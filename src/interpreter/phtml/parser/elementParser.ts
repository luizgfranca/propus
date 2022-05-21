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

enum ElementParserState {
  NONE,
  ELEMENT_OPEN,
  ELEMENT_CLOSED,
  ON_TAG_TITLE,
  WAITING_ATTRIBUTE,
  ON_ATTRIBUTE_NAME,
  ON_ATTRIBUTE_VALUE,
  ON_FINISHED_ELEMENT,
}

type Attribute = {
  name?: string;
  value?: string;
};

export class ElementParser {
  #state: ElementParserState;
  #element: Element;
  #parent: Node;

  #possibleTags = Object.values(Tag);

  #tagNameAccumulator = "";
  #attributeAccumulator: Attribute = {};

  public parse(parent: Node, token: Token): Element {
    this.resetState();
    this.#parent = parent;
    return this.parseContent(parent, token.content);
  }

  private parseContent(parent: Node, content: string): Element {
    const iterator = new StringIterator(content);
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
      }
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
