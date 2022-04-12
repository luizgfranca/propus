import { StringIterator } from "../../general/stringIterator";
import { Token, TokenType } from "./token";

enum ProcessingState {
  TAG_OPEN,
  TAG_CLOSE,
  INSIDE_TAG,
  OUTSIDE_TAG,
}

export class Lexer {
  public doLex(str: string): Token[] {
    const iterator = new StringIterator(str);
    let tokenBuffer = new Token();
    let accumulator: Token[] = [];

    let character: string;
    while ((character = iterator.getNextCharacter())) {
      tokenBuffer.appendContent(character);
    }

    console.log(tokenBuffer);

    accumulator.push(tokenBuffer);
    return accumulator;
  }
}
