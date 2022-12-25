class Node {
  val;
  next;
  prev;
  ogNext;
  ogPrev;

  constructor(val) {
    this.val = val;
  }
}

class CircularList {
  #first;
  #zero;
  #size = 0;

  constructor(values) {
    this.#size = values.length;

    if (!this.#first) {
      const f = values.shift();
      this.#first = new Node(f);
      if (f == 0) this.#zero = this.#first;
    }

    let curr = this.#first;

    for (const v of values) {
      const n = new Node(v);
      n.prev = curr;
      n.ogPrev = curr;
      curr.next = n;
      curr.ogNext = n;
      curr = n;

      if (v == 0) this.#zero = n;
    }

    curr.next = this.#first;
    curr.ogNext = this.#first;

    this.#first.prev = curr;
    this.#first.ogPrev = curr;
  }

  printAll() {
    let curr = this.#first;
    do {
      console.log(curr.val);
      curr = curr.next;
    } while (curr !== this.#first);
  }

  moveAll() {
    let curr = this.#first;
    do {
      this.move(curr);
      curr = curr.ogNext;
    } while (curr !== this.#first);
  }

  #moveForward(node, lim) {
    let target = node;

    for (let i = 0; i < lim; i++) {
      target = target.next;
    }

    const nodeNext = node.next;
    const nodePrev = node.prev;

    node.next = target.next;
    node.prev = target;
    target.next.prev = node;
    target.next = node;
    nodePrev.next = nodeNext;
    nodeNext.prev = nodePrev;
  }

  #moveBackward(node, lim) {
    let target = node;

    for (let i = 0; i < lim; i++) {
      target = target.prev;
    }

    if (node === target) {
      return;
    }

    const nodeNext = node.next;
    const nodePrev = node.prev;

    node.next = target;
    node.prev = target.prev;
    target.prev.next = node;
    target.prev = node;
    nodePrev.next = nodeNext;
    nodeNext.prev = nodePrev;
  }

  move(node) {
    const lim = Math.abs(node.val) % (this.#size - 1);
    if (lim == 0) return;

    if (node.val < 0) {
      this.#moveBackward(node, lim);
    } else {
      this.#moveForward(node, lim);
    }
  }

  findCoord(coord) {
    const lim = coord % (this.#size - 1);
    let curr = this.#zero;

    for (let i = 0; i < lim; i++) {
      curr = curr.next;
    }

    return curr.val;
  }
}

exports.CircularList = CircularList;
