import { Dictionary } from "./type/generic";
import { PropusDataOptions } from "./type/phtml";

export class PHTMLInterpreter {
  private originStr: string;
  private data: Dictionary<any>;
  private datasets: Dictionary<Object[]>;

  constructor(readonly str: string) {
    this.originStr = str;
  }

  public loadData(input: PropusDataOptions) {
    this.data = input.data;
    this.datasets = input.dataset;
  }

  public lex(): string[] {
    return [];
  }

  public parseToHTML(): string {
    return "";
  }
}
