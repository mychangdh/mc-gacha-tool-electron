import { CardType, CARTTYPR, GoldObjType } from "./type";
import { useEffect, useRef, useState } from "react";
import "./index.scss";
import drawEcharts from "./drawChart";
import { colorList } from "./type";
export default function MyEchart({
  type,
  data,
}: {
  type: 1 | 2 | 3 | 4 | 5
  data: CardType[];
}) {
  const chartRef = useRef(null);
  function setChart() {
    const goldObj: GoldObjType = {
      gold: [],
      purple: [],
      blue: [],
    };
    data.forEach((item) => {
      switch (item.qualityLevel) {
        case 3:
          goldObj.blue.unshift(item);
          break;
        case 4:
          goldObj.purple.unshift(item);
          break;
        case 5:
          goldObj.gold.unshift(item);
          break;
      }
    });
    drawEcharts(goldObj, chartRef as any);
    return goldObj;
  }

  const [goldObj, setGoldObj] = useState<GoldObjType>({
    gold: [],
    purple: [],
    blue: [],
  });
  function getPercentage(key: "gold" | "purple" | "blue") {
    const num = goldObj[key].length / data.length;
    return (num * 100).toFixed(2) + "%";
  }
  useEffect(() => {
    setGoldObj(setChart());
  }, [data]);
  return (
    <div className="MyChart">
      <div className="title">{CARTTYPR[type]}</div>
      <div>
        <div ref={chartRef} style={{ height: "250px", width: "100%" }}></div>
        <div className="message">
          <div className="date">
            {data[data.length - 1].time.slice(0, 10)} -{" "}
            {data[0].time.slice(0, 10)}
          </div>
        </div>
      </div>
      <div>
        <div className="cramp">
          <div className="tip">
            一共 <span className="total">{data.length}</span>
            抽，已累计
            <span className="no-card-num">{data[0].count}</span>
            抽未出5星
          </div>
          <div
            className="average"
            style={{ color: "#eab748", marginTop: "10px" }}
          >
            5星：<span className="length">{goldObj.gold.length} </span>
            <span className="percentage">[{getPercentage("gold")}]</span>
          </div>
          <div className="average" style={{ color: "#9333ea" }}>
            4星：<span className="length">{goldObj.purple.length} </span>
            <span className="percentage">[{getPercentage("purple")}]</span>
          </div>
          <div
            className="average"
            style={{ color: "#3b82f6", marginBottom: "10px" }}
          >
            3星：<span className="length">{goldObj.blue.length} </span>
            <span className="percentage">[{getPercentage("blue")}]</span>
          </div>
          <span className="history-text"> 5星历史记录：</span>
          {goldObj.gold.map((item, index) => (
            <span
              key={index}
              className="cramp-item"
              style={{ color: colorList[item.count] }}
            >
              <span className="name">{item.name}</span>
              <span className="count">[{item.count}]</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
