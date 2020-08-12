import React, { useState } from "react";
import { Layout } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { USER } from "../../lib/graphql/queries/index";
import { ScrollToTop } from "../../index";
import {
  UserQuery,
  UserQueryVariables,
} from "../../lib/graphql/queries/__generated__/index.generated";
import { UserCard } from "./UserCard";
import { Viewer } from "../../lib/types";
import { PageSkeleton } from "../../components/Skeletons/PageSkeleton";
import { ErrorBanner } from "../../components/Error/Error";
import { UserListings } from "./UserListings";

interface MatchType {
  id: string;
}

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const UserPage = ({ viewer, setViewer }: Props) => {
  ScrollToTop();
  const { id } = useParams<MatchType>();
  const [listingsPage, setListingsPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error, refetch } = useQuery<
    UserQuery,
    UserQueryVariables
  >(USER, {
    variables: {
      id: id,
      bookingsPage,
      listingsPage,
      limit: 4,
    },
  });

  const handleUserRefetch = async () => {
    await refetch();
  };

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
  const userListings = user ? user.listings : null;
  const idCheck = viewer.id === id;

  return (
    <Content className="user">
      <div className="user-page">
        {user ? (
          <UserCard
            user={user}
            idCheck={idCheck}
            viewer={viewer}
            setViewer={setViewer}
            handleUserRefetch={handleUserRefetch}
          />
        ) : null}

        <div className="user-page-listings">
          {userListings && user ? (
            <UserListings
              user={user}
              userListings={userListings}
              listingsPage={listingsPage}
              limit={4}
              setListingsPage={setListingsPage}
            />
          ) : null}
        </div>
      </div>
    </Content>
  );
};
