import { useEffect, useState } from "react";
import { Renderer } from "@/utils/ipcRender";
export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appList, setAppList] = useState<any[]>([]);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Renderer.ipcRenderer.invoke("getGachaByType").then((res: any) => {
      setAppList(res.data);
    });
  }, []);
  return (
    <div>
      {appList.map((item, index) => (
        <div key={index}>
         {item.count}.{item.resourceType}: {item.name} 星级{item.qualityLevel} 时间：{item.time}
        </div>
      ))}
    </div>
  );
}
