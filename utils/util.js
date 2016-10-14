function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function pickKvFromArray(array, keys) {
  if (!array instanceof Array || !keys instanceof Array) {
    return {}
  }

  return array.map(item => {
      var pickData = {};

  keys.forEach(key => {
    var value = item[key];

  if (value) {
    pickData[key] = value;
  }

})

  return pickData;
})
}

module.exports = {
  formatTime: formatTime,
  pickKvFromArray: pickKvFromArray
}

