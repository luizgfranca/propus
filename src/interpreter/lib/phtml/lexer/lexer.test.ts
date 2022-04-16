const { Lexer } = require("./lexer");
const { TokenType } = require("./token");

test("with plain text input should return only a text token", () => {
  const lexer = new Lexer();
  const result = lexer.doLex("this is a test");

  expect(result.length).toBe(1);
  expect(result[0].type).toBe(TokenType.CONTENT);
  expect(result[0].content).toBe("this is a test");
});

test("simple tag with text inside", () => {
  const lexer = new Lexer();
  const result = lexer.doLex("<h1>this is a test</h1>");

  expect(result.length).toBe(3);

  expect(result[0].type).toBe(TokenType.TAG);
  expect(result[0].content).toBe("<h1>");

  expect(result[1].type).toBe(TokenType.CONTENT);
  expect(result[1].content).toBe("this is a test");

  expect(result[2].type).toBe(TokenType.TAG);
  expect(result[2].content).toBe("</h1>");
});
