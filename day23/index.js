const { readFileSync } = require("fs");

const parseInput = (input) =>
  new Set(
    input
      .split("\n")
      .flatMap((line, row) =>
        line.split("").map((v, col) => (v == "#" ? `${row}_${col}` : null))
      )
      .filter((v) => v != null)
  );

const ADJ = {
  NW: [-1, -1],
  N: [-1, 0],
  NE: [-1, 1],
  E: [0, 1],
  SE: [1, 1],
  S: [1, 0],
  SW: [1, -1],
  W: [0, -1],
};

const DIR = [
  ["N", "NW", "NE"],
  ["S", "SW", "SE"],
  ["W", "NW", "SW"],
  ["E", "NE", "SE"],
];

const canMoveDirection = (validDirs, ...checkDirs) =>
  checkDirs.every((d) => validDirs.has(d));

const getNext = (curr, directions, elves) => {
  const [row, col] = curr.split("_").map((v) => parseInt(v, 10));
  const validDirs = new Set(
    Object.entries(ADJ)
      .filter(([_, [dr, dc]]) => !elves.has(`${row + dr}_${col + dc}`))
      .map(([dir]) => dir)
  );

  if (validDirs.size == 8) {
    return null;
  }

  for (const [dir, ...others] of directions) {
    if (canMoveDirection(validDirs, dir, ...others)) {
      return [row + ADJ[dir][0], col + ADJ[dir][1]];
    }
  }

  return null;
};

const simulateRound = (elves, directions) => {
  const proposals = new Map();

  for (const elfHash of elves) {
    const next = getNext(elfHash, directions, elves);
    if (next == null) continue;

    const newHash = `${next[0]}_${next[1]}`;

    if (!proposals.has(newHash)) proposals.set(newHash, []);
    proposals.get(newHash).push(elfHash);
  }

  let moved = false;
  for (const [prop, propElves] of proposals) {
    if (propElves.length == 1) {
      elves.delete(propElves[0]);
      elves.add(prop);
      moved = true;
    }
  }

  directions.push(directions.shift());
  return moved;
};

const part1 = (initElves) => {
  const elves = new Set([...initElves]);
  const directions = DIR.map((d) => [...d]);

  for (let i = 0; i < 10; i++) {
    simulateRound(elves, directions);
  }

  const bounds = [...elves].reduce(
    ([minRow, maxRow, minCol, maxCol], elfHash) => {
      const [row, col] = elfHash.split("_").map((v) => parseInt(v, 10));
      return [
        row < minRow ? row : minRow,
        row > maxRow ? row : maxRow,
        col < minCol ? col : minCol,
        col > maxCol ? col : maxCol,
      ];
    },
    [
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]
  );

  const size = (bounds[1] - bounds[0] + 1) * (bounds[3] - bounds[2] + 1);

  return size - elves.size;
};

const part2 = (initElves) => {
  const elves = new Set([...initElves]);
  const directions = DIR.map((d) => [...d]);

  let round = 1;
  while (simulateRound(elves, directions)) {
    round++;
  }

  return round;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
