const net = require("net")
const fs = require("fs")
const basePath ="/Users/amoyr/projects/"

const server = net.createServer(socket => {
  socket.setEncoding('utf8')
  socket.on("data", data => {
    const reqMsgAry = data.split("\n\n")
    const reqLine = reqMsgAry[0]
    const body    = reqMsgAry[1]

    const reqLineAry = reqLine.split(" ")
    const method = reqLineAry[0]
    const path   = reqLineAry[1]

    if (method === "READ") {
      const responseFile = readMethod(path)
      socket.write(responseFile)
    }


    if (method === "WRITE") {
      writeMethod(path, body)
    }
  })

}).listen(3333)

function readMethod(requestedPath) {
  const responseFile = fs.readFileSync(basePath + requestedPath, "utf-8") 
  return responseFile
}


function writeMethod(requestedPath, body) {
  fs.writeFile(basePath + requestedPath, body, function (err) {
    if (err) { throw err }
    console.log("completed uproad")
  })
}


