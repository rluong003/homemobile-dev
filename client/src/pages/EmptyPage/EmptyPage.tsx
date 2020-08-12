import React, { Fragment } from "react";
import { ScrollToTop } from "../../index";
import { Button, Empty, Typography } from "antd";

const { Title } = Typography;

export const EmptyPage = () => {
  ScrollToTop();
  return (
    <div className="empty-page">
      <div>
        <Empty
          description={
            <Fragment>
              <div className="empty-page-huge-text">Oops!</div>
              <Title level={2}>
                We can't seem to find the page you're looking for
              </Title>
            </Fragment>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <div className="empty-page-button">
          <Button href="/" className="ant-btn ant-btn-primary ant-btn-lg">
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};
