import createWsClient from './client'

const {write, close} = createWsClient({
  onmessage(message) {
    console.log('index: got message', message)
  },
  onopen() {
    console.log('index: onopen')
    write('hello')
  },
})
