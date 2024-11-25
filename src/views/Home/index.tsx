import ipc from "@/utils/IPC"
import { useEffect, useState } from "react"

export default function Home() {
    const [appList, setAppList] = useState<any[]>([])
    useEffect(() => {
      ipc.invoke("getAppPath").then(data => {
        setAppList(data)
      })
    }, [])
    return (
        <div>
            {appList.map(item=>(
                <div key={item.name}>{item.name}:{item.path}</div>
            ))}
        </div>
    )
}