import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Combobox,
  InputBase,
  InputBaseProps,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { getCurrentCallingCode } from "@/utils/callingCode";
import { CALLING_LIST } from "@/data/common";

export type CallingCodeSelectHandles = {
  getCallingCode: () => Record<string, string>;
};

type CallingCodeSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  inputProps?: InputBaseProps;
};

const CallingCodeSelect = forwardRef<
  CallingCodeSelectHandles,
  CallingCodeSelectProps
>(function CallingCodeSelect({ value, onChange, inputProps }, ref) {
  const [callingCode, setCallingCode] = useState<Record<string, string>>({
    name: "",
    value: "",
  });
  const listRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef(null);
  const [search, setSearch] = useState("");

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useImperativeHandle(
    ref,
    () => ({
      getCallingCode: () => callingCode,
    }),
    [callingCode]
  );

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    if (callingCode.value !== value) {
      if (typeof onChange === "function") {
        onChange(callingCode.value);
      }
    }
  }, [callingCode, onChange, value]);

  const getInitData = async () => {
    // const { currentCallingCode, callingList } = await getCallingCode();
    const currentCallingCode = await getCurrentCallingCode();

    // setCallingCodeList(callingList);
    if (value) {
      const currentCallingCode = CALLING_LIST.find(
        (calling) => calling.value === value
      ) ?? { name: "VN", value: "84" };
      setCallingCode(currentCallingCode);
    } else {
      setCallingCode(currentCallingCode);
    }
  };

  const onKeyDown = (e: any) => {
    const char = e?.key?.toLowerCase();
    if (/^[a-z0-9]$/.test(char)) {
      const newSearch = search + char;
      setSearch(newSearch);

      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        scrollToItem(newSearch);
        setSearch("");
      }, 500);
    }
  };

  const scrollToItem = (query: string) => {
    const index = CALLING_LIST.findIndex((item) =>
      item.name.toLowerCase().startsWith(query)
    );

    if (index !== -1 && listRef.current) {
      const item = listRef.current.querySelector(`#calling-code-item-${index}`);
      if (item) {
        item.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        setCallingCode(CALLING_LIST[index]);
      }
    }
  };

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        const selected = CALLING_LIST.find((item) => item.value === val) || {
          name: "",
          value: "",
        };
        setCallingCode(selected);
        combobox.closeDropdown();
      }}
      onKeyDown={onKeyDown}
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
          {callingCode.value ? `${callingCode.name} +${callingCode.value}` : ""}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={200} ref={listRef}>
            {CALLING_LIST.map((item, index) => (
              <Combobox.Option
                value={item.value}
                key={item.name + index}
                id={`calling-code-item-${index}`}
              >
                {item.name} +{item.value}
              </Combobox.Option>
            ))}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
});

export default CallingCodeSelect;
