import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { Layout, Card, Typography, Spin } from "antd";
import { Viewer } from "../../lib/types";
import { ScrollToTop } from "../../index";
import { AUTH_URL } from "../../lib/graphql/queries/index";
import { AuthUrlQuery } from "../../lib/graphql/queries/__generated__/index.generated";
import { LOG_IN } from "../../lib/graphql/mutations/index";
import { ErrorBanner } from "../../components/Error/Error";
import { GoogleOutlined } from "@ant-design/icons";
import {
  SuccessNotification,
  ErrorNotification,
} from "../Notification/Notificaitons";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  LogInMutation,
  LogInMutationVariables,
} from "../../lib/graphql/mutations/__generated__/index.generated";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const LogIn = ({ setViewer }: Props) => {
  ScrollToTop();
  const client = useApolloClient();
  const [
    logIn,
    { data: LogInMutation, loading: logInLoading, error: logInError },
  ] = useMutation<LogInMutation, LogInMutationVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn);
        sessionStorage.setItem("token", data.logIn.token);
        SuccessNotification("You successfully logged in!");
      }
    },
    onError: (error) => {
      ErrorNotification("Log in error");
      console.error(error.message);
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuth = async () => {
    try {
      const { data } = await client.query<AuthUrlQuery>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      ErrorNotification("Login failed, try again.");
    }
  };

  if (logInLoading) {
    return (
      <Content className="login-wrapper">
        <Spin size="large" tip="Logging in..." />
      </Content>
    );
  }

  if (LogInMutation && LogInMutation.logIn) {
    const { id: viewerId } = LogInMutation.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }
  if(logInError && LogInMutation  && LogInMutation.logIn ){
    const { id: viewerId } = LogInMutation.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  return (
    <Layout className="login-wrapper">
      {logInError ? (
        <ErrorBanner description="Login failed, try again." />
      ) : null}
      <Card className="login-card">
        <div>
          <Title level={4}>Home Mobile </Title>
        </div>
        <div className="login-title">
          <Title level={1}>Log In</Title>
        </div>

        <button className="login-card-button" onClick={handleAuth}>
          <div className="login-google">
            <div className="login-google-icon">
              <GoogleOutlined />
            </div>

            <div className="login-google-text ">Sign in with Google</div>
          </div>
        </button>

        <Text>
          You will be redirected to Google's login page. Home Mobile currently
          only works with Google accounts
        </Text>
      </Card>
    </Layout>
  );
};
