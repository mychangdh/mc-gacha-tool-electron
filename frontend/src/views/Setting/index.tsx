import { useEffect, useState } from "react";
import "./index.scss";
import { Button, Form, message, Select } from "antd";
import { ipc } from "@/utils/ipcRender";
import { FloatButton } from "antd";
import { CloseOutlined, SelectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Switch } from "antd";

export default function Setting() {
  const [installPath, setInstallPath] = useState("");
  const [gachaPath, setGachaPath] = useState("");
  const [version, setVersion] = useState("");
  useEffect(() => {
    ipc.invoke("getInstallPath").then((data: string) => {
      setInstallPath(data);
    });
    ipc.invoke("getGachaPath").then((data: string) => {
      setGachaPath(data);
    });
    ipc.invoke("getVersion").then((data: string) => {
      setVersion(data);
    });
  }, []);
  async function copyUrl() {
    ipc.send("copy", gachaPath);
    message.success("复制成功！");
  }
  const navigate = useNavigate();
  function closePage() {
    navigate("/");
  }

  const [showSelectUid, setShowSelectUid] = useState(
    Boolean(localStorage.getItem("showSelectUid"))
  );
  function switchChange(val: boolean) {
    setShowSelectUid(val);
    localStorage.setItem("showSelectUid", val ? "true" : "");
  }
  return (
    <div className="Setting">
      <FloatButton icon={<CloseOutlined />} onClick={closePage} />
      <div className="title">设置</div>
      <div className="setting-props">
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%" }}
        >
          <Form.Item label="语言" extra="其实我并没有做其他语言版本的，hh">
            <Select style={{ width: "200px" }} defaultValue="jtzw">
              <Select.Option value="jtzw">简体中文</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="UID可选"
            extra="由于本人只有一个账号，该功能并未做测试，慎用"
          >
            <Switch checked={Boolean(showSelectUid)} onChange={switchChange} />
          </Form.Item>
          <Form.Item label="游戏安装目录">
            {installPath}
            <Button
            className="install-select-btn"
              onClick={() => navigate("/find-mc?showMessage=no")}
              icon={<SelectOutlined />}
              type="default"
            >
              手动选择安装位置
            </Button>
          </Form.Item>
          <Form.Item
            className="url"
            label="上一次抽卡链接"
            extra="点击文本可复制"
          >
            <div
              className="no-select"
              style={{ width: "400px", cursor: "pointer" }}
              onClick={copyUrl}
            >
              {gachaPath}
            </div>
          </Form.Item>
          <Form.Item label="版本号">{version}</Form.Item>
        </Form>
      </div>
      <div className="title about-title">关于</div>
      <div className="about-value">
        <div className="link">
          蓝奏云：
          <span
            onClick={() =>
              ipc.send("openBrowser", "https://wwyl.lanzouv.com/b00mox71rg")
            }
          >
            https://wwyl.lanzouv.com/b00mox71rg
          </span>
          密码:1234。
        </div>
        <div>本软件使用electron + react框架。</div>
        <div>就不整自动更新了，毕竟服务器要花钱，直接蓝奏云就轻松多了。</div>
      </div>
    </div>
  );
}
