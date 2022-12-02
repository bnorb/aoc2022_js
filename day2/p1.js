const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const scoreMap = {
  X: 1,
  Y: 2,
  Z: 3,
};

const beatMap = {
  A: "Z",
  B: "X",
  C: "Y",
  X: "C",
  Y: "A",
  Z: "B",
};

const score = data.split("\n").reduce((score, round) => {
  const [them, me] = round.split(" ");
  score += scoreMap[me];
  if (beatMap[me] == them) {
    score += 6;
  } else if (beatMap[them] != me) {
    score += 3;
  }

  return score;
}, 0);

console.log(score);
