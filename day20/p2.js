const fs = require("fs");
const { CircularList } = require("./list");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const numbers = data.split("\n").map((n) => parseInt(n, 10) * 811589153);

const circle = new CircularList(numbers);

const first = circle.getFirst();
let curr = first;

for (let i = 0; i < 10; i++) {
  do {
    circle.move(curr);
    curr = curr.ogNext;
  } while (curr !== first);
}
const coords = [1000, 2000, 3000].map((c) => circle.findCoord(c));
const sum = coords.reduce((s, c) => s + c, 0);

console.log(sum);
