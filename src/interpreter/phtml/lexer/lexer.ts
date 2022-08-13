import { StringIterator } from "../../lib/stringIterator";
import { ErrorMessage } from "../error";
import { Expression } from "../model/expression";
import { SpecialCharacter } from "../model/specialCharacter";
import { Token, TokenType } from "../model/token";
import { IteratorExpressionMatcher } from "../../lib/iteratorExpressionMatcher";

enum State {
  NONE,
  INSIDE_TAG,
  TAG_CLOSE,
  CONTENT,
}

export class Lexer {
  #accumulator: Token[] = [];
  #tokenBuffer: Token;
  #state: State = State.NONE;
  #lastCharacter: string = SpecialCharacter.VOID;

  #propTester = new IteratorExpressionMatcher(Expression.PROP_PREFIX, {
    caseSensitive: false,
  });

  public doLex(str: string): Token[] {
    const iterator = new StringIterator(str);
    this.#tokenBuffer = new Token();

    let character: string;
    while ((character = iterator.getNextCharacter())) {
      this.processCharacter(character);
      this.#lastCharacter = character;
    }

    if (this.#tokenBuffer.type !== TokenType.NONE)
      this.#accumulator.push(this.#tokenBuffer);

    return this.#accumulator;
  }

  private processCharacter(char: string) {
    if (
      char === SpecialCharacter.NEW_LINE ||
      char === SpecialCharacter.TAB_SPACE ||
      (this.#lastCharacter === SpecialCharacter.BLANK_SPACE &&
        char === SpecialCharacter.BLANK_SPACE)
    )
      return;

    switch (this.#state) {
      case State.NONE:
        if (char === SpecialCharacter.BLANK_SPACE) return;

        if (char === Expression.OPEN_TAG) return this.beginTagToken(char);

        if (char === Expression.CLOSE_TAG) throw ErrorMessage.UNMATCHED_CLOSURE;

        return this.beginContentToken(char);

      case State.INSIDE_TAG:
        if (this.#propTester.testNextCharacter(char))
          this.#tokenBuffer.flags.hasProp = true;

        if (char === Expression.CLOSE_TAG) {
          this.#tokenBuffer.appendContent(char);
          this.#propTester.reset();
          return this.commitToken();
        }

        if (char === Expression.OPEN_TAG) throw ErrorMessage.INVALID_OPENNING;

        return this.#tokenBuffer.appendContent(char);

      case State.CONTENT:
        if (char === Expression.CLOSE_TAG) throw ErrorMessage.UNMATCHED_CLOSURE;

        if (char === Expression.OPEN_TAG) {
          this.commitToken();
          return this.beginTagToken(char);
        }

        return this.#tokenBuffer.appendContent(char);
    }
  }

  private commitToken() {
    if (this.#tokenBuffer.type !== TokenType.NONE) {
      this.#tokenBuffer.commit();
      this.#accumulator.push(this.#tokenBuffer);
    }

    this.#state = State.NONE;
    this.#tokenBuffer = new Token();
  }

  private beginTagToken(char: string) {
    this.#tokenBuffer.type = TokenType.TAG;
    this.#state = State.INSIDE_TAG;
    this.#tokenBuffer.appendContent(char);
  }

  private beginContentToken(char: string) {
    this.#tokenBuffer.type = TokenType.CONTENT;
    this.#state = State.CONTENT;
    this.#tokenBuffer.appendContent(char);
  }
}
