import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import { ListingQuery } from "../../lib/graphql/queries/__generated__/index.generated";
import moment, { Moment } from "moment";
import { ErrorNotification } from "../../components/Notification/Notificaitons";
import { Viewer } from "../../lib/types";
import { ErrorBanner } from "../../components/Error/Error";

const { Paragraph, Title } = Typography;

interface BookingsIndexMonth {
  [key: string]: boolean;
}

interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

interface BIndex {
  [key: string]: BookingsIndexYear;
}

interface Props {
  viewer: Viewer;
  host: ListingQuery["listing"]["host"];
  bookingIndex: ListingQuery["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
  price: number;
}

export const CreateBooking = ({
  setModalVisible,
  host,
  bookingIndex,
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
  viewer,
}: Props) => {
  const bIndexJSON: BIndex = JSON.parse(bookingIndex);

  const IsBooked = (currentDate: Moment) => {
    const y = moment(currentDate).year();
    const m = moment(currentDate).month();
    const d = moment(currentDate).date();

    if (bIndexJSON[y] && bIndexJSON[y][m]) {
      return Boolean(bIndexJSON[y][m][d]);
    } else {
      return false;
    }
  };

  const disabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

      return dateIsBeforeEndOfDay || IsBooked(currentDate);
    } else {
      return false;
    }
  };

  const verifyCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        return ErrorNotification(`This date is before your check in date.`);
      }
      let dateCursor = checkInDate;

      while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
        dateCursor = moment(dateCursor).add(1, "days");

        const y = moment(dateCursor).year();
        const m = moment(dateCursor).month();
        const d = moment(dateCursor).date();

        if (bIndexJSON[y] && bIndexJSON[y][m] && bIndexJSON[y][m][d]) {
          return ErrorNotification("This date has already been booked.");
        }
      }
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  let message = "";

  const idCheck = viewer.id === host.id;

  const checkInDisable = idCheck || !viewer.id;
  const checkOutInputDisabled = checkInDisable || !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

  if (!viewer.id) {
    message = "You must be signed in to make a reservation.";
  } else if (idCheck) {
    message = "You can't book your own listing";
  }

  return (
    <div className="listing-booking">
      <Card className="create-booking-card">
        {!viewer.id || idCheck ? (
          <ErrorBanner message={message} description={""} />
        ) : null}
        <div>
          <Title level={2} className="create-booking-price">
            ${price} <span style={{ fontWeight: 300 }}> / night</span>
          </Title>
          <Divider />
          <div className="create-booking-dates">
            <Paragraph className="checkin-checkout">Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              format={"YYYY/MM/DD"}
              disabled={checkInDisable}
              showToday={false}
              disabledDate={disabledDate}
              onChange={(dateValue) => setCheckInDate(dateValue)}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="create-booking-dates">
            <Paragraph className="checkin-checkout">Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
              onChange={(dateValue) => verifyCheckOutDate(dateValue)}
            />
          </div>
        </div>
        <Divider />
        <Button
          className="create-booking-button"
          disabled={buttonDisabled}
          size="large"
          type="primary"
          onClick={() => setModalVisible(true)}
        >
          Reserve
        </Button>
      </Card>
    </div>
  );
};
