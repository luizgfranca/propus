import { Root } from "../model/root";
import { Parser } from "./parser";

test("parse empty list of tokens", () => {
  const parser = new Parser();
  expect(parser.doParse([])).toStrictEqual(new Root());
});
