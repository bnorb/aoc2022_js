const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const [initState, moves] = data.split("\n\n").map((d) => d.split("\n"));

const columns = initState[initState.length - 1].trim().split(/\s+/).length;
const stacks = new Array(columns).fill(0).map((_) => []);

for (let i = initState.length - 2; i >= 0; i--) {
  const row = initState[i];
  for (let j = 1, s = 0; j < row.length; j += 4, s++) {
    const item = row.charAt(j);
    if (item == " ") {
      continue;
    }

    stacks[s].push(item);
  }
}

moves
  .map((move) => {
    const [_, count, __, from, ___, to] = move.split(" ");
    return [parseInt(count, 10), parseInt(from, 10) - 1, parseInt(to, 10) - 1];
  })
  .forEach(([count, from, to]) => {
    stacks[to].push(...stacks[from].splice(-1 * count, count));
  });

const top = stacks.map((s) => s.pop()).join("");

console.log(top);
