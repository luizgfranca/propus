import { ExplorationContext } from "../model/root";
import { Element } from "../model/element";
import { Expression } from "../model/expression";

export default class ElementBuilder {
  static build(
    element: Element,
    explorationContext: ExplorationContext
  ): string {
    if (explorationContext === ExplorationContext.OPENNING) {
      return (
        Expression.OPEN_TAG + element.tag.toLowerCase() + Expression.CLOSE_TAG
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
