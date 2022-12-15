const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const pairs = data.split("\n").map((line) =>
  line
    .split(": ")
    .map((part) => part.split(" at ")[1])
    .map((part) =>
      part.split(", ").map((coords) => parseInt(coords.split("=")[1], 10))
    )
);

const occupied = new Set();
pairs.forEach(
  ([[sX, sY], [bX, bY]]) =>
    occupied.add(`${sX}_${sY}`) && occupied.add(`${bX}_${bY}`)
);

const distances = pairs.map(([[sX, sY], [bX, bY]]) => [
  [sX, sY],
  Math.abs(sX - bX) + Math.abs(sY - bY),
]);

const Y = 2000000;
const noBeacon = new Set();

distances.forEach(([[sX, sY], distance]) => {
  const lineD = Math.abs(sY - Y);
  if (lineD > distance) {
    return;
  }

  let x = sX;
  let d = lineD;
  while (d <= distance) {
    const h = `${x}_${Y}`;
    if (!occupied.has(h)) {
      noBeacon.add(h);
    }
    x++;
    d = Math.abs(sX - x) + Math.abs(sY - Y);
  }

  x = sX;
  d = lineD;
  while (d <= distance) {
    const h = `${x}_${Y}`;
    if (!occupied.has(h)) {
      noBeacon.add(h);
    }
    x--;
    d = Math.abs(sX - x) + Math.abs(sY - Y);
  }
});

console.log(noBeacon.size);
