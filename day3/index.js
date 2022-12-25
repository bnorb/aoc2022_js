const { readFileSync } = require("fs");

const parseInput = (input) => input.split("\n");

const part1 = (data) =>
  data
    .map((line) => [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2),
    ])
    .map(([f, s]) => {
      const fSet = new Set(f.split(""));
      return s.split("").filter((item) => fSet.has(item))[0];
    })
    .reduce((sum, item) => {
      if (item == item.toLowerCase()) {
        sum += item.charCodeAt(0) - 96;
      } else {
        sum += item.charCodeAt(0) - 64 + 26;
      }

      return sum;
    }, 0);

const part2 = (data) => {
  let sum = 0;

  for (let i = 0; i <= data.length - 3; i += 3) {
    let set = new Set(data[i].split(""));
    set = new Set(data[i + 1].split("").filter((item) => set.has(item)));
    set = new Set(data[i + 2].split("").filter((item) => set.has(item)));

    const badge = [...set][0];
    if (badge == badge.toLowerCase()) {
      sum += badge.charCodeAt(0) - 96;
    } else {
      sum += badge.charCodeAt(0) - 64 + 26;
    }
  }

  return sum;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
