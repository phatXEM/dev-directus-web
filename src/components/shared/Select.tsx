import { ReactNode } from "react";
import {
  Combobox,
  InputBase,
  InputBaseProps,
  Text,
  useCombobox,
} from "@mantine/core";

type SelectProps = {
  data: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  inputProps?: InputBaseProps;
  placeholder?: string;
  renderInputValue?: (item: any) => ReactNode;
  renderItem?: (item: any) => ReactNode;
};

const Select = ({
  data,
  value,
  onChange,
  inputProps,
  placeholder,
  renderInputValue,
  renderItem,
}: SelectProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        onChange(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          {...inputProps}
        >
          {renderInputValue
            ? renderInputValue(data.find((item) => item.value === value))
            : data.find((item) => item.value === value)?.label || placeholder}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {data.map((item) => (
            <Combobox.Option
              value={item.value}
              key={item.value}
              selected={item.value === value}
            >
              {renderItem ? (
                renderItem(item)
              ) : (
                <Text size={inputProps?.size ?? "sm"}>{item.label}</Text>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default Select;
