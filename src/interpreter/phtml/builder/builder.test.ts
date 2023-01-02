import { Content } from "../model/content";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Root } from "../model/root";
import { Element } from "../model/element";
import { Compiler } from "./builder";
import { Tag } from "../model/tag";

test("should return empty string when only the root exists", () => {
  const tree = new Root();
  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe("");
});

test("should mount NotProcessedTokens as their content is", () => {
  const tree = new Root();
  const a = new NotProcessedToken(tree, '<div class="container">');
  const b = new NotProcessedToken(tree, "this is some content");
  const c = new NotProcessedToken(tree, "</div>");
  [a, b, c].forEach((item) => tree.addChild(item));

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe(
    '<div class="container">\nthis is some content\n</div>\n'
  );
});

test("should mount Contents elements as their content is", () => {
  const tree = new Root();
  const a = new NotProcessedToken(tree, '<div class="container">');
  const b = new Content(tree, "this is some content");
  const c = new NotProcessedToken(tree, "</div>");
  [a, b, c].forEach((item) => tree.addChild(item));

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe(
    '<div class="container">\nthis is some content\n</div>\n'
  );
});

test("should mount and close tag elements with no params' strings correctly", () => {
  const tree = new Root();

  const tag = new Element(tree, Tag.DIV);
  tree.addChild(tag);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe("<div>\n</div>\n");
});

test("should build elements with an attribute", () => {
  const tree = new Root();

  const element = new Element(tree, Tag.DIV);
  element.addAttribute("class", "test");
  tree.addChild(element);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe('<div class="test">\n</div>\n');
});

test("should build self-enclosed elements", () => {
  const tree = new Root();

  const element = new Element(tree, Tag.BR);
  element.isSelfEnclosed = true;
  tree.addChild(element);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe("<br/>\n");
});
