const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const trees = data.split("\n").map((l) => l.split(""));
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
  for (let f = 0, b = trees.length - 1; f < trees.length && b >= 0; f++, b--) {
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

const sum = marked.reduce((s, row) => s + row.reduce((s, m) => s + m, 0), 0);

console.log(sum);
