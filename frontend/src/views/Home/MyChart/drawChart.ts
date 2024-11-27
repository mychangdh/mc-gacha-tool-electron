import * as echarts from "echarts";
import { goldDict, GoldObjType } from "./type";
import { MutableRefObject } from "react";
const COLOR = ["#e4a800", "#4B0082", "#1E90FF"] as const
export default function drawEcharts(data: GoldObjType, chartRef: MutableRefObject<HTMLElement>) {
    let chartInstance = echarts.init(chartRef.current);
    const option: any = {
        color: COLOR,
        grid:{
            top:0,
            left:0,
            right:0,
            bottom:0
        },
        series: [
            {
                type: "pie",
                radius: "60%",
                center: ["50%", "50%"],
                data: Object.values(data).map((item, index) => ({
                    name: Object.values(goldDict)[index],
                    value: item.length
                })),
                itemStyle: {
                    normal: {
                        borderWidth: 2,
                        borderColor: "#ffffff",
                        label: {
                            show: true,
                            formatter: "{b} : {c} ({d}%)",
                        },
                    },
                    emphasis: {
                        borderWidth: 0,
                        shadowBlur: 2,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                    labelLine: {
                        length: 5,
                        length2: 5,
                        show: false,
                        color: "#00ffff",
                    },
                },

            },
        ],
    };

    chartInstance.setOption(option);
}