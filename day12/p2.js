const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const DIR = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const map = data.split("\n").map((line) => line.split(""));

const H = map.length;
const W = map[0].length;

const start = map.reduce((coord, row, r) => {
  const c = row.reduce((coord, val, c) => (val == "E" ? [r, c] : coord), -1);
  if (c != -1) {
    return c;
  }

  return coord;
}, -1);

const getElevation = (c) => {
  if (c == "S") return "a".charCodeAt(0);
  if (c == "E") return "z".charCodeAt(0);
  return c.charCodeAt(0);
};

const getNext = (row, col, visited) => {
  return DIR.map(([dr, dc]) => [row + dr, col + dc]).filter(
    ([nr, nc]) =>
      !visited.has(`${nr}_${nc}`) &&
      nr < H &&
      nr >= 0 &&
      nc < W &&
      nc >= 0 &&
      getElevation(map[nr][nc]) - getElevation(map[row][col]) >= -1
  );
};

const bfs = () => {
  const queue = [[start, 0]];
  const visited = new Set([`${start[0]}_${start[1]}`]);

  while (queue.length) {
    const [[row, col], steps] = queue.shift();
    if (map[row][col] == "a") {
      return steps;
    }

    getNext(row, col, visited).forEach(([nr, nc]) => {
      visited.add(`${nr}_${nc}`);
      queue.push([[nr, nc], steps + 1]);
    });
  }
};

console.log(bfs());
