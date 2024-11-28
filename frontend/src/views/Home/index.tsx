import { useEffect, useState } from "react";
// import { useState } from "react";
import { ipc } from "@/utils/ipcRender";
import {
  SelectOutlined,
  SettingOutlined,
  SyncOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Button, Form, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import MyEchart from "./MyChart";
export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const navgiate = useNavigate();
  const [gachaData, setGachaData] = useState<any[]>([]);
  const [uidList, setUidList] = useState([]);
  const [uid, setUid] = useState<string>("");

  // 效验本地路径是否合法
  async function efficacyMcPath() {
    const res = await ipc.invoke("getUidParams");
    if (res.code === 1) {
      messageApi.error(res.data);
      return false
    }
    if (res.code === 2) {
      messageApi.error(res.data);
      return false
    }
    return true
  }

  /*尝试得到本地UID和本地数据 */
  async function getLocalData() {
    const urls = await ipc.invoke("getUrlList");
    setUidList(urls);
    if (urls.length) setUid(urls[0]);
    const data = await ipc.invoke("getOldAllGachaByType");
    setGachaData(Object.values(data));
  }

  async function exportGachaData() {
    const res = await ipc.invoke("exportGachaData", gachaData);
    if (res.code === 100000) {
      await message.success(`导出成功，路径为${res.path}`)
      await ipc.invoke("openFile", res.path)

    }
  }
  // 更新数据
  async function upDateGachaData() {
    const res = await ipc.invoke("updateAllGachaByType");
    if (res.code !== 100000) {
      message.error(res.data);
      return;
    }
    setGachaData(Object.values(res.data));
    message.success("更新成功！");
  }
  useEffect(() => {
    efficacyMcPath();
    getLocalData();
  }, []);
  return (
    <>
      {contextHolder}
      <Form className="form" layout="inline">
        <Form.Item label={null}>
          <Select
            style={{ width: 220 }}
            value={uid}
            onChange={setUid}
            options={uidList.map((item) => ({
              value: item,
              id: item,
            }))}
          />
        </Form.Item>
        <Form.Item label={null}>
          <Button
            className="btn"
            onClick={upDateGachaData}
            icon={<SyncOutlined />}
            type="default"
          >
            更新数据
          </Button>
        </Form.Item>
        <Form.Item label={null}>
          <Button
            onClick={exportGachaData}
            icon={<VerticalAlignTopOutlined />}
            type="primary"
          >
            导出Excel
          </Button>
        </Form.Item>
        <Form.Item className="select-file-btn" label={null}>
          <Button
            onClick={() => navgiate("/find-mc?showMessage=no")}
            icon={<SelectOutlined />}
            type="default"
          >
            手动选择安装位置
          </Button>
          <Button type="text" shape="circle" icon={<SettingOutlined />} />
        </Form.Item>
      </Form>
      <div className="echarts">
        {gachaData.map((item, index: any) =>
          item.length ? (
            <MyEchart key={index} type={index + 1} data={item}></MyEchart>
          ) : (
            <div key={index}></div>
          )
        )}
      </div>
    </>
  );
}
