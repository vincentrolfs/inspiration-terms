const UPDATE_RATE = 50;

const params = new URL(location.href).searchParams;

const terms = (params.get("terms") || "inspiration,terms").split(",");
const delayLow = parseInt(params.get("delayLow")) || 10;
const delayHigh = parseInt(params.get("delayHigh")) || delayLow;
const fadeWindow = parseFloat(params.get("fadeWindow")) || 0.1;
const avoidTerms = parseInt(params.get("avoid")) || 1;
const useNormalDistribution = null !== params.get("useNormalDistribution");

const width = window.innerWidth;
const height = document.body.innerHeight;
