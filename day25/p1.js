const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const sums = {
  "1_1": ["0", "2"],
  "1_2": ["1", "="],
  "1_-": ["0", "0"],
  "1_=": ["0", "-"],
  "2_2": ["1", "-"],
  "2_-": ["0", "1"],
  "2_=": ["0", "0"],
  "-_-": ["0", "="],
  "-_=": ["-", "2"],
  "=_=": ["-", "1"],
};

const addDigits = (a, b) => {
  if (a == "0") {
    return ["0", b];
  }

  if (b == "0") {
    return ["0", a];
  }

  return sums[`${a}_${b}`] || sums[`${b}_${a}`];
};

const snafuAdder = (a, b) => {
  const len = Math.max(a.length, b.length);

  const aDigits = a.padStart(len, "0").split("");
  const bDigits = b.padStart(len, "0").split("");

  const sum = [];
  const carry = [];

  while (aDigits.length) {
    const aDig = aDigits.pop();
    const bDig = bDigits.pop();

    const carryCount = carry.length;
    let [c, s] = addDigits(aDig, bDig);
    if (c != "0") carry.push(c);

    for (let i = 0; i < carryCount; i++) {
      c = carry.shift();
      [c, s] = addDigits(s, c);
      if (c != "0") carry.push(c);
    }

    sum.unshift(s);
  }

  while (carry.length) {
    let s = carry.shift();

    const carryCount = carry.length;
    for (let i = 0; i < carryCount; i++) {
      let c = carry.shift();
      [c, s] = addDigits(s, c);
      if (c != "0") carry.push(c);
    }

    sum.unshift(s);
  }

  return sum.join("");
};

const snafus = data.split("\n");
const sum = snafus.reduce(
  (sum, snafu) => snafuAdder(sum, snafu),
  snafus.shift()
);

console.log(sum);
