import { StringIterator } from "../../lib/stringIterator";
import { Content } from "../model/content";
import { Node } from "../model/node";
import { Token } from "../model/token";
import { Element } from "../model/element";
import { Tag } from "../model/tag";
import { ErrorMessage } from "../model/error";
import { Expression } from "../model/expression";
import { SpecialCharacter } from "../model/specialCharacter";
import isLetter from "../../lib/isLetter";
import { Dictionary } from "../../type/generic";
import { IteratorExpressionMatcher } from "../../lib/iteratorExpressionMatcher";

enum ElementParserState {
  NONE,
  ELEMENT_OPEN,
  ELEMENT_CLOSED,
  ON_TAG_TITLE,
  WAITING_ATTRIBUTE,
  ON_ATTRIBUTE_NAME,
  ON_ATTRIBUTE_VALUE,
  WAITING_PROP,
  ON_PROP_NAME,
  ON_PROP_VALUE,
  ON_FINISHED_ELEMENT,
}

type Attribute = {
  name?: string;
  value?: string;
};

export class ElementParser {
  readonly #possibleTags = Object.values(Tag);

  #parent: Node;

  #state: ElementParserState;
  #element: Element;

  #tagNameAccumulator = "";
  #attributeAccumulator: Attribute = {};
  #propTester: IteratorExpressionMatcher;

  public parse(parent: Node, token: Token): Element {
    this.resetState();
    this.#parent = parent;
    return this.parseContent(parent, token.content);
  }

  private parseContent(parent: Node, content: string): Element {
    const iterator = new StringIterator(content);
    this.#propTester = new IteratorExpressionMatcher(Expression.PROP_PREFIX, {
      caseSensitive: false,
    });

    let character: string;
    while ((character = iterator.getNextCharacter())) {
      this.processCharacter(character);
    }

    return this.#element;
  }

  private processCharacter(char: string) {
    if (this.#state === ElementParserState.ELEMENT_CLOSED) {
      throw ErrorMessage.DATA_AFTER_CLOSED;
    }

    if (char === Expression.OPEN_TAG) {
      if (this.#state === ElementParserState.NONE) {
        this.#state = ElementParserState.ELEMENT_OPEN;
        return (this.#element = new Element(this.#parent));
      }

      throw ErrorMessage.INVALID_OPENNING;
    }

    if (char === SpecialCharacter.BLANK_SPACE) {
      if (this.#state === ElementParserState.ON_FINISHED_ELEMENT)
        throw ErrorMessage.INFO_AFTER_FINISHED;

      if (this.#state === ElementParserState.ON_TAG_TITLE) {
        const tagName = this.#tagNameAccumulator.toUpperCase();

        if (!this.#possibleTags.includes(tagName as Tag))
          throw ErrorMessage.INVALID_TAG;

        // @ts-ignore: ts(7015)
        this.#element.tag = Tag[tagName];

        this.#state = ElementParserState.WAITING_ATTRIBUTE;
        return;
      }

      if (this.#state === ElementParserState.ON_ATTRIBUTE_NAME) {
        const { name, value } = this.#attributeAccumulator;
        if (!name) throw ErrorMessage.ATTRIBUTE_NAME_OR_VALUE_NULL;

        this.#element.addAttribute(name, value ? value : true);
        this.resetAttributeAccumlator();
        this.#state = ElementParserState.WAITING_ATTRIBUTE;
      }

      if (this.#state === ElementParserState.ON_ATTRIBUTE_VALUE) {
        const { name, value } = this.#attributeAccumulator;
        if (!name || !value) throw ErrorMessage.ATTRIBUTE_NAME_OR_VALUE_NULL;

        this.#element.addAttribute(name, value);
        this.resetAttributeAccumlator();
        this.#state = ElementParserState.WAITING_ATTRIBUTE;
        return;
      }

      if (this.#state === ElementParserState.ON_PROP_VALUE) {
        if (
          !this.#attributeAccumulator.name ||
          this.#attributeAccumulator.value
        )
          throw ErrorMessage.ATTRIBUTE_NAME_OR_VALUE_NULL;

        // @ts-expect-error ts(7053)
        this.#element.props[this.#attributeAccumulator.name] =
          this.#attributeAccumulator.value;
        this.resetAttributeAccumlator();
        this.#state = ElementParserState.WAITING_ATTRIBUTE;
        return;
      }
    }

    if (
      char === Expression.PROP_DELIMITER &&
      this.#state === ElementParserState.WAITING_PROP
    ) {
      this.#state = ElementParserState.ON_PROP_NAME;
    }

    if (isLetter(char)) {
      if (this.#state === ElementParserState.ON_FINISHED_ELEMENT)
        throw ErrorMessage.INFO_AFTER_FINISHED;

      if (this.#state === ElementParserState.ELEMENT_OPEN) {
        this.#state = ElementParserState.ON_TAG_TITLE;
        this.#tagNameAccumulator += char;
        return;
      }

      if (this.#state === ElementParserState.ON_TAG_TITLE) {
        this.#tagNameAccumulator += char;
        return;
      }

      if (this.#state === ElementParserState.WAITING_ATTRIBUTE) {
        this.#attributeAccumulator.name = char;
        this.#state = ElementParserState.ON_ATTRIBUTE_NAME;
        return;
      }

      if (
        this.#state === ElementParserState.ON_ATTRIBUTE_NAME ||
        this.#state === ElementParserState.ON_PROP_NAME
      ) {
        this.#attributeAccumulator.name += char;

        if (
          this.#propTester.testNextCharacter(char) &&
          this.#state !== ElementParserState.ON_PROP_NAME
        )
          this.#state = ElementParserState.WAITING_PROP;

        return;
      }

      if (
        this.#state === ElementParserState.ON_ATTRIBUTE_VALUE ||
        this.#state === ElementParserState.ON_PROP_VALUE
      ) {
        this.#attributeAccumulator.value += char;
        return;
      }

      throw ErrorMessage.MISPLACED_SYMBOL(char);
    }

    if (char === Expression.EQUALS) {
      this.#propTester.reset();

      if (this.#state === ElementParserState.ON_ATTRIBUTE_NAME) {
        this.#state = ElementParserState.ON_ATTRIBUTE_VALUE;
        this.#attributeAccumulator.value = SpecialCharacter.VOID;
        return;
      }

      if (this.#state === ElementParserState.ON_PROP_NAME) {
        if (
          this.#attributeAccumulator.name &&
          Object.keys(this.#element.props).includes(
            this.#attributeAccumulator.name.toLowerCase()
          )
        ) {
          this.#state = ElementParserState.ON_PROP_VALUE;
          this.#attributeAccumulator.value = SpecialCharacter.VOID;
          return;
        }

        throw ErrorMessage.INVALID_PROP_NAME;
      }

      throw ErrorMessage.MISPLACED_SYMBOL(char);
    }

    if (char === Expression.CLOSING_DASH) {
      if (this.#state === ElementParserState.WAITING_ATTRIBUTE) {
        this.#element.isSelfEnclosed = true;
        this.#state = ElementParserState.ON_FINISHED_ELEMENT;
        return;
      }

      if (this.#state === ElementParserState.ELEMENT_OPEN) {
        this.#element.isElementCloser = true;
        this.#state = ElementParserState.ON_FINISHED_ELEMENT;
        return;
      }

      throw ErrorMessage.MISPLACED_SYMBOL(char);
    }

    if (char === Expression.CLOSE_TAG) {
      if (
        this.#state === ElementParserState.WAITING_ATTRIBUTE ||
        this.#state === ElementParserState.ON_FINISHED_ELEMENT
      ) {
        this.#state = ElementParserState.ELEMENT_CLOSED;
        return;
      }
    }
  }

  private resetAttributeAccumlator() {
    this.#attributeAccumulator = {};
  }

  private resetTagAccumulator() {
    this.#tagNameAccumulator = "";
  }

  private resetState() {
    this.resetTagAccumulator();
    this.resetAttributeAccumlator();
    this.#state = ElementParserState.NONE;
  }
}
