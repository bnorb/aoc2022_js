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

const findRowCoverage = (pairs, y, removeBeacons = true) => {
  const ranges = [];

  pairs.forEach(([[sX, sY], [bX, bY], distance]) => {
    const yDistance = Math.abs(sY - y);
    if (yDistance > distance) {
      return;
    }

    const xDistance = distance - yDistance;
    const range = [sX - xDistance, sX + xDistance];

    if (removeBeacons && bY == y) {
      if (bX == range[0]) {
        range[0]++;
      } else {
        range[1]--;
      }
    }

    ranges.push(range);
  });

  ranges.sort((a, b) => b[0] - a[0] || b[1] - a[1]);

  const aggrRanges = [];
  let currRange = ranges.pop();
  while (ranges.length) {
    const nextRange = ranges.pop();
    if (nextRange[1] <= currRange[1]) continue;

    if (nextRange[0] <= currRange[1]) {
      currRange[1] = nextRange[1];
    } else {
      aggrRanges.push(currRange);
      currRange = nextRange;
    }
  }

  aggrRanges.push(currRange);

  return aggrRanges;
};

const part1 = (pairs) =>
  findRowCoverage(pairs, 2000000).reduce(
    (s, [min, max]) => s + (max - min + 1),
    0
  );

const part2 = (pairs) => {
  const find = (maxXY) => {
    const checkedRows = new Set();
    for (const [[_, sY], __, distance] of pairs) {
      for (
        let y = Math.max(0, sY - distance);
        y <= Math.min(maxXY, sY + distance);
        y++
      ) {
        if (checkedRows.has(y)) continue;

        checkedRows.add(y);
        const coverage = findRowCoverage(pairs, y, false);

        if (coverage.length == 1) {
          if (coverage[0][0] == 1) return [0, y];
          if (coverage[0][1] == maxXY - 1) return [maxXY, y];
        }

        if (coverage.length == 2) {
          return [coverage[0][1] + 1, y];
        }
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
