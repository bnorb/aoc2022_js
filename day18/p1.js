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

cubes.forEach((cube) => {
  const sides = getSides(cube);
  sides.forEach((side) => {
    if (uncoveredSides.has(side)) {
      uncoveredSides.delete(side);
    } else {
      uncoveredSides.add(side);
    }
  });
});

console.log(uncoveredSides.size);
