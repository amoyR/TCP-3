const net = require("net")
const fs = require("fs")
const basePath ="/Users/amoyr/projects/"

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const client = net.connect("3333", "localhost", () => {

  console.log("connected to server")

  rl.question("READ or WRITE => ", method => {
    if (method === "READ") {
      rl.question("Input requestPath => ", requestPath => {
        rl.question("Input savePath => ", savePath => {

          const readReqMsg = `${method} ${requestPath}`
          client.write(readReqMsg)

          client.on("data", data => {

            console.log("data\n" + data)

            fs.writeFile(basePath + savePath, data, function (err) {
              if (err) { throw err }
            })
            
          })

        })
      })
    }


    if ( method === "WRITE") {
        rl.question("Input requestPath => ", requestPath => {
          rl.question("Input srcPath => ", srcPath => {

            const body = fs.readFileSync(basePath + srcPath, "utf-8") 

            const writeReqMsg = `${method} ${requestPath}\n\n${body}`
            client.write(writeReqMsg)
          })
        })
    }


  })
})


