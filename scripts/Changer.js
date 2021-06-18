class Changer {
  lastWordIndices = [];
  currentWordIndex;
  currentWordTime;
  timeSinceWordChange;
  currentColor;
  nextColor;
  currentPos;
  nextPos;

  performWordChange() {
    const newWordIndex = this.computenewWordIndex();
    const newWordTime = this.computenewWordTime();
    const newColor = new Rgb();

    this.applyChange(newWordIndex, newWordTime, newColor);
  }

  applyChange(newWordIndex, newWordTime, newColor) {
    this.currentWordIndex = newWordIndex;
    this.currentWordTime = newWordTime;
    this.timeSinceWordChange = 0;

    this.currentColor = this.nextColor || new Rgb();
    this.nextColor = newColor;

    this.lastWordIndices.push(newWordIndex);

    if (this.lastWordIndices.length > avoidTerms) {
      this.lastWordIndices.shift();
    }

    document.getElementById("word").innerText = terms[this.currentWordIndex];
    document.body.style.color = this.currentColor.textColor().toString();

    console.log({
      ...this,
      currentColor: this.currentColor.toString(),
      nextColor: this.nextColor.toString(),
    });
  }

  computenewWordIndex() {
    let newWordIndex;

    do {
      newWordIndex = randomInt(0, terms.length);
    } while (
      this.lastWordIndices.indexOf(newWordIndex) !== -1 &&
      terms.length > this.lastWordIndices.length
    );

    return newWordIndex;
  }

  computenewWordTime() {
    if (!useNormalDistribution) {
      return 1000 * Math.abs(randomFloat(delayLow, delayHigh));
    }

    const stdDv = (1000 * (delayHigh - delayLow)) / 2;
    const mean = (1000 * (delayLow + delayHigh)) / 2;

    return Math.abs(stdDv * normalDistribution() + mean);
  }

  applyFadingColors() {
    if (this.timeSinceWordChange < (1 - fadeWindow) * this.currentWordTime) {
      return this.applyColor(this.currentColor);
    }

    const fadeTimeSoFar =
      this.timeSinceWordChange - (1 - fadeWindow) * this.currentWordTime;
    const fadeTimeTotal = fadeWindow * this.currentWordTime;
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
    this.performWordChange();

    setInterval(() => {
      this.timeSinceWordChange += UPDATE_RATE;

      this.applyFadingColors();

      if (this.timeSinceWordChange >= this.currentWordTime) {
        this.performWordChange();
      }
    }, UPDATE_RATE);
  }
}

new Changer().run();
