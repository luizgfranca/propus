import { Root } from "../model/root";
import { Token } from "../model/token";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";

export class Parser {
  #treeRoot: Root;
  #cursor: Node;

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

  private handleToken(token: Token) {
    let newCursor: Node | null = null;

    if (!token.flags.hasProp) newCursor = this.handleNotToBeProcessed(token);

    this.#cursor = newCursor as Node;
  }
}
