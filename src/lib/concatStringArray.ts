import { accumulate } from "./accumulate";

export function concatStringArray(array: string[]): string {
  if (!array || array === null) return "";

  return accumulate(array, "");
}
