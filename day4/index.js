const { readFileSync } = require("fs");

const parseInput = (input) =>
  input
    .split("\n")
    .map((l) => l.split(","))
    .map(([e1, e2]) => [
      e1.split("-").map((n) => parseInt(n, 10)),
      e2.split("-").map((n) => parseInt(n, 10)),
    ]);

const part1 = (data) =>
  data.reduce(
    (count, [[e1Min, e1Max], [e2Min, e2Max]]) =>
      (e1Min <= e2Min && e1Max >= e2Max) || (e2Min <= e1Min && e2Max >= e1Max)
        ? count + 1
        : count,
    0
  );

const part2 = (data) =>
  data.reduce(
    (count, [[e1Min, e1Max], [e2Min, e2Max]]) =>
      (e1Min <= e2Min && e1Max >= e2Min) ||
      (e2Min <= e1Min && e2Max >= e1Min) ||
      (e1Min <= e2Max && e1Max >= e2Max) ||
      (e2Min <= e1Max && e2Max >= e1Max)
        ? count + 1
        : count,
    0
  );

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
