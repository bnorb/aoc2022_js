const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const max = data
  .split("\n\n")
  .map((elf) =>
    elf
      .split("\n")
      .map((c) => parseInt(c, 10))
      .reduce((s, c) => s + c, 0)
  )
  .reduce((max, curr) => (curr > max ? curr : max), 0);

console.log(max);
