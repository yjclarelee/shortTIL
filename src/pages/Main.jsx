import React, { useState, useEffect } from "react";
import { Layout, Button, Input, Select } from "antd";
import { EditFilled } from "@ant-design/icons";
import Navbar from "../components/Header/Header";
import CardComponent from "../components/Card/CardComponent";
import Grass from "../components/Contribute/Contribute";
import axios from "axios";
import "./Main.scss";
import TagFiltering from "../components/TagFiltering";

const { Option } = Select;

function Main({ imageUploader }) {
  const [postData, setPostData] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [filteringData, setFilteringData] = useState([]);
  const [postNum, setPostNum] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");

  useEffect(() => {
    //searchTerm여부에 따라 전체검색 or 필터검색 실행
    searchTerm ? getFilterData() : getData();
  }, [searchTerm, searchType, postNum]);

  async function getData() {
    const res = await axios.get(
      "http://localhost:4000/posts?_sort=id&_order=desc"
    );
    setPostData(res.data);
  }

  async function getFilterData() {
    const res = await axios.get(
      `http://localhost:4000/posts?_sort=id&_order=desc&${searchType}_like=${searchTerm}`
    );
    setPostData(res.data);
  }

  const onAdd = async (newPost) => {
    await axios.post("http://localhost:4000/posts", {
      ...newPost,
    });
    setPostNum(postNum + 1);
  };

  const handleSearchChange = async (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSelectChange = (event) => {
    setSearchType(event);
  };

  const handleFiltering = (event) => {
    if (event.target.innerText === "ALL") {
      setFiltered(false);
      return;
    }
    // const matchedData = postData.filter(
    //   (post) =>
    //     post.tags && post.tags.some((tag) => tag === event.target.innerText)
    // );
    const matchedData = postData.filter(
      (post) =>
        post.tags &&
        post.tags.some((tag) => {
          const regExpSpecial =
            /[!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]/g;
          const regExpKor = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
          const regExpNum = /[0-9]/g;
          const regExpEng = /[a-zA-Z]/g;
          if (
            tag != null &&
            !regExpKor.test(tag) &&
            !regExpNum.test(tag) &&
            !regExpSpecial.test(tag) &&
            regExpEng.test(tag)
          ) {
            return tag.toUpperCase() === event.target.innerText.toUpperCase();
          } else {
            return false;
          }
        })
    );

    setFilteringData(matchedData);
    console.log(matchedData);
    setFiltered(true);
  };

  return (
    <div>
      <Navbar
        onAdd={onAdd}
        handleSearchChange={handleSearchChange}
        handleSelectChange={handleSelectChange}
        searchType={searchType}
        imageUploader={imageUploader}
      />
      <Grass postData={postData} />
      <TagFiltering onFiltering={handleFiltering} />
      <section className="cardgrid">
        <div className="inner">
          <div className="cardheader">
            <p>All Posts</p>
            <Input.Group compact className="search">
              <Select defaultValue="title" onChange={handleSelectChange} value={searchType}>
                <Option value="title">Title</Option>
                <Option value="body">Body</Option>
                <Option value="tags">Tags</Option>
              </Select>
              <Input onChange={handleSearchChange} placeholder="search" className="input"/>
            </Input.Group>
          </div>
          <div className="grid">
            <div className="cards">
            {filtered ? (
              <>
                {filteringData.map((post) => (
                  <CardComponent
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    imagefile={post.uploaded_images}
                    imageUploader={imageUploader}
                  ></CardComponent>
                ))}
              </>
            ) : (
              <>
                {postData.map((post) => (
                  <CardComponent
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    imagefile={post.uploaded_images}
                    imageUploader={imageUploader}
                  ></CardComponent>
                ))}
              </>
            )}
            </div>
          </div>
        </div>
      </section>
      <footer>© {new Date().getFullYear()} TIL Team</footer>
  </div>
  );
}

export default Main;
