import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Divider, Tag, Typography } from "antd";
import { ListingQuery } from "../../lib/graphql/queries/__generated__/index.generated";

interface Props {
  listing: ListingQuery["listing"];
}

const { Paragraph, Title } = Typography;

export const ListingFeatures = ({ listing }: Props) => {
  const {
    description,
    type,
    numOfGuests,
    host,
    numOfBeds,
    numOfBathrooms,
    numOfBedrooms,
  } = listing;

  const nameArr = host.name.split(" ");
  const firstName = nameArr[0];
  let property = "";
  if (type.toString() === "HOUSE") {
    property = "Entire House";
  } else if (type.toString() === "APARTMENT") {
    property = "Entire Apartment";
  } else if (type.toString() === "ROOM") {
    property = "Private Room";
  }

  return (
    <div className="listing-details">
      <div className="listing-details-header-wrapper">
        <div className="listing-details-header">
          <div>
            <Title level={3} className="listing-details-title">
              {property} hosted by {firstName}
            </Title>
          </div>

          <div>
            <Tag color="#ff4d4f">{property}</Tag>
            <Tag color="#ff4d4f">{numOfGuests} Guests</Tag>
            <Tag color="#ff4d4f">{numOfBedrooms} Bedrooms</Tag>
            <Tag color="#ff4d4f">{numOfBeds} Beds</Tag>
            <Tag color="#ff4d4f">{numOfBathrooms} Bathrooms</Tag>
          </div>
        </div>

        <div className="listing-pfp-wrapper">
          <Link to={`/user/${host.id}`}>
            <Avatar className="listing-pfp" src={host.pfp} size={90} />
          </Link>
        </div>
      </div>

      <Divider />

      <div>
        <Title className="listing-about-space" level={3}>
          About this space
        </Title>
        <Paragraph
          className="listing-description"
          ellipsis={{ rows: 3, expandable: true }}
        >
          {description}
        </Paragraph>
      </div>
    </div>
  );
};
