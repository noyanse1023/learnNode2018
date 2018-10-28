/*
* 2018/9/24 0:14
* @ noyanse@163.com
* @ description 先启动node index.js 然后再打开个控制台输入curl localhost:3000直接运行
*/
const http = require('http')
const https = require('https')
const fs = require('fs')
const url = require('url')
const config = require('./config')
const StringDecoder = require('string_decoder').StringDecoder // buffer ---> string
const _data = require('./lib/data')

// _data.create('test', 'newFile', {'foo': 'bar'}, (err) => {
//   console.log('callback err', err)
// })
// _data.read('test', 'newFile', (err, data) => {
//   console.log('callback err', err, 'data', data)
// })
// _data.update('test', 'newFile', {'hello': 'test'}, (err) => {
//   console.log('callback err', err)
// })
_data.delete('test', 'newFile',(err) => {
  console.log('callback err', err)
})
// Instantiate the HTTP server
const httpServer = http.createServer((req,res) => {
  unifiedServer(req, res)
})

httpServer.listen(config.httpPort, () => {
  console.log(`your server is running at ${config.httpPort}`)
})

// Instantiate the HTTPS server
const httpsServerOptions = {
  'keys': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})
httpsServer.listen(config.httpsPort, () => {
  console.log(`your server is running at ${config.httpsPort}`)
})
// All the server logic for both http and https server
const unifiedServer = (req, res) => {
  // Get the URL and parse it
  let parseUrl = url.parse(req.url, true);

  // Get the path
  let trimedPath = parseUrl.pathname.replace(/^\/+|\/+$/, '')

  // Get the HTTP method
  let method = req.method.toLowerCase()

  // Get the querystring as an object
  let querystringObj = parseUrl.query

  let headers = req.headers

  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })
  req.on('end', (data) => {
    buffer += decoder.end()

    // Choose the handler this request should go to, if one is not found, use the notFound handlers
    const chosenHandler = typeof(router[trimedPath]) !== 'undefined' ? router[trimedPath] : handlers.notFound
    // 如果路径存在，就去该路径，否则调用notFound
    // Construct the data object to send the handler
    const resData = {
      'trimedPath': trimedPath,
      'querystringObj': querystringObj,
      'method': method,
      'headers': headers,
      'payload': buffer
    }
    // Route the request to the handler specified in the router 跳转到指定路由
    chosenHandler(resData, (statusCode, payload) => {
      // Use the status code callback by the handler, or default 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200

      // Use the payload callback by the handler, or default to an empty object
      payload = typeof(payload) == 'object' ? payload: {}

      // Conver the payload to a String
      const payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      // Return the response
      res.writeHead(statusCode)
      res.end(payloadString)
        // Log the request
      console.log('Returning the response: ', statusCode, payloadString)
    })
  })
}
// Define the handlers
const handlers = {}

// Ping handler
handlers.ping = (data, callback) =>{
  callback(200)
}
// Sample handlers
handlers.sample = (data, callback) => {
  // Callback a HTTP status code, and a payload object
  callback(406, {'name': 'sample handler'})
}
// Not found handlers
handlers.notFound = (data, callback) => {
  callback(404)
}
// Define a request router
const router = {
  'ping': handlers.ping,
  'sample': handlers.sample
}
