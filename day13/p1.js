const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const pairs = data
  .split("\n\n")
  .map((pair) => pair.split("\n").map((packet) => eval(packet)));

const comparePacketPair = (leftItems, rightItems) => {
  for (
    let leftIndex = 0, rightIndex = 0;
    leftIndex < leftItems.length && rightIndex < rightItems.length;
    leftIndex++, rightIndex++
  ) {
    let left = leftItems[leftIndex];
    let right = rightItems[rightIndex];

    if (Number.isInteger(left) && Number.isInteger(right)) {
      if (left - right != 0) {
        return left - right;
      }

      continue;
    } else if (Number.isInteger(left)) {
      left = [left];
    } else if (Number.isInteger(right)) {
      right = [right];
    }

    const ic = comparePacketPair(left, right);
    if (ic != 0) {
      return ic;
    }
  }

  return leftItems.length - rightItems.length;
};

const sum = pairs.reduce(
  (s, [left, right], index) =>
    comparePacketPair(left, right) < 0 ? s + index + 1 : s,
  0
);

console.log(sum);
