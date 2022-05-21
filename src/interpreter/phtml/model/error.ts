export const ErrorMessage = {
  NOT_PROCESSED_ELEMENT_ADD_CHILD:
    "addChild operation not applicable to not processed node.",
  ELEMENT_INVALID_ATTR_PARAMS:
    "Invalid parameters for attribute. Usage (key: string, value: string)",
  INVALID_OPENNING: "Misplaced tag openning",
  INVALID_TAG: "Invalid tag identifier",
  MISPLACED_SYMBOL: (symbol: string) => `Misplaced symbol: ${symbol}`,
  DATA_AFTER_CLOSED: "Internal error: Token has more than one element",
  INFO_AFTER_FINISHED: "Invalid content after element is finished",
};
