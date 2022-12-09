const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const moves = data
  .split("\n")
  .map((l) => l.split(" "))
  .map(([dir, step]) => [dir, parseInt(step, 10)]);

const dirMap = {
  L: [-1, 0],
  R: [1, 0],
  D: [0, -1],
  U: [0, 1],
};

const head = [0, 0];
const tail = [0, 0];
const visited = new Set(["0_0"]);

const moveTail = () => {
  const d = [head[0] - tail[0], head[1] - tail[1]];
  if (d.every((c) => c <= 1 && c >= -1)) {
    return;
  }

  if (d[0] != 0) {
    tail[0] += d[0] / Math.abs(d[0]);
  }

  if (d[1] != 0) {
    tail[1] += d[1] / Math.abs(d[1]);
  }
};

moves.forEach(([dir, step]) => {
  const [dx, dy] = dirMap[dir];
  for (let i = 0; i < step; i++) {
    head[0] += dx;
    head[1] += dy;
    moveTail();
    visited.add(`${tail[0]}_${tail[1]}`);
  }
});

console.log(visited.size);
