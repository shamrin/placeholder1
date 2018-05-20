import http from 'http'
import WebSocket from 'ws'
import express from 'express'

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)
const wss = new WebSocket.Server({server})

wss.on('connection', client => {
  client.on('message', data => {
    console.log('C->S', data)

    console.log('S->C', data)
    client.send(data)
    // reader.push(JSON.parse(data as any))
  })

  //   write(data, _, callback) {
  //     console.log('S->C', data)
  //     if (client.readyState === client.OPEN) {
  //       client.send(JSON.stringify(data))
  //     }
  //     callback()
  //   },

  client.on('close', () => {
    // ???
  })
})

server.listen(4411, () => {
  console.log('listening on port 4411')
})
