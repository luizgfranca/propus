import { ExplorationContext } from "../model/root";
import { Element } from "../model/element";
import { Expression } from "../model/expression";
import { SpecialCharacter } from "../model/specialCharacter";

export default class ElementBuilder {
  static attributes(element: Element) {
    let attributesStr = SpecialCharacter.VOID;

    for (const key of Object.keys(element.attributes)) {
      attributesStr +=
        SpecialCharacter.BLANK_SPACE +
        key +
        Expression.EQUALS +
        SpecialCharacter.BRACKET +
        element.attributes[key] +
        SpecialCharacter.BRACKET;
    }

    return attributesStr;
  }

  static selfCloser(element: Element) {
    return element.isSelfEnclosed
      ? Expression.CLOSING_DASH
      : SpecialCharacter.VOID;
  }

  static buildOpenner(element: Element) {
    return (
      Expression.OPEN_TAG +
      element.tag.toLowerCase() +
      this.attributes(element) +
      this.selfCloser(element) +
      Expression.CLOSE_TAG
    );
  }

  static buildCloser(element: Element) {
    return !element.isSelfEnclosed
      ? Expression.OPEN_TAG +
          Expression.CLOSING_DASH +
          element.tag.toLowerCase() +
          Expression.CLOSE_TAG
      : SpecialCharacter.VOID;
  }
}
