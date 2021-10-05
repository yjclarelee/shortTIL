import React, { useState } from "react";
import "./NavBar.css";
import { Layout, Button } from "antd";
import { EditFilled } from "@ant-design/icons";
import CreateForm from "./CreateForm";

const { Header } = Layout;

const Navbar = ({ onAdd }) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
  };

  const onCreate = (values) => {
    const today = new Date();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const date = `0${today.getDate()}`.slice(-2);
    const newPost = {
      id: Date.now(),
      title: values.title,
      author: "anonymous",
      published_at: `${today.getFullYear()}-${month}-${date}`,
      body: values.content,
    };
    onAdd(newPost);
    setVisible(false);
  };

  return (
    <Header className="header">
      <div className="header_logo">ReactJS Team Project</div>
      <div>
        <Button
          className="header_write-btn"
          size="large"
          icon={<EditFilled />}
          onClick={showModal}
        />
        <CreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
        />
      </div>
    </Header>
  );
};

export default Navbar;