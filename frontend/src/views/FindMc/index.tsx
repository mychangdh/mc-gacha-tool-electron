/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal } from "antd";
import { useState } from "react";
import "./index.scss";
import { FileSearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { ipc} from "@/utils/ipcRender";
import { useNavigate } from "react-router-dom"; 
export default function FinMc({ showMessage = true }) {
  const [showFindMc, setShowFindMc] = useState(true);
  const [fileName, setFileName] = useState("");
  const navigator = useNavigate()
  function selectFile() {
    ipc.invoke("openFilesDialog").then(({ filePaths }: any) => {
      if (!filePaths[0]) return;
      setFileName(filePaths[0] as string);
    });
  }
  function getIndex(){
    ipc.send("setMcPostion",fileName)
    navigator("/")
  }
  return (
    <>
      <Modal
        open={showFindMc}
        title="请手动选择安装位置"
        onCancel={() => setShowFindMc(false)}
        footer={[]}
        width="60%"
        closable={false}
        maskClosable={false}
        className="no-select"
      >
       <div className="mesage"> {showMessage ? "没有找到鸣潮安装目录或者安装目录错误呢，请手动选择一下吧" : ""}</div>
        <div className="tip">注意：选择名字叫做 <span>Wuthering Waves</span> 的目录！</div>
        <div className="find-mk">
          <Input
            addonBefore={<FileSearchOutlined />}
            value={fileName}
            onClick={selectFile}
            placeholder="点击选择安装目录"
          ></Input>
          <Button  className="btn" onClick={getIndex} type="primary">
            确定
          </Button>
        </div>
      </Modal>
    </>
  );
}
