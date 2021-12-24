import * as htmlPdf from "html-pdf";
import * as htmlParser from "node-html-parser";
import { concatStringArray } from "../lib/concatStringArray";

export class Template {
  protected content: string;

  private readonly DATASET_CLASS_NAME = "propus-dataset-item";

  private readonly DATA_EXPRESSION_FORMAT = "{{[A-Za-z0-9_]*}}";
  private readonly DATASET_EXPRESSION_FORMAT = "{{[[A-Za-z0-9_]*]}}";

  private readonly DATA_MATCH_STR_POSITION = 0;
  private readonly DATASET_MATCH_STR_POSITION = 0;

  private readonly OBJECT_OPEN_SYMBOL = "{{";
  private readonly ARRAY_ITEM_OPEN_SYMBOL = "[";
  private readonly CLASS_SELECTOR_SYMBOL = ".";
  private readonly ID_SELECTOR_SYMBOL = "#";

  private readonly LENGTH_OBJECT_SYMBOL = this.OBJECT_OPEN_SYMBOL.length;
  private readonly LENGTH_ARRAY_ITEM_SYMBOL =
    this.ARRAY_ITEM_OPEN_SYMBOL.length;

  private replaceExpressionWithData(
    content: string,
    expr: string,
    data: any,
    controlSymbolsSize: number
  ) {
    content = content.replace(
      expr,
      data[
        expr.substr(controlSymbolsSize, expr.length - 2 * controlSymbolsSize)
      ]
    );

    return content;
  }

  private extractDatasetBand(template: string): htmlParser.HTMLElement {
    const root = htmlParser.parse(template);
    return root.querySelector(
      this.CLASS_SELECTOR_SYMBOL + this.DATASET_CLASS_NAME
    );
  }

  private renderDatasetContent(
    datasetBand: htmlParser.HTMLElement,
    dataset?: any[]
  ): string[] {
    if (!dataset || dataset.length === 0) return [];
    if (!datasetBand || datasetBand === null) return [];

    const bandContent = datasetBand.toString();

    const contentArray = dataset.map((datasetItem): string => {
      let itemContent = bandContent;

      while (true) {
        const match = itemContent.match(this.DATASET_EXPRESSION_FORMAT);
        if (!match || match === null) break;

        itemContent = this.replaceExpressionWithData(
          itemContent,
          match[this.DATASET_MATCH_STR_POSITION],
          datasetItem,
          this.LENGTH_OBJECT_SYMBOL + this.LENGTH_ARRAY_ITEM_SYMBOL
        );
      }

      return itemContent;
    });

    return contentArray;
  }

  public render(data: any, dataset?: any[]) {
    while (true) {
      const match = this.content.match(this.DATA_EXPRESSION_FORMAT);

      if (!match || match === null) break;
      this.content = this.replaceExpressionWithData(
        this.content,
        match[this.DATA_MATCH_STR_POSITION],
        data,
        this.LENGTH_OBJECT_SYMBOL
      );
    }

    const datasetBand = this.extractDatasetBand(this.content);
    const datasetContentList = this.renderDatasetContent(datasetBand, dataset);

    this.content = this.content.replace(
      datasetBand.toString(),
      concatStringArray(datasetContentList)
    );

    return this;
  }

  public generate(path: string) {
    htmlPdf.create(this.content).toFile(path, (err, res) => {
      if (err) throw err;
    });
  }
}
