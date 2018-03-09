var http = require('http');
var querystring = require('querystring');

var ip = '202.120.167.89';
var port = 4000;

function sendRequest(path, method, headers, data){
  return new Promise((resolve, reject) => {
    var options = {
      hostname: ip,
      port: port,
      path: path,
      method: method,
      headers: headers
    };
    var returnInfo;
    var req = http.request(options, (res) => {
      /*console.log("状态码: " + res.statusCode);
      console.log("响应头:" + JSON.stringify(res.headers));*/
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        //chunk是string类型
        /*console.log("响应主体:" + chunk);*/
        returnInfo = chunk;
      });
      res.on('end', () => {
        /*console.log('响应中已无数据。');*/
        resolve(returnInfo);

      });
    });

    req.on('error', (e) => {
      console.error("请求遇到问题:" + e.message);
      reject(e);
      return;
    });
    // 写入数据到请求主体
    if (method == "POST") {
      req.write(data);
    }
    req.end();  
  })
}

function enroll(){
  var token;
  var data = {
    "username" : "Jim",
    "orgName" : "org1"
  };
  data = querystring.stringify(data);
  var method = 'POST';
  var path = '/users';
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return sendRequest(path, method, headers, data);
}

function invoke(){
  return new Promise((resolve, reject) => {
    enroll().then((returnInfo)=>{
      var token = JSON.parse(returnInfo).token;
      if (token == undefined) {
        var errorInfo = "获取token失败！"
        console.log(errorInfo);
        reject(errorInfo);
        return;
      }
      var authorization = "Bearer " + token;
      var data = {
        "fcn" : "move",
        "args" : ["a", "b", "10"]
      };
      data = JSON.stringify(data);
      var method = 'POST';
      var path = '/channels/mychannel/chaincodes/mycc';
      var headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
      /*sendRequest(path, method, headers, data).then((returnInfo) => {
        var txId = returnInfo;
        console.log("交易ID为：" + txId);
      });*/
      resolve(sendRequest(path, method, headers, data));
    })
  })  
}

function query(){
  return new Promise((resolve, reject) => {
    enroll().then((returnInfo)=>{
      var token = JSON.parse(returnInfo).token;
      if (token == undefined) {
        var errorInfo = "获取token失败！"
        console.log(errorInfo);
        reject(errorInfo);
        return;
      }
      var authorization = "Bearer " + token;
      var data = {
        "peer" : "peer1",
        "fcn" : "query",
        "args": "[\"b\"]"
      };
      data = querystring.stringify(data);
      var method = 'GET';
      var path = '/channels/mychannel/chaincodes/mycc?' + data;
      var headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
      /*sendRequest(path, method, headers, data).then((returnInfo) => {
        var queryResult = returnInfo;
        console.log("查询结果：" + queryResult);
      });*/
      resolve(sendRequest(path, method, headers, data));
    })
  })
   
}

function queryBlockByBlockHeight(){
  return new Promise((resolve, reject) => {
    enroll().then((returnInfo)=>{
      var token = JSON.parse(returnInfo).token;
      if (token == undefined) {
        var errorInfo = "获取token失败！"
        console.log(errorInfo);
        reject(errorInfo);
        return;
      }
      var authorization = "Bearer " + token;
      var blockHeight = 2;
      var data = {
        "peer" : "peer1"
      };
      data = querystring.stringify(data);
      var method = 'GET';
      var path = '/channels/mychannel/blocks/' + blockHeight + '?' + data;
      var headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
      /*sendRequest(path, method, headers, data).then((returnInfo) => {
        var queryResult = returnInfo;
        console.log("区块信息为：" + queryResult);
      });*/
      resolve(sendRequest(path, method, headers, data));
    })
  })  
}

function queryTx(){
  return new Promise((resolve, reject) => {
    enroll().then((returnInfo)=>{
      var token = JSON.parse(returnInfo).token;
      if (token == undefined) {
        var errorInfo = "获取token失败！"
        console.log(errorInfo);
        reject(errorInfo);
        return;
      }
      var authorization = "Bearer " + token;
      var txId = '964159d56799f164b7a8a2ea34c8efc098a5591bf8a2228131cf83aed263db65';
      var data = {
        "peer" : "peer1"
      };
      data = querystring.stringify(data);
      var method = 'GET';
      var path = '/channels/mychannel/transactions/' + txId + '?' + data;
      var headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
      /*sendRequest(path, method, headers, data).then((returnInfo) => {
        var queryResult = returnInfo;
        console.log("交易信息为：" + queryResult);
      });*/
      resolve(sendRequest(path, method, headers, data));
    })
  })
}

function queryInstalledCC(){
  return new Promise((resolve, reject) => {
    enroll().then((returnInfo)=>{
      var token = JSON.parse(returnInfo).token;
      if (token == undefined) {
        var errorInfo = "获取token失败！"
        console.log(errorInfo);
        reject(errorInfo);
        return;
      }
      var authorization = "Bearer " + token;
      var data = {
        "peer" : "peer1",
        "type" : "installed"
      };
      data = querystring.stringify(data);
      var method = 'GET';
      var path = '/chaincodes?' + data;
      var headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
      /*sendRequest(path, method, headers, data).then((returnInfo) => {
        var queryResult = returnInfo;
        console.log("已经安装的智能合约信息为：" + queryResult);
        console.log(JSON.parse(queryResult).length);
      });*/
      resolve(sendRequest(path, method, headers, data));
    }) 
  })
}

function queryChainInfo(){
  return new Promise((resolve, reject) => {
    enroll().then((returnInfo)=>{
      var token = JSON.parse(returnInfo).token;
      if (token == undefined) {
        var errorInfo = "获取token失败！"
        console.log(errorInfo);
        reject(errorInfo);
        return;
      }
      var authorization = "Bearer " + token;
      var data = {
        "peer" : "peer1"
      };
      data = querystring.stringify(data);
      var method = 'GET';
      var path = '/channels/mychannel?' + data;
      var headers = {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
      /*sendRequest(path, method, headers, data).then((returnInfo) => {
        var queryResult = returnInfo;
        console.log("已经安装的智能合约信息为：" + queryResult);
        console.log(JSON.parse(queryResult).length);
      });*/
      resolve(sendRequest(path, method, headers, data));
    }) 
  })
}
module.exports.invoke = invoke;
module.exports.query = query;
module.exports.queryBlockByBlockHeight = queryBlockByBlockHeight;
module.exports.queryTx = queryTx;
module.exports.queryInstalledCC = queryInstalledCC;
module.exports.queryChainInfo = queryChainInfo;