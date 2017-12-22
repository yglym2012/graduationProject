// index page
exports.index = function(req, res) {
	res.render('index.jade', {
		title: 'ilove 首页'
	}) 
}