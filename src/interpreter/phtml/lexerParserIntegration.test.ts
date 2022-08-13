import { NotProcessedToken } from "./model/notProcessedElement";
import { Root } from "./model/root";
import { Tag } from "./model/tag";
import { Element } from "./model/element";
import { Content } from "./model/content";
import { Parser } from "./parser/parser";
import Flatted from "flatted";
import { Lexer } from "./lexer/lexer";

test("should understand simple tag compositions", () => {
  const toParse = `
        <div class="container">
            <div class="test" prop:test>
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

  const tree = new Root();

  const notProcessed = new NotProcessedToken(tree, '<div class="container">');
  tree.addChild(notProcessed);

  const tag = new Element(tree, Tag.DIV);
  tag.addAttribute("class", "test");
  tag.props["test"] = true;
  tree.addChild(tag);

  const insideTag = new Element(tag, Tag.DIV);
  insideTag.addAttribute("class", "content-container");
  tag.addChild(insideTag);

  const content = new Content(insideTag, "this is some content");
  insideTag.addChild(content);

  const otherTag = new Element(tag, Tag.DIV);
  otherTag.addAttribute("class", "content-container");
  tag.addChild(otherTag);

  const deepTag = new Element(otherTag, Tag.DIV);
  deepTag.addAttribute("class", "deeper-container");
  otherTag.addChild(deepTag);

  const otherContent = new Content(deepTag, "this is some other content");
  deepTag.addChild(otherContent);

  const notProcessedCloser = new NotProcessedToken(tree, "</div>");
  tree.addChild(notProcessedCloser);

  const lexer = new Lexer();
  const parser = new Parser();

  const tokens = lexer.doLex(toParse);
  const parsedTree = parser.doParse(tokens);

  expect(Flatted.toJSON(parsedTree)).toStrictEqual(Flatted.toJSON(tree));
});
