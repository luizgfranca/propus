import { ExplorationContext, Root } from "../model/root";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Expression } from "../model/expression";
import { Content } from "../model/content";

export class Compiler {
  contentBuffer = "";

  append(str: string) {
    this.contentBuffer += str + Expression.NEW_LINE;
  }

  processElement(node: Node, explorationContext: ExplorationContext) {
    if (
      node instanceof NotProcessedToken &&
      explorationContext === ExplorationContext.OPENNING
    ) {
      this.append((node as NotProcessedToken).content);
    } else if (
      node instanceof Content &&
      explorationContext === ExplorationContext.OPENNING
    ) {
      this.append((node as Content).content);
    }
  }

  doCompilation(tree: Root): string {
    tree.forEachTreeElement(this.processElement.bind(this));
    return this.contentBuffer;
  }
}
