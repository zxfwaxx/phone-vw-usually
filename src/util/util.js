import { axios } from "./request"
const mimeMap = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip',
    xml: 'application/xml'
  }
/**
 *下载
 * @param {*} data
 */
export function downloadFileAPI(url, name, isblob = false) {
    let filename = ''
    if (!name) {
      filename = url.substring(url.lastIndexOf('/') + 1)
    } else {
      const houzhui = url.substring(url.lastIndexOf('.'))
      filename = name + houzhui
    }
    var link = document.createElement('a')
    link.download = filename
    link.style.display = 'none'
    link.href = isblob?url = window.URL.createObjectURL(url):url
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 移除blob对象的url
    isblob?window.URL.revokeObjectURL(url):''
}
  
/**
 *  url 转 文件
 * @param {String} filename 文件
 */
export function downloadWebApi (url, filename) {
    return axios({
        url: url,
        method: 'get',
        params:filename,
        responseType: 'blob'
    })
}
  
/**
 * 根据图片路径转64
 * @param {String} img 路径 new Image()
 * @param {String} file 文件
 * 
 */
export function getBase64Image (img) {
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
    var dataURL = canvas.toDataURL('image/' + ext)
    return dataURL
}

export function  getImgObj (img) {
  var image = new Image()
  image.src = img
  image.setAttribute('crossOrigin', 'Anonymous')
  image.onload = function () {
    var base64 = this.getBase64Image(image)
    // document.getElementById('img').src = base64
    var formData = new FormData()
    // 转换base64到file
    var file = this.btof(base64, 'test')
    formData.append('imageName', file)
  }
}

export function  getBase64 (file) {
    return new Promise((resolve, reject) => {
        /// 实例化文件读取对象
        const reader = new FileReader()
        let fileResult = ''
        // 将文件读取为 DataURL,也就是base64编码
        // reader.readAsDataURL(new Blob([file], { type: 'application/pdf;charset=UTF-8' }))
        reader.readAsDataURL(file)
        // 开始转 文件读取成功完成时触发
        reader.onload = function () {
          fileResult = reader.result /// 获得文件读取成功后的DataURL,也就是base64编码
        }
        // 转 失败
        reader.onerror = function (error) {
          reject(error)
        }
        // 转 结束  咱就 resolve 出去
        reader.onloadend = function () {
          resolve(fileResult)
        }
    })
}

/**
 * 下载.xlsx文件
 * @param {String} filename 文件名
 */
const downloadUrl = 'www.xxx.com'
export function downloadXlsx (filename) {
    axios({
      url: downloadUrl,
      method: 'get',
      params: { fileName: filename, delete: true },
      responseType: 'blob'
    }).then(res => {
      resolveBlob(res, mimeMap.xlsx)
    })
}
  
// base转文件
export function base64ToBlob (dataurl) {
    return new Promise((resolve) => {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
    //   const filename = uuid() + '.png'
      const filename = '0' + '.png'
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      const file = new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
      resolve(file)
    })
}
  
// 去掉字符串头尾空格
export  function trim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}


/**
 *
 * @param {*} nums 获取未来过去几天
 * @param {*} falg 未来还是过去
 */
export function customTimes (nums, falg = 0) {
    const currentDay = new Date().getTime()
    let cutTime
    if (falg === 0) {
      cutTime = nums * 24 * 3600 * 1000 + currentDay
    } else {
      cutTime = currentDay - nums * 24 * 3600 * 1000
    }
    return new Date(cutTime)
  }
 
  export  function getDatess () {
    var nowDate = new Date()
    var year = nowDate.getFullYear()
    var month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1)
      : nowDate.getMonth() + 1
    var day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate
      .getDate()
    var dateStr = year + month + day
    return dateStr
  }
  
  // 秒转化成小时，分钟，秒
export function sToTime (times) {
    const time = times
    let h = ''
    let m = ''
    let s = ''
    console.log(time, 'times')
    if (time < 60) {
      return time
    } else if (time < 3600) {
      m = Math.floor(time / 60)
      s = Math.round(time % 60)
      return m + '分' + s + '秒'
    } else {
      h = Math.floor(time / 3600)
      m = Math.floor((time % 3600) / 60)
      s = Math.round(time % 60)
      return h + '时' + m + '分' + s + '秒'
    }
  } 

/** 获取file大小的名称 */
export function fileSize (value) {
  // eslint-disable-next-line eqeqeq
  if (value == null || value == '') {
    return '0 Bytes'
  }
  var unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var index = 0
  var srcsize = parseFloat(value)
  index = Math.floor(Math.log(srcsize) / Math.log(1024))
  var size = srcsize / Math.pow(1024, index)
  //  保留的小数位数
  size = size.toFixed(2)
  return size + unitArr[index]
}

var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子
var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值.10代表X
export function IdCardValidate (idCard) {
  idCard = trim(idCard.replace(/ /g, '')) // 去掉字符串头尾空格
  if (idCard.length === 15) {
    return isValidityBrithBy15IdCard(idCard) // 进行15位身份证的验证
  } else if (idCard.length === 18) {
    var aIdcard = idCard.split('') // 得到身份证数组
    if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(aIdcard)) { // 进行18位身份证的基本验证和第18位的验证
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param aIdcard 身份证号码数组
 * @return
 */
function isTrueValidateCodeBy18IdCard (aIdcard) {
  var sum = 0 // 声明加权求和变量
  if (aIdcard[17].toLowerCase() === 'x') {
    aIdcard[17] = 10 // 将最后位为x的验证码替换为10方便后续操作
  }
  for (var i = 0; i < 17; i++) {
    sum += Wi[i] * aIdcard[i] // 加权求和
  }
  var valCodePosition = sum % 11 // 得到验证码所位置
  if (parseFloat(aIdcard[17]) === ValideCode[valCodePosition]) {
    return true
  } else {
    return false
  }
}

/**
  * 验证18位数身份证号码中的生日是否是有效生日
  * @param idCard 18位书身份证字符串
  * @return
  */
 function isValidityBrithBy18IdCard (idCard18) {
  var year = idCard18.substring(6, 10)
  var month = idCard18.substring(10, 12)
  var day = idCard18.substring(12, 14)
  var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day))
  // 这里用getFullYear()获取年份，避免千年虫问题
  if (parseFloat(tempDate.getFullYear()) !== parseFloat(year) ||
  parseFloat(tempDate.getMonth()) !== parseFloat(month) - 1 ||
  parseFloat(tempDate.getDate()) !== parseFloat(day)) {
    return false
  } else {
    return true
  }
}
/**
   * 验证15位数身份证号码中的生日是否是有效生日
   * @param idCard15 15位书身份证字符串
   * @return
   */
  function isValidityBrithBy15IdCard (idCard15) {
    var year = idCard15.substring(6, 8)
    var month = idCard15.substring(8, 10)
    var day = idCard15.substring(10, 12)
    var tempDate = new Date(year, parseFloat(month) - 1, parseFloat(day))
    // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
    if (parseFloat(tempDate.getYear()) !== parseFloat(year) ||
    parseFloat(tempDate.getMonth()) !== parseFloat(month) - 1 ||
    parseFloat(tempDate.getDate()) !== parseFloat(day)) {
      return false
    } else {
      return true
    }
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob (res, mimeType) {
    const aLink = document.createElement('a')
    var blob = new Blob([res.data], { type: mimeType })
    // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
    var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
    var contentDisposition = decodeURI(res.headers['content-disposition'])
    var result = patt.exec(contentDisposition)
    var fileName = result[1]
    aLink.href = URL.createObjectURL(blob)
    aLink.setAttribute('download', fileName) // 设置下载文件名称
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink)
    window.URL.revokeObjectURL(aLink.href)
  }
  

//阿里云上传
// export function aliUpload (newFile, f = () => { }) {
//   let imgUrl = ''
//   const consat = newFile.name.toString()
//   var name = aliyunPrefix + '/' + getDatess() + '/' + uuid().replace(/-/g, '') + consat.slice(consat.lastIndexOf('.'))
//   return new Promise((resolve, reject) => {
//     client(objdata).multipartUpload(name, newFile, { progress: f }).then(function (res) {
//       if (res.res.status === 200) {
//         if (res.res.requestUrls[0].indexOf('?') !== -1) {
//           imgUrl = res.res.requestUrls[0].slice(0, res.res.requestUrls[0].lastIndexOf('?'))
//         } else {
//           imgUrl = res.res.requestUrls[0]
//         }
//         resolve(imgUrl)
//       }
//     })
//   })
// }


// 格式化文件大小
export function filterSize (size) {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'Kb'
  } else {
    return (size / 1024 / 1024).toFixed(2) + 'M'
  }
}
