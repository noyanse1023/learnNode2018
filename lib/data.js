/*
* 2018/10/21 20:20
* @ noyanse@163.com
* @ description 写入，读取，更新，删除文件
*/
// Library for storing and editing data
// Dependencies
const fs = require('fs')
const path = require('path')

// Contaner for the module (to be exported)
const lib = {}

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/')

/*
* @ { name } lib.create
* @ { dir } 文件夹名
* @ { filename } 文件名
* @ { data } 写入的数据
* @ { callback } 第一个参数是err, 第二个是一个整数，表示打开文件返回的文件描述符，window中又称文件句柄
* @ description Write data to a file
*/
// Write data to a file
lib.create = (dir, filename, data, callback) => {
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+filename+'.json', 'wx', (err, fileDecriptor) => {
    console.log('fileDecriptor', fileDecriptor)
    if(!err && fileDecriptor) {
      // Conver data to string
      const stringData = JSON.stringify(data)
      fs.writeFile(fileDecriptor, stringData, (err) => {
        if(!err) {
          fs.close(fileDecriptor, (err) => {
            if(!err) {
              callback(false)
            } else {
              callback('Error closing new file')
            }
          })
        } else {
          callback('Error writing to a new file')
        }
      })
    } else {
      callback('Could not create file, it may already exist')
    }
  })
 }

// Read data from a file
lib.read = (dir, filename, callback) => {
  fs.readFile(lib.baseDir+dir+'/'+filename+'.json', 'utf8', (err, data) => {
    if(!err) {
      callback('Read file data', data)
    } else {
      callback('Read file failed')
    }
  })
}

//
/*
* @ { name } fs.truncate(path[, len], callback)
* @ { path } 路径
* @ { len } <integer> 默认 = 0
* @ { callback } err
* @ description Update data inside a file
*/
lib.update = (dir, filename, data, callback) => {
  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+filename+'.json', 'r+', (err, fileDecriptor) => {
    if(!err && fileDecriptor) {
      const stringData = JSON.stringify(data)
      fs.truncate(fileDecriptor, (err) =>{
        if(!err) {
          // Write to the file and close it
          fs.writeFile(fileDecriptor, stringData, (err) => {
            if(!err) {
              fs.close(fileDecriptor, (err) =>{
                if(!err) {
                  callback(false)
                } else {
                  callback('Error closing exsiting data')
                }
              })
            } else {
              callback('Error writing data')
            }
          })
        } else {
          callback('Error truncating file')
        }
      })
    } else {
      callback('Could not open the file for updating, it may not exist yet')
    }
  })
}

// Delete a file
lib.delete = (dir, filename, callback) =>{
  // unlink the file
  fs.unlink(lib.baseDir+dir+'/'+filename+'.json', (err) => {
    if(!err) {
      callback(false)
    } else {
      callback('Error deleting file')
    }
  })
}

module.exports = lib
