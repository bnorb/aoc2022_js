class Dir {
  #parent = null;
  #children = new Map();
  #fileSet = new Set();
  #size = 0;

  constructor(parent) {
    this.#parent = parent;
  }

  addFile(size, fileName) {
    if (!this.#fileSet.has(fileName)) {
      this.#size += size;
      this.#fileSet.add(fileName);
    }
  }

  addDir(dirName) {
    if (!this.#children.has(dirName)) {
      this.#children.set(dirName, new Dir(this));
    }
  }

  getParent() {
    return this.#parent;
  }

  getChildren() {
    return this.#children;
  }

  getSize() {
    return this.#size;
  }

  getChild(dir) {
    this.addDir(dir);
    return this.#children.get(dir);
  }
}

exports.Dir = Dir;
