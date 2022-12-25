const { readFileSync } = require("fs");

const parseInput = (input) =>
  input
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
      [bX, bY],
      Math.abs(sX - bX) + Math.abs(sY - bY),
    ]);

const part1 = (pairs) => {
  const occupied = new Set();
  pairs.forEach(
    ([[sX, sY], [bX, bY]]) =>
      occupied.add(`${sX}_${sY}`) && occupied.add(`${bX}_${bY}`)
  );

  const Y = 2000000;

  const noBeacon = new Set();

  pairs.forEach(([[sX, sY], _, distance]) => {
    const lineD = Math.abs(sY - Y);
    if (lineD > distance) {
      return;
    }

    let x = sX;
    let d = lineD;
    while (d <= distance) {
      const h = `${x}_${Y}`;
      if (!occupied.has(h) && !noBeacon.has(h)) {
        noBeacon.add(h);
      }
      x++;
      d = Math.abs(sX - x) + lineD;
    }

    x = sX;
    d = lineD;
    while (d <= distance) {
      const h = `${x}_${Y}`;
      if (!occupied.has(h) && !noBeacon.has(h)) {
        noBeacon.add(h);
      }
      x--;
      d = Math.abs(sX - x) + lineD;
    }
  });

  return noBeacon.size;
};

const part2 = (pairs) => {
  const find = (maxXY) => {
    const seen = new Set();

    const checkPos = (x, y) => {
      const h = `${x}_${y}`;
      if (seen.has(h) || x < 0 || y < 0 || x > maxXY || y > maxXY) return false;

      seen.add(h);
      if (
        pairs.every(
          ([[sX, sY], _, d]) => d < Math.abs(sX - x) + Math.abs(sY - y)
        )
      ) {
        return true;
      }
    };

    for (const [[sX, sY], _, d] of pairs) {
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

  return pos[0] * 4000000 + pos[1];
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
