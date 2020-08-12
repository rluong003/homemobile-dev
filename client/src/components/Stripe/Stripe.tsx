import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Layout, Spin } from "antd";
import { CONNECT_STRIPE } from "../../lib/graphql/mutations/index";
import {
  ConnectStripeMutation,
  ConnectStripeMutationVariables,
} from "../../lib/graphql/mutations/__generated__/index.generated";
import {SuccessNotification} from "../Notification/Notificaitons"

import { Viewer } from "../../lib/types";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const Stripe = ({ viewer, setViewer }: Props) => {
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeMutation,
    ConnectStripeMutationVariables
  >(CONNECT_STRIPE, {
      onCompleted: data => {
          setViewer({...viewer, hasWallet: data.connectStripe.hasWallet});
          SuccessNotification("Successfull stripe connection!");
      }
  });

  const StripeRef = useRef(connectStripe);


  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      StripeRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  if (data && data.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Logging into your Stripe Account" />
      </Content>
    );
  }

  if (error) {
    return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />;
  }
  return(null);
};
