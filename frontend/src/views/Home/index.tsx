import { useEffect, useState } from "react";
// import { useState } from "react";
import { ipc } from "@/utils/ipcRender";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Form, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import MyEchart from "./MyEchart";
export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const navgiate = useNavigate();
  const [gachaData, setGachaData] = useState<any[]>([]);
  const [uidList, setUidList] = useState([]);
  const [uid, setUid] = useState<string>("");
  async function findMc() {
    const res = await ipc.invoke("getUidUrl");

    if (res.code === 1) {
      navgiate("/find-mc", { replace: false });
      return;
    }
    if (res.code === 2) {
      return messageApi.error(res.data);
    }
    if (res.code === 100000) {
      const data = await ipc.invoke("getOldAllGachaByType");
      const urls = await ipc.invoke("getUrlList");
      
      setGachaData(Object.values(data));
      setUidList(urls);
      if (urls.length) setUid(urls[0]);
    }
  }
  function onUidChange(selectUid: string) {
    setUid(selectUid);
  }
  async function upDataGachaData() {
    const res = await ipc.invoke("updateAllGachaByType");
    if (res.code !== 100000) {
      message.error(res.data);
      return;
    }
    setGachaData(Object.values(res.data));
    message.success("更新成功！");
  }
  useEffect(() => {
    findMc();
  }, []);
  return (
    <>
      {contextHolder}
      <Form className="form" layout="inline">
        <Form.Item label={null}>
          <Select
            style={{ width: 220 }}
            value={uid}
            onChange={onUidChange}
            options={uidList.map((item) => ({
              value: item,
              id: item,
            }))}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button
            className="btn"
            onClick={upDataGachaData}
            icon={<SyncOutlined />}
            type="default"
          >
            更新数据
          </Button>
          <Button
            className="up-btn"
            onClick={upDataGachaData}
            icon={<SyncOutlined />}
            type="primary"
          >
            导出Excel
          </Button>
        </Form.Item>
      </Form>
      <div className="echarts">
        {gachaData.map((item, index) => (
          <MyEchart key={index} type={index+1} data={item}></MyEchart>
        ))}
      </div>
    </>
  );
}
