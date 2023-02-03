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

  public traverseTreeAndRun(
    onOpen: (node: Node) => void,
    onClose: (node: Node) => void
  ) {
    let explorationHorizon: Array<ExplorationElement> = [];
    let cursor: ExplorationElement | undefined = undefined;

    explorationHorizon.push({
      level: 0,
      node: this,
    });

    while (true) {
      if (
        cursor &&
        (!explorationHorizon.length ||
          explorationHorizon[0].level <= cursor.level)
      ) {
        onClose(cursor.node);

        if (!cursor.node.parent) break;

        cursor = {
          level: cursor.level - 1,
          node: cursor.node.parent,
        };
      } else {
        cursor = explorationHorizon.shift();
        if (!cursor) throw "no cursor after shifting";

        onOpen(cursor.node);

        if (cursor.node.childs.length) {
          const level = cursor.level;
          const childs: Array<ExplorationElement> = cursor.node.childs.map(
            (child) => {
              return {
                level: level + 1,
                node: child,
              };
            }
          );

          explorationHorizon = childs.concat(explorationHorizon);
        }
      }
    }
  }
}
