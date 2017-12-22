var Project = require('../models/project')
var _ = require('underscore')

// detail page
exports.detail = function(req, res) {
  var id = req.params.id

  Project.findById(id, function(err, project) {
    res.render('detail', {
      title: 'ilove 详情页',
      project: project
    })
  })
}

// 項目申請
exports.new = function(req, res) {
  res.render('admin', {
    title: '項目申請'
  })
}


// 项目审批
exports.audit = function(req, res) {
  var id = req.params.id

  Project.findById(id, function(err, project) {
    res.render('audit', {
      title: 'ilove 审批页',
      project: project
    })
  })
}

// 项目进度
exports.updateProgressRate = function(req, res) {
  var id = req.params.id

  Project.findById(id, function(err, project) {
    res.render('progress', {
      title: 'ilove 进度更新页',
      project: project
    })
  })
}

// 项目拨款
exports.appropriation = function(req, res) {
  var id = req.params.id

  Project.findById(id, function(err, project) {
    res.render('appropriation', {
      title: 'ilove 拨款页',
      project: project
    })
  })
}

// admin post movie
exports.save = function(req, res) {
  var id = req.body.project._id
  var operationId = req.body.project.operationId
  var projectObj = req.body.project
  var _project

  if (id) {
    Project.findById(id, function(err, project) {
      if (err) {
        console.log(err)
      }

      //将projectObj对象中的所有属性拷贝到project对象中，并返回project对象
      _project = _.extend(project, projectObj)
      
      _project.save(function(err, project) {
        if (err) {
          console.log(err)
        }

        res.redirect('/project/' + project._id)
      })
    })
  }
  else {
    _project = new Project({
      name: projectObj.name,//项目名称
      type: projectObj.type,//项目类型
      responsibleDepartment: projectObj.responsibleDepartment,//县责任部门
      budget: projectObj.budget,//预算
      beginTime: projectObj.beginTime,//开始时间
      endTime: projectObj.endTime,//介绍时间
      implementationAgency: projectObj.implementationAgency,//承接单位
      abstract: projectObj.abstract,//项目介绍
      agencyAbstract: projectObj.agencyAbstract//承接单位资质介绍
    })

    _project.save(function(err, project) {
      if (err) {
        console.log(err)
      }
      res.redirect('/project/' + project._id)
    })  
  }
}

// list page
exports.list = function(req, res) {
  Project.fetch(function(err, projects){
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: 'ilove 列表页',
      projects: projects
    })
  })
}