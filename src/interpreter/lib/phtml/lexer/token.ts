export enum TokenType {
  NONE,
  TAG,
  CONTENT,
}

export class Token {
  type: TokenType;
  content: string;

  constructor(type?: TokenType) {
    (this.type = type ? type : TokenType.NONE), (this.content = "");
  }

  appendContent(str: string) {
    this.content += str;
  }
}
