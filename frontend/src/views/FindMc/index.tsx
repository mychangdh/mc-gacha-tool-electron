/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, message, Modal } from "antd";
import { useState } from "react";
import "./index.scss";
import { useSearchParams } from 'react-router-dom';

import { FileSearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { ipc } from "@/utils/ipcRender";
import { useNavigate } from "react-router-dom";
export default function FinMc() {
  const [showFindMc, setShowFindMc] = useState(true);
  const [fileName, setFileName] = useState("");
  const navigator = useNavigate()
  const [searchParams] = useSearchParams()
  const showMessage = searchParams.get("showMessage")
  function selectFile() {
    ipc.invoke("openFilesDialog").then(({ filePaths }: any) => {
      if (!filePaths[0]) return;
      setFileName(filePaths[0] as string);
    });
  }
  function getIndex() {
    if (!fileName.trim()) return message.error("没有选择文件呢")
    ipc.send("setMcPostion", fileName)
    navigator("/")
  }
  return (
    <>
      <Modal
        open={showFindMc}
        title="请手动选择安装位置"
        onCancel={() => setShowFindMc(false)}
        afterClose={() => navigator("/")}
        footer={[]}
        width="60%"
        maskClosable={false}
        className="FindMc no-select"
      >
        <div className="mesage"> {showMessage === "no" ? "" : "没有找到鸣潮安装目录或者安装目录错误呢，请手动选择一下吧"}</div>
        <div className="tip">注意：选择名字叫做 <span>Wuthering Waves</span> 的目录！</div>
        <div className="find-mk">
          <Input
            addonBefore={<FileSearchOutlined />}
            value={fileName}
            onClick={selectFile}
            placeholder="点击选择安装目录"
          ></Input>
          <Button className="btn" onClick={getIndex} type="primary">
            确定
          </Button>
        </div>
      </Modal>
    </>
  );
}
