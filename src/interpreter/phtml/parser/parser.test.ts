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

test("parse a tag with attributes that contains a prop", () => {
  const content = '<img src="test.png" class="test-image" prop:test />';
  const tokens = [new Token(TokenType.TAG, content, { hasProp: true })];

  const tree = new Root();
  const tag = new Element(tree, Tag.IMG);
  tag.isSelfEnclosed = true;
  tag.addAttribute("src", "test.png");
  tag.addAttribute("class", "test-image");
  tag.props["test"] = true;
  tree.addChild(tag);

  const parser = new Parser();
  expect(Flatted.toJSON(parser.doParse(tokens))).toStrictEqual(
    Flatted.toJSON(tree)
  );
});

test("parse a tag that contains a prop with another tag inside", () => {
  const tokens = [
    new Token(TokenType.TAG, '<div class="test" prop:test>', { hasProp: true }),
    new Token(TokenType.TAG, '<img src="test.png" />'),
    new Token(TokenType.TAG, "</div>"),
  ];

  const tree = new Root();
  const tag = new Element(tree, Tag.DIV);
  tag.addAttribute("class", "test");
  tag.props["test"] = true;
  tree.addChild(tag);

  const insideContent = new Element(tag, Tag.IMG);
  insideContent.addAttribute("src", "test.png");
  insideContent.isSelfEnclosed = true;
  tag.addChild(insideContent);

  const parser = new Parser();
  expect(Flatted.toJSON(parser.doParse(tokens))).toStrictEqual(
    Flatted.toJSON(tree)
  );
});

test("parse a tag that contains a prop with content inside", () => {
  const tokens = [
    new Token(TokenType.TAG, '<div class="test" prop:test>', { hasProp: true }),
    new Token(TokenType.CONTENT, "this is some content"),
    new Token(TokenType.TAG, "</div>"),
  ];

  const tree = new Root();
  const tag = new Element(tree, Tag.DIV);
  tag.addAttribute("class", "test");
  tag.props["test"] = true;
  tree.addChild(tag);

  const insideContent = new Content(tag, "this is some content");
  tag.addChild(insideContent);

  const parser = new Parser();
  expect(Flatted.toJSON(parser.doParse(tokens))).toStrictEqual(
    Flatted.toJSON(tree)
  );
});

test("3 levels composition of to be processed tokens", () => {
  const tokens = [
    new Token(TokenType.TAG, '<div class="test" prop:test>', { hasProp: true }),
    new Token(TokenType.TAG, '<div class="content-container">'),
    new Token(TokenType.CONTENT, "this is some content"),
    new Token(TokenType.TAG, "</div>"),
    new Token(TokenType.TAG, "</div>"),
  ];

  const tree = new Root();
  const tag = new Element(tree, Tag.DIV);
  tag.addAttribute("class", "test");
  tag.props["test"] = true;
  tree.addChild(tag);

  const insideTag = new Element(tag, Tag.DIV);
  insideTag.addAttribute("class", "content-container");
  tag.addChild(insideTag);

  const content = new Content(insideTag, "this is some content");
  insideTag.addChild(content);

  const parser = new Parser();
  expect(Flatted.toJSON(parser.doParse(tokens))).toStrictEqual(
    Flatted.toJSON(tree)
  );
});
