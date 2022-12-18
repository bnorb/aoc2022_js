const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const cubes = data
  .split("\n")
  .map((line) => line.split(",").map((e) => parseInt(e, 10)));

const getSides = ([x, y, z]) => [
  `${x}_${y}_${z}_YZ`,
  `${x}_${y}_${z}_XZ`,
  `${x}_${y}_${z}_XY`,
  `${x + 1}_${y}_${z}_YZ`,
  `${x}_${y + 1}_${z}_XZ`,
  `${x}_${y}_${z + 1}_XY`,
];

const uncoveredSides = new Set();

const bounds = [
  [Number.MAX_SAFE_INTEGER, 0],
  [Number.MAX_SAFE_INTEGER, 0],
  [Number.MAX_SAFE_INTEGER, 0],
];

function* getCube([[xMin, xMax], [yMin, yMax], [zMin, zMax]]) {
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      for (let z = zMin; z <= zMax; z++) {
        yield [x, y, z];
      }
    }
  }
}

// same order as getSides!
const D = [
  [-1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

const getNext = ([x, y, z], visited) => {
  const sides = getSides([x, y, z]);
  return D.filter((_, i) => !uncoveredSides.has(sides[i]))
    .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])
    .filter((cube) => !visited.has(cube.join("_")));
};

const bfs = (
  startCube,
  visited,
  innerSides,
  [[xMin, xMax], [yMin, yMax], [zMin, zMax]]
) => {
  visited.add(startCube.join("_"));
  const q = [startCube];
  let inner = true;

  const seenSides = new Set();

  while (q.length) {
    const curr = q.shift();

    const sides = getSides(curr);
    sides
      .filter((side) => uncoveredSides.has(side))
      .forEach((side) => seenSides.add(side));

    const next = getNext(curr, visited);

    const inBoundsNext = next.filter(
      ([x, y, z]) =>
        x >= xMin &&
        x <= xMax &&
        y >= yMin &&
        y <= yMax &&
        z >= zMin &&
        z <= zMax
    );

    if (next.length > inBoundsNext.length) {
      inner = false;
    }

    inBoundsNext.forEach((cube) => {
      visited.add(cube.join("_"));
      q.push(cube);
    });
  }

  if (inner) {
    for (const side of seenSides) innerSides.add(side);
  }
};

cubes.forEach((cube) => {
  for (const c in cube) {
    if (cube[c] < bounds[c][0]) bounds[c][0] = cube[c];
    if (cube[c] > bounds[c][1]) bounds[c][1] = cube[c];
  }

  const sides = getSides(cube);
  sides.forEach((side) => {
    if (uncoveredSides.has(side)) {
      uncoveredSides.delete(side);
    } else {
      uncoveredSides.add(side);
    }
  });
});

const visited = new Set(cubes.map((cube) => cube.join("_")));
const innerSides = new Set();

const gen = getCube(bounds);
let cube = gen.next();
while (!cube.done) {
  if (!visited.has(cube.value.join("_"))) {
    bfs(cube.value, visited, innerSides, bounds);
  }

  cube = gen.next();
}

console.log(uncoveredSides.size - innerSides.size);
