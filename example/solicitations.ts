import * as propus from "../src";
import * as fs from "fs";
import * as path from "path";
import { solicitations } from "./dataset/solicitations";

const template = fs.readFileSync(
  path.resolve(__dirname, "template", "solicitations.html")
);

propus
  .fromHtmlTemplate()
  .load(template.toString())
  .render(null, solicitations.resultData.customerDemands)
  .generate(path.resolve(__dirname, "artifacts", "solicitations.pdf"));
