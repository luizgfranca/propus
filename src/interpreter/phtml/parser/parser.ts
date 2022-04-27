import { Root } from "../model/root";
import { Token } from "../model/token";

export class Parser {
  public doParse(tokens: Token[]): Root {
    return new Root();
  }
}
