const {
  greetRPC,
  greetManyTimesServer,
  greetManyTimesClient,
  greetBidi,
} = require("./greet");
const {
  sumRPC,
  primeNumberDecomposition,
  avgRPC,
  maxRPC,
  squareRoot,
} = require("./calculator");

module.exports = {
  greet: greetRPC,
  greetManyTimesServer: greetManyTimesServer,
  greetManyTimesClient: greetManyTimesClient,
  greetBidi: greetBidi,
  sum: sumRPC,
  primeNumberDecomposition: primeNumberDecomposition,
  avg: avgRPC,
  max: maxRPC,
  squareRoot: squareRoot,
};
