import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Viewer } from "../../lib/types";
import { Avatar, Layout, Menu, Input } from "antd";
import { LOG_OUT } from "../../lib/graphql/mutations/index";
import { LogOutMutation } from "../../lib/graphql/mutations/__generated__/index.generated";
import { UserOutlined, LogoutOutlined, CarOutlined } from "@ant-design/icons";
import {
  SuccessNotification,
  ErrorNotification,
} from "../Notification/Notificaitons";
import HM from "../../assets/HM.png";

const { Header } = Layout;
const { SubMenu, Item } = Menu;
const { Search } = Input;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppBar = ({ viewer, setViewer }: Props) => {
  let history = useHistory();

  const onSearch = (value: string) => {
    if (value) {
      history.push(`/listings/${value.trim()}`);
    } else {
      ErrorNotification("Invalid search");
    }
  };

  const [logOut] = useMutation<LogOutMutation>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        SuccessNotification("Successful logout!");
        history.push("/");
      }
    },
    onError: () => {
      ErrorNotification("Log out failed");
    },
  });
  const handleLogOut = () => {
    logOut();
  };

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px #f0f1f2",
          height: "70px",
        }}
      >
        <div className="app-bar">
          <div className="app-bar-brand">
            <Link to="/">
              <img alt="App logo" src={HM} />{" "}
              <span className="app-bar-brandName"> Home Mobile</span>
            </Link>
          </div>

          <div className="app-bar-searchbar">
            <Search
              style={{ textAlign: "center", width: 550 }}
              placeholder="Add a location"
              size="large"
              enterButton
              onSearch={onSearch}
            />
          </div>

          <div className="app-bar-end">
            <Menu
              mode="horizontal"
              selectable={false}
              style={{ color: "black" }}
            >
              <Item key="/host">
                <Link to="/host">
                  {" "}
                  <span className="app-bar-text"> Become A Host</span>
                </Link>
              </Item>

              {viewer?.id && viewer?.avatar ? (
                <SubMenu title={<Avatar src={viewer.avatar} />}>
                  <Item key="/user">
                    <Link to={`/user/${viewer.id}`}>
                      <UserOutlined />
                      <span className="app-bar-text"> Account </span>
                    </Link>
                  </Item>

                  <Item key="/trips">
                    <Link to={`/trips/${viewer.id}`}>
                      <CarOutlined />
                      <span className="app-bar-text"> Trips </span>
                    </Link>
                  </Item>

                  <Item key="/logout">
                    <div onClick={handleLogOut}>
                      <LogoutOutlined />
                      <span className="app-bar-text"> Sign Out </span>
                    </div>
                  </Item>
                </SubMenu>
              ) : (
                <Item>
                  <Link to="/login">
                    <span className="app-bar-text"> Sign In </span>
                  </Link>
                </Item>
              )}
            </Menu>
          </div>
        </div>
      </Header>
    </Layout>
  );
};
