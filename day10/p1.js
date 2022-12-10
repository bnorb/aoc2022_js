const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

let clock = 1;
let x = 1;
let sum = 0;
let nextPoint = 20;

const ops = data.split("\n");
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

console.log(sum);
