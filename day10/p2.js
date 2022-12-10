const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

let clock = 1;
let x = 1;
const crt = new Array(6).fill(0).map((_) => new Array(40).fill("."));

const drawPixel = (c) => {
  const row = Math.floor((c - 1) / 40);
  const col = (c - 1) % 40;
  crt[row][col] = col >= x - 1 && col <= x + 1 ? "#" : ".";
};

const ops = data.split("\n");
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

console.table(crt.map((row) => row.join("")));
