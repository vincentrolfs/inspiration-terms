class Changer {
  lastIndices = [];
  currentIndex;
  currentDelay;
  timeSinceChange;
  currentColor;
  nextColor;

  performChange() {
    const newIndex = this.computeNewIndex();
    const newDelay = this.computeNewDelay();
    const newColor = new Rgb();

    this.applyChange(newIndex, newDelay, newColor);
  }

  applyChange(newIndex, newDelay, newColor) {
    this.currentIndex = newIndex;
    this.currentDelay = newDelay;
    this.timeSinceChange = 0;
    this.currentColor = this.nextColor || new Rgb();
    this.nextColor = newColor;

    this.lastIndices.push(newIndex);

    if (this.lastIndices.length > avoidTerms) {
      this.lastIndices.shift();
    }

    document.getElementById("word").innerText = terms[this.currentIndex];
    document.body.style.color = this.currentColor.textColor().toString();

    console.log({
      ...this,
      currentColor: this.currentColor.toString(),
      nextColor: this.nextColor.toString(),
    });
  }

  computeNewIndex() {
    let newIndex;

    console.log("avoid", this.lastIndices);

    do {
      newIndex = randomInt(0, terms.length);
    } while (
      this.lastIndices.indexOf(newIndex) !== -1 &&
      terms.length > this.lastIndices.length
    );

    return newIndex;
  }

  computeNewDelay() {
    if (!useNormalDistribution) {
      return 1000 * Math.abs(randomFloat(delayLow, delayHigh));
    }

    const stdDv = (1000 * (delayHigh - delayLow)) / 2;
    const mean = (1000 * (delayLow + delayHigh)) / 2;

    return Math.abs(stdDv * normalDistribution() + mean);
  }

  applyFadingColors() {
    if (this.timeSinceChange < (1 - fadeWindow) * this.currentDelay) {
      return this.applyColor(this.currentColor);
    }

    const fadeTimeSoFar =
      this.timeSinceChange - (1 - fadeWindow) * this.currentDelay;
    const fadeTimeTotal = fadeWindow * this.currentDelay;
    const effectiveColor = this.currentColor.interpolate(
      this.nextColor,
      fadeTimeSoFar / fadeTimeTotal
    );

    this.applyColor(effectiveColor);
  }

  applyColor(color) {
    document.getElementById("main").style.backgroundColor = color.toString();
  }

  run() {
    this.performChange();

    setInterval(() => {
      this.timeSinceChange += UPDATE_RATE;

      this.applyFadingColors();

      if (this.timeSinceChange >= this.currentDelay) {
        this.performChange();
      }
    }, UPDATE_RATE);
  }
}

new Changer().run();
