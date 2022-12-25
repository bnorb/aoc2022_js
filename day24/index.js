const { readFileSync } = require("fs");
const { lcm } = require("./lcm");

const parseInput = (input) => {
  const map = input.split("\n").map((line) => line.split(""));
  const blizzards = new Map(
    map
      .map((row, r) =>
        row
          .map((v, c) => [`${r}_${c}`, [v]])
          .filter(([_, [v]]) => !["#", "."].includes(v))
      )
      .flat(1)
  );

  const blizMemo = {
    0: blizzards,
  };

  const startPos = [0, map[0].findIndex((v) => v == ".")];
  const endPos = [
    map.length - 1,
    map[map.length - 1].findIndex((v) => v == "."),
  ];

  const loop = lcm(map.length - 2, map[0].length - 2);

  return [map, blizMemo, startPos, endPos, loop];
};
const DIR = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [0, 0],
];

const BLIZZ_DIR = {
  ">": [0, 1],
  v: [1, 0],
  "<": [0, -1],
  "^": [-1, 0],
};

const wrap = (num, min, max) => (num < min ? max : num > max ? min : num);

const getNext = (map, row, col, blizzards) => {
  return DIR.map(([dr, dc]) => [row + dr, col + dc]).filter(
    ([r, c]) =>
      !blizzards.has(`${r}_${c}`) &&
      r >= 0 &&
      c >= 0 &&
      r < map.length &&
      c < map[0].length &&
      map[r][c] != "#"
  );
};

const moveBlizzards = (map, blizzards, period, blizMemo) => {
  if (blizMemo[period]) return blizMemo[period];

  const newBlizzards = new Map();
  for (const [h, dirs] of blizzards) {
    const coords = h.split("_").map((v) => parseInt(v, 10));

    dirs.forEach((dir) => {
      let [r, c] = coords.map((v, i) => v + BLIZZ_DIR[dir][i]);
      r = wrap(r, 1, map.length - 2);
      c = wrap(c, 1, map[0].length - 2);
      const h = `${r}_${c}`;

      if (!newBlizzards.has(h)) newBlizzards.set(h, []);
      newBlizzards.get(h).push(dir);
    });
  }

  blizMemo[period] = newBlizzards;

  return newBlizzards;
};

const bfs = (map, blizMemo, start, end, loop, prevSteps = 0) => {
  const seenStates = new Set([`${start[0]}_${start[1]}_0`]);

  const q = [[start, prevSteps, blizMemo[prevSteps]]];
  while (q.length) {
    const [[currRow, currCol], steps, blizzards] = q.shift();

    if (currRow == end[0] && currCol == end[1]) {
      return steps;
    }

    const newBliz = moveBlizzards(map, blizzards, (steps + 1) % loop, blizMemo);
    const next = getNext(map, currRow, currCol, newBliz);
    for (const [r, c] of next) {
      const h = `${r}_${c}_${(steps + 1) % loop}`;
      if (!seenStates.has(h)) {
        seenStates.add(h);

        q.push([[r, c], steps + 1, newBliz]);
      }
    }
  }
};

const part1 = ([map, blizMemo, startPos, endPos, loop]) =>
  bfs(map, blizMemo, startPos, endPos, loop);

const part2 = ([map, blizMemo, startPos, endPos, loop]) => {
  let totalSteps = bfs(map, blizMemo, startPos, endPos, loop);
  totalSteps = bfs(map, blizMemo, endPos, startPos, loop, totalSteps);
  return bfs(map, blizMemo, startPos, endPos, loop, totalSteps);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
