const { readFileSync } = require("fs");

const parseInput = (input) => {
  const formations = input
    .split("\n")
    .map((line) =>
      line
        .split(" -> ")
        .map((coord) => coord.split(",").map((c) => parseInt(c, 10)))
    );

  const filled = new Set();

  formations.forEach((f) => {
    for (let i = 1; i < f.length; i++) {
      const [x, y] = f[i];
      const [lastX, lastY] = f[i - 1];

      if (x == lastX) {
        const [min, max] = lastY < y ? [lastY, y] : [y, lastY];
        for (let j = min; j <= max; j++) {
          filled.add(`${x}_${j}`);
        }
      } else {
        const [min, max] = lastX < x ? [lastX, x] : [x, lastX];
        for (let j = min; j <= max; j++) {
          filled.add(`${j}_${y}`);
        }
      }
    }
  });

  const bounds = [
    Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];

  formations.forEach((f) =>
    f.forEach(([x, y]) => {
      if (y > bounds[0]) bounds[0] = y;
      if (x < bounds[1]) bounds[1] = x;
      if (x > bounds[2]) bounds[2] = x;
    })
  );

  return [filled, bounds];
};

const part1 = ([filled, [bottom, left, right]]) => {
  filled = new Set([...filled]);
  const stepSand = ([x, y]) => {
    if (!filled.has(`${x}_${y + 1}`)) {
      if (y + 1 > bottom) {
        return false;
      }

      return stepSand([x, y + 1]);
    }

    if (!filled.has(`${x - 1}_${y + 1}`)) {
      if (y + 1 > bottom || x - 1 < left) {
        return false;
      }

      return stepSand([x - 1, y + 1]);
    }

    if (!filled.has(`${x + 1}_${y + 1}`)) {
      if (y + 1 > bottom || x + 1 > right) {
        return false;
      }

      return stepSand([x + 1, y + 1]);
    }

    return [x, y];
  };

  let c = 0;

  while (true) {
    const settled = stepSand([500, 0]);
    if (settled == false) {
      return c;
    }

    c++;
    filled.add(`${settled[0]}_${settled[1]}`);
  }
};

const part2 = ([filled, [bottom]]) => {
  filled = new Set([...filled]);
  bottom += 2;

  const stepSand = ([x, y]) => {
    if (y + 1 == bottom) {
      return [x, y];
    }

    if (!filled.has(`${x}_${y + 1}`)) {
      return stepSand([x, y + 1]);
    }

    if (!filled.has(`${x - 1}_${y + 1}`)) {
      return stepSand([x - 1, y + 1]);
    }

    if (!filled.has(`${x + 1}_${y + 1}`)) {
      return stepSand([x + 1, y + 1]);
    }

    return [x, y];
  };

  let c = 0;
  while (true) {
    c++;
    const [x, y] = stepSand([500, 0]);
    if (x == 500 && y == 0) {
      return c;
    }

    filled.add(`${x}_${y}`);
  }
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
