import { StringIterator } from "../../lib/stringIterator";
import { Content } from "../model/content";
import { Node } from "../model/node";
import { Token } from "../model/token";

export class TokenParser {
  public parse(parent: Node, token: Token): Element | Content {
    this.resetState();
    return this.parseContent(parent, token.content);
  }

  private parseContent(parent: Node, content: string): Element | Content {
    const iterator = new StringIterator(content);
    let character: string;
    while ((character = iterator.getNextCharacter())) {
      this.processCharacter(character);
    }

    return new Content(parent, "");
  }

  private processCharacter(char: string) {}

  private resetState() {}
}
