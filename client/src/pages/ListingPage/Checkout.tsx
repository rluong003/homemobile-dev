import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, Divider, Modal, Typography } from "antd";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import moment, { Moment } from "moment";
import {
  BookListingMutation,
  BookListingMutationVariables,
} from "../../lib/graphql/mutations/__generated__/index.generated";
import { BOOK_LISTING } from "../../lib/graphql/mutations/index";
import {
  SuccessNotification,
  ErrorNotification,
} from "../../components/Notification/Notificaitons";

const { Paragraph, Text, Title } = Typography;

interface Props {
  id: string;
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
  handleRefetch: () => void;
  clearDates: () => void;
}

export const Checkout = ({
  id,
  handleRefetch,
  clearDates,
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [bookListing, { loading }] = useMutation<
    BookListingMutation,
    BookListingMutationVariables
  >(BOOK_LISTING, {
    onCompleted: () => {
      clearDates();
      SuccessNotification("Succesfully booked the listing!");
      handleRefetch();
    },
    onError: () => {
      ErrorNotification("Booking error, please try again later.");
    },
  });

  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const total = price * daysBooked;

  const handleClick = async () => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }
    const { token, error } = await stripe.createToken(cardElement);
    if (token) {
      bookListing({
        variables: {
          input: {
            id: id,
            source: token.id,
            checkIn: moment(checkInDate).format("YYYY-MM-DD"),
            checkOut: moment(checkOutDate).format("YYYY-MM-DD"),
          },
        },
      });
    } else {
      ErrorNotification(
        error && error.message
          ? error.message
          : "Reservation failed sorry, try again"
      );
    }
  };
  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div>
        <div>
          <Title level={2}>Confirm and pay</Title>
          <Divider />
          <Title level={3}>Your Trip</Title>

          <Paragraph>
            <Title level={4}> Dates</Title>
            <Text className="checkout-summary-text">
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
            -{" "}
            <Text className="checkout-summary-text">
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Text>
          </Paragraph>
        </div>

        <Divider />

        <div>
          <Title level={4}> Price Details</Title>
          <Paragraph className="checkout-summary-text">
            ${price} X {daysBooked} nights
          </Paragraph>
          <Paragraph className="checkout-summary-text">
            <Title level={4}>
              Total = <Text className="checkout-summary-text">${total}</Text>{" "}
            </Title>
          </Paragraph>
        </div>

        <Divider />

        <div className="checkout-stripe-wrapper">
          <Title level={4}> Pay With</Title>
          <Text type="secondary">
            {" "}
            Note: This is only a test, please do not input a real credit card
            number. Use 4242 4242 4242 4242
          </Text>
          <CardElement className="checkout-stripe-element" />

          <Button
            className="checkout-button"
            loading={loading}
            onClick={handleClick}
            size="large"
            type="primary"
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
