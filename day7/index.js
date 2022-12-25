const { readFileSync } = require("fs");
const { Dir } = require("./dir");

const parseInput = (input) => {
  const root = new Dir(null, "/");
  let currNode = root;

  const changeDir = (dir) => {
    if (dir == "/") return root;
    if (dir == "..") return currNode.getParent();
    return currNode.getChild(dir);
  };

  input
    .split("\n")
    .map((l) => l.split(" "))
    .forEach(([first, ...rest]) => {
      if (first == "$") {
        if (rest[0] == "cd") {
          currNode = changeDir(rest[1]);
        }
      } else if (first == "dir") {
        currNode.addDir(rest[0]);
      } else {
        currNode.addFile(parseInt(first, 10), rest[0]);
      }
    });

  return root;
};

const getDirSizes = (node, sizes) => {
  const children = node.getChildren();

  if (children.size == 0) {
    sizes.push(node.getSize());
    return node.getSize();
  }

  let size = node.getSize();

  for (const [_, child] of children) {
    size += getDirSizes(child, sizes);
  }

  sizes.push(size);
  return size;
};

const part1 = (root) => {
  const sizes = [];
  getDirSizes(root, sizes);

  return sizes.filter((v) => v <= 100000).reduce((s, v) => s + v, 0);
};

const part2 = (root) => {
  const sizes = [];
  const rootSize = getDirSizes(root, sizes);

  const needed = 30000000 - (70000000 - rootSize);

  return sizes.reduce(
    (min, v) => (v >= needed && v < min ? v : min),
    Number.MAX_SAFE_INTEGER
  );
};

const input = readFileSync(`${__dirname}/input.txt`, "utf8");
const data = parseInput(input);

console.log("Part 1:", part1(data));
console.log("Part 2:", part2(data));
