import { Node } from "./node";

export class NotProcessedToken extends Node {
  content: string;

  constructor(parent: Node, content: string) {
    super(parent);
    this.content = content;

    this.isAddChildOperationAllowed = false;
  }
}
