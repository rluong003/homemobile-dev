import React, { useState, useRef, useEffect } from "react";
import { ScrollToTop } from "../../index";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Layout, List, Typography, Pagination } from "antd";
import { ListingCard } from "../../components/ListingCard/ListingsCard";
import {
  ListingsQuery,
  ListingsQueryVariables,
} from "../../lib/graphql/queries/__generated__/index.generated";
import { ErrorBanner } from "../../components/Error/Error";
import { LISTINGS } from "../../lib/graphql/queries/index";
import { ListingFilter } from "../../lib/graphql/globalTypes";
import { ListingsFilter } from "./ListingsFilter";
import { ListingsSkeleton } from "../../components/Skeletons/ListingsSkeleton";
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface MatchType {
  location: string;
}

export const ListingsPage = () => {
  ScrollToTop();
  const { location } = useParams<MatchType>();
  const curLocation = useRef(location);
  const [filter, setFilter] = useState(ListingFilter.PriceLh);
  const [page, setPage] = useState(1);
  const { loading, data, error } = useQuery<
    ListingsQuery,
    ListingsQueryVariables
  >(LISTINGS, {
    skip: curLocation.current !== location && page !== 1,
    variables: {
      location: location,
      filter: filter,
      limit: 10,
      page: page,
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    setPage(1);
    curLocation.current = location;
  }, [location]);

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description={`Something went wrong. Try again`} />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listings = data ? data.listings : null;

  const listingRegion = listings ? listings.region : null;
  const totalListings = listings ? listings.total : undefined;

  return (
    <Content className="listings">
      {listingRegion ? (
        <div>
          <span> {totalListings} stays </span>
          <Title level={3}>Stays in {listingRegion}</Title>
        </div>
      ) : (
        <div>
          <span> {totalListings} stays </span>
          <Title level={3}> Stays on Home Mobile</Title>
        </div>
      )}

      {listings && listings.result.length !== 0 ? (
        <div>
          <ListingsFilter filter={filter} setFilter={setFilter} />
          <List
            grid={{
              gutter: 8,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 5,
              xl: 5,
              xxl: 5,
            }}
            dataSource={listings.result}
            renderItem={(listing) => (
              <List.Item>
                <ListingCard listing={listing} />
              </List.Item>
            )}
          />

          <Pagination
            className="listings-pagination"
            current={page}
            total={totalListings}
            onChange={(page: number) => setPage(page)}
            hideOnSinglePage
            showLessItems
            defaultPageSize={10}
          />
        </div>
      ) : (
        <div>
          <Paragraph>
            There are no listings for <Text mark>"{listingRegion} "</Text>
          </Paragraph>
        </div>
      )}
    </Content>
  );
};
