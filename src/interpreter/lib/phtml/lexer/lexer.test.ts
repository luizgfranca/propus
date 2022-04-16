import { Token } from "./token";

const { Lexer } = require("./lexer");
const { TokenType } = require("./token");

test("with plain text input should return only a text token", () => {
  const lexer = new Lexer();
  const result = lexer.doLex("this is a test");
  expect(result).toStrictEqual([
    new Token(TokenType.CONTENT, "this is a test"),
  ]);
});

test("simple tag with text inside", () => {
  const lexer = new Lexer();
  const result = lexer.doLex("<h1>this is a test</h1>");

  expect(result).toStrictEqual([
    new Token(TokenType.TAG, "<h1>"),
    new Token(TokenType.CONTENT, "this is a test"),
    new Token(TokenType.TAG, "</h1>"),
  ]);
});
