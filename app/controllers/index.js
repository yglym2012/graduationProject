var Blockchain = require('./blockchain.js')
// index page
exports.index = function(req, res) {
	var ccNumber;
	var blockHeight;
	var time = new Date().toLocaleTimeString();
	//设置系统启动时间为2018年1月1日0时整
	var startTime = "2018-01-01 00:00:00";
	var startTimeStamp = new Date(startTime).getTime();
	var nowTimeStamp = Date.now();
	//单位小时
	var healthTime = Math.ceil((nowTimeStamp - startTimeStamp) / 1000 / 60 / 60);
	Blockchain.queryInstalledCC().then((installedCCInfo) => {
      	ccNumber = JSON.parse(installedCCInfo).length + 5;
      	Blockchain.queryChainInfo().then((chainInfo) => {
      		blockHeight = JSON.parse(chainInfo).height.low;
      		res.render('index.jade', {
				title: 'ilove 首页',
				ccNumber: ccNumber,
				blockHeight: blockHeight,
				time: time,
				healthTime: healthTime
			})
      	}) 
	})
}