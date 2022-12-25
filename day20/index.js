const { readFileSync } = require("fs");
const { CircularList } = require("./circularList");

const parseInput = (input) => input.split("\n").map((n) => parseInt(n, 10));

const part1 = (numbers) => {
  const circle = new CircularList([...numbers]);
  circle.moveAll();

  const coords = [1000, 2000, 3000].map((c) => circle.findCoord(c));
  return coords.reduce((s, c) => s + c, 0);
};

const part2 = (numbers) => {
  const circle = new CircularList(numbers.map((n) => n * 811589153));

  for (let i = 0; i < 10; i++) {
    circle.moveAll();
  }

  const coords = [1000, 2000, 3000].map((c) => circle.findCoord(c));
  return coords.reduce((s, c) => s + c, 0);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
