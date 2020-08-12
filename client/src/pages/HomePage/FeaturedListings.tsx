import React from "react";
import { List } from "antd";
import { ListingCard } from "../../components/ListingCard/ListingsCard";
import { ListingsQuery } from "../../lib/graphql/queries/__generated__/index.generated";

interface Props {
  listings: ListingsQuery["listings"]["result"];
}

export const FeaturedListings = ({ listings }: Props) => {
  return (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 4,
        xl: 4,
        xxl: 4,
      }}
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item>
          <ListingCard listing={listing} />
        </List.Item>
      )}
    />
  );
};
