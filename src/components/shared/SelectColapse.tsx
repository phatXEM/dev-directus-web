import { forwardRef, ReactNode, useImperativeHandle } from "react";
import {
  Button,
  Collapse,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconChevronUp,
  IconRotate,
} from "@tabler/icons-react";
import commonClasses from "@/styles/Common.module.css";
import { useTranslations } from "next-intl";

export type SelectColapseHandles = {
  open: () => void;
  close: () => void;
};

type SelectColapseProps = {
  label: string;
  data: { value: string; label: string }[];
  value: string;
  customValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  renderItem?: (item: any, onChangeValue: (val: string) => void) => ReactNode;
  dataRender?: any[];
  showRetry?: boolean;
  retryMessage?: string;
  onRetry?: () => void;
  openDefault?: boolean;
};

const SelectColapse = forwardRef<SelectColapseHandles, SelectColapseProps>(
  function SelectColapse(
    {
      label,
      data,
      value,
      customValue,
      onChange,
      disabled = false,
      renderItem,
      dataRender,
      showRetry,
      retryMessage,
      onRetry,
      openDefault = false,
    },
    ref
  ) {
    const [opened, { toggle, open, close }] = useDisclosure(openDefault);
    const t = useTranslations();

    useImperativeHandle(ref, () => ({
      open: () => {
        open();
      },
      close: () => {
        close();
      },
    }));

    const onChangeValue = (value: string) => {
      close();
      onChange(value);
    };

    return (
      <Paper withBorder>
        <Group justify="center" mb={5}>
          <Button
            variant="transparent"
            justify="space-between"
            fullWidth
            onClick={toggle}
            rightSection={opened ? <IconChevronUp /> : <IconChevronDown />}
            disabled={disabled}
            px="sm"
            className={commonClasses.button_black}
          >
            {label}
          </Button>
        </Group>

        {(data.find((item) => item.value === value)?.label || customValue) &&
          !opened && (
            <Text mx="md" mb={3} size="sm">
              {customValue || data.find((item) => item.value === value)?.label}
            </Text>
          )}

        <Collapse in={opened} px="md" pt={6} pb="sm">
          {renderItem ? (
            <Stack gap={5}>
              {!!dataRender?.length &&
                dataRender.map((item) => renderItem(item, onChangeValue))}
            </Stack>
          ) : (
            <Radio.Group value={value} onChange={onChange}>
              <Stack>
                {data.map((item) => (
                  <Radio
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    disabled={disabled}
                  />
                ))}
              </Stack>
            </Radio.Group>
          )}

          {showRetry && (
            <Stack align="center" gap="xs">
              <Text c="red" size="sm">
                {retryMessage || t("no_result")}
              </Text>
              <Button
                size="xs"
                leftSection={<IconRotate size={15} />}
                onClick={onRetry}
              >
                {t("retry")}
              </Button>
            </Stack>
          )}
        </Collapse>
      </Paper>
    );
  }
);

export default SelectColapse;
