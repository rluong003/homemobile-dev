import React, { useState } from "react";
import { Layout, Typography } from "antd";
import { ScrollToTop } from "../../index";
import { Viewer } from "../../lib/types";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import {
  UserQuery,
  UserQueryVariables,
} from "../../lib/graphql/queries/__generated__/index.generated";
import { USER } from "../../lib/graphql/queries/index";
import { UserBookings } from "../UserPage/UserBookings";
import { PageSkeleton } from "../../components/Skeletons/PageSkeleton";
import { ErrorBanner } from "../../components/Error/Error";
interface MatchType {
  id: string;
}
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}
const { Content } = Layout;
const { Title, Paragraph } = Typography;
export const TripsPage = ({ viewer, setViewer }: Props) => {
  ScrollToTop();
  const { id } = useParams<MatchType>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error } = useQuery<UserQuery, UserQueryVariables>(
    USER,
    {
      variables: {
        id: id,
        listingsPage,
        bookingsPage,
        limit: 4,
      },
    }
  );

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    console.error(error);
    return (
      <Content className="user">
        <ErrorBanner description="Error, please refresh or try signing in again." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = data ? data.user : null;
  const userBookings = user ? user.bookings : null;
  const idCheck = viewer.id === id;
  return (
    <div className="user-trips">
      {idCheck && userBookings ? (
        <UserBookings
          userBookings={userBookings}
          bookingsPage={bookingsPage}
          limit={4}
          setBookingsPage={setBookingsPage}
        />
      ) : idCheck ? (
        <div>
          {" "}
          <Title level={1}>Your Trips</Title>{" "}
          <Paragraph>You don't have any upcoming or past trips</Paragraph>
        </div>
      ) : (
        <div>
          {" "}
          <Title level={1}>You don't have access to this page.</Title>
        </div>
      )}
    </div>
  );
};
