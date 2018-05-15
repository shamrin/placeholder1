const path = '/'
const ws = new WebSocket('ws://' + window.location.host + path)

ws.onopen = () => {
  console.log('ws opened')
}
ws.onerror = e => {
  console.error('ws error', e)
}

ws.onmessage = msg => {
  const data = JSON.parse(msg.data)
  console.log('received', data)
  // reader.onmessage!(data)
}

ws.onclose = () => {
  console.warn('---- WEBSOCKET CLOSED ----')
}

export const write = (data: any) => {
  if (ws.readyState === ws.OPEN) {
    console.log('sending', data)
    ws.send(JSON.stringify(data))
  } else {
    console.log('websocket message discarded because ws closed')
  }
}

export const close = () => {
  ws.close()
}
