import React, { Fragment } from "react";
import { Skeleton } from "antd";

export const PageSkeleton = () => {
  return (
    <Fragment>
      <Skeleton active paragraph={{ rows: 4 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
    </Fragment>
  );
};
