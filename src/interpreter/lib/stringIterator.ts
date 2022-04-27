// TODO: Maybe it's better rewrite this as a javascript generator
export class StringIterator {
  private str: string;
  private position: number;

  constructor(str: string) {
    this.str = str;
    this.position = 0;
  }

  hasNextCharacter(): boolean {
    if (!this.str) return false;

    if (this.str.charAt(this.position)) return true;
    return false;
  }

  getNextCharacter(): string {
    const char = this.str.charAt(this.position);
    this.position++;
    return char;
  }
}
