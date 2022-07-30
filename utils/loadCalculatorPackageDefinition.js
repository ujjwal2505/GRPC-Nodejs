const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

function LoadCalculatorPackageDefiniton() {
  const PROTO_PATH = path.join(__dirname, "..", "protos", "calculator.proto");
  const protoDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  return grpc.loadPackageDefinition(protoDefinition).calculator; //.calculator coincides with package name in protoFile
}

module.exports = LoadCalculatorPackageDefiniton;
