const net = require("net")

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const client = net.connect("3333", "localhost", () => {

  console.log("connected to server")

  rl.question("READ or WRITE => ", method => {
    if (method === "READ") {
      rl.question("Input path => ", path => {
      const readReqMsg = `${method} ${path}`
      client.write(readReqMsg)
      })
    }


    if ( method === "WRITE") {
        rl.question("Input path => ", path => {
          //rl.question("Input destination path => ", dstPath => {
            rl.question("Input body => ", body => {
              const writeReqMsg = `${method} ${path}\n\n${body}`
              client.write(writeReqMsg)
            })
          })
        //})
    }


  })
})

client.on("data", data => {
  console.log("data\n" + data)
})

