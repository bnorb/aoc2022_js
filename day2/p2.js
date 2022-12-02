const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const scoreMap = {
  A: 1,
  B: 2,
  C: 3,
};

const beatMap = {
  A: "C",
  B: "A",
  C: "B",
};

const loseMap = {
  A: "B",
  B: "C",
  C: "A",
};

const score = data.split("\n").reduce((score, round) => {
  const [them, outcome] = round.split(" ");

  let me = them;

  if (outcome == "X") {
    //lose
    me = beatMap[them];
  } else if (outcome == "Z") {
    // win
    score += 6;
    me = loseMap[them];
  } else {
    score += 3;
  }

  score += scoreMap[me];

  return score;
}, 0);

console.log(score);
