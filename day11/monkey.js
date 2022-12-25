class Monkey {
  #items = [];
  #initialItems = [];
  #inspected = 0;
  #operation;
  #divisor;

  static #reduceWorry;

  receiveStuff(item) {
    this.#items.push(item);
  }

  getDivisor() {
    return this.#divisor;
  }

  getInspected() {
    return this.#inspected;
  }

  reset() {
    this.#items = [...this.#initialItems];
    this.#inspected = 0;
  }

  *throwStuff() {
    this.#inspected += this.#items.length;
    let item = this.#items.shift();
    while (item != undefined) {
      let worry = this.#operation(item);

      worry = Monkey.#reduceWorry(worry);

      yield [worry, this.test(worry)];
      item = this.#items.shift();
    }
  }

  static setWorryReducer(reducer) {
    Monkey.#reduceWorry = reducer;
  }

  static parseMonkey(monkeyString) {
    const monkey = new Monkey();

    const data = monkeyString
      .split("\n")
      .slice(1)
      .map((line) => line.split(": ")[1]);

    monkey.#initialItems.push(
      ...data[0].split(", ").map((d) => parseInt(d, 10))
    );
    monkey.#items = [...monkey.#initialItems];

    const op = `n${data[1].substr(3)}`;
    monkey.#operation = (old) => {
      // old used in eval
      let n;
      eval(op);
      return n;
    };

    const t = parseInt(data[2].split(" ")[2], 10);
    const tt = parseInt(data[3].split(" ")[3], 10);
    const tf = parseInt(data[4].split(" ")[3], 10);

    monkey.#divisor = t;
    monkey.test = (level) => {
      if (level % t == 0) {
        return tt;
      }

      return tf;
    };

    return monkey;
  }
}

exports.Monkey = Monkey;
