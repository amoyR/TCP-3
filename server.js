const net = require("net")
const fs = require("fs")

const basePath ="/Users/amoyr/projects"

const server = net.createServer(socket => {
  socket.setEncoding('utf8')
  socket.on("data", data => {
    console.log(data)
    console.log("data comes from " + socket.remoteAddress + socket.remotePort )
    const separationInx = data.indexOf("\n\n")
    let reqLine
    if (separationInx === -1) {
      reqLine = data
    } else {
      reqLine = data.substring(0, separationInx)
    }
    const body = data.substring(separationInx)

    const reqLineAry = reqLine.split(" ")
    const method     = reqLineAry[0]
    const path       = reqLineAry[1]


    if (method === "READ") {
      try {
        const rspBody    = readMethod(path)
        const statusCode ="SUCCEEDED"
        const response   = `${statusCode}\n\n${rspBody}`
        socket.write(response)

      } catch (e) {
        const statusCode = "FAILED"
        const rspBody    = "Not Found"
        const response   = `${statusCode}\n\n${rspBody}`
        socket.write(response)
      }
    }

    if (method === "WRITE") {
      try {
        writeMethod(path, body)
        const statusCode ="SUCCEEDED"
        const response   = `${statusCode}`
        socket.write(response)

      } catch (e) {
        const statusCode = "FAILED"
        const response   = `${statusCode}`
        socket.write(response)
      }
    }

    if (method === "DELETE") {
      try {
        deleteMethod(path)
        const statusCode ="SUCCEEDED"
        const response   = `${statusCode}`
        socket.write(response)

      } catch (e) {
        const statusCode = "FAILED"
        const rspBody    = "Not Found"
        const response   = `${statusCode}\n\n${rspBody}`
        socket.write(response)
      }
    }

    if (method === "LIST") {
      try {
        const rspBody = listMethod(path)
        const statusCode ="SUCCEEDED"
        const response   = `${statusCode}\n\n${rspBody}`
        socket.write(response)

      } catch (e) {
        const statusCode = "FAILED"
        const rspBody    = "Not Found"
        const response   = `${statusCode}\n\n${rspBody}`
        socket.write(response)
      }
    }
  })

}).listen(3333)

function readMethod(requestedPath) {
  const responseFile = fs.readFileSync(basePath + requestedPath, "utf-8") 
  return responseFile
}


function writeMethod(requestedPath, body) {
  const separationIndex = requestedPath.lastIndexOf("/")
  const file = requestedPath.substring(separationIndex + 1)
  const dir  = requestedPath.substring(0, separationIndex + 1)

  fs.mkdir(basePath + dir, { recursive: true }, (err) => {
    if (err) { throw err }

    fs.writeFile(basePath + dir + file, body, (err) => {
      if (err) { throw err }

    })
  })
}

function deleteMethod(requestedPath) {
  const deletefile = fs.unlinkSync(basePath + requestedPath)
  return deletefile
}

function listMethod (requestedPath) {
  const list = fs.readdirSync(basePath + requestedPath)
  return list
}
function creatRspMsg (methodFunc){
  try {
    methodFunc
    const statusCode ="SUCCEEDED"
    const response   = `${statusCode}`
    socket.write(response)

  } catch (e) {
    const statusCode = "FAILED"
    const response   = `${statusCode}`
    socket.write(response)
  }
}

