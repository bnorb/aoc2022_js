const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const distances = data
  .split("\n")
  .map((line) =>
    line
      .split(": ")
      .map((part) => part.split(" at ")[1])
      .map((part) =>
        part.split(", ").map((coords) => parseInt(coords.split("=")[1], 10))
      )
  )
  .map(([[sX, sY], [bX, bY]]) => [
    [sX, sY],
    Math.abs(sX - bX) + Math.abs(sY - bY),
  ]);

const find = (maxXY) => {
  const seen = new Set();

  const checkPos = (x, y) => {
    const h = `${x}_${y}`;
    if (seen.has(h) || x < 0 || y < 0 || x > maxXY || y > maxXY) return false;

    seen.add(h);
    if (
      distances.every(
        ([[sX, sY], d]) => d < Math.abs(sX - x) + Math.abs(sY - y)
      )
    ) {
      return true;
    }
  };

  for (const [[sX, sY], d] of distances) {
    // edge 1
    for (let x = sX - d - 1, y = sY; x <= sX && y >= sY - d - 1; x++, y--) {
      if (checkPos(x, y)) return [x, y];
    }

    // edge 2
    for (let x = sX, y = sY - d - 1; x <= sX + d + 1 && y <= sY; x++, y++) {
      if (checkPos(x, y)) return [x, y];
    }

    // edge 3
    for (let x = sX + d + 1, y = sY; x >= sX && y <= sY + d + 1; x--, y++) {
      if (checkPos(x, y)) return [x, y];
    }

    // edge 4
    for (let x = sX, y = sY + d + 1; x >= sX - d - 1 && y >= sY; x--, y--) {
      if (checkPos(x, y)) return [x, y];
    }
  }
};

const pos = find(4000000);

console.log(pos[0] * 4000000 + pos[1]);