import { Root } from "../model/root";
import { Token } from "../model/token";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Content } from "../model/content";
import { TokenParser } from "./tokenParser";

export class Parser {
  #treeRoot: Root;
  #cursor: Node;
  #tokenParser: TokenParser;

  constructor() {
    this.#tokenParser = new TokenParser();
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

  private parseTokenToNodes(token: Token): Content | Element {
    return this.#tokenParser.parse(this.#cursor, token);
  }

  private handleToken(token: Token) {
    let newCursor: Node | null = null;

    if (!token.flags.hasProp) newCursor = this.handleNotToBeProcessed(token);
    else this.parseTokenToNodes(token);

    this.#cursor = newCursor as Node;
  }
}
