import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar/Navbar";
import CardComponent from "../components/CardComponent";
import Grass from "../components/NavBar/Grass";
import axios from "axios";

function Main() {
  const [postData, setPostData] = useState([]);
  const [postNum, setPostNum] = useState(0);

  useEffect(() => {
    async function getData() {
      const res = await axios.get("http://localhost:4000/posts");
      setPostData(res.data);
    }
    getData();
  }, [postNum]);

  const onAdd = (newPost) => {
    axios.post("http://localhost:4000/posts", { ...newPost });
    setPostNum(postNum + 1);
  };

  return (
    <div>
      <Navbar onAdd={onAdd} />
      <Grass postData = {postData}/>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {postData
          .map((post) => (
            <CardComponent
              key={post.id}
              title={post.title}
              body={post.body}
            ></CardComponent>
          ))
          .reverse()}
      </div>
    </div>
  );
}

export default Main;
