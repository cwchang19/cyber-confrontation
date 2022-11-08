import request from '@/utils/request'

export function getScenarioList(params) {
  return request({
    url: '/vue-admin-template/scenario/list',
    method: 'get',
    params
  })
}

export function addScenario(data) {
  return request({
    url: '/vue-admin-template/scenario/add',
    method: 'post',
    data
  })
}
