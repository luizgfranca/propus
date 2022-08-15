import { NotProcessedToken } from "../model/notProcessedElement";
import { Root } from "../model/root";
import { Compiler } from "./builder";

test("should return empty string when only the root exists", () => {
  const tree = new Root();
  const compiler = new Compiler();
  expect(compiler.doCompilation(tree)).toBe("");
});
