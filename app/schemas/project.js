var mongoose = require('mongoose');

var orgAttrabutesObj = {
    account: String,
    amount: Number,
    actualAmount: Number,
    deadline: Date,
    actualTimeOfRemit: Date,
    serialNumber: String,
    sequenceNumber: Number
}
var ProjectSchema = new mongoose.Schema({
    name: String,//项目名称
    type: String,//项目类型
    responsibleDepartment: String,//县责任部门
    budget: String,//预算
    beginTime: String,//开始时间
    endTime: String,//介绍时间
    implementationAgency: String,//承接单位
    abstract: String,//项目介绍
    agencyAbstract: String,//承接单位资质介绍
    //申请时间
    createAt: {
        type: Date,
        default: Date.now()
    },
    //审核情况
    audit: {
        auditStatus: {
            type: Number,
            default: 2
        },
        auditInfo: {
            type: String,
            default: null
        }
    },
    //项目进度
    progress: {
        rate: {
            type: Number,
            default: 0
        },
        illustration: {
            type: String,
            default: null
        }
    },
    //资金拨付
    fundAppropriation: {
        //省财政厅
        departmentOfFinance: orgAttrabutesObj,
        //银行
        commercialBank: orgAttrabutesObj,
        //有限合伙公司
        spv: orgAttrabutesObj,
        //县财政局
        bureauOfFinance: orgAttrabutesObj,
        //县基金公司
        fundCompany: orgAttrabutesObj,
        currentSequenceNumber: {
            type: Number,
            default: 1
        }
    }
});

/*// ProjectSchema.pre 表示每次存储数据之前都先调用这个方法
ProjectSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});*/

// ProjectSchema 模式的静态方法
ProjectSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('createAt')
            .exec(cb)
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

// 导出movieSchema模式
module.exports = ProjectSchema