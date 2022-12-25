const { readFileSync } = require("fs");

const parseInput = (input) => input.split("\n").map((line) => line.split(""));

const DIR = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const getElevation = (c) => {
  if (c == "S") return "a".charCodeAt(0);
  if (c == "E") return "z".charCodeAt(0);
  return c.charCodeAt(0);
};

const getNext = (map, row, col, visited, backwards) => {
  const eligible = DIR.map(([dr, dc]) => [row + dr, col + dc]).filter(
    ([nr, nc]) =>
      !visited.has(`${nr}_${nc}`) &&
      nr < map.length &&
      nr >= 0 &&
      nc < map[0].length &&
      nc >= 0
  );

  const currElevation = getElevation(map[row][col]);

  if (backwards)
    return eligible.filter(
      ([nr, nc]) => getElevation(map[nr][nc]) - currElevation >= -1
    );

  return eligible.filter(
    ([nr, nc]) => getElevation(map[nr][nc]) - currElevation <= 1
  );
};

const getStartCoords = (map, start) =>
  map.reduce((coord, row, r) => {
    const c = row.reduce(
      (coord, val, c) => (val == start ? [r, c] : coord),
      -1
    );

    if (c != -1) {
      return c;
    }

    return coord;
  }, -1);

const findShortest = (map, start, end, backwards = false) => {
  const s = getStartCoords(map, start);
  const queue = [[s, 0]];
  const visited = new Set([`${s[0]}_${s[1]}`]);

  while (queue.length) {
    const [[row, col], steps] = queue.shift();
    if (map[row][col] == end) {
      return steps;
    }

    getNext(map, row, col, visited, backwards).forEach(([nr, nc]) => {
      visited.add(`${nr}_${nc}`);
      queue.push([[nr, nc], steps + 1]);
    });
  }
};

const part1 = (map) => findShortest(map, "S", "E");

const part2 = (map) => findShortest(map, "E", "a", true);

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
