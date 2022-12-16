const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const graph = {};
const rates = {};
const valveGraph = {};

data
  .split("\n")
  .map((line) => line.split("; "))
  .forEach(([rateStr, tunnelStr]) => {
    const rate = parseInt(rateStr.split("=")[1], 10);
    const room = rateStr.split(" ")[1];
    const destinations = tunnelStr.split(/valves? /)[1].split(", ");

    graph[room] = new Set(destinations);

    if (rate > 0) {
      valveGraph[room] = [];
      rates[room] = rate;
    }
  });

Object.keys(valveGraph).forEach(
  (k) =>
    (valveGraph[k] = Object.keys(valveGraph)
      .filter((k2) => k2 != k)
      .reduce((m, k) => ({ ...m, [k]: -1 }), {}))
);

valveGraph["START"] = Object.keys(valveGraph).reduce(
  (m, k) => ({ ...m, [k]: -1 }),
  {}
);

const findShortest = (start, end) => {
  const q = [[start, 0]];
  const visited = new Set([start]);

  while (q.length) {
    const [curr, count] = q.shift();
    if (curr == end) {
      return count;
    }

    graph[curr].forEach((next) => {
      if (!visited.has(next)) {
        visited.add(next);
        q.push([next, count + 1]);
      }
    });
  }
};

for (const [start, destinations] of Object.entries(valveGraph)) {
  for (const [end, distance] of Object.entries(destinations)) {
    if (distance == -1) {
      const shortest = findShortest(start == "START" ? "AA" : start, end) + 1;
      valveGraph[start][end] = shortest;
      if (start != "START") valveGraph[end][start] = shortest;
    }
  }
}

for (const k of Object.keys(valveGraph)) {
  valveGraph[k] = Object.entries(valveGraph[k]);
}

const T = 30;
let maxReleased = 0;
const valveCount = Object.keys(valveGraph).length - 1;

const dfs = (
  curr = "START",
  timeLeft = T,
  pressureReleased = 0,
  visited = new Set(),
  openValves = 0
) => {
  if (curr != "START") {
    pressureReleased += timeLeft * rates[curr];
    openValves++;
  }

  if (timeLeft == 0 || openValves == valveCount) {
    if (pressureReleased > maxReleased) {
      maxReleased = pressureReleased;
    }

    return;
  }

  for (const [next, timeDistance] of valveGraph[curr]) {
    if (visited.has(next)) continue;
    if (timeLeft < timeDistance) continue;

    dfs(
      next,
      timeLeft - timeDistance,
      pressureReleased,
      new Set([...visited, next]),
      openValves
    );
  }
};

dfs();

console.log(maxReleased);
