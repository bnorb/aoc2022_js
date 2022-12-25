const gcd = (a, b) => {
  while (a != b) {
    if (a > b) {
      a -= b;
    } else {
      b -= a;
    }
  }

  return a;
};

exports.lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};
