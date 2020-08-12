import { message } from "antd";

export const SuccessNotification = (goodMessage: string) => {
  return message.success(goodMessage);
};

export const ErrorNotification = (error: string) => {
  return message.error(error);
};
