import { Content } from "../model/content";
import { NotProcessedToken } from "../model/notProcessedElement";
import { Root } from "../model/root";
import { Compiler } from "./builder";

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
