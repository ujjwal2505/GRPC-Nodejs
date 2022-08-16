const grpc = require("grpc");

/* --------------------------------- Uniary --------------------------------- */
function sumRPC(call, callback) {
  console.log("Inside sumRPC call");

  let payload = {
    result: call.request.num1 + call.request.num2,
  };

  callback(null, payload);
}

/* ---------------------------- Server Streaming ---------------------------- */
function primeNumberDecomposition(call, callback) {
  console.log("Inside primeNumberDecomposition server streaming RPC ");

  let num = call.request.num;
  let k = 2;

  while (num > 1) {
    if (num % k == 0) {
      num = num / k;
      let response = {
        result: k,
      };
      call.write(response);
    } else {
      k += 1;
    }
  }

  call.end();
}

/* ---------------------------- Client Streaming ---------------------------- */

function avgRPC(call, callback) {
  let total = 0,
    count = 0;

  call.on("data", (request) => {
    console.log(`Recieved ${request.num} on the server`);

    total += request.num;
    count++;
  });

  call.on("error", (error) => {
    console.log("Error on client streaming ", error);
  });

  call.on("end", () => {
    let response = {
      result: total / count,
    };

    callback(null, response);
  });
}

/* ---------------------------- Bidi Streaming ---------------------------- */

function maxRPC(call, callback) {
  let max = 0;

  call.on("data", (response) => {
    console.log("Number is ", response.num);
    max = Math.max(response.num, max);

    let final = {
      result: max,
    };

    call.write(final);
  });

  call.on("error", (error) => {
    console.log("Error in server , bidi streaming ", error);
  });

  call.on("end", () => {
    console.log("finished at server");
    call.end();
  });
}

/* ------------------ demostrate errors on recieving negative numbers ------------------ */

function squareRoot(call, callback) {
  let num = call.request.num;
  let squareRootNum;
  if (num >= 0) {
    squareRootNum = Math.sqrt(num);

    let payload = {
      result: squareRootNum,
    };

    callback(null, payload);
  } else {
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: "negative numbers are not allowed",
    });
  }
}

module.exports = {
  sumRPC,
  primeNumberDecomposition,
  avgRPC,
  maxRPC,
  squareRoot,
};
