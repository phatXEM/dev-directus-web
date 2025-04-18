import { NotificationData, notifications } from "@mantine/notifications";

export const showNotification = (notification: NotificationData) => {
  notifications.show({
    position: "top-right",
    autoClose: 3000,
    withBorder: true,
    ...notification,
  });
};
