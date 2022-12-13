const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const packets = data
  .split("\n\n")
  .flatMap((pair) => pair.split("\n").map((packet) => eval(packet)));

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

packets.push([[2]], [[6]]);

packets.sort(comparePacketPair);

const i1 = packets.findIndex((p) => JSON.stringify(p) == "[[2]]") + 1;
const i2 = packets.findIndex((p) => JSON.stringify(p) == "[[6]]") + 1;

console.log(i1 * i2);
