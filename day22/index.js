const { readFileSync } = require("fs");

const parseInput = (input) => {
  const [mapStr, stepStr] = input.split("\n\n");

  const numSteps = stepStr.split(/[A-Z]/).map((n) => parseInt(n, 10));
  let faceSteps = stepStr.split(/[0-9]+/);
  faceSteps = faceSteps.slice(1, -1);

  const steps = numSteps.flatMap((n, i) =>
    !faceSteps[i] ? n : [n, faceSteps[i]]
  );

  const mapWidth = mapStr
    .split("\n")
    .reduce((max, line) => (line.length > max ? line.length : max), 0);

  const map = mapStr
    .split("\n")
    .map((line) => line.padEnd(mapWidth, " ").split(""));

  return [map, steps, mapWidth];
};

const part1 = ([map, steps]) => {
  const wrap = (num, min, max) => (num < min ? max : num > max ? min : num);

  const getNextRow = (row, col, d, map) => {
    let r = wrap(row + d, 0, map.length - 1);
    if (d < 0 && map[r][col] == " ") r = map.length - 1;
    if (d > 0 && map[r][col] == " ") r = 0;

    while (map[r][col] == " ") r += d;

    return [r, col];
  };

  const getNextCol = (row, col, d, map) => {
    let c = wrap(col + d, 0, map[row].length - 1);
    if (d < 0 && map[row][c] == " ") c = map[row].length - 1;
    if (d > 0 && map[row][c] == " ") c = 0;

    while (map[row][c] == " ") c += d;

    return [row, c];
  };

  const getNext = (row, col, dir, map) => {
    if (dir == 0) return getNextCol(row, col, 1, map);
    if (dir == 1) return getNextRow(row, col, 1, map);
    if (dir == 2) return getNextCol(row, col, -1, map);

    return getNextRow(row, col, -1, map);
  };

  let row = 0;
  let col = 0;
  let dir = 0;
  while (map[row][col] == " ") col++;

  steps.forEach((step) => {
    if (Number.isInteger(step)) {
      if (step == 0) return;

      let i = 0;
      do {
        let [nextR, nextC] = getNext(row, col, dir, map);
        if (map[nextR][nextC] == "#") break;
        row = nextR;
        col = nextC;
        i++;
      } while (i < step);
    } else if (step == "R") {
      dir = wrap(dir + 1, 0, 3);
    } else {
      dir = wrap(dir - 1, 0, 3);
    }
  });

  return 1000 * (row + 1) + 4 * (col + 1) + dir;
};

const part2 = ([map, steps, mapWidth]) => {
  const getCubeBounds = (sideLen, map) => {
    let cubeBounds = {};
    let side = 1;

    for (let y = 0; y < map.length; y += sideLen) {
      for (let x = 0; x < mapWidth; x += sideLen) {
        if (map[y][x] != " ") {
          cubeBounds[side++] = [
            [y, y + sideLen - 1],
            [x, x + sideLen - 1],
          ];
        }
      }
    }

    return cubeBounds;
  };

  // ain't calculating that chief
  const edgeMap = {
    "1_0": [2, 0, true],
    "1_1": [3, 1, true],
    "1_2": [4, 0, false],
    "1_3": [6, 0, true],
    "2_0": [5, 2, false],
    "2_1": [3, 2, true],
    "2_2": [1, 2, true],
    "2_3": [6, 3, true],
    "3_0": [2, 3, true],
    "3_1": [5, 1, true],
    "3_2": [4, 1, true],
    "3_3": [1, 3, true],
    "5_0": [2, 2, false],
    "5_1": [6, 2, true],
    "5_2": [4, 2, true],
    "5_3": [3, 3, true],
    "4_0": [5, 0, true],
    "4_1": [6, 1, true],
    "4_2": [1, 0, false],
    "4_3": [3, 0, true],
    "6_0": [5, 3, true],
    "6_1": [2, 1, true],
    "6_2": [1, 1, true],
    "6_3": [4, 3, true],
  };

  const cubeBounds = getCubeBounds(50, map);

  const getNextData = (nextSide, nextDir, diff, cubeBounds) => {
    if (nextDir == 0) {
      const [[nextRowMin], [nextCol]] = cubeBounds[nextSide];
      return [nextRowMin + diff, nextCol, nextDir, nextSide];
    }

    if (nextDir == 1) {
      const [[nextRow], [nextColMin]] = cubeBounds[nextSide];
      return [nextRow, nextColMin + diff, nextDir, nextSide];
    }

    if (nextDir == 2) {
      const [[nextRowMin], [_, nextCol]] = cubeBounds[nextSide];
      return [nextRowMin + diff, nextCol, nextDir, nextSide];
    }

    const [[_, nextRow], [nextColMin]] = cubeBounds[nextSide];
    return [nextRow, nextColMin + diff, nextDir, nextSide];
  };

  const getNextRow = (row, col, dir, side, edgeMap, cubeBounds) => {
    let newRow = row + (dir == 1 ? 1 : -1);
    const [[rMin, rMax], [cMin, cMax]] = cubeBounds[side];

    if (newRow >= rMin && newRow <= rMax) return [newRow, col, dir, side];

    const [nextSide, nextDir, sameOrientation] = edgeMap[`${side}_${dir}`];
    const diff = sameOrientation ? col - cMin : cMax - col;

    return getNextData(nextSide, nextDir, diff, cubeBounds);
  };

  const getNextCol = (row, col, dir, side, edgeMap, cubeBounds) => {
    let newCol = col + (dir == 0 ? 1 : -1);
    const [[rMin, rMax], [cMin, cMax]] = cubeBounds[side];

    if (newCol >= cMin && newCol <= cMax) return [row, newCol, dir, side];

    const [nextSide, nextDir, sameOrientation] = edgeMap[`${side}_${dir}`];
    const diff = sameOrientation ? row - rMin : rMax - row;

    return getNextData(nextSide, nextDir, diff, cubeBounds);
  };

  const getNext = (row, col, dir, side, edgeMap, cubeBounds) => {
    if (dir % 2 == 0)
      return getNextCol(row, col, dir, side, edgeMap, cubeBounds);
    return getNextRow(row, col, dir, side, edgeMap, cubeBounds);
  };

  const wrap = (num, min, max) => (num < min ? max : num > max ? min : num);

  let row = 0;
  let col = 0;
  let dir = 0;
  let side = 1;
  while (map[row][col] == " ") col++;

  steps.forEach((step) => {
    if (Number.isInteger(step)) {
      if (step == 0) return;

      let i = 0;
      do {
        let [nextR, nextC, nextDir, nextSide] = getNext(
          row,
          col,
          dir,
          side,
          edgeMap,
          cubeBounds
        );

        if (map[nextR][nextC] == "#") break;

        row = nextR;
        col = nextC;
        dir = nextDir;
        side = nextSide;
        i++;
      } while (i < step);
    } else if (step == "R") {
      dir = wrap(dir + 1, 0, 3);
    } else {
      dir = wrap(dir - 1, 0, 3);
    }
  });

  return 1000 * (row + 1) + 4 * (col + 1) + dir;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
