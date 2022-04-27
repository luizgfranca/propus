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
  flags: TokenFlags = {
    hasProp: false,
  };

  constructor(type?: TokenType, content?: string, flags?: TokenFlags) {
    this.type = type ? type : TokenType.NONE;
    this.content = content ? content : "";

    if (flags?.hasProp) this.flags.hasProp = flags.hasProp;
  }

  appendContent(str: string) {
    this.content += str;
  }
}
