const path = '/'

import {WSChannel, WSChannelCallbacks} from './types'

export default function({onmessage, onopen}: WSChannelCallbacks): WSChannel {
  const ws = new WebSocket('ws://' + window.location.host + path)

  ws.onopen = () => {
    console.log('ws opened')
    onopen()
  }
  ws.onerror = e => {
    console.error('ws error!', e)
  }
  
  ws.onmessage = msg => {
    const data = JSON.parse(msg.data)
    console.log('received', data)
    onmessage(data)
  }
  
  ws.onclose = () => {
    console.warn('---- WEBSOCKET CLOSED ----')
  }
  
  const write = (data: any) => {
    if (ws.readyState === ws.OPEN) {
      console.log('sending', data)
      ws.send(JSON.stringify(data))
    } else {
      console.log('websocket message discarded because ws closed')
    }
  }
  
  const close = () => {
    ws.close()
  }

  return {write, close}
}