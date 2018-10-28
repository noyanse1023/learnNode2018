const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

const server = http.createServer((req, res) => {
  const urlParse = url.parse(req.url, true)
  const pathTrimed = urlParse.pathname.replace(/^\/+|\/+$/, '')
  let buffer = ''
  const decoder = new StringDecoder('utf-8')
  req.on('data', data => {
    buffer += decoder.write(data)
  })
  req.on('end', data => {
    buffer += decoder.end()
    const chosenHandler = typeof(router[pathTrimed]) !== 'undefined' ? router[pathTrimed] : handlers.notFound
    const resData = {
      'pathTrimed': pathTrimed,
      'buffer': buffer
    }
    chosenHandler(resData, (statusCode, payload) =>{
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200
      payload = typeof(payload) == 'object' ? payload : {}
      const payloadString = JSON.stringify(payload)
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      console.log(statusCode, payloadString)
    })
  })
})

const config = {
  'port': 3000
}
server.listen(config.port, () => {
  console.log(`port ${config.port}`)
})

const handlers = {}
handlers.hello = (data, callback) => {
  callback(200, {'msg': 'welcome!'})
}
handlers.notFound = (data, callback) =>{
  callback(404)
}

const router = {
  'hello': handlers.hello
}
