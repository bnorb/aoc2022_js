class Monkey {
  _items = [];
  _operation;
  _inspected = 0;
  _noWorries;
  divisor;
  mod;

  receiveStuff(item) {
    this._items.push(item);
  }

  *throwStuff() {
    this._inspected += this._items.length;
    let item = this._items.shift();
    while (item != undefined) {
      let worry = this._operation(item);
      if (this._noWorries) {
        worry = Math.floor(worry / this._noWorries);
      }

      if (this.mod) {
        worry = worry % this.mod;
      }

      yield [worry, this.test(worry)];
      item = this._items.shift();
    }
  }

  static parseMonkey(monkeyString, noWorries) {
    const monkey = new Monkey();

    monkey._noWorries = noWorries;

    const data = monkeyString
      .split("\n")
      .slice(1)
      .map((line) => line.split(": ")[1]);

    monkey._items.push(...data[0].split(", ").map((d) => parseInt(d, 10)));

    const op = `n${data[1].substr(3)}`;
    monkey._operation = (old) => {
      let n;
      eval(op);
      return n;
    };

    const t = parseInt(data[2].split(" ")[2], 10);
    const tt = parseInt(data[3].split(" ")[3], 10);
    const tf = parseInt(data[4].split(" ")[3], 10);

    monkey.divisor = t;
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
