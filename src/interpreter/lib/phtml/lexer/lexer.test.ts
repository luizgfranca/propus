const { Lexer } = require("./lexer");
const { TokenType } = require("./token");

test("with plain text input should return only a text token", () => {
  const lexer = new Lexer();
  const result = lexer.doLex("this is a test");

  expect(result.length).toBe(1);
  expect(result[0].type).toBe(TokenType.TEXT);
  expect(result[0].content).toBe("this is a test");
});
