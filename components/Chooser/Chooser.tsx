import { PropsWithChildren } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";

type ChooserProps<T extends { id: number }> = PropsWithChildren<{
  items: T[];
  selectedItem: T | null;
  onChange?: (selected: T) => void;
  getText: (item: T) => string;
}>;

export const Chooser = <T extends { id: number }>({
  children,
  items,
  selectedItem,
  onChange,
  getText
}: ChooserProps<T>) => {
  const handleOnChange = ({ target: { value } }: SelectChangeEvent<number>) => {
    const selected = items.find((item) => item.id === value);
    if(selected)
      onChange?.(selected)
  }
  return (
    <FormControl fullWidth>
      <InputLabel>{children}</InputLabel>
      <Select 
      fullWidth
      label={children}
      onChange={handleOnChange} 
      value={selectedItem?.id ?? ""}
      >
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {getText(item)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
