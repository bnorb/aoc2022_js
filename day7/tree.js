class Dir {
  _name;
  _parent = null;
  _children = new Map();
  _fileSet = new Set();
  _size = 0;

  constructor(parent, name) {
    this._parent = parent;
    this._name = name;
  }

  AddFile(size, fileName) {
    if (!this._fileSet.has(fileName)) {
      this._size += size;
      this._fileSet.add(fileName);
    }
  }

  AddDir(dir) {
    if (!this._children.has(dir)) {
      this._children.set(dir, new Dir(this, dir));
    }
  }

  GetParent() {
    return this._parent;
  }

  GetName() {
    return this._name;
  }

  GetChildren() {
    return this._children;
  }

  GetSize() {
    return this._size;
  }

  GetChild(dir) {
    this.AddDir(dir);
    return this._children.get(dir);
  }
}

exports.Dir = Dir;
