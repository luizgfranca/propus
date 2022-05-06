import { Content } from "../model/content";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Root } from "../model/root";
import { Token, TokenType } from "../model/token";
import { Parser } from "./parser";

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
