import React from "react";
import { UserQuery } from "../../lib/graphql/queries/__generated__/index.generated";
import { ListingCard } from "../../components/ListingCard/ListingsCard";
import { List, Typography, Pagination } from "antd";

const { Title } = Typography;

interface Props {
  user: UserQuery["user"];
  userListings: UserQuery["user"]["listings"];
  listingsPage: number;
  limit: number;
  setListingsPage: (page: number) => void;
}

export const UserListings = ({
  user,
  userListings,
  listingsPage,
  limit,
  setListingsPage,
}: Props) => {
  const { total, result } = userListings;
  const { name } = user;
  const nameArr = name.split(" ");
  const firstName = nameArr[0];
  return (
    <div className="user-listings">
      <Title level={2}>{firstName}'s Listings</Title>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={result}
        locale={{ emptyText: "You doesn't have any listings yet!" }}
        renderItem={(userListing) => (
          <List.Item>
            <ListingCard listing={userListing} />
          </List.Item>
        )}
      />
      <Pagination
        current={listingsPage}
        total={total}
        onChange={(page: number) => setListingsPage(page)}
        hideOnSinglePage
        showLessItems
        defaultPageSize={4}
        className="listings-pagination"
      />
    </div>
  );
};
