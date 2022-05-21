import { Root } from "../model/root";
import { Token, TokenType } from "../model/token";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";
import { ElementParser } from "./elementParser";
import { Element } from "../model/element";
import { Content } from "../model/content";

export class Parser {
  #treeRoot: Root;
  #cursor: Node;
  #elementParser: ElementParser;

  constructor() {
    this.#elementParser = new ElementParser();
  }

  public doParse(tokens: Token[]): Root {
    this.#treeRoot = new Root();
    this.#cursor = this.#treeRoot;

    tokens.forEach((t) => this.handleToken(t));

    return this.#treeRoot;
  }

  private handleNotToBeProcessed(token: Token): NotProcessedToken {
    this.#cursor.addChild(new NotProcessedToken(this.#cursor, token.content));
    return this.#cursor.getLastChild() as NotProcessedToken;
  }

  private parseElement(token: Token): Element {
    const element = this.#elementParser.parse(this.#cursor, token);
    this.#cursor.addChild(element);
    return this.#cursor.getLastChild() as Element;
  }

  private parseContent(token: Token): Content {
    return new Content(this.#cursor, "");
  }

  private handleToken(token: Token) {
    let newCursor: Node | null = null;

    if (!token.flags.hasProp) {
      newCursor = this.handleNotToBeProcessed(token);
    } else if (token.type === TokenType.TAG) {
      newCursor = this.parseElement(token);
    } else if (token.type === TokenType.CONTENT) {
      newCursor = this.parseContent(token);
    }

    this.#cursor = newCursor as Node;
  }
}
