import React, { Fragment } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Avatar, Button, Card, Divider, Typography, Tag } from "antd";
import { UserQuery } from "../../lib/graphql/queries/__generated__/index.generated";
import { Viewer } from "../../lib/types";
import {
  ErrorNotification,
  SuccessNotification,
} from "../../components/Notification/Notificaitons";
import { CheckOutlined } from "@ant-design/icons";
import { DisconnectStripeMutation } from "../../lib/graphql/mutations/__generated__/index.generated";
import { DISCONNECT_STRIPE } from "../../lib/graphql/mutations/index";
require("dotenv").config();

interface Props {
  user: UserQuery["user"];
  idCheck: boolean;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => void;
  viewer: Viewer;
}

const stripeAuthUrl = `
https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write
`;
const { Paragraph, Title } = Typography;

export const UserCard = ({
  user,
  idCheck,
  setViewer,
  viewer,
  handleUserRefetch,
}: Props) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeMutation>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
        SuccessNotification("Successfully disconnected from Stripe");
        handleUserRefetch();
      },
      onError: () => {
        ErrorNotification("Stripe disconnect error");
      },
    }
  );

  const stripeRedirect = () => {
    window.location.href = stripeAuthUrl;
  };

  const firstName = user.name.split(" ")[0];
  return (
    <div className="user-profile">
      <Card className="user-card">
        <div className="user-pfp">
          <Avatar size={100} src={user.pfp} />
        </div>
        <Divider />
        {idCheck ? (
          <div>
            <Title level={4}>Personal Info</Title>
            {user.hasWallet ? (
              <Paragraph>
                <Tag color="blue">Stripe Registered</Tag>
              </Paragraph>
            ) : null}
            <span className="user-info-labels">Legal Name: </span>
            <br />
            <span className="user-personal-info">{user.name}</span>
            <br />
            <br />
            <span className="user-info-labels"> Email:</span>
            <br />

            <span className="user-personal-info">{user.email}</span>
            <br />
          </div>
        ) : (
          <div>
            <Title level={3}>{firstName} Confirmed</Title>
            <div>
              <strong>
                <CheckOutlined />{" "}
                <span className="user-personal-info"> Email Address </span>{" "}
              </strong>
            </div>
          </div>
        )}

        {idCheck ? (
          <Fragment>
            <Divider />
            <div>
              {user.hasWallet ? null : (
                <Title level={4}>Connect Stripe Account!</Title>
              )}
              {user.hasWallet ? (
                <Fragment>
                  <Paragraph>
                    <Title level={4}>
                      Payout : ${user.income ? user.income : `$0`}{" "}
                    </Title>
                  </Paragraph>
                  <Button
                    type="primary"
                    className="user-stripe-button"
                    loading={loading}
                    onClick={() => disconnectStripe()}
                  >
                    Disconnect Stripe
                  </Button>
                  <Paragraph type="secondary">
                    You can no longer gain earnings if you disconnect your
                    Stripe account.
                  </Paragraph>
                </Fragment>
              ) : (
                <Fragment>
                  <Paragraph>
                    Want to host on Home Mobile? Connect with your{" "}
                    <a
                      href="https://stripe.com/en-US/connect"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Stripe
                    </a>{" "}
                    Account to receive earnings
                  </Paragraph>
                  <Button
                    type="primary"
                    className="user-stripe-button"
                    onClick={stripeRedirect}
                  >
                    Connect with Stripe
                  </Button>
                </Fragment>
              )}
            </div>
          </Fragment>
        ) : null}
      </Card>
    </div>
  );
};
