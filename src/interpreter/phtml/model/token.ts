import { SpecialCharacter } from "./specialCharacter";

export enum TokenType {
  NONE,
  TAG,
  CONTENT,
}

export interface TokenFlags {
  hasProp: boolean;
}
export class Token {
  type: TokenType;
  content: string;
  uncommitedBuffer?: string;
  flags: TokenFlags = {
    hasProp: false,
  };

  constructor(type?: TokenType, content?: string, flags?: TokenFlags) {
    this.type = type ? type : TokenType.NONE;
    this.content = content ? content : "";
    this.uncommitedBuffer = undefined;

    if (flags?.hasProp) this.flags.hasProp = flags.hasProp;
  }

  appendContent(str: string) {
    if (str === SpecialCharacter.BLANK_SPACE) {
      this.uncommitedBuffer = !this.uncommitedBuffer
        ? str
        : this.uncommitedBuffer + str;
    } else {
      if (this.uncommitedBuffer) {
        this.content += this.uncommitedBuffer;
        this.uncommitedBuffer = undefined;
      }

      this.content += str;
    }
  }

  commit() {
    this.uncommitedBuffer = undefined;
  }
}
