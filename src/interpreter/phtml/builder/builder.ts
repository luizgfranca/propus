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
    if (str) this.contentBuffer += str + Expression.NEW_LINE;
  }

  processContent(content: Content) {
    this.append((content as NotProcessedToken).content);
  }

  processNotProcessedToken(token: NotProcessedToken) {
    this.append((token as NotProcessedToken).content);
  }

  processOpenElement(element: Element) {
    this.append(ElementBuilder.buildOpenner(element));
  }

  processCloseElement(element: Element) {
    this.append(ElementBuilder.buildCloser(element));
  }

  processNodeOpenning(node: Node) {
    if (node instanceof NotProcessedToken) {
      this.processNotProcessedToken(node);
    } else if (node instanceof Content) {
      this.processContent(node);
    } else if (node instanceof Element) {
      this.processOpenElement(node);
    }
  }

  processNodeClosing(node: Node) {
    if (node instanceof Element) {
      this.processCloseElement(node);
    }
  }

  doCompilation(tree: Root): string {
    tree.traverseTreeAndRun(
      (node: Node) => this.processNodeOpenning(node),
      (node: Node) => this.processNodeClosing(node)
    );
    return this.contentBuffer;
  }
}
