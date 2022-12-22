const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const [mapStr, stepStr] = data.split("\n\n");

const numSteps = stepStr.split(/[A-Z]/).map((n) => parseInt(n, 10));
let faceSteps = stepStr.split(/[0-9]+/);
faceSteps = faceSteps.slice(1, -1);

const steps = numSteps.flatMap((n, i) =>
  !faceSteps[i] ? n : [n, faceSteps[i]]
);

const mapWidth = mapStr
  .split("\n")
  .reduce((max, line) => (line.length > max ? line.length : max), 0);

const map = mapStr
  .split("\n")
  .map((line) => line.padEnd(mapWidth, " ").split(""));

const wrap = (num, min, max) => (num < min ? max : num > max ? min : num);

const getNextRow = (row, col, d, map) => {
  let r = wrap(row + d, 0, map.length - 1);
  if (d < 0 && map[r][col] == " ") r = map.length - 1;
  if (d > 0 && map[r][col] == " ") r = 0;

  while (map[r][col] == " ") r += d;

  return [r, col];
};

const getNextCol = (row, col, d, map) => {
  let c = wrap(col + d, 0, map[row].length - 1);
  if (d < 0 && map[row][c] == " ") c = map[row].length - 1;
  if (d > 0 && map[row][c] == " ") c = 0;

  while (map[row][c] == " ") c += d;

  return [row, c];
};

const getNext = (row, col, dir, map) => {
  if (dir == 0) return getNextCol(row, col, 1, map);
  if (dir == 1) return getNextRow(row, col, 1, map);
  if (dir == 2) return getNextCol(row, col, -1, map);

  return getNextRow(row, col, -1, map);
};

let row = 0;
let col = 0;
let dir = 0;
while (map[row][col] == " ") col++;

steps.forEach((step) => {
  if (Number.isInteger(step)) {
    if (step == 0) return;

    let i = 0;
    do {
      let [nextR, nextC] = getNext(row, col, dir, map);
      if (map[nextR][nextC] == "#") break;
      row = nextR;
      col = nextC;
      i++;
    } while (i < step);
  } else if (step == "R") {
    dir = wrap(dir + 1, 0, 3);
  } else {
    dir = wrap(dir - 1, 0, 3);
  }
});

const pass = 1000 * (row + 1) + 4 * (col + 1) + dir;
console.log(pass);
