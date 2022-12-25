const { readFileSync } = require("fs");

const parseInput = (input) => input.split("\n").map((l) => l.split(""));

const part1 = (trees) => {
  const marked = new Array(trees.length)
    .fill(0)
    .map((_) => new Array(trees[0].length).fill(0));

  trees.forEach((row, r) => {
    let highestF = -1;
    let highestB = -1;
    for (let f = 0, b = row.length - 1; f < row.length && b >= 0; f++, b--) {
      if (row[f] > highestF) {
        highestF = row[f];
        marked[r][f] = 1;
      }

      if (row[b] > highestB) {
        highestB = row[b];
        marked[r][b] = 1;
      }
    }
  });

  for (let c = 0; c < trees[0].length; c++) {
    let highestF = -1;
    let highestB = -1;
    for (
      let f = 0, b = trees.length - 1;
      f < trees.length && b >= 0;
      f++, b--
    ) {
      if (trees[f][c] > highestF) {
        highestF = trees[f][c];
        marked[f][c] = 1;
      }

      if (trees[b][c] > highestB) {
        highestB = trees[b][c];
        marked[b][c] = 1;
      }
    }
  }

  return marked.reduce((s, row) => s + row.reduce((s, m) => s + m, 0), 0);
};

const part2 = (trees) => {
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

  return trees.reduce((maxScore, row, r) => {
    if (r == 0 || r == trees.length - 1) {
      return maxScore;
    }

    const score = row.reduce((rowMax, _, c) => {
      if (c == 0 || c == row.length - 1) {
        return rowMax;
      }

      const score =
        countDirection([r, c], [1, 0]) *
        countDirection([r, c], [-1, 0]) *
        countDirection([r, c], [0, 1]) *
        countDirection([r, c], [0, -1]);

      return Math.max(score, rowMax);
    }, 0);

    return Math.max(score, maxScore);
  }, 0);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
