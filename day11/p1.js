const fs = require("fs");
const { Monkey } = require("./monkey");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const monkeys = data
  .split("\n\n")
  .map((monkeyString) => Monkey.parseMonkey(monkeyString, 3));

for (let round = 0; round < 20; round++) {
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

const monkeyBusiness = monkeys[0]._inspected * monkeys[1]._inspected;

console.log(monkeyBusiness);
