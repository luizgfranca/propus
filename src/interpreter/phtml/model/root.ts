import { Node } from "./node";

export enum ExplorationContext {
  OPENNING,
  CLOSING,
}

type ExplorationElement = {
  level: number;
  node: Node;
};

export class Root extends Node {
  constructor() {
    super();
  }

  public forEachTreeElement(
    lambda: (node: Node, context: ExplorationContext) => void
  ) {
    const explorationHorizon: Array<ExplorationElement> = [];
    const toCloseBacklog: Array<ExplorationElement> = [];
    let currentLevel: number = 0;

    explorationHorizon.push({
      level: 0,
      node: this,
    });

    let cursor: ExplorationElement | undefined;

    while (explorationHorizon.length || toCloseBacklog.length) {
      if (
        (cursor && cursor.level >= currentLevel) ||
        (!explorationHorizon.length && cursor?.level !== 0)
      ) {
        const closing = toCloseBacklog.pop() as ExplorationElement;
        lambda(closing.node, ExplorationContext.CLOSING);
        currentLevel--;
      }

      cursor = explorationHorizon.shift();

      if (!cursor) continue;

      lambda(cursor.node, ExplorationContext.OPENNING);

      if (cursor.node.childs.length) {
        currentLevel++;

        cursor.node.childs.forEach((child) =>
          explorationHorizon.push({
            node: child,
            level: currentLevel,
          })
        );
      }

      toCloseBacklog.push(cursor);
    }
  }
}
