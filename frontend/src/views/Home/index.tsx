import { useEffect } from "react";
// import { useState } from "react";
import { ipc } from "@/utils/ipcRender";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [appList, setAppList] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navgiate = useNavigate();
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
      console.log(data,urls);
      
    }
  }

  
  useEffect(() => {
    findMc();
  }, []);

  return (
    <>
      {contextHolder}
      <div></div>
    </>
  );
}
