import { Dictionary } from "../../type/generic";
import { Props } from "./props";
import { Tag } from "./tag";
import { Node } from "./node";

export class Element extends Node {
  tag: Tag;
  attributes: Dictionary<string>;
  props: Props;

  constructor(parent: Node, tag: Tag) {
    super(parent);
    this.attributes = {};
    this.props = {};
    this.tag = tag;
  }

  public addAttribute(key: string, value: string) {
    if (!key || !value) throw ErrorMessage.ELEMENT_INVALID_ATTR_PARAMS;

    if (typeof key !== "string" || typeof value !== "string")
      throw ErrorMessage.ELEMENT_INVALID_ATTR_PARAMS;

    this.attributes[key] = value;
  }
}
