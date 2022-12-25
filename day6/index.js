const { readFileSync } = require("fs");

const parseInput = (input) => input.split("");

const findMarker = (data, markerLen) => {
  const buff = data.slice(0, markerLen);

  for (let i = 3; i < data.length; i++) {
    buff.push(data[i]);

    if (new Set(buff).size == buff.length) {
      return i + 1;
    }

    buff.shift();
  }

  return -1;
};

const part1 = (data) => findMarker(data, 3);

const part2 = (data) => findMarker(data, 13);

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
