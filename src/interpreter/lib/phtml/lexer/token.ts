export enum TokenType {
  NONE,
  TAG,
  CONTENT,
}

export class Token {
  type: TokenType;
  content: string;

  constructor(type?: TokenType, content?: string) {
    this.type = type ? type : TokenType.NONE;
    this.content = content ? content : "";
  }

  appendContent(str: string) {
    this.content += str;
  }
}
