const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const count = data
  .split("\n")
  .map((l) => l.split(","))
  .map(([e1, e2]) => [
    e1.split("-").map((n) => parseInt(n, 10)),
    e2.split("-").map((n) => parseInt(n, 10)),
  ])
  .reduce(
    (count, [[e1Min, e1Max], [e2Min, e2Max]]) =>
      (e1Min <= e2Min && e1Max >= e2Min) ||
      (e2Min <= e1Min && e2Max >= e1Min) ||
      (e1Min <= e2Max && e1Max >= e2Max) ||
      (e2Min <= e1Max && e2Max >= e1Max)
        ? count + 1
        : count,
    0
  );

console.log(count);
