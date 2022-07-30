/* ---------------------------------- Unary --------------------------------- */
function greetRPC(call, callback) {
  console.log("Inside greetRPC call");
  let response = {
    result: `Hello ${call.request.greeting.first_name} ${call.request.greeting.last_name}`,
  };
  callback(null, response);
}

/* ---------------------------- Server Streaming ---------------------------- */
function greetManyTimesServer(call, callback) {
  console.log("Inside sever streaming greetRPC call");

  /* ------------ setInterval and count is used  show a visually good output ------------ */
  let count = 0;

  let intervalID = setInterval(() => {
    let response = {
      result: `Hello ${call.request.greeting.first_name}, this is a server streaming result`,
    };
    call.write(response);
    if (count++ > 9) {
      clearInterval(intervalID);
      call.end(); // all message are sent
    }
  }, 1000);
}

/* ---------------------------- Client Streaming ---------------------------- */

function greetManyTimesClient(call, callback) {
  console.log("Inside client streaming greetRPC call");

  call.on("data", (request) => {
    const fullName = request.greeting.first_name + request.greeting.last_name;
    console.log(
      `Recieving a stream of data from client on the server: ${fullName}`
    );
  });

  call.on("error", (error) => {
    console.log("Error on client streaming ", error);
  });

  call.on("end", () => {
    let response = {
      result: "All streaming data from client is sent to server",
    };

    callback(null, response);
  });
}

/* ---------------------------- Bidi Streaming ---------------------------- */

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}

async function greetBidi(call, callback) {
  call.on("data", (response) => {
    const fullName = response.greeting.first_name + response.greeting.last_name;

    console.log(
      `Hello ,this is ${fullName} from client sending data to server in  Bidi stream`
    );
  });

  call.on("error", (error) => {
    console.log("Error on client streaming ", error);
  });

  call.on("end", () => {
    console.log("All data recived from client on server in bidi streaming");
  });

  for (let i = 0; i < 4; i++) {
    let response = {
      result: `Hello , this is a server sending data to client in bidi streaming`,
    };

    call.write(response);
    await sleep(4000);
  }
  call.end();
}

module.exports = {
  greetRPC,
  greetManyTimesServer,
  greetManyTimesClient,
  greetBidi,
};
