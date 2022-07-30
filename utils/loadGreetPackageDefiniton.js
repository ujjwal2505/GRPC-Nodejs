const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

function LoadGreetPackageDefiniton() {
  const PROTO_PATH = path.join(__dirname, "..", "protos", "greet.proto");
  const protoDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  return grpc.loadPackageDefinition(protoDefinition).greet; //.calculator coincides with package name in protoFile
}

module.exports = LoadGreetPackageDefiniton;
