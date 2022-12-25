const { readFileSync } = require("fs");

const parseInput = (input) => input.split("\n");

const part1 = (data) => {
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

  return data.reduce((score, round) => {
    const [them, me] = round.split(" ");
    score += scoreMap[me];

    if (beatMap[me] == them) {
      score += 6;
    } else if (beatMap[them] != me) {
      score += 3;
    }

    return score;
  }, 0);
};

const part2 = (data) => {
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

  return data.reduce((score, round) => {
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
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
