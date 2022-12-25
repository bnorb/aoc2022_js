const { readFileSync } = require("fs");

const parseInput = (input) => input.split("");

const WIDTH = 7;
const rocks = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [1, 0],
    [0, -1],
    [1, -1],
    [2, -1],
    [1, -2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, -1],
    [2, -2],
  ],
  [
    [0, 0],
    [0, -1],
    [0, -2],
    [0, -3],
  ],
  [
    [0, 0],
    [1, 0],
    [0, -1],
    [1, -1],
  ],
];

const spawnRock = (rock, topIndex, chamber) => {
  let bottomLeft = [2, topIndex - 4];
  let newRock = rock.map(([x, y]) => [bottomLeft[0] + x, bottomLeft[1] + y]);

  const rockTop = newRock.reduce((min, [_, y]) => (y < min ? y : min), 0);

  if (rockTop >= 0) {
    return [newRock, topIndex];
  }

  for (let i = 0; i > rockTop; i--) {
    chamber.unshift(new Array(WIDTH).fill(0));
    topIndex++;
  }

  return [newRock.map(([x, y]) => [x, y + Math.abs(rockTop)]), topIndex];
};

const simulateRock = (rock, wind, windex, chamber) => {
  // wind
  let pushedRock = rock.map(([x, y]) => [
    x + (wind[windex] == ">" ? 1 : -1),
    y,
  ]);

  if (
    !pushedRock.every(([x, y]) => x < WIDTH && x >= 0 && chamber[y][x] == 0)
  ) {
    pushedRock = rock;
  }

  windex++;
  if (windex >= wind.length) windex = 0;

  // fall
  fallenRock = pushedRock.map(([x, y]) => [x, y + 1]);
  if (!fallenRock.every(([x, y]) => y < chamber.length && chamber[y][x] == 0)) {
    return [pushedRock, windex];
  }

  return simulateRock(fallenRock, wind, windex, chamber);
};

const part1 = (wind) => {
  const chamber = new Array(4).fill(0).map((_) => new Array(WIDTH).fill(0));
  let topIndex = 4;
  let windex = 0;

  for (let i = 0; i < 2022; i++) {
    const rockIndex = i % 5;

    let rock = rocks[rockIndex];

    [rock, topIndex] = spawnRock(rock, topIndex, chamber);
    [rock, windex] = simulateRock(rock, wind, windex, chamber);
    topIndex = rock.reduce((min, [_, y]) => (y < min ? y : min), topIndex);

    rock.forEach(([x, y]) => (chamber[y][x] = 1));
  }

  return chamber.length - topIndex;
};

const part2 = (wind) => {
  const chamber = new Array(4).fill(0).map((_) => new Array(WIDTH).fill(0));
  let topIndex = 4;
  let windex = 0;

  const states = new Map();
  let repStart, repEnd;
  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    const rockIndex = i % 5;

    if (i > 0) {
      const state = `${chamber[topIndex].join("")}_${windex}_${rockIndex}`;
      if (states.has(state)) {
        repStart = states.get(state);
        repEnd = [i, chamber.length - topIndex];
        break;
      }

      states.set(state, [i, chamber.length - topIndex]);
    }

    let rock = rocks[rockIndex];

    [rock, topIndex] = spawnRock(rock, topIndex, chamber);
    [rock, windex] = simulateRock(rock, wind, windex, chamber);
    topIndex = rock.reduce((min, [_, y]) => (y < min ? y : min), topIndex);

    rock.forEach(([x, y]) => (chamber[y][x] = 1));
  }

  const eleGain = repEnd[1] - repStart[1];
  const indexDiff = repEnd[0] - repStart[0];

  const remainingRocks = 1000000000000 - repEnd[0];
  const initGain = repEnd[1];
  const repGain = Math.floor(remainingRocks / indexDiff) * eleGain;
  const rocksLeft = remainingRocks % indexDiff;

  let lastGain = 0;
  if (rocksLeft > 0) {
    const targetIdx = repStart[0] + rocksLeft;
    let heightAtRem;

    for (const [_, [i, height]] of states) {
      if (i == targetIdx) {
        heightAtRem = height;
        break;
      }
    }

    lastGain = heightAtRem - repStart[1];
  }

  return initGain + repGain + lastGain;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
