const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

let pos = -1;

const buff = data.substring(0, 13).split("");

for (let i = 13; i < data.length; i++) {
  buff.push(data.charAt(i));

  if (new Set(buff).size == buff.length) {
    pos = i + 1;
    break;
  }

  buff.shift();
}

console.log(pos);
