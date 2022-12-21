const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const monkeyMap = data
  .split("\n")
  .map((line) => line.split(": "))
  .reduce(
    (m, [name, op]) => ({
      ...m,
      [name]: op.split(" ").length == 1 ? parseInt(op, 10) : op.split(" "),
    }),
    {}
  );

const getVal = (node) => {
  if (Number.isInteger(monkeyMap[node])) {
    return monkeyMap[node];
  }

  let [left, operand, right] = monkeyMap[node];
  left = getVal(left);
  right = getVal(right);

  return eval(`${left} ${operand} ${right}`);
};

console.log(getVal("root"));
