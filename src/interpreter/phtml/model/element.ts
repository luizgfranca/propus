import { Dictionary } from "../../type/generic";
import { Props } from "./props";
import { Tag } from "./tag";
import { Node } from "./node";
import { ErrorMessage } from "./error";

export class Element extends Node {
  tag: Tag;
  attributes: Dictionary<string | boolean>;
  props: Props;
  isElementCloser: boolean;
  isSelfEnclosed: boolean;

  constructor(parent: Node, tag?: Tag) {
    super(parent);
    this.attributes = {};
    this.props = {};
    this.tag = tag ? tag : Tag.NONE;
    this.isSelfEnclosed = false;
    this.isElementCloser = false;
  }

  public addAttribute(key: string, value: string | boolean) {
    if (!key || !value) throw ErrorMessage.ELEMENT_INVALID_ATTR_PARAMS;

    if (typeof key !== "string" || typeof value !== "string")
      throw ErrorMessage.ELEMENT_INVALID_ATTR_PARAMS;

    this.attributes[key] = value;
  }

  public setParent(parent: Node) {
    this.parent = parent;
  }
}
