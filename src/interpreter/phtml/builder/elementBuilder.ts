import { ExplorationContext } from "../model/root";
import { Element } from "../model/element";
import { Expression } from "../model/expression";
import { SpecialCharacter } from "../model/specialCharacter";

export default class ElementBuilder {
  static attributes(element: Element, explorationContext: ExplorationContext) {
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

  static build(
    element: Element,
    explorationContext: ExplorationContext
  ): string {
    if (explorationContext === ExplorationContext.OPENNING) {
      return (
        Expression.OPEN_TAG +
        element.tag.toLowerCase() +
        this.attributes(element, explorationContext) +
        Expression.CLOSE_TAG
      );
    }

    if (explorationContext === ExplorationContext.CLOSING) {
      return (
        Expression.OPEN_TAG +
        Expression.CLOSING_DASH +
        element.tag.toLowerCase() +
        Expression.CLOSE_TAG
      );
    }

    return "";
  }
}
