const grpc = require("grpc");
const LoadCalculatorPackageDefinition = require("../utils/loadCalculatorPackageDefinition");
const LoadGreetPackageDefiniton = require("./../utils/loadGreetPackageDefiniton");

function joinName(client) {
  const request = {
    greeting: {
      first_name: "Ujjwal",
      last_name: "Garg",
    },
  };
  console.log("request", request);
  client.greet(request, (error, response) => {
    if (!error) {
      console.log("repsonse of api : ", response);
    } else {
      console.error(error);
    }
  });
}

function callGreetManyTimesServer(client) {
  const request = {
    greeting: {
      first_name: "Ujjwal",
      last_name: "Garg",
    },
  };

  const call = client.greetManyTimesServer(request, () => {});

  // to implement methods on streaming data
  call.on("data", (response) => {
    console.log(response);
  });

  //status of streaming data
  call.on("status", (status) => {
    console.log("status of streamin server", status);
  });

  //if error on streaming data
  call.on("error", (err) => {
    console.error("Error on streamin server", err);
  });

  //on completion of streaming
  call.on("end", () => {
    console.log("Streaming server ended");
  });
}

function greetManyTimesClient(client) {
  const greetPackageDefiniton = LoadGreetPackageDefiniton();
  let req = greetPackageDefiniton.GreetManyTimesRequestClient;

  const call = client.greetManyTimesClient(req, (err, response) => {
    if (!err) {
      console.log(response.result);
    } else {
      console.log(err);
    }
  });

  let count = 0,
    intervalID = setInterval(() => {
      console.log(`Client Sending message ${count}`);

      const request = {
        greeting: {
          first_name: "Ujjwal",
          last_name: "Garg",
        },
      };

      const request2 = {
        greeting: {
          first_name: "Satvik",
          last_name: "Garg",
        },
      };

      call.write(request); //can send 2 write calls
      call.write(request2);

      if (count++ >= 3) {
        clearInterval(intervalID);
        call.end();
      }
    }, 1000);
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}

async function callgreetBidi(client) {
  const greetPackageDefiniton = LoadGreetPackageDefiniton();
  let req = greetPackageDefiniton.GreetBidiRequest;

  const call = client.greetBidi(req, (err, response) => {
    console.log(`Client recieving from server msg: ${response}`);
  });

  call.on("data", (response) => {
    console.log(response.result);
  });

  call.on("error", (error) => {
    console.log("Error on bidi streaming ", error);
  });

  call.on("end", () => {
    console.log("client end");
  });

  for (let i = 0; i < 4; i++) {
    let request = {
      greeting: {
        first_name: "Testing",
        last_name: "Garg",
      },
    };

    call.write(request);
    await sleep(3000);
  }

  call.end();
}

function calculateSum(client) {
  let request = {
    num1: 10,
    num2: 12,
  };

  client.sum(request, (err, response) => {
    if (!err) {
      console.log(
        `sum of ${request.num1} & ${request.num2} is : `,
        response.result
      );
      return;
    } else {
      console.error(err);
    }
  });
}

function callPrimeNumberDecomposition(client) {
  let request = {
    num: 120,
  };

  const call = client.primeNumberDecomposition(request, () => {});

  call.on("data", (response) => {
    console.log(`Prime Decomposition is:`, response.result);
  });

  call.on("end", () => {
    console.log("Server streaming ended for primeNumberDecomposition");
  });
}

function calculateAvg(client) {
  const calculatorPackageDefiniton = LoadCalculatorPackageDefinition();

  let request = calculatorPackageDefiniton.AvgRequest;

  const call = client.avg(request, (err, response) => {
    if (!err) {
      console.log("Avg of numbers is ", response.result);
    } else {
      console.log(err);
    }
  });

  for (let i = 1; i <= 10; i++) {
    let req = {
      num: i,
    };
    call.write(req);
  }

  call.end();
}

async function callMax(client) {
  calculatorPackageDefiniton = LoadCalculatorPackageDefinition();

  let req = calculatorPackageDefiniton.MaxRequest;

  const call = client.max(req, (err, response) => {});

  call.on("data", (response) => {
    console.log("Max of num ", response.result);
  });

  call.on("error", (error) => {
    console.log("Error on bidi streaming ", error);
  });

  call.on("end", () => {
    console.log("This is client ,Server finsished  sending ");
  });

  for (let i = 0; i < 10; i++) {
    let num = Math.floor(Math.random() * 100);
    let request = {
      num,
    };
    console.log("Sending Number: ", num);
    call.write(request);
    await sleep(100);
  }

  call.end();
}

function callSqaureRoot(client) {
  let req = {
    num: 25,
  };

  let deadline = new Date(Date.now() + 10);

  client.squareRoot(req, { deadline }, (error, response) => {
    if (!error) {
      console.log(`Square root of ${req.num} is ${response.result}`);
    } else {
      console.log(error);
    }
  });
}

function main() {
  /* ----------------------------- Greeting client ---------------------------- */
  const greetPackageDefiniton = LoadGreetPackageDefiniton();
  const greetClient = new greetPackageDefiniton.GreetingService(
    "127.0.0.1:50051",
    grpc.credentials.createInsecure()
  );

  // joinName(greetClient);
  // callGreetManyTimesServer(greetClient);
  // greetManyTimesClient(greetClient);
  // callgreetBidi(greetClient);

  /* ---------------------------- Calculator Client --------------------------- */
  const calculatorPackageDefiniton = LoadCalculatorPackageDefinition();
  const client = new calculatorPackageDefiniton.CalculatorService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  // calculateSum(client);
  // callPrimeNumberDecomposition(client);
  // calculateAvg(client);
  // callMax(client);
  callSqaureRoot(client);
}

main();
