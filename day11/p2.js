const fs = require("fs");
const { Monkey } = require("./monkey");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const monkeys = data
  .split("\n\n")
  .map((monkeyString) => Monkey.parseMonkey(monkeyString, 0));

const prod = monkeys.reduce((p, m) => p * m.divisor, 1);
monkeys.forEach((m) => (m.mod = prod));

for (let round = 0; round < 10000; round++) {
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

monkeys.sort((a, b) => b._inspected - a._inspected);

console.log(monkeys);
const monkeyBusiness = monkeys[0]._inspected * monkeys[1]._inspected;

console.log(monkeyBusiness);
