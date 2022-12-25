const { readFileSync } = require("fs");
const { Monkey } = require("./monkey");

const parseInput = (input) =>
  input.split("\n\n").map((monkeyString) => Monkey.parseMonkey(monkeyString));

const simulateRounds = (monkeys, rounds) => {
  for (let round = 0; round < rounds; round++) {
    monkeys.forEach((monkey) => {
      const thrower = monkey.throwStuff();
      let t = thrower.next();

      while (!t.done) {
        const [factors, target] = t.value;
        monkeys[target].receiveStuff(factors);
        t = thrower.next();
      }
    });
  }

  const inspections = monkeys.map((m) => m.getInspected());
  inspections.sort((a, b) => b - a);

  return inspections[0] * inspections[1];
};

const part1 = (monkeys) => {
  Monkey.setWorryReducer((worry) => Math.floor(worry / 3));
  monkeys.forEach(m => m.reset())

  return simulateRounds(monkeys, 20);
};

const part2 = (monkeys) => {
  const prod = monkeys.reduce((p, m) => p * m.getDivisor(), 1);
  Monkey.setWorryReducer((worry) => worry % prod);
  monkeys.forEach(m => m.reset())

  return simulateRounds(monkeys, 10000);
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
