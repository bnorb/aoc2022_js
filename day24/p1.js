const fs = require("fs");
const { lcm } = require("./lcm");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const map = data.split("\n").map((line) => line.split(""));

const blizzards = new Map(
  map
    .map((row, r) =>
      row
        .map((v, c) => [`${r}_${c}`, [v]])
        .filter(([_, [v]]) => !["#", "."].includes(v))
    )
    .flat(1)
);

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

const getNext = (row, col, blizzards) => {
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

const blizMemo = {
  0: blizzards,
};

const moveBlizzards = (blizzards, period) => {
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

const startPos = [0, map[0].findIndex((v) => v == ".")];
const endPos = [map.length - 1, map[map.length - 1].findIndex((v) => v == ".")];

const loop = lcm(map.length - 2, map[0].length - 2);

const bfs = (start, initBliz) => {
  const seenStates = new Set([`${startPos[0]}_${startPos[1]}_0`]);

  const q = [[start, 0, initBliz]];
  while (q.length) {
    const [[currRow, currCol], steps, blizzards] = q.shift();

    if (currRow == endPos[0] && currCol == endPos[1]) {
      return steps;
    }

    const newBliz = moveBlizzards(blizzards, (steps + 1) % loop);
    const next = getNext(currRow, currCol, newBliz);
    for (const [r, c] of next) {
      const h = `${r}_${c}_${(steps + 1) % loop}`;
      if (!seenStates.has(h)) {
        seenStates.add(h);

        q.push([[r, c], steps + 1, newBliz]);
      }
    }
  }
};

console.log(bfs(startPos, blizzards));
