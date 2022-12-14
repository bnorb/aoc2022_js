const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const formations = data
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

let BOTTOM = Number.MIN_SAFE_INTEGER;

formations.forEach((f) =>
  f.forEach(([x, y]) => {
    if (y > BOTTOM) BOTTOM = y;
  })
);

BOTTOM += 2;

const stepSand = ([x, y]) => {
  if (y + 1 == BOTTOM) {
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
    break;
  }

  filled.add(`${x}_${y}`);
}

console.log(c);
