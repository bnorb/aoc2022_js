const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const sum = data
  .split("\n")
  .map((line) => [line.slice(0, line.length / 2), line.slice(line.length / 2)])
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

console.log(sum);
