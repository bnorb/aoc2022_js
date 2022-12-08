const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const trees = data.split("\n").map((l) => l.split(""));
const marked = new Array(trees.length)
  .fill(0)
  .map((_) => new Array(trees[0].length).fill(0));

const countDirection = ([r, c], [dr, dc]) => {
  let nr = r + dr;
  let nc = c + dc;
  let count = 0;

  while (nr >= 0 && nr < trees.length && nc >= 0 && nc < trees[0].length) {
    count++;
    if (trees[nr][nc] >= trees[r][c]) {
      break;
    }

    nr = nr + dr;
    nc = nc + dc;
  }

  return count;
};

let maxScore = 0;

trees.forEach((row, r) => {
  if (r == 0 || r == trees.length - 1) {
    return;
  }

  row.forEach((_, c) => {
    if (c == 0 || c == row.length - 1) {
      return;
    }

    const score =
      countDirection([r, c], [1, 0]) *
      countDirection([r, c], [-1, 0]) *
      countDirection([r, c], [0, 1]) *
      countDirection([r, c], [0, -1]);

    if (score > maxScore) {
      maxScore = score;
    }
  });
});

console.log(maxScore);
