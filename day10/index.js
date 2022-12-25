const { readFileSync } = require("fs");

const parseInput = (input) => input.split("\n");

const part1 = (ops) => {
  let clock = 1;
  let x = 1;
  let nextPoint = 20;

  let sum = 0;
  for (op of ops) {
    if (clock == nextPoint || clock == nextPoint - 1) {
      sum += x * nextPoint;
      if (nextPoint == 220) {
        break;
      }
      nextPoint += 40;
    }

    if (op == "noop") {
      clock++;
    } else {
      let [_, addx] = op.split(" ");
      x += parseInt(addx, 10);
      clock += 2;
    }
  }

  return sum;
};

const part2 = (ops) => {
  let clock = 1;
  let x = 1;
  const crt = new Array(6).fill(0).map((_) => new Array(40).fill("."));

  const drawPixel = (c) => {
    const row = Math.floor((c - 1) / 40);
    const col = (c - 1) % 40;
    crt[row][col] = col >= x - 1 && col <= x + 1 ? "#" : ".";
  };

  for (op of ops) {
    drawPixel(clock);

    if (op == "noop") {
      clock++;
    } else {
      drawPixel(clock + 1);
      let [_, addx] = op.split(" ");
      x += parseInt(addx, 10);
      clock += 2;
    }
  }

  return crt;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log(
  "Part 2:",
  part2(data)
    .map((row) => row.join(""))
    .join("\n\t")
);
