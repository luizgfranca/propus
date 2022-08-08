import { Root } from "../model/root";
import { Token, TokenType } from "../model/token";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";
import { ElementParser } from "./elementParser";
import { Element } from "../model/element";
import { Content } from "../model/content";
import { ErrorMessage } from "../model/error";

export class Parser {
  #treeRoot: Root;
  #cursor: Node;
  #elementParser: ElementParser;

  #processingDepth: number = 0;

  constructor() {
    this.#elementParser = new ElementParser();
  }

  public doParse(tokens: Token[]): Root {
    this.#treeRoot = new Root();
    this.#cursor = this.#treeRoot;

    tokens.forEach((t) => this.handleToken(t));

    return this.#treeRoot;
  }

  private handleNotToBeProcessed(token: Token): Node {
    this.#cursor.addChild(new NotProcessedToken(this.#cursor, token.content));
    return this.#cursor;
  }

  private parseElement(token: Token): Element {
    const element = this.#elementParser.parse(this.#cursor, token);

    if (element.isElementCloser) {
      if (!this.#cursor.parent) throw ErrorMessage.TAG_WITHOUT_PARENT;

      this.#processingDepth--;

      if (
        this.#cursor.isAddChildOperationAllowed &&
        (this.#cursor as Element).tag === element.tag
      ) {
        return this.#cursor.parent as Element;
      }

      if (
        this.#cursor.parent.isAddChildOperationAllowed &&
        (this.#cursor.parent as Element).tag === element.tag
      ) {
        element.setParent(this.#cursor.parent);
        return this.#cursor.parent as Element;
      }

      throw ErrorMessage.UNMATCHED_CLOSER_TAG;
    } else if (!element.isSelfEnclosed) {
      this.#processingDepth++;
    }

    this.#cursor.addChild(element);
    return this.#cursor.getLastChild() as Element;
  }

  private parseContent(token: Token) {
    const content = new Content(this.#cursor, token.content);
    this.#cursor.addChild(content);
  }

  private handleToken(token: Token) {
    let newCursor: Node | null = null;

    if (!token.flags.hasProp && this.#processingDepth === 0) {
      newCursor = this.handleNotToBeProcessed(token);
    } else if (token.type === TokenType.TAG) {
      newCursor = this.parseElement(token);
    } else if (token.type === TokenType.CONTENT) {
      this.parseContent(token);
    }

    if (newCursor) {
      this.#cursor = newCursor as Node;
    }
  }
}
