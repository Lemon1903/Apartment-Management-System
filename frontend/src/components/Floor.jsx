import Room from "./Room";

const dimensions = {
  width: 140,
  height: 120,
};
const blueprint = [
  ["504", "nan", "500", "501", "nan", "515"],
  ["505", "nan", "502", "503", "nan", "514"],
  ["506", "nan", "nan", "nan", "nan", "513"],
  ["507", "508", "509", "510", "511", "512"],
];

export default function Floor() {
  return (
    <div className="container grid gap-2 rounded-3xl border-b-[12px] border-l-[12px] border-border bg-popover p-4">
      {blueprint.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((cell, cellIndex) =>
            cell !== "nan" ? (
              <Room key={cellIndex} roomNumber={cell} {...dimensions} />
            ) : (
              <div key={cellIndex} style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }} />
            )
          )}
        </div>
      ))}
    </div>
  );
}
