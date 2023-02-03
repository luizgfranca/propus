import { Content } from "../model/content";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Root } from "../model/root";
import { Element } from "../model/element";
import { Compiler } from "./builder";
import { Tag } from "../model/tag";
import { ChildProcess } from "child_process";

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

test("should build nested elements", () => {
  const tree = new Root();

  const parent = new Element(tree, Tag.DIV);
  tree.addChild(parent);

  const child = new Element(parent, Tag.BR);
  child.isSelfEnclosed = true;
  parent.addChild(child);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe("<div>\n<br/>\n</div>\n");
});

test("should build nested elements with content inside the child", () => {
  const tree = new Root();

  const parent = new Element(tree, Tag.DIV);
  parent.addAttribute("class", "parent");
  tree.addChild(parent);

  const child = new Element(parent, Tag.DIV);
  child.addAttribute("class", "child");
  parent.addChild(child);

  const content = new Content(child, "some content");
  child.addChild(content);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe(
    '<div class="parent">\n' +
      '<div class="child">\n' +
      "some content\n" +
      "</div>\n" +
      "</div>\n"
  );
});

test("should build content with a self enclosed tag", () => {
  const tree = new Root();

  const parent = new Element(tree, Tag.DIV);
  parent.addAttribute("class", "parent");
  tree.addChild(parent);

  const child = new Element(parent, Tag.DIV);
  child.addAttribute("class", "child");
  parent.addChild(child);

  const content = new Content(child, "some content");
  child.addChild(content);

  const newLine = new Element(child, Tag.BR);
  newLine.isSelfEnclosed = true;
  child.addChild(newLine);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe(
    '<div class="parent">\n' +
      '<div class="child">\n' +
      "some content\n<br/>\n" +
      "</div>\n" +
      "</div>\n"
  );
});

test("should build mixed and combined with tags", () => {
  const tree = new Root();

  const parent = new Element(tree, Tag.DIV);
  parent.addAttribute("class", "parent");
  tree.addChild(parent);

  const container = new Element(parent, Tag.DIV);
  container.addAttribute("class", "container");
  parent.addChild(container);

  const titleTag = new Element(container, Tag.H1);
  container.addChild(titleTag);

  const titleText = new Content(titleTag, 'title')
  titleTag.addChild(titleText);

  const textBefore = new Content(container, 'some content')
  container.addChild(textBefore);

  const newLine = new Element(container, Tag.BR);
  newLine.isSelfEnclosed = true;
  container.addChild(newLine);

  const textAfter = new Content(container, 'more content');
  container.addChild(textAfter);

  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe(
    '<div class="parent">\n' +
      '<div class="container">\n' +
      "<h1>\ntitle\n</h1>\nsome content\n<br/>\nmore content\n" +
      "</div>\n" +
      "</div>\n"
  );
});