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
  ATTRIBUTE_NAME_OR_VALUE_NULL:
    "Internal error: attribute name or value used but not assigned",
  INVALID_PROP_NAME: "Invalid prop name",
  UNCONTAINED_VALUE: "Uncontained attribute or property value"
};
