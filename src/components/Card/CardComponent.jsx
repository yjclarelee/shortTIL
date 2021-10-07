import React, {useState} from 'react';
import { Card, Modal, Button, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import "./style.scss";

const { TextArea } = Input;
const { confirm } = Modal;
const { Meta } = Card;

function CardComponent(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { visible, loading } = useState(false);
  const [postNum, setPostNum] = useState([]);
  const [editing, setEditing] = useState(true);

  const onDel = async (newPost) => {
    await axios.delete(`http://localhost:4000/posts/${props.id}`, {
      ...newPost,
    });
    console.log('delete') // 삭제 누르면 db에서 삭제는 되는데 뷰에서 삭제가 안됨
    setEditing(true);
  };

  const onUpdate = async (newPost) => {
    await axios.patch(`http://localhost:4000/posts/${props.id}`, JSON.stringify({
      data: {
        id: '`${id}`',
        title: '`${title}`',
        body: '`${body}`'
      }
    //   // .then(function(response) {
    //   //   data.send(response.data)
    // })
    }));
    console.log('patch') // 수정하면 db에 업로드가 안됨, 뷰에서도 수정되지 않음
    setEditing(true); // 수정완료 누르면 이전 모달로 전환이 안됨
                      // 모달을 닫고 다시열면 수정상태 그대로 보임
  };

  function showDeleteConfirm() {
    confirm({
      title: '삭제하시겠습니까',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      centered: 'yes',
      onOk() {
        // console.log('Yes');
        onDel(true);
        setEditing(true);
        setIsModalVisible(false)
      },
      onCancel() {
        setEditing(true);
        console.log('No');
      },
    });
  }

  return (
    <div>
      <Card
        hoverable
        style={{ width: 300, margin: "1rem" }}
        cover={<img alt="example" src="https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1180&q=80"/>}
        onClick={() => setIsModalVisible(true)}
      >
        <div className="cardText">
          <Meta title={props.title} description={props.body} />
        </div>
      </Card>
        <Modal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={editing} footer={[]} centered>
        {editing ? (
          <>
            <h1 style={{marginTop: "30px"}}>{props.title}</h1>
            <p style={{height: "200px", marginBottom: "20px"}}>{props.body}</p>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Button size="medium" onClick={() => setEditing(false)}>수정</Button>
              <Button size="medium" onClick={showDeleteConfirm} type="danger" ghost>삭제</Button>
            </div>
          </>
          ) : (
            <>
              <Input defaultValue={`${props.title}`} style={{fontSize: "28px", padding: "0", marginTop: "30px"}}/>
              <TextArea defaultValue={`${props.body}`} style={{height: "200px", marginTop: "10px", marginBottom: "20px", padding: "0"}}/>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Button size="medium" onClick={onUpdate} type="primary">
                수정완료
              </Button>
              <Button size="medium" onClick={() => setEditing(true)} type="primary" ghost>
                취소
              </Button>
              </div>
            </>
          )}
      </Modal>
    </div>  
  );
}

export default CardComponent;