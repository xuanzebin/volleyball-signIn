const AV = require('../.././libs/av-weapp-min.js')

Page({
  data:{
    fileUrl:[{}],
    foldCheck:[],
    userName:null,
    userId:null
  },
  smilePic(e){
    let { index, bindex } = e.currentTarget.dataset
    let { id }=this.data.fileUrl[bindex].picMessage[index]
    if (this.data.fileUrl[bindex].picMessage[index].frown[this.data.userName]){
      this.frownPic(e)
    }
    let picFile = AV.Object.createWithoutData('_File', id);
    let query = new AV.Query('FileMessage');
    query.equalTo('dependent', picFile);
    query.find().then( (list)=> {
      console.log(list)
      let value=list[0]
      console.log(value)
      let fileUrl = this.data.fileUrl
      console.log(fileUrl)
      if(fileUrl[bindex].picMessage[index].smile[this.data.userName]){
        fileUrl[bindex].picMessage[index].smile[this.data.userName]=false
        fileUrl[bindex].picMessage[index].smile.length--
      } else {
        fileUrl[bindex].picMessage[index].smile[this.data.userName]=true
        fileUrl[bindex].picMessage[index].smile.length++
      }
      this.setData({
        fileUrl
      })
      console.log(111,fileUrl[bindex].picMessage[index].smile)
      let FileMessage = AV.Object.createWithoutData('FileMessage', value.id)
      // 修改属性
      FileMessage.set('smile',JSON.stringify(fileUrl[bindex].picMessage[index].smile ))
      // 保存到云端
      FileMessage.save()
      console.log(value.attributes.smile)
      console.log(value.attributes.frown)
    });
  },
  frownPic(e) {
    let { index, bindex } = e.currentTarget.dataset
    let { id } = this.data.fileUrl[bindex].picMessage[index]
    if (this.data.fileUrl[bindex].picMessage[index].smile[this.data.userName]) {
      this.smilePic(e)
    }
    let picFile = AV.Object.createWithoutData('_File', id);
    let query = new AV.Query('FileMessage');
    query.equalTo('dependent', picFile);
    query.find().then((list) => {
      console.log(list)
      let value = list[0]
      console.log(value)
      let fileUrl = this.data.fileUrl
      console.log(fileUrl)
      if (fileUrl[bindex].picMessage[index].frown[this.data.userName]) {
        fileUrl[bindex].picMessage[index].frown[this.data.userName] = false
        fileUrl[bindex].picMessage[index].frown.length--
      } else {
        fileUrl[bindex].picMessage[index].frown[this.data.userName] = true
        fileUrl[bindex].picMessage[index].frown.length++
      }
      this.setData({
        fileUrl
      })
      console.log(111, fileUrl[bindex].picMessage[index].frown)
      let FileMessage = AV.Object.createWithoutData('FileMessage', value.id)
      // 修改属性
      FileMessage.set('frown', JSON.stringify(fileUrl[bindex].picMessage[index].frown))
      // 保存到云端
      FileMessage.save()
      console.log(value.attributes.smile)
      console.log(value.attributes.frown)
    });
  },
  onShow:function(e){
    this.setData({
      fileUrl: [{}],
      foldCheck: []
    })
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    console.log('user',user)
    this.setData({
      userName:user.attributes.nickName,
      userId:user.id
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
    // setTimeout(()=>{
      
    new AV.Query('_File')
      .ascending('createdAt')
      .find()
      .then(todos => {
        let array = []
        let fileUrl = this.data.fileUrl

        Promise.all(todos.map((value, index) => {
          let id = value.id
          let picFile = AV.Object.createWithoutData('_File', id);
          let query = new AV.Query('FileMessage');
          query.equalTo('dependent', picFile);

          return query.find()

          // query.find().then((list) => {
         
          // });
        })).then((res) => {
          todos.forEach((value,index)=>{
            let id = value.id   
            let owner = value.attributes.metaData.owner
            let month = 1 + value.createdAt.getMonth()
            let time = value.createdAt.getFullYear() + '-' + month + '-' + value.createdAt.getDate()
            let { url } = value.attributes
            let smile
            let frown
            console.log(res)
            let secure = { "length": 0 }
            smile =JSON.parse(res[index][0].attributes.smile) || secure
            frown =JSON.parse(res[index][0].attributes.frown) || secure
            let picMessage = { url, owner, id, smile, frown }
            if (time === this.data.fileUrl[0].time) {
              fileUrl[0].picMessage.unshift(picMessage)
            } else {
              let newPic = {
                time,
                picMessage: [picMessage]
              }
              if (JSON.stringify(fileUrl[0]) === '{}') {
                fileUrl[0] = newPic
              } else {
                fileUrl.unshift(newPic)
              }
            }
            this.setData({ fileUrl })
          })
          // console.log(res,11)
        })
      })
      .catch(console.error);

    // },250)
  },
  upload:function(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=> {
        let tempFilePath = res.tempFilePaths[0];
        let fileObject=new AV.File('file-name', {
          blob: { 
            uri: tempFilePath,
          },
        }).save().then(
          file => {
            let fileUrl = this.data.fileUrl
            let month = 1 + new Date().getMonth()
            let time = new Date().getFullYear() + '-' + month + '-' + new Date().getDate()
            let url=file.url()
            let owner = file.attributes.metaData.owner
            let id=file.id
            let newFile = AV.Object.createWithoutData('_File', id);
            let FileMessage = new AV.Object('FileMessage');
            FileMessage.set('smile', '{"length":0}');
            FileMessage.set('frown','{"length":0}')
            FileMessage.set('dependent', newFile);
            FileMessage.save();
            let smile={"length":0}
            let frown={"length":0}
            let picMessage={url,owner,id,smile,frown}
            if (time === this.data.fileUrl[0].time) {
              fileUrl[0].picMessage.unshift(picMessage)
            } else {
              let newPic = {
                time,
                picMessage: [picMessage]
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
  deletePic(e){
    let {bindex,index} = e.currentTarget.dataset
    let form = AV.Object.createWithoutData('_File', this.data.fileUrl[bindex].picMessage[index].id);
    form.destroy().then((success) => {
      // console.log('删除成功')
      let fileUrl = this.data.fileUrl
      fileUrl[bindex].picMessage.splice(index, 1)
      this.setData({ fileUrl })
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }, function (error) {
      // console.log('删除失败')
    });
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

