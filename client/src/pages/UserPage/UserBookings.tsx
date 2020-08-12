import React from "react";
import { UserQuery } from "../../lib/graphql/queries/__generated__/index.generated";
import { ListingCard } from "../../components/ListingCard/ListingsCard";
import { List, Typography } from "antd";

const { Title, Text } = Typography;

interface Props {
  userBookings: UserQuery["user"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (page: number) => void;
}

export const UserBookings = ({
  userBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const total = userBookings ? userBookings.total : null;
  const result = userBookings ? userBookings.result : null;

  return (
    <div className="user-bookings">
      <Title level={1}>Your Trips</Title>

      {
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={result ? result : undefined}
          locale={{ emptyText: "You don't have any trips planned" }}
          pagination={{
            position: "bottom",
            current: bookingsPage,
            total: total ? total : undefined,
            defaultPageSize: limit,
            hideOnSinglePage: true,
            showLessItems: true,
            onChange: (page: number) => setBookingsPage(page),
          }}
          renderItem={(userBooking) => (
            <List.Item>
              <div>
                <Title level={3}> Reservation Date</Title>
                <div className="user-bookings-dates">
                  <Text strong>
                    {userBooking.checkIn} - {userBooking.checkOut}
                  </Text>
                </div>
              </div>
              <ListingCard listing={userBooking.listing} />
            </List.Item>
          )}
        />
      }
    </div>
  );
};
