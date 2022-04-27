import { Node } from "./node";

export class NotProcessedToken extends Node {
  content: string;

  constructor(parent: Node) {
    super(parent);

    this.isAddChildOperationAllowed = false;
  }
}
