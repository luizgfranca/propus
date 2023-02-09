import { NotProcessedToken } from "./model/notProcessedElement";
import { Root } from "./model/root";
import { Tag } from "./model/tag";
import { Element } from "./model/element";
import { Content } from "./model/content";
import { Parser } from "./parser/parser";
import Flatted from "flatted";
import { Lexer } from "./lexer/lexer";
import { Compiler } from "./builder/builder";

test("should parse and then be able to recompose tag composition", () => {
  const toParse = `
        <div class="container">
            <div class="test">
                <h1>this is a title</h1><br>
                <div class="content-container">
                    this is some content
                </div>
                <div class="content-container">
                    <div class="deeper-container">
                        this is some other content
                    </div>
                </div>
            </div>
        </div>
    `;

  const expected =
    '<div class="container">\n' +
    '<div class="test">\n' +
    "<h1>\nthis is a title\n</h1>\n<br>\n" +
    '<div class="content-container">\n' +
    "this is some content\n" +
    "</div>\n" +
    '<div class="content-container">\n' +
    '<div class="deeper-container">\n' +
    "this is some other content\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n";

  const lexer = new Lexer();
  const parser = new Parser();
  const compiler = new Compiler();

  const tokens = lexer.doLex(toParse);
  const parsedTree = parser.doParse(tokens);
  const processingResult = compiler.doCompilation(parsedTree);

  expect(processingResult).toBe(expected);
});
