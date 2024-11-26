import { useEffect, useState } from "react";
import { Renderer } from "@/utils/ipcRender";
import { message } from 'antd'
import { useNavigate } from "react-router-dom";
export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appList, setAppList] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navgiate = useNavigate()
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Renderer.ipcRenderer.invoke("getGachaByType").then(async (res: any) => {
      if (res.code === 1) {
        navgiate("/find-mc",{replace:false})
        return
      }
      if (res.code === 2) {
        return messageApi.error(res.message)
      }
      setAppList(res.data);
    });
  }, []);


  return (
    <>
      {contextHolder}
      <div></div>
    </>
  );
}
