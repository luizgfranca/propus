export class Node {
  parent?: Node;
  childs: Node[];

  isAddChildOperationAllowed: boolean;

  constructor(parent?: Node) {
    this.isAddChildOperationAllowed = true;

    this.childs = [];

    if (parent) this.parent = parent;
  }

  public addChild(child: Node) {
    if (this.isAddChildOperationAllowed) return this.childs.push(child);

    throw ErrorMessage.NOT_PROCESSED_ELEMENT_ADD_CHILD;
  }

  public getLastChild() {
    if (!this.childs.length) return null;

    return this.childs[this.childs.length - 1];
  }
}
