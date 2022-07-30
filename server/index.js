const grpc = require("grpc");
const grpcHandlers = require("./grpc-handlers");

const LoadGreetPackageDefiniton = require("./../utils/loadGreetPackageDefiniton");
const LoadCalculatorPackageDefiniton = require("../utils/loadCalculatorPackageDefinition");

function main() {
  var server = new grpc.Server();

  const greetPackageDefiniton = LoadGreetPackageDefiniton();

  const calculatorPackageDefiniton = LoadCalculatorPackageDefiniton();

  /* -------------------------------- greet rpc ------------------------------- */
  server.addService(
    greetPackageDefiniton.GreetingService.service,
    grpcHandlers
  );

  /* -------------------------------- calculator rpc ------------------------------- */
  server.addService(
    calculatorPackageDefiniton.CalculatorService.service,
    grpcHandlers
  );

  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("server running on port 50051");
}

main();
