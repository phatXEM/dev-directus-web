import {
  Combobox,
  Group,
  Text,
  InputBase,
  InputBaseProps,
  useCombobox,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

type MultiSelectProps = {
  data: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  inputProps?: InputBaseProps;
  placeholder?: string;
};

const MultiSelect = ({
  data,
  value,
  onChange,
  inputProps,
  placeholder,
}: MultiSelectProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) => {
    const newValue = value.includes(val)
      ? value.filter((item) => item !== val)
      : [...value, val];
    onChange(newValue);
  };

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
          {...inputProps}
        >
          {placeholder}
        </InputBase>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {data.map((item) => (
            <Combobox.Option key={item.value} value={item.value}>
              <Group justify="space-between">
                <Text size="sm">{item.label}</Text>
                {value.includes(item.value) && <IconCheck size={16} />}
              </Group>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default MultiSelect;
