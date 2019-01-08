const AV = require('../.././libs/av-weapp-min.js')

Page({
  data:{
    fileUrl:[{}],
    foldCheck:[],
    userName:null
  },
  onReady:function(e){
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    this.setData({
      userName:user.attributes.nickName
    })
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          // console.log(user.toJSON())
        }).catch(console.error);
      }
    });
    new AV.Query('_File')
      .ascending('createdAt')
      .find()
      .then(todos => {
        let array = []
        let fileUrl = this.data.fileUrl
        todos.forEach((value, index) => {
          let month = 1 + value.createdAt.getMonth()
          let time = value.createdAt.getFullYear() + '-' + month + '-' + value.createdAt.getDate()
          let { url } = value.attributes
          let id = value.id
          if (time===this.data.fileUrl[0].time){
            fileUrl[0].url.unshift(url)
          } else {
            let newPic={  
              time,
              url:[url]
            }
            if (JSON.stringify(fileUrl[0]) === '{}'){
              fileUrl[0]=newPic
            } else {
              fileUrl.unshift(newPic)
            }
          }
        })
        this.setData({fileUrl})
      })
      .catch(console.error);
  },
  upload:function(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: { 
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            let fileUrl = this.data.fileUrl
            let month = 1 + new Date().getMonth()
            let time = new Date().getFullYear() + '-' + month + '-' + new Date().getDate()
            let url=file.url()
            if (time === this.data.fileUrl[0].time) {
              fileUrl[0].url.unshift(url)
            } else {
              let newPic = {
                time,
                url: [url]
              }
              if (JSON.stringify(fileUrl[0]) === '{}') {
                fileUrl[0] = newPic
              } else {
                fileUrl.unshift(newPic)
              }
            }
            this.setData({ fileUrl})
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
          }
        ).catch(console.error);
      }
    })
  }, 
  previewMoreImage(e) {
    let src = e.currentTarget.dataset.src;
    let urlarr = [];
    urlarr.push(src)
    wx.previewImage({
      current: src,
      urls: urlarr
    })
  },
  foldPic(e){
    let index=e.currentTarget.dataset.index
    let foldCheck=this.data.foldCheck
    if (foldCheck[index]){
      foldCheck[index]=false
    } else {
      foldCheck[index] = true
    }
    this.setData({foldCheck})
  },
  onShareAppMessage: function () {
    return {

      title: `少年，约球吗？${this.data.userName}邀请你火速前往球场！与他一同甜蜜双排~`,

      desc: `天气如此晴朗，一起打个球吧~`,

      path: '/pages/index/index',
      
      imageUrl:'https://upload-images.jianshu.io/upload_images/11958479-7d537d727ac02e4c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'

    }
  }
})

