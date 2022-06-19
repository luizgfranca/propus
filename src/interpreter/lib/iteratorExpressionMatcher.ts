const Error = {
  VALIDATION_EXPRESSION_INVALID: "Invalid expression",
  VALIDATION_COMPARATION_CHARACTER: "Expected one and only one character",
};

export interface IteratorExpressionMatcherOptions {
  caseSensitive: boolean;
}

export class IteratorExpressionMatcher {
  #expression: string;
  #similarityIndexes: number[] = [];
  #caseSensitive: boolean;

  constructor(expression: string, options?: IteratorExpressionMatcherOptions) {
    if (!expression || !expression.length)
      throw Error.VALIDATION_EXPRESSION_INVALID;

    this.#caseSensitive =
      options?.caseSensitive === false ? options.caseSensitive : true;

    this.#expression = !this.#caseSensitive
      ? expression.toUpperCase()
      : expression;
  }

  public testNextCharacter(character: string): boolean {
    if (!character || character.length !== 1)
      throw Error.VALIDATION_EXPRESSION_INVALID;

    this.#similarityIndexes.push(-1);
    let newSimilarityIndexes: number[] = [];
    for (let index of this.#similarityIndexes) {
      if (
        this.#caseSensitive
          ? this.#expression.charAt(index + 1) !== character
          : this.#expression.charAt(index + 1) !== character.toUpperCase()
      )
        continue;

      const newIndex = index + 1;
      if (this.#expression.length - 1 === newIndex) return true;

      newSimilarityIndexes.push(newIndex);
    }

    this.#similarityIndexes = newSimilarityIndexes;

    return false;
  }

  public reset() {
    this.#similarityIndexes = [];
  }
}
