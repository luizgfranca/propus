export enum TokenType {
  TAG,
  TEXT,
}

export class Token {
  type: TokenType;
  content: string;

  constructor(type?: TokenType) {
    (this.type = type ? type : TokenType.TEXT), (this.content = "");
  }

  appendContent(str: string) {
    this.content += str;
  }
}
