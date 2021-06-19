const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const params = new URL(location.href).searchParams;

const terms = (params.get("terms") || "inspiration,terms").split(",");
const delayLow = parseInt(params.get("delayLow")) || 10;
const delayHigh = parseInt(params.get("delayHigh")) || delayLow;
const fadeWindow = parseFloat(params.get("fadeWindow")) || 0.1;
const avoidTerms = parseInt(params.get("avoid")) || 1;
const useNormalDistribution = null !== params.get("useNormalDistribution");

const updateRate = parseInt(params.get("updateRate")) || 10;
const movementSpeed =
  parseInt(params.get("movementSpeed")) ||
  (Math.min(WIDTH, HEIGHT) * updateRate) / 3500;
const movementEpsilon =
  parseInt(params.get("movementEpsilon")) || 1.01 * movementSpeed;

console.log({ movementSpeed, movementEpsilon });
