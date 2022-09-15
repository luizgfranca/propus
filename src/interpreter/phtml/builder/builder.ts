import { ExplorationContext, Root } from "../model/root";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Expression } from "../model/expression";

export class Compiler {
  contentBuffer = "";

  append(str: string) {
    this.contentBuffer += str;
  }

  processElement(node: Node, explorationContext: ExplorationContext) {
    if (
      node instanceof NotProcessedToken &&
      explorationContext === ExplorationContext.OPENNING
    ) {
      this.append((node as NotProcessedToken).content);
      this.append(Expression.NEW_LINE);
    }
  }

  doCompilation(tree: Root): string {
    tree.forEachTreeElement(this.processElement.bind(this));
    return this.contentBuffer;
  }
}
