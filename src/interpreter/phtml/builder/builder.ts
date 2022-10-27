import { ExplorationContext, Root } from "../model/root";
import { Node } from "../model/node";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Expression } from "../model/expression";
import { Content } from "../model/content";
import { Element } from "../model/element";
import ElementBuilder from "./elementBuilder";

export class Compiler {
  contentBuffer = "";

  append(str: string) {
    this.contentBuffer += str + Expression.NEW_LINE;
  }

  processContent(content: Content, explorationContext: ExplorationContext) {
    if (explorationContext === ExplorationContext.OPENNING) {
      this.append((content as NotProcessedToken).content);
    }
  }

  processNotProcessedToken(
    token: NotProcessedToken,
    explorationContext: ExplorationContext
  ) {
    if (explorationContext === ExplorationContext.OPENNING) {
      this.append((token as NotProcessedToken).content);
    }
  }

  processElement(element: Element, explorationContext: ExplorationContext) {
    this.append(ElementBuilder.build(element, explorationContext));
  }

  processNode(node: Node, explorationContext: ExplorationContext) {
    if (node instanceof NotProcessedToken) {
      this.processNotProcessedToken(node, explorationContext);
    } else if (node instanceof Content) {
      this.processContent(node, explorationContext);
    } else if (node instanceof Element) {
      this.processElement(node, explorationContext);
    }
  }

  doCompilation(tree: Root): string {
    tree.forEachTreeElement(this.processNode.bind(this));
    return this.contentBuffer;
  }
}
