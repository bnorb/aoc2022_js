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

const T = 26;

const hashValveSet = (valveSet) => {
  const v = [...valveSet];
  v.sort();
  return v.join("_");
};

const dfs = (
  maxReleases,
  valveCount,
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
  if (timeLeft == 0) return;

  if (openValves == valveCount) {
    const h = hashValveSet(visited);
    if (pressureReleased > (maxReleases[h] || 0))
      maxReleases[h] = pressureReleased;

    return;
  }

  for (const [next, timeDistance] of valveGraph[curr]) {
    if (visited.has(next)) continue;
    if (timeLeft < timeDistance) continue;

    dfs(
      maxReleases,
      valveCount,
      next,
      timeLeft - timeDistance,
      pressureReleased,
      new Set([...visited, next]),
      openValves
    );
  }
};

// const dfs = (
//   // own
//   curr = "START",
//   timeLeft = T,
//   openValves = new Set(),
//   // elephant
//   currEle = "START",
//   timeLeftEle = T,
//   openValvesEle = new Set(),
//   // common
//   pressureReleased = 0,
//   visitedValves = new Set()
// ) => {
//   if (curr != "START" && !openValves.has(curr)) {
//     pressureReleased += timeLeft * rates[curr];
//     openValves.add(curr);
//   }

//   if (currEle != "START" && !openValvesEle.has(currEle)) {
//     pressureReleased += timeLeftEle * rates[currEle];
//     openValvesEle.add(currEle);
//   }

//   if (
//     (timeLeft <= 0 && timeLeftEle <= 0) ||
//     openValves.size + openValvesEle.size >= valveCount
//   ) {
//     if (pressureReleased > maxReleased) {
//       console.log(
//         timeLeft,
//         timeLeftEle,
//         openValves,
//         openValvesEle,
//         pressureReleased
//       );
//       maxReleased = pressureReleased;
//     }

//     return;
//   }

//   const nextMoves = [];
//   const comboTried = new Set();
//   for (const [next, timeDistance] of valveGraph[curr]) {
//     for (const [nextEle, timeDistanceEle] of valveGraph[currEle]) {
//       if (next == nextEle) continue;

//       const canMove = timeDistance <= timeLeft && !visitedValves.has(next);
//       const canMoveEle =
//         timeDistanceEle <= timeLeftEle && !visitedValves.has(nextEle);

//       if (!canMove && !canMoveEle) continue;

//       const n = canMove ? next : curr;
//       const nEle = canMoveEle ? nextEle : currEle;
//       const nTime = canMove
//         ? timeLeft - timeDistance
//         : timeLeft - timeDistanceEle;
//       const nTimeEle = canMoveEle
//         ? timeLeftEle - timeDistanceEle
//         : timeLeftEle - timeDistance;

//       const h1 = `${n}_${nTime}|${nEle}_${nTimeEle}`;
//       const h2 = `${nEle}_${nTimeEle}|${n}_${nTime}`;

//       if (comboTried.has(h1 || comboTried.has(h2))) continue;

//       comboTried.add(h1);
//       comboTried.add(h2);

//       nextMoves.push([
//         n,
//         nTime,
//         new Set(openValves),

//         nEle,
//         nTimeEle,
//         new Set(openValvesEle),

//         pressureReleased,
//         new Set([...visitedValves, next, nextEle]),
//       ]);
//     }
//   }

//   console.table(nextMoves);

//   nextMoves.forEach((m) => {
//     dfs(...m);
//   });
// };

const maxValveCount = Object.keys(valveGraph).length - 1;
const maxReleases = {};
for (let valveCount = 1; valveCount <= maxValveCount; valveCount++) {
  dfs(maxReleases, valveCount);
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
      if (max < ownReleased + eleReleased) max = ownReleased + eleReleased;
    }
  }
}

console.log(max);
