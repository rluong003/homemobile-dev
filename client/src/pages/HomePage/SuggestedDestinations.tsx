import React from "react";
import { Link } from "react-router-dom";

import { Card, Col, Row, Typography } from "antd";
import HK from "../../assets/Hong Kong.jpg";
import London from "../../assets/London.jpg";
import NYC from "../../assets/NYC.jpg";
import Paris from "../../assets/Paris.jpg";
import Rome from "../../assets/Rome.jpg";
import SF from "../../assets/SF.jpg";
import Tokyo from "../../assets/Tokyo.jpg";
import Vancouver from "../../assets/Vancouver.jpg";

const { Text } = Typography;

export const SuggestedDestinations = () => {
  return (
    <Row gutter={12}>
      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/new%20york%20city">
          <Card cover={<img alt="New York City" src={NYC} />}> </Card>
        </Link>
        <Text className="home-destinations-text"> New York City</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/paris">
          <Card cover={<img alt="Parie" src={Paris} />}> </Card>
        </Link>
        <Text className="home-destinations-text"> Paris</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/tokyo">
          <Card cover={<img alt="Tokyo" src={Tokyo} />}> </Card>
        </Link>
        <Text className="home-destinations-text">Tokyo</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/vancouver">
          <Card cover={<img alt="Vancouver" src={Vancouver} />}> </Card>
        </Link>
        <Text className="home-destinations-text"> Vancouver</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/hong%20kong">
          <Card cover={<img alt="Hong Kong" src={HK} />}> </Card>
        </Link>
        <Text className="home-destinations-text"> Hong Kong</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/london">
          <Card cover={<img alt="London" src={London} />}> </Card>
        </Link>
        <Text className="home-destinations-text"> London</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/san%20francisco">
          <Card cover={<img alt="SF" src={SF} />}> </Card>
        </Link>
        <Text className="home-destinations-text">San Francisco</Text>
      </Col>

      <Col xs={12} md={6} lg={6} xl={6} xxl={6}>
        <Link to="listings/rome">
          <Card cover={<img alt="Roma" src={Rome} />}> </Card>
        </Link>
        <Text className="home-destinations-text"> Rome</Text>
      </Col>
    </Row>
  );
};
