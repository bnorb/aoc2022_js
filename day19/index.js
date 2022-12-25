const { readFileSync } = require("fs");

const parseInput = (input) =>
  input
    .split("\n")
    .map((line) => line.split(": ")[1])
    .map((line) => {
      const [oreRobot, clayRobot, obsRobot, geodeRobot] = line
        .split(". ")
        .map((l) => l.split(" "));
      const c = [
        [parseInt(oreRobot[4], 10), 0, 0],
        [parseInt(clayRobot[4], 10), 0, 0],
        [parseInt(obsRobot[4], 10), parseInt(obsRobot[7], 10), 0],
        [parseInt(geodeRobot[4], 10), 0, parseInt(geodeRobot[7], 10)],
      ];

      return c;
    })
    .map((robotCosts) => [
      robotCosts,
      robotCosts.reduce(
        ([oreMax, clayMax, obsMax], [ore, clay, obs]) => [
          ore > oreMax ? ore : oreMax,
          clay > clayMax ? clay : clayMax,
          obs > obsMax ? obs : obsMax,
        ],
        [0, 0, 0]
      ),
    ]);

const ORD = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

const getPossibleBuilds = (resources, robotCosts) => {
  return [
    ...robotCosts
      .map((rc, i) => [rc, i])
      .filter(([cost]) => cost.every((c, i) => c <= resources[i]))
      .map(([_, i]) => i)
      .reverse(),
    -1,
  ];
};

const seenBetterState = (state, stateMap) => {
  const keys = [
    `res_${state[0].join("_")}`,
    `rob_${state[1].join("_")}`,
    state[2][0],
  ];

  for (const [i, j, k] of ORD) {
    if (!stateMap.has(keys[i])) continue;
    if (!stateMap.get(keys[i]).has(keys[j])) continue;

    const found = stateMap.get(keys[i]).get(keys[j]);
    if (found.every((f, i) => state[k][i] <= f)) {
      return true;
    }
  }

  return false;
};

const addState = (state, stateMap) => {
  const keys = [
    `res_${state[0].join("_")}`,
    `rob_${state[1].join("_")}`,
    state[2][0],
  ];

  for (const [i, j, k] of ORD) {
    if (!stateMap.has(keys[i])) stateMap.set(keys[i], new Map());

    stateMap.get(keys[i]).set(keys[j], state[k]);
  }
};

const simulateBlueprint = (
  stateMap,
  robotCosts,
  maxCosts,
  max,
  timeLeft,
  resources = [0, 0, 0, 0],
  robots = [1, 0, 0, 0]
) => {
  if (timeLeft == 0) {
    if (resources[3] > max[0]) {
      max[0] = resources[3];
    }
    return;
  }

  let possibleBuilds = getPossibleBuilds(resources, robotCosts);

  if (possibleBuilds.includes(3)) {
    possibleBuilds = [3];
  } else {
    possibleBuilds = possibleBuilds.filter((build) => {
      if (build == -1) return true;
      return robots[build] < maxCosts[build];
    });
  }

  robots.forEach((count, i) => {
    resources[i] += count;
  });

  for (const build of possibleBuilds) {
    if (build > -1) {
      robots[build]++;
      robotCosts[build].forEach((c, i) => (resources[i] -= c));
    }

    if (!seenBetterState([resources, robots, [timeLeft - 1]], stateMap)) {
      addState([[...resources], [...robots], [timeLeft - 1]], stateMap);
      simulateBlueprint(
        stateMap,
        robotCosts,
        maxCosts,
        max,
        timeLeft - 1,
        resources,
        robots
      );
    }

    if (build > -1) {
      robots[build]--;
      robotCosts[build].forEach((c, i) => (resources[i] += c));
    }
  }

  robots.forEach((count, i) => {
    resources[i] -= count;
  });
};

const findMaxes = (costs, T) => {
  const maxes = [];

  for (const [robotCosts, maxCosts] of costs) {
    const stateMap = new Map();
    const max = [0];
    addState([[0, 0, 0, 0], [1, 0, 0, 0], [T]], stateMap);
    simulateBlueprint(stateMap, robotCosts, maxCosts, max, T);

    maxes.push(max[0]);
  }

  return maxes;
};

const part1 = (costs) => {
  return findMaxes(costs, 24).reduce((s, m, i) => s + m * (i + 1), 0);
};

const part2 = (costs) => {
  return findMaxes(costs.slice(0, 3), 32).reduce((p, m) => p * m, 1);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
