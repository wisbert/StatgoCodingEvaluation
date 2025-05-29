type CalculateCodePriceProps = {
  selectedCodes: (Code | null)[];
  modifiers: Modifier[];
};

export const calculateCodePrice = ({
  selectedCodes,
  modifiers,
}: CalculateCodePriceProps) => {

  return (
    selectedCodes.reduce((final, selectedCodes) => final + (selectedCodes?.amount ?? 0), 0) +
    modifiers.reduce((final, modifier) => final + (modifier?.amount ?? 0), 0)
  );
};
