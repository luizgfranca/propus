import { Template } from "./template";

export class HtmlTemplate extends Template {
  public load(html: string) {
    this.content = html;
    return this;
  }
}
