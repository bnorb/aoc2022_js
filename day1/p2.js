const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const cals = data.split("\n\n").map((elf) =>
  elf
    .split("\n")
    .map((c) => parseInt(c, 10))
    .reduce((s, c) => s + c, 0)
);

cals.sort((a, b) => b - a);

const sum = cals.slice(0, 3).reduce((s, c) => s + c);

console.log(sum);
