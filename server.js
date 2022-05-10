const net = require("net")
const fs  = require("fs")

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
      const Read     = new READ(basePath, path) 
      const response = Read.createRes()
      socket.write(response)
    }

    if (method === "WRITE") {
      const Write    = new WRITE(basePath, path, body) 
      const response = Write.createRes()
      socket.write(response)
    }

    if (method === "DELETE") {
      const Delete   = new DELETE(basePath, path) 
      const response = Delete.createRes()
      socket.write(response)
    }

    if (method === "LIST") {
      const List     = new LIST(basePath, path) 
      const response = List.createRes()
      socket.write(response)
    }

  })

}).listen(3333)


class READ {
  constructor(basePath, requestedPath) {
    this.basePath      = basePath
    this.requestedPath = requestedPath
  }

  readMethod (){
    this.responseFile = fs.readFileSync(this.basePath + this.requestedPath, "utf-8") 
  }

  createRes() {
    try {
      this.readMethod()
      const resBody    = this.responseFile
      const statusCode = "SUCCEEDED"
      const response   = `${statusCode}\n\n${resBody}`
      return response
    } catch (e) {
      const statusCode = "FAILED"
      const resBody    = "Not Found"
      const response   = `${statusCode}\n\n${resBody}`
      return response
    }
  }
}


class WRITE {
  constructor(basePath, requestedPath, body) {
    this.basePath      = basePath
    this.requestedPath = requestedPath
    this.body          = body
  }

  writeMethod (){
    const separationIndex = this.requestedPath.lastIndexOf("/")

    const file = this.requestedPath.substring(separationIndex + 1)
    const dir  = this.requestedPath.substring(0, separationIndex + 1)

    fs.mkdir(basePath + dir, { recursive: true }, (err) => {
      if (err) { throw err }

      fs.writeFile(this.basePath + dir + file, this.body, (err) => {
        if (err) { throw err }

      })
    })
  }

  createRes() {
    try {
      this.writeMethod()
      const statusCode = "SUCCEEDED"
      const response   = `${statusCode}`
      return response
    } catch (e) {
      const statusCode = "FAILED"
      const response   = `${statusCode}`
      return response
    }
  }
}

class DELETE {
  constructor(basePath, requestedPath){
    this.basePath      = basePath
    this.requestedPath = requestedPath
  }

  deleteMethod () {
    const deletePath = this.basePath + this.requestedPath
    if (fs.statSync(deletePath).isDirectory()){
      fs.rmdirSync(deletePath)
    } else {
      fs.unlinkSync(deletePath)
    }

  }

  createRes() {
    try {
      this.deleteMethod()
      const statusCode = "SUCCEEDED"
      const response   = `${statusCode}`
      return response
    } catch (e) {
      const statusCode = "FAILED"
      const resBody    = "Not Found"
      const response   = `${statusCode}\n\n${resBody}`
      return response
    }
  }
}

class LIST {
  constructor(basePath, requestedPath){
    this.basePath      = basePath
    this.requestedPath = requestedPath
  }
  
  listMethod () {
    this.list = fs.readdirSync(this.basePath + this.requestedPath)
  }

  createRes() {
    try {
      this.listMethod()
      const resBody    = this.list.join("\n")
      const statusCode ="SUCCEEDED"
      const response   = `${statusCode}\n\n${resBody}`
      return response
    } catch (e) {
      const statusCode = "FAILED"
      const resBody    = "Not Found"
      const response   = `${statusCode}\n\n${resBody}`
      return response
    }
  }
}

