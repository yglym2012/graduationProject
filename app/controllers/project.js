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

// admin post 
exports.save = function(req, res) {
  var id = req.body.project._id
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

//审核之后，更新信息
exports.updateAfterAudit = function(req, res) {
  var id = req.body.project._id
  var projectObj = req.body.project
  var _project

  Project.findById(id, function(err, project) {
    if (err) {
      console.log(err)
    }

    //将projectObj对象中的所有属性拷贝到project对象中，并返回project对象
    _project = _.extend(project, projectObj)
    //更新各个机构的deadline
    var t1 = new Date()
    //县财政局T+1
    t1.setDate(t1.getDate() + 1)
    _project.fundAppropriation.bureauOfFinance.deadline = t1
    //省财政厅T+2
    var t2 = new Date()
    t2.setDate(t2.getDate() + 2)
    _project.fundAppropriation.departmentOfFinance.deadline = t2
    //商业银行T+3
    var t3 = new Date()
    t3.setDate(t3.getDate() + 3)
    _project.fundAppropriation.commercialBank.deadline = t3
    //SPVT+4
    var t4 = new Date()
    t4.setDate(t4.getDate() + 4)
    _project.fundAppropriation.spv.deadline = t4
    //县脱贫基金公司T+5
    var t5 = new Date()
    t5.setDate(t5.getDate() + 5)
    _project.fundAppropriation.fundCompany.deadline = t5
    
    _project.save(function(err, project) {
      if (err) {
        console.log(err)
      }

      res.redirect('/project/' + project._id)
    })
  })
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

  //先查出要拨款的项目的数据对象
  Project.findById(id, function(err, project) {
      if (err) {
      console.log(err)
    }
    //检查权限
    /*if (_user.role !== project.fundAppropriation.currentSequenceNumber) {*/
    if (_user.role < 0) {
      res.redirect('/')
    }


    switch(_user.role)
    {
      case 100:
        project.fundAppropriation.bureauOfFinance.actualAmount = actualAmount
        project.fundAppropriation.bureauOfFinance.actualTimeOfRemit =Date.now()
        project.fundAppropriation.bureauOfFinance.serialNumber = serialNumber
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

    project.fundAppropriation.currentSequenceNumber++
    
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
  var page = parseInt(req.query.page, 10)
  var count = 5
  var index = page * count
  Project.fetch(function(err, projects){
    if (err) {
      console.log(err)
    }
    var showedProjects = projects.slice(index, index + count)
    res.render('list', {
      title: 'ilove 列表页',
      currentPage: (page + 1),
      totalPage: Math.ceil(projects.length / count),
      projects: showedProjects,
      allProjects: projects
    })
  })
}