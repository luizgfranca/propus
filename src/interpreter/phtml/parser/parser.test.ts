import { Content } from "../model/content";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Root } from "../model/root";
import { Tag } from "../model/tag";
import { Token, TokenType } from "../model/token";
import { Parser } from "./parser";
import { Element } from "../model/element";
import Flatted from "flatted";

test("parse empty list of tokens", () => {
  const parser = new Parser();
  expect(parser.doParse([])).toStrictEqual(new Root());
});

test("parse a simple piece of content", () => {
  const tokens = [new Token(TokenType.CONTENT, "hello world")];

  const tree = new Root();
  tree.addChild(new NotProcessedToken(tree, "hello world"));

  const parser = new Parser();
  expect(parser.doParse(tokens)).toStrictEqual(tree);
});

test("parse a tag that contains a prop", () => {
  const tokens = [new Token(TokenType.TAG, "<br />", { hasProp: true })];

  const tree = new Root();
  const tag = new Element(tree, Tag.BR);
  tag.isSelfEnclosed = true;
  tree.addChild(tag);

  const parser = new Parser();
  expect(Flatted.toJSON(parser.doParse(tokens))).toStrictEqual(
    Flatted.toJSON(tree)
  );
});
