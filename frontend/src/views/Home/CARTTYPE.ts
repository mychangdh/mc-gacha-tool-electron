export const CARTTYPR = {
    1: "角色精准调谐",
    2: "武器精准调谐",
    3: "角色调谐（常驻池）",
    4: "角色精准调谐",
    5: "武器调谐（常驻池）",
    6: "角色调谐（新手池）",
}
export type cardType =
    {
        cardPoolType: string,
        resourceId: number,
        qualityLevel: number,
        resourceType: string,
        name: string,
        count: number,
        time: string
    }