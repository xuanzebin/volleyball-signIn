const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

Page({
  data:{
    formOwner:null,
    creater:null
  },
  onReady(){
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    this.setData({formOwner:user.id,creater:user.attributes.nickName})
  },
  signformSubmit:function(e){
    if (app.data.createCheck) return
    app.data.createCheck = true
    let newForm=e.detail.value
    var FormList = AV.Object.extend('formList')
    // 新建对象
    var formList = new FormList()
    // 设置名称
    formList.set('name', newForm.name)
    formList.set('creater', newForm.creater)
    formList.set('time', newForm.time);
    formList.set('remarks', newForm.remarks)
    formList.set('signIn','{}')
    formList.set('leave','{}')
    formList.set('owner',this.data.formOwner)
    // 设置优先级
    formList.save().then(function (formList) {
      newForm.signIn={}
      newForm.leave={}
      newForm.id=formList.id
      app.data.formList.unshift(newForm)
      wx.showToast({
        title: '创建成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      },500)
    }, (error)=> {
      app.data.createCheck = false
      wx.showToast({
        title: '加载失败请重试',
        icon: 'none',
        duration: 2000
      })
      console.error(error);
    });
  },
  onShareAppMessage: function () {
    return {

      title: `少年，约球吗？${this.data.creater}邀请你火速前往球场！与他一同甜蜜双排~`,

      desc: `天气如此晴朗，一起打个球吧~`,

      path: '/pages/index/index',

      imageUrl: 'https://upload-images.jianshu.io/upload_images/11958479-7d537d727ac02e4c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'

    }
  }
})
