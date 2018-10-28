## 创建文件并写入内容
```
fs.appendFile('greeting.txt','hello world')
```
## url模块
- parse the url
`cosnt pathTrimed = url.parse(req.url, true).pathname.replace(/^\/+|\/+$/, '')`

- get the HTTP method
`req.method.toLowerCase()`

- get the querystring as an object
```
const pathUrl = url.parse(req.url, true)
cosnt querystringObj = pathUrl.query
```

- turn buffer into string
```
const StringDecoder = require('string_decoder').StringDecoder
const decoder = new StringDecoder('utf-8')
let buffer = ''
req.on('data', data => {
  buffer += decoder.write(data)
})
req.on('end', data => {
  buffer += decoder.end()
})
```
- writeHead
```
res.writeHead(statusCode)
```

- setHeader
```
res.setHeader('Content-Type', 'application/json')
```

- HTTPS
```
mkdir https
cd https
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
US
Califormia
Francisco
noyanse
noyanse
localhost 这里可以填域名
noyanse@163.com
```

- ping
```
const handlers = {}
handlers.ping = (data, callback) => {
  callback(200)
}
const router = {
  'ping': handlers.ping
}
```

## storing data
- create
```
/*
* {path} 文件路径
* {flags} 操作标识，如"r",读方式打开 'wx' - 和 ' w ' 模式一样，如果文件存在则返回失败
* {fileDecriptor} 表示打开文件返回的文件描述符
*/
fs.open(path, flags , function(err, fileDecriptor) {})

fs.writeFile(fileDecriptor, stringData, callback)

fs.close(fileDecriptor, callback)
```
- read
```
/*
* {path} 文件路径
*/
fs.readFile(path, 'utf8', callback)
```
- update
```
/*
* {path} 文件路径
* {flags} r+ 以读取模式打开文件，如果文件不存在则创建
* {fileDecriptor} 表示打开文件返回的文件描述符
*/
fs.open(path, flags, function(err, fileDecriptor) {})

fs.truncate(fileDecriptor, callback)

fs.writeFile(fileDecriptor, stringData, callback)

fs.close(fileDecriptor, callback)
```
- delete
```
fs.unlink(path, callback)
```
