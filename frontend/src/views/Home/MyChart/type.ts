import getColor from "./getColor"

export const CARTTYPR = {
    1: "角色精准调谐",
    2: "武器精准调谐",
    3: "角色调谐（常驻池）",
    4: "武器调谐（常驻池）",
    5: "角色调谐（新手池）",
} as const
export type CardType =
    {
        cardPoolType: string,
        resourceId: number,
        qualityLevel: number,
        resourceType: string,
        name: string,
        count: number,
        time: string
    }
export type GoldObjType = { [key in "gold" | "purple" | "blue"]: CardType[] }
export const goldDict :any = {
    gold: "5星",
    purple: "4星",
    blue: "3星",
} 
export const colorList = getColor("#fffb0d", "#a43f2c", 81)