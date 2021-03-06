const net = require("net")
const fs  = require("fs")
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

const client = net.connect("3333", "localhost", () => {
  console.log("connected to server")
  client.setEncoding('utf8')

  rl.question("READ or WRITE or DELETE or LIST => ", method => {

    if (method === "READ") {
      rl.question("Input resrcPath => ", resrcPath => {
        rl.question("Input savePath => ", savePath => {

          try {
            const sepInx = savePath.lastIndexOf("/")
            const dir = savePath.substring(0, sepInx + 1)
            fs.readdirSync(dir)

            const readReqMsg = `${method} ${resrcPath}`
            client.write(readReqMsg)
          } catch (e) {
            console.log("no such file or directory")
          }

          client.on("data", data => {
            const separationInx = data.indexOf("\n\n") 

            const resLine = data.substring(0, separationInx)
            const body    = data.substring(separationInx)

            if (resLine === "SUCCEEDED"){
              fs.writeFile(savePath, body, function (err) {
                if (err) { throw err }
              })
            }
          })
        })
      })
    }

    if ( method === "WRITE") {
      rl.question("Input resrcPath => ", resrcPath => {
        rl.question("Input fetchFilePath => ", fetchFilePath => {
          try {
            const body        = fs.readFileSync(fetchFilePath, "utf-8") 
            const writeReqMsg = `${method} ${resrcPath}\n\n${body}`
            client.write(writeReqMsg)
          } catch (e) {
            console.log("no such file or directory")
          }
        })
      })
    }

    if (method === "DELETE") {
      rl.question("Input resrcPath => ", resrcPath => {
        const deleteReqMsg = `${method} ${resrcPath}`
        client.write(deleteReqMsg)
      })
    }

    if (method === "LIST") {
      rl.question("Input resrcPath => ", resrcPath => {
        const listReqMsg = `${method} ${resrcPath}`
        client.write(listReqMsg)
      })
    }
     

    client.on("data", data => {
      console.log(data)
    })
  })
})



