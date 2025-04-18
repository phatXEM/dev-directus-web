import { useRef, useState } from "react";
import { ModalHandles } from "@/components/shared/Modal";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import {
  Group,
  Stack,
  TextInput,
  Text,
  Radio,
  Title,
  Avatar,
  ActionIcon,
  Button,
  Anchor,
  Grid,
} from "@mantine/core";
import { IconDeviceMobile, IconPencil, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import CallingCodeSelect, {
  CallingCodeSelectHandles,
} from "@/components/form/CallingCodeSelect";
import ChangeAvatarModal from "./ChangeAvatarModal";
import { Link } from "@/i18n/routing";
import { DateInput } from "@mantine/dates";
import { CALLING_LIST } from "@/data/common";

type ProfileFormData = z.infer<typeof schema>;

const schema = z.object({
  avatar: z.string(),
  fullname: z.string().min(1, "required"),
  gender: z.string(),
  phone: z.string().min(9, "phone_number_is_invalid"),
  birthday: z.string(),
  country_code: z.string(),
});

const ProfileForm = () => {
  const gridSpan = { xs: 12, sm: 6 };
  const { data: session } = useSession();
  const changeAvatarRef = useRef<ModalHandles>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations();
  const callingCodeRef = useRef<CallingCodeSelectHandles>(null);
  const phoneNumber = session?.user?.phone
    ? session?.user?.phone?.replace(
        "+" +
          CALLING_LIST.find((item) => item.name === session?.user?.country_code)
            ?.value,
        ""
      )
    : "";

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: session?.user?.avatar ?? "",
      fullname: session?.user?.full_name ?? "",
      gender: session?.user?.gender ?? "male",
      phone: phoneNumber || "",
      birthday: session?.user?.birthday ?? "",
      country_code: session?.user?.country_code ?? "",
    },
  });

  const onChangeAvatar = () => {
    changeAvatarRef.current?.open();
  };

  const onChangePhoneNumber = (
    text: string,
    onChange: (val: string) => void
  ) => {
    if (text.match(/^\d+$/) || text === "") onChange(text);
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (values) => {
    console.log(values);
  };

  const onCancel = () => {
    reset();
  };

  return (
    <Stack maw={1200}>
      <Grid>
        <Grid.Col span={12}>
          <Group>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Stack pos="relative">
                  <Avatar
                    src={
                      value
                        ? `https://soc.socjsc.com/assets/${value}?key=system-small-cover`
                        : "/images/user.png"
                    }
                    alt="Profile picture"
                    size={100}
                    radius="xl"
                    color="blue"
                  />
                  <ActionIcon
                    onClick={onChangeAvatar}
                    radius="xl"
                    pos="absolute"
                    bottom={0}
                    right={0}
                  >
                    <IconPencil size={18} />
                  </ActionIcon>
                  <ChangeAvatarModal
                    modalRef={changeAvatarRef}
                    avatar={
                      value
                        ? `${process.env.NEXT_PUBLIC_API_URL}/assets/${value}?key=system-small-cover`
                        : "/images/user.png"
                    }
                  />
                </Stack>
              )}
            />
            <Stack gap={0}>
              <Title order={4}>{session?.user?.username}</Title>
              <Text size="md" c="gray">
                {session?.user?.email}
              </Text>
              <Text size="xs" c="green">
                  {t("verified")}
                </Text>
            </Stack>
          </Group>
        </Grid.Col>

        <Grid.Col span={gridSpan}>
          <Controller
            name="fullname"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                label={t("fullname")}
                placeholder={t("enter_fullname")}
                onChange={(event) => {
                  field.onChange(event.currentTarget.value);
                }}
                leftSectionPointerEvents="none"
                leftSection={<IconUser size={18} />}
                error={
                  errors.fullname?.message ? t(errors.fullname?.message) : ""
                }
                disabled={isSubmitting}
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={gridSpan}>
          <Controller
            name="gender"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Stack gap="xs">
                <Text fw={500} size="sm">
                  {t("gender")}
                </Text>
                <Radio.Group value={value} onChange={onChange}>
                  <Group gap="lg">
                    <Radio
                      size="xs"
                      value="male"
                      label={
                        <Title size="sm" fw={400} ta="center">
                          {t("male")}
                        </Title>
                      }
                    />
                    <Radio
                      size="xs"
                      value="female"
                      label={
                        <Title size="sm" fw={400} ta="center">
                          {t("female")}
                        </Title>
                      }
                    />
                  </Group>
                </Radio.Group>
              </Stack>
            )}
          />
        </Grid.Col>

        <Grid.Col span={gridSpan}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Stack gap={3}>
                <Group gap={5} align="top">
                  <CallingCodeSelect
                    ref={callingCodeRef}
                    inputProps={{
                      label: t("phone_number"),
                      disabled: isSubmitting,
                      leftSection: <IconDeviceMobile size={18} />,
                      w: 150,
                    }}
                  />
                  <TextInput
                    {...field}
                    label=" "
                    placeholder={t("enter_phone_number")}
                    onChange={(event) => {
                      onChangePhoneNumber(
                        event.currentTarget.value,
                        field.onChange
                      );
                    }}
                    disabled={isSubmitting}
                    error={!!errors.phone?.message}
                    flex={1}
                  />
                </Group>
                {errors.phone?.message ? (
                  <Text c="red" size="xs">
                    {t(errors.phone.message)}
                  </Text>
                ) : null}
              </Stack>
            )}
          />
        </Grid.Col>
        <Grid.Col span={gridSpan}>
          <Controller
            name="birthday"
            control={control}
            render={({ field: { value, onChange } }) => (
              <DateInput
                value={value ? new Date(value) : null}
                onChange={(val) => {
                  if (!val) onChange(null);
                  onChange(val?.toISOString() ?? "");
                }}
                label={t("birthday")}
                placeholder={t("pick_birthday")}
                valueFormat="DD-MM-YYYY"
                weekendDays={[]}
                defaultLevel="decade"
                clearable
              />
            )}
          />
        </Grid.Col>
      </Grid>
      <Group>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !isDirty}
        >
          {t("save_changes")}
        </Button>
      </Group>
    </Stack>
  );
};

export default ProfileForm;
