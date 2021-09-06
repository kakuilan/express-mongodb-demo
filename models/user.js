var mongoose = require("mongoose");
var Kencrypt = require("@kakuilan/js-helper/lib/encrypt")

//定义用户模型
var userSchema = mongoose.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    createdAt: {type: Date, default: Date.now},
    displayName: String,
    bio: String
});

//获取名称
userSchema.methods.name = function () {
    return this.displayName || this.username;
}

// 保存操作之前的回调函数
userSchema.pre('save', function (done) {
    let user = this
    if (!user.isModified('password')) {
        return done()
    }

    user.password = Kencrypt.md5(user.password)
    return done()
})

// 比较密码
userSchema.methods.checkPassword = function (guess, done) {
    let err = null
    let pwd = Kencrypt.md5(guess.password || '')
    let ret = pwd === this.password
    if (!ret) {
        err = new Error('wrong password!')
    }

    done(err, ret)
}

var User = mongoose.model('User', userSchema)
module.exports = User