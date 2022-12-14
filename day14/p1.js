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

let LEFT = Number.MAX_SAFE_INTEGER;
let RIGHT = Number.MIN_SAFE_INTEGER;
let BOTTOM = Number.MIN_SAFE_INTEGER;

formations.forEach((f) =>
  f.forEach(([x, y]) => {
    if (x < LEFT) LEFT = x;
    if (x > RIGHT) RIGHT = x;
    if (y > BOTTOM) BOTTOM = y;
  })
);

const stepSand = ([x, y]) => {
  if (!filled.has(`${x}_${y + 1}`)) {
    if (y + 1 > BOTTOM) {
      return false;
    }

    return stepSand([x, y + 1]);
  }

  if (!filled.has(`${x - 1}_${y + 1}`)) {
    if (y + 1 > BOTTOM || x - 1 < LEFT) {
      return false;
    }

    return stepSand([x - 1, y + 1]);
  }

  if (!filled.has(`${x + 1}_${y + 1}`)) {
    if (y + 1 > BOTTOM || x + 1 > RIGHT) {
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
    break;
  }

  c++;
  filled.add(`${settled[0]}_${settled[1]}`);
}

console.log(c);
