const { readFileSync } = require("fs");

const parseInput = (input) =>
  input.split("\n\n").map((elf) =>
    elf
      .split("\n")
      .map((c) => parseInt(c, 10))
      .reduce((s, c) => s + c, 0)
  );

const part1 = (data) =>
  data.reduce((max, curr) => (curr > max ? curr : max), 0);

const part2 = (data) => {
  cals = [...data].sort((a, b) => b - a);

  return cals.slice(0, 3).reduce((s, c) => s + c);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
