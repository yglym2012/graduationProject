var Project = require('../models/project')
var _ = require('underscore')
var config = require('../../config/config.js')

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
      agencyAbstract: projectObj.agencyAbstract,//承接单位资质介绍
      fundAppropriation: {
        //省财政厅
        departmentOfFinance: {
          account: config.account.departmentOfFinance,
          amount: config.ratioOfContributions.departmentOfFinance*projectObj.budget,
          //deadline: projectObj.createAt + 2*1000*60*60*24,
          sequenceNumber: config.sequenceNumber.departmentOfFinance
        },
        //银行
        commercialBank: {
          account: config.account.commercialBank,
          amount: config.ratioOfContributions.commercialBank*projectObj.budget,
          //deadline: projectObj.createAt + 3*1000*60*60*24,
          sequenceNumber: config.sequenceNumber.commercialBank
        },
        //有限合伙公司
        spv: {
          account: config.account.spv,
          amount: config.ratioOfContributions.spv*projectObj.budget,
          //deadline: projectObj.createAt + 4*1000*60*60*24,
          sequenceNumber: config.sequenceNumber.spv
        },
        //初始化省财政厅的 银行账号 拨款金额 截止时间 顺序编号信息
        bureauOfFinance: {
          account: config.account.bureauOfFinance,
          amount: config.ratioOfContributions.bureauOfFinance*projectObj.budget,
          //deadline: projectObj.createAt + 1000*60*60*24,
          sequenceNumber: config.sequenceNumber.bureauOfFinance
        },
        //县基金公司
        fundCompany: {
          account: config.account.fundCompany,
          amount: config.ratioOfContributions.fundCompany*projectObj.budget,
          //deadline: projectObj.createAt + 5*1000*60*60*24,
          sequenceNumber: config.sequenceNumber.fundCompany
        }
      }
    })

    _project.save(function(err, project) {
      if (err) {
        console.log(err)
      }
      res.redirect('/project/' + project._id)
    })  
  }
}

// 对账
exports.check = function(req, res) {
  //先检查权限，是不是该他拨款
  var _user = req.session.user
  var id = req.body.project._id
  var projectObj = req.body.project
  var _project

  var actualAmount = req.body.amount
  var serialNumber = req.body.serialNumber
  console.log(actualAmount)
  console.log(serialNumber)

  //先查出要拨款的项目的数据对象
  Project.findById(id, function(err, project) {
      if (err) {
      console.log(err)
    }
    //检查权限
    /*if (_user.role !== project.fundAppropriation.currentSequenceNumber) {*/
    if (_user.role > 0) {
      res.redirect('/')
    }

    switch(project.fundAppropriation.currentSequenceNumber)
    {
      case 100:
        console.log('jindao 100 le 1!!!!!!!!!!!!!!!!!!!!!!!')
        project.fundAppropriation.bureauOfFinance.actualAmount = actualAmount
        project.fundAppropriation.bureauOfFinance.actualTimeOfRemit =Date.now()
        project.fundAppropriation.bureauOfFinance.serialNumber = serialNumber
        console.log('project.fundAppropriation.bureauOfFinance.actualTimeOfRemit')
        break;
      case 2:
        project.fundAppropriation.departmentOfFinance.actualAmount = actualAmount
        project.fundAppropriation.departmentOfFinance.actualTimeOfRemit =Date.now()
        project.fundAppropriation.departmentOfFinance.serialNumber = serialNumber
        break;
      case 3:
        project.fundAppropriation.commercialBank.actualAmount = actualAmount
        project.fundAppropriation.commercialBank.actualTimeOfRemit =Date.now()
        project.fundAppropriation.commercialBank.serialNumber = serialNumber
        break;
      case 4:
        project.fundAppropriation.spv.actualAmount = actualAmount
        project.fundAppropriation.spv.actualTimeOfRemit =Date.now()
        project.fundAppropriation.spv.serialNumber = serialNumber
        break;
      case 5:
        project.fundAppropriation.fundCompany.actualAmount = actualAmount
        project.fundAppropriation.fundCompany.actualTimeOfRemit =Date.now()
        project.fundAppropriation.fundCompany.serialNumber = serialNumber
        break;
    }

    
    project.save(function(err, project) {
      if (err) {
        console.log(err)
      }

      res.redirect('/project/' + project._id)
    })
  })
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