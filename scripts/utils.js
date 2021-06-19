function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(minInclusive, maxExclusive) {
  return Math.floor(randomFloat(minInclusive, maxExclusive));
}

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function normalDistribution() {
  return (
    Math.sqrt(-2 * Math.log(1 - Math.random())) *
    Math.cos(2 * Math.PI * Math.random())
  );
}

class Rgb {
  constructor(r, g, b) {
    this.r = r ?? this.randomColor();
    this.g = g ?? this.randomColor();
    this.b = b ?? this.randomColor();
  }

  toString() {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  textColor() {
    // Calculate the perceptive luminance (aka luma) - human eye favors green color...
    const luma = (0.299 * this.r + 0.587 * this.g + 0.114 * this.b) / 255;

    return luma > 0.5 ? new Rgb(0, 0, 0) : new Rgb(255, 255, 255);
  }

  randomColor() {
    return randomFloat(0, 255);
  }

  interpolate(otherColor, strength) {
    strength = Math.max(0, Math.min(1, strength || 0));

    const r = strength * otherColor.r + (1 - strength) * this.r;
    const g = strength * otherColor.g + (1 - strength) * this.g;
    const b = strength * otherColor.b + (1 - strength) * this.b;

    return new Rgb(r, g, b);
  }
}

class Vector {
  constructor(top, left) {
    this.top = top ?? randomFloat(0, HEIGHT);
    this.left = left ?? randomFloat(0, WIDTH);
  }

  norm() {
    return Math.sqrt(this.top ** 2 + this.left ** 2);
  }

  mult(float) {
    return new Vector(this.top * float, this.left * float);
  }

  add(anotherVec) {
    return new Vector(this.top + anotherVec.top, this.left + anotherVec.left);
  }

  connection(anotherVec) {
    return new Vector(anotherVec.top - this.top, anotherVec.left - this.left);
  }

  distance(anotherVec) {
    return this.connection(anotherVec).norm();
  }

  move(destinationVec) {
    const conn = this.connection(destinationVec);
    const connNorm = conn.norm();

    if (connNorm === 0) {
      return this;
    }

    const connScaled = conn.mult(movementSpeed / conn.norm());

    return this.add(connScaled);
  }
}
