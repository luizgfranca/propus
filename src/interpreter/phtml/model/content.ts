import { Node } from "./node";

export class Content extends Node {
  content: string;

  constructor(parent: Node, content: string) {
    super(parent);
    this.content = content;
  }
}
