import React from "react";
import { Select } from "antd";
import { ListingFilter } from "../../lib/graphql/globalTypes";

const { Option } = Select;

interface Props {
  filter: ListingFilter;
  setFilter: (filter: ListingFilter) => void;
}

export const ListingsFilter = ({ filter, setFilter }: Props) => {
  return (
    <div className="listings-filters">
      <Select
        value={filter}
        onChange={(filter: ListingFilter) => setFilter(filter)}
      >
        <Option value={ListingFilter.PriceLh}>Price: Low to High</Option>
        <Option value={ListingFilter.PriceHl}>Price: High to Low</Option>
      </Select>
    </div>
  );
};
