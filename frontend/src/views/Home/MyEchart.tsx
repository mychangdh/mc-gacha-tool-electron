import { cardType } from "./CARTTYPE";

export default function MyEchart({
  type,
  data,
}: {
  type: number;
  data: cardType[];
}) {
  const goldData = data.filter((item) => {
    return item.qualityLevel === 5;
  });
  return (
    <>
      <div>{type}</div>
      <div>
        {goldData.map((item, index) => {
          return (
            <span key={index}>
              ({item.count}){item.name}
            </span>
          );
        })}
      </div>
    </>
  );
}
