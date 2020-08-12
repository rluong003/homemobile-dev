import React from "react";
import { Link } from "react-router-dom";
import { Card, Typography } from "antd";

interface Props {
  listing: {
    type: string;
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
  };
}

const { Text, Title } = Typography;

export const ListingCard = ({ listing }: Props) => {
  const { type, id, title, image, price } = listing;

  let property = "";
  if (type === "HOUSE") {
    property = "Entire Home";
  } else if (type === "APARTMENT") {
    property = "Entire Apartment";
  } else if (type === "ROOM") {
    property = "Entire Room";
  }

  return (
    <Link to={`/listing/${id}`}>
      <Card
        bordered={false}
        cover={
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="listing-card-img"
          />
        }
      >
        <div className="listing-card-details">
          <Text strong ellipsis className="listing-card-property-type">
            {property}
          </Text>
          <Text ellipsis className="listing-card-title">
            {title}
          </Text>
          <Title level={4} className="listing-card-price">
            ${price} / night
          </Title>
        </div>
      </Card>
    </Link>
  );
};
