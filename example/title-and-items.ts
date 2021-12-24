import path from "path";
import * as propus from "../src";

propus
  .fromHtmlTemplate()
  .load(
    "<h1>{{x}}</h1>" +
      "<ul>" +
      '<li class="propus-dataset-item">{{[a]}}</li>' +
      "</ul>"
  )
  .render({ x: "Hi" }, [{ a: "this is a item" }, { a: "this is another item" }])
  .generate(path.resolve(__dirname, "artifacts", "test.pdf"));
