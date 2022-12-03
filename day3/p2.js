const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const sacks = data.split("\n");
let sum = 0;

for (let i = 0; i <= sacks.length - 3; i += 3) {
  let set = new Set(sacks[i].split(""));
  set = new Set(sacks[i + 1].split("").filter((item) => set.has(item)));
  set = new Set(sacks[i + 2].split("").filter((item) => set.has(item)));

  const badge = [...set][0];
  if (badge == badge.toLowerCase()) {
    sum += badge.charCodeAt(0) - 96;
  } else {
    sum += badge.charCodeAt(0) - 64 + 26;
  }
}

console.log(sum);
