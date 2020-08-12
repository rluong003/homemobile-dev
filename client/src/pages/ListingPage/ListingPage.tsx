import React, { useState } from "react";
import { Layout, Typography, Tag } from "antd";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { LISTING } from "../../lib/graphql/queries/index";
import { PageSkeleton } from "../../components/Skeletons/PageSkeleton";
import { ScrollToTop } from "../../index";
import { ErrorBanner } from "../../components/Error/Error";
import {
  ListingQuery,
  ListingQueryVariables,
} from "../../lib/graphql/queries/__generated__/index.generated";
import { ListingFeatures } from "./ListingFeatures";
import { Checkout } from "./Checkout";
import { CreateBooking } from "./CreateBooking";
import { Moment } from "moment";
import { Viewer } from "../../lib/types";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;
interface MatchType {
  id: string;
}
interface Props {
  viewer: Viewer;
}

export const ListingPage = ({ viewer }: Props) => {
  ScrollToTop();
  const { id } = useParams<MatchType>();
  const [modalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

  const { data, loading, error, refetch } = useQuery<
    ListingQuery,
    ListingQueryVariables
  >(LISTING, {
    variables: {
      id: id,
      bookingsPage,
      limit: 3,
    },
  });
  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="Listing error, please try again" />
        <PageSkeleton />
      </Content>
    );
  }

  const handleRefetch = async () => {
    await refetch();
  };

  const clearDates = () => {
    setModalVisible(false);
    setCheckInDate(null);
    setCheckOutDate(null);
  };
  const listing = data ? data.listing : null;

  const addySplit = listing ? listing.address.split(",") : "";

  let addy = "";
  for (let i = 1; i < addySplit.length; i++) {
    if (i === addySplit.length - 1) {
      addy += addySplit[i];
    } else {
      addy += addySplit[i] + ", ";
    }
  }
  return (
    <Layout className="listing">
      <Content>
        {listing ? (
          <div className="listing-header-wrapper">
            <div className="listing-header">
              <div className="listing-header-title">
                <div>
                  <Title
                    style={{ fontWeight: "bold", lineHeight: "30px" }}
                    level={2}
                  >
                    {listing.title}
                  </Title>
                </div>

                <div>
                  <Tag color="#ff4d4f">
                    <Link to={`/listings/${listing.city}`}>
                      <EnvironmentOutlined />{" "}
                      <span>
                        {" "}
                        <u> {addy}</u>
                      </span>
                    </Link>
                  </Tag>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="listing-details-image-wrapper">
          <img
            className="listing-details-image"
            src={listing?.image}
            alt="listing"
          />
        </div>

        <div className="listing-details-wrapper">
          <div className="listing-column-left">
            {listing ? <ListingFeatures listing={listing} /> : null}
          </div>

          <div className="listing-column-right">
            {listing ? (
              <CreateBooking
                bookingIndex={listing.bookingsIndex}
                host={listing.host}
                viewer={viewer}
                price={listing.price}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setCheckInDate={setCheckInDate}
                setCheckOutDate={setCheckOutDate}
                setModalVisible={setModalVisible}
              />
            ) : null}

            {listing && checkInDate && checkOutDate ? (
              <Checkout
                id={listing.id}
                clearDates={clearDates}
                price={listing.price}
                handleRefetch={handleRefetch}
                modalVisible={modalVisible}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setModalVisible={setModalVisible}
              />
            ) : null}
          </div>
        </div>
      </Content>
    </Layout>
  );
};
