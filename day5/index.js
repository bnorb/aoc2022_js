const { readFileSync } = require("fs");

const parseInput = (input) => {
  const [initState, moves] = input.split("\n\n").map((d) => d.split("\n"));

  const columns = initState[initState.length - 1].trim().split(/\s+/).length;
  const stacks = new Array(columns).fill(0).map((_) => []);

  for (let i = initState.length - 2; i >= 0; i--) {
    const row = initState[i];
    for (let j = 1, s = 0; j < row.length; j += 4, s++) {
      const item = row.charAt(j);
      if (item == " ") {
        continue;
      }

      stacks[s].push(item);
    }
  }

  return [
    stacks,
    moves.map((move) => {
      const [_, count, __, from, ___, to] = move.split(" ");
      return [
        parseInt(count, 10),
        parseInt(from, 10) - 1,
        parseInt(to, 10) - 1,
      ];
    }),
  ];
};

const part1 = ([initStacks, moves]) => {
  stacks = initStacks.map((s) => [...s]);
  moves.forEach(([count, from, to]) => {
    for (let i = 0; i < count; i++) {
      stacks[to].push(stacks[from].pop());
    }
  });

  return stacks.map((s) => s.pop()).join("");
};

const part2 = ([initStacks, moves]) => {
  stacks = initStacks.map((s) => [...s]);
  moves.forEach(([count, from, to]) => {
    stacks[to].push(...stacks[from].splice(-1 * count, count));
  });

  return stacks.map((s) => s.pop()).join("");
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
