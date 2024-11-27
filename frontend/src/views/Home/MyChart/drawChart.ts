import * as echarts from "echarts";
import { CardType, goldDict, GoldObjType } from "./type";
import { MutableRefObject } from "react";
const COLOR = ["#e4a800", "#95d178", "#5c7bd9", "#ee6666"] as const
export default function drawEcharts(data: GoldObjType, chartRef: MutableRefObject<HTMLElement>) {
    let myChart = echarts.getInstanceByDom(chartRef.current);
    if (myChart) myChart.dispose()
    let chartInstance = echarts.init(chartRef.current);
    type OnlyGoldType = {
        purple: CardType[],
        gold: CardType[],
    }
    const weaponsList: OnlyGoldType = {
        purple: [],
        gold: []
    }
    const rolesList: OnlyGoldType = {
        purple: [],
        gold: []
    }
    const r_goldDict = {
        3: "blue",
        4: "purple",
        5: "gold"
    } as const
    Object.values(data).forEach((itemList) => {
        itemList.forEach(item => {
            if (item.qualityLevel === 3) return
            if (item.resourceType === "武器") weaponsList[r_goldDict[item.qualityLevel as 4 | 5]].unshift(item)
            else rolesList[r_goldDict[item.qualityLevel as 4 | 5]].unshift(item)
        })
    })
    const option: any = {
        color: COLOR,
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        tooltip: {
            trigger: "item",
            confine: true,
            formatter: "{b} : {c} ({d}%)",
        },
        legend: {
        },
        series: [
            {
                type: "pie",
                radius: "50%",
                center: ["50%", "60%"],
                avoidLabelOverlap: false,
                data: [...Object.values(weaponsList).map((item, index) => ({
                    name: goldDict[Object.keys(weaponsList)[index]] + "武器",
                    value: item.length ? item.length : null
                })),
                ...Object.values(rolesList).map((item, index) => ({
                    name: goldDict[Object.keys(weaponsList)[index]] + "角色",
                    value: item.length ? item.length : null
                }))],
                itemStyle: {
                    borderWidth: 2,
                    borderColor: "#ffffff",
                },
                labelLine: {
                    showAbove: false,
                    length: 15,
                    length2: 0
                },
                label: {
                    formatter: function (params: any) {
                        if (params.value == 0) return ''
                        else
                            return params.data.name
                    },

                },

            },
        ],
    };

    chartInstance.setOption(option);
}