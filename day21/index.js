const { readFileSync } = require("fs");

const parseInput = (input) =>
  input
    .split("\n")
    .map((line) => line.split(": "))
    .reduce(
      (m, [name, op]) => ({
        ...m,
        [name]: op.split(" ").length == 1 ? parseInt(op, 10) : op.split(" "),
      }),
      {}
    );

const part1 = (monkeyMap) => {
  const getVal = (node) => {
    if (Number.isInteger(monkeyMap[node])) {
      return monkeyMap[node];
    }

    let [left, operand, right] = monkeyMap[node];
    left = getVal(left);
    right = getVal(right);

    return eval(`${left} ${operand} ${right}`);
  };

  return getVal("root");
};

const part2 = (monkeyMap) => {
  const opInverse = {
    "-": "+",
    "+": "-",
    "*": "/",
    "/": "*",
  };

  const getVal = (node, map) => {
    if (map[node] == "x") throw "nope";

    if (!Array.isArray(map[node])) {
      return map[node];
    }

    const [leftOp, operand, rightOP] = map[node];
    const left = getVal(leftOp, map);
    const right = getVal(rightOP, map);

    map[leftOp] = left;
    map[rightOP] = right;

    const val = eval(`${left} ${operand} ${right}`);
    map[node] = val;

    return val;
  };

  const buildEquation = (node, map) => {
    if (Number.isInteger(map[node]) || node == "humn") {
      return map[node];
    }

    const [leftOp, operand, rightOP] = map[node];

    const left = buildEquation(leftOp, map);
    const right = buildEquation(rightOP, map);

    if (Number.isInteger(left) && Number.isInteger(right)) {
      return eval(`${left} ${operand} ${right}`);
    } else if (left == "x") {
      return `x=${leftEq(node, operand, right)}`;
    } else if (right == "x") {
      return `x=${rightEq(node, operand, left)}`;
    }

    if (Number.isInteger(left)) {
      return right.replace(rightOP, rightEq(node, operand, left));
    }

    return left.replace(leftOp, leftEq(node, operand, right));
  };

  const leftEq = (node, op, right) => {
    return `(${node} ${opInverse[op]} ${right})`;
  };

  const rightEq = (node, op, left) => {
    if (op == "+" || op == "*") {
      return `(${node} ${opInverse[op]} ${left})`;
    }

    return `(${left} ${op} ${node})`;
  };

  let knownVal, unkownkey;

  const root = monkeyMap["root"];

  monkeyMap = { ...monkeyMap };

  delete monkeyMap["root"];
  monkeyMap["humn"] = "x";

  try {
    knownVal = getVal(root[0], monkeyMap);
    unkownkey = root[2];
  } catch {
    knownVal = getVal(root[2], monkeyMap);
    unkownkey = root[0];
  }

  const eq = buildEquation(unkownkey, monkeyMap).replace(unkownkey, knownVal);
  const num = eval(eq);

  return num;
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
