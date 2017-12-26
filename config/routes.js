var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Project = require('../app/controllers/project')

module.exports = function(app) {

  // pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.user

    app.locals.user = _user

    next()
  })


  // Index
  app.get('/', Index.index)

  // User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

  // Project
  app.get('/project/:id', Project.detail)
  app.get('/admin/project/new', User.signinRequired, User.adminRequired, Project.new)
  app.get('/admin/project/audit/:id', User.signinRequired, User.adminRequired, Project.audit)
  app.get('/admin/project/updateProgressRate/:id', User.signinRequired, User.adminRequired, Project.updateProgressRate)
  app.get('/admin/project/appropriation/:id', User.signinRequired, User.adminRequired, Project.appropriation)
  app.get('/admin/project/list', User.signinRequired, User.adminRequired, Project.list)
  app.post('/admin/project', User.signinRequired, User.adminRequired, Project.save)
  app.post('/admin/project/check', User.signinRequired, User.adminRequired, Project.check)
  app.post('/admin/project/updateAfterAudit', User.signinRequired, User.adminRequired, Project.updateAfterAudit)
}