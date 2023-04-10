import { MessageBox, Message } from 'element-ui'

export function errorHandler(res) {
  const url = res.config.url;
  if(url.includes('/api/scenario')) {
    scenarioErrorHandler(res);
  } else {
    scenarioErrorHandler(res);
  }
}

function scenarioErrorHandler(res) {
  // console.log(res);
  if(res.data.includes('0 invalid subnet size, must be positive int')) {
    showErrorMsg('存在空子网！请检查并保证每个子网内至少有1个主机！');
  } else if (res.data.includes('Number of sensitive hosts must be >= 1: 0 not >= 1')) {
    showErrorMsg('网络中敏感主机的数量为0，需包含至少一个敏感主机作为目标主机！')
  } else {
    showErrorMsg(res.data);
  }
}

function showErrorMsg(msg) {
  Message({
    message: msg,
    type: 'error',
    duration: 3 * 1000
  })
}