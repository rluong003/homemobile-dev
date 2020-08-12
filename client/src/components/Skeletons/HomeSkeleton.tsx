import React from "react";
import { Card, List, Skeleton } from "antd";

import CC from "../../assets/gray-card-cover.png";

export const HomeSkeleton = () => {
  const fillerData = [{}, {}, {}, {}];

  return (
    <div>
      <Skeleton paragraph={{ rows: 12 }} />
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4,
          xl: 4,
          xxl: 4,
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
