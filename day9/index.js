const { readFileSync } = require("fs");

const parseInput = (input) =>
  input
    .split("\n")
    .map((l) => l.split(" "))
    .map(([dir, step]) => [dir, parseInt(step, 10)]);

const DIR = {
  L: [-1, 0],
  R: [1, 0],
  D: [0, -1],
  U: [0, 1],
};

const moveParts = (parts, head, i = 0) => {
  const part = parts[i];
  const d = [head[0] - part[0], head[1] - part[1]];

  if (d.every((c) => c <= 1 && c >= -1)) {
    return;
  }

  if (d[0] != 0) {
    part[0] += d[0] / Math.abs(d[0]);
  }

  if (d[1] != 0) {
    part[1] += d[1] / Math.abs(d[1]);
  }

  if (i < parts.length - 1) {
    moveParts(parts, part, i + 1);
  }
};

const calcVisited = (moves, head, parts) => {
  const visited = new Set(["0_0"]);

  moves.forEach(([dir, step]) => {
    const [dx, dy] = DIR[dir];
    for (let i = 0; i < step; i++) {
      head[0] += dx;
      head[1] += dy;
      moveParts(parts, head);
      visited.add(
        `${parts[parts.length - 1][0]}_${parts[parts.length - 1][1]}`
      );
    }
  });

  return visited.size;
};

const part1 = (moves) => {
  const head = [0, 0];
  const parts = [[0, 0]];

  return calcVisited(moves, head, parts);
};

const part2 = (moves) => {
  const head = [0, 0];
  const parts = new Array(9).fill(0).map((_) => [0, 0]);

  return calcVisited(moves, head, parts);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
