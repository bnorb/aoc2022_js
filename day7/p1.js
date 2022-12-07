const fs = require("fs");

const { Dir } = require("./tree.js");

const data = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const root = new Dir(null, "/");
let currNode = root;

const changeDir = (dir) => {
  if (dir == "/") {
    currNode = root;
  } else if (dir == "..") {
    currNode = currNode.GetParent();
  } else {
    currNode = currNode.GetChild(dir);
  }
};

data
  .split("\n")
  .map((l) => l.split(" "))
  .forEach(([first, ...rest]) => {
    if (first == "$") {
      if (rest[0] == "cd") {
        changeDir(rest[1]);
      }
    } else {
      if (first == "dir") {
        currNode.AddDir(rest[0]);
      } else {
        currNode.AddFile(parseInt(first, 10), rest[0]);
      }
    }
  });

const getSize = (node, sizes) => {
  const children = node.GetChildren();
  if (children.size == 0) {
    sizes.push(node.GetSize());
    return node.GetSize();
  }

  let size = node.GetSize();

  for (const [_, child] of children) {
    size += getSize(child, sizes);
  }

  sizes.push(size);
  return size;
};

const sizes = [];
getSize(root, sizes);

const sum = sizes.filter((v) => v <= 100000).reduce((s, v) => s + v, 0);

console.log(sum);
