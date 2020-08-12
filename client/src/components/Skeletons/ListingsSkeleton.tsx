import React from "react";
import { Card, List, Skeleton } from "antd";

import CC from "../../assets/gray-card-cover.png";

export const ListingsSkeleton = () => {
  const fillerData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

  return (
    <div>
      <Skeleton paragraph={{ rows: 1 }} />
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 5,
          xl: 5,
          xxl: 5,
        }}
        dataSource={fillerData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  className="listings-skeleton-img"
                  style={{ backgroundImage: `url(${CC})` }}
                ></div>
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
