const { readFileSync } = require("fs");

const parseInput = (input) => {
  const graph = {};
  const rates = {};
  const valveGraph = {};

  input
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

  return [valveGraph, rates];
};

const findMaxReleased = (
  valveGraph,
  rates,
  T,
  valveCount,
  visited = new Set()
) => {
  const hashValveSet = (valveSet) => {
    const v = [...valveSet];
    v.sort();
    return v.join("_");
  };

  let maxReleased = 0;
  const allFullReleases = {};

  const dfs = (
    curr = "START",
    timeLeft = T,
    pressureReleased = 0,
    openValves = visited.size
  ) => {
    if (curr != "START") {
      pressureReleased += timeLeft * rates[curr];
      openValves++;
    }

    if (timeLeft == 0 || openValves == valveCount) {
      if (pressureReleased > maxReleased) {
        maxReleased = pressureReleased;
      }

      if (openValves == valveCount) {
        const h = hashValveSet(visited);
        if (pressureReleased > (allFullReleases[h] || 0))
          allFullReleases[h] = pressureReleased;
      }

      return;
    }

    for (const [next, timeDistance] of valveGraph[curr]) {
      if (visited.has(next)) continue;
      if (timeLeft < timeDistance) continue;

      visited.add(next);
      dfs(next, timeLeft - timeDistance, pressureReleased, openValves);
      visited.delete(next);
    }
  };

  dfs();

  return [maxReleased, allFullReleases];
};

const part1 = ([valveGraph, rates]) => {
  const [maxReleased] = findMaxReleased(
    valveGraph,
    rates,
    30,
    Object.keys(valveGraph).length - 1
  );

  return maxReleased;
};

const part2 = ([valveGraph, rates]) => {
  const maxValveCount = Object.keys(valveGraph).length - 1;
  let maxReleases = {};
  for (let valveCount = 1; valveCount <= maxValveCount; valveCount++) {
    const [_, maxes] = findMaxReleased(valveGraph, rates, 26, valveCount);
    maxReleases = { ...maxReleases, ...maxes };
  }

  const entries = Object.entries(maxReleases);
  entries.sort((a, b) => b[1] - a[1]);

  const allValves = new Set(Object.keys(valveGraph));
  allValves.delete("START");

  let max = 0;
  for (let i = 0; i < entries.length; i++) {
    const ownValves = new Set(entries[i][0].split("_"));
    const ownReleased = entries[i][1];

    for (let j = i + 1; j < entries.length; j++) {
      const eleReleased = entries[j][1];

      if (entries[j][0].split("_").every((v) => !ownValves.has(v))) {
        max = Math.max(max, ownReleased + eleReleased);
        break;
      }
    }
  }

  return max;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
