import React from "react";
import { Layout, Typography, Input } from "antd";
import { ScrollToTop } from "../../index";
import { useHistory } from "react-router-dom";
import { FeaturedListings } from "./FeaturedListings";
import { ErrorNotification } from "../../components/Notification/Notificaitons";
import { SuggestedDestinations } from "./SuggestedDestinations";
import { useQuery } from "@apollo/react-hooks";
import {
  ListingsQuery,
  ListingsQueryVariables,
} from "../../lib/graphql/queries/__generated__/index.generated";
import { LISTINGS } from "../../lib/graphql/queries/index";
import { ListingFilter } from "../../lib/graphql/globalTypes";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

export const HomePage = () => {
  const history = useHistory();
  ScrollToTop();
  const onSearch = (value: string) => {
    if (value) {
      history.push(`/listings/${value.trim()}`);
    } else {
      ErrorNotification("Invalid search");
    }
  };

  const { data } = useQuery<ListingsQuery, ListingsQueryVariables>(LISTINGS, {
    variables: {
      filter: ListingFilter.PriceHl,
      limit: 4,
      page: 1,
    },
    fetchPolicy: "cache-and-network",
  });

  return (
    <Layout className="home">
      <Content>
        <div className="home-landing">
          <Title className="home-landing-title">Where will you stay? </Title>
          <Paragraph className="home-landing-text">
            <span id="landing">Experience destinations like a local with </span>
            <span>
              <Text type="danger"> Home Mobile</Text>{" "}
            </span>
          </Paragraph>
        </div>

        <div className="home-content">
          <div className="home-searchbar">
            <Search
              placeholder="Add a location"
              size="large"
              enterButton
              className="home-searchbar-button"
              onSearch={onSearch}
            />
          </div>

          <div className="home-listings">
            <Title level={4} className="home-content-title">
              Featured Listings
            </Title>
            {data ? <FeaturedListings listings={data.listings.result} /> : null}
          </div>

          <div className="home-destinations">
            <Title level={4} className="home-content-title">
              Featured Destinations
            </Title>
            <SuggestedDestinations />
          </div>
        </div>
      </Content>
    </Layout>
  );
};
