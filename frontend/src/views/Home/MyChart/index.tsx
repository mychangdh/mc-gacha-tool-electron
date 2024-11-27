import { cardType, CARTTYPR, GoldObjType } from "./type";
import { useEffect, useRef, useState } from "react";
import "./index.scss"
import drawEcharts from "./drawChart";
import { colorList } from "./type";
export default function MyEchart({
  type,
  data,
}: {
  type: 1 | 2 | 3 | 4 | 5;
  data: cardType[];
}) {
  const chartRef = useRef(null);
  function setChart() {
    const goldObj: GoldObjType = {
      gold: [],
      purple: [],
      blue: [],
    }
    data.forEach(item => {
      switch (item.qualityLevel) {
        case (3):
          goldObj.blue.unshift(item)
          break
        case (4):
          goldObj.purple.unshift(item)
          break
        case (5):
          goldObj.gold.unshift(item)
          break
      }
    })
    drawEcharts(goldObj, chartRef as any)
    return goldObj
  }

  const [goldObj, setGoldObj] = useState<GoldObjType>({
    gold: [],
    purple: [],
    blue: [],
  })

  useEffect(() => {
    setGoldObj(setChart())
  }, [data]);
  return (
    <div className="echarts-item">
      <div>{CARTTYPR[type]}</div>
      <div>
        <div ref={chartRef} style={{ height: "300px", width: "350px" }}></div>
      </div>
      <div>
        <div className="cramp">{goldObj.gold.map((item, index) => (
          <span key={index} className="cramp-item" style={{ color: colorList[item.count] }}>
            <span className="count">({item.count})</span>
            <span className="name">{item.name}</span>
          </span>
        )
        )}</div>
      </div>
    </div>
  );
}
