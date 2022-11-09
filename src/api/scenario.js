import request from '@/utils/request'

export function searchScenario(id) {
  return request({
    url: '/vue-admin-template/scenario/search',
    method: 'get',
    params: { id }
  })
}

export function addScenario(data) {
  return request({
    url: '/vue-admin-template/scenario/add',
    method: 'post',
    data
  })
}

export function alterScenario(data) {
  return request({
    url: '/vue-admin-template/scenario/alter',
    method: 'post',
    data
  })
}

export function deleteScenario(data) {
  return request({
    url: '/vue-admin-template/scenario/delete',
    method: 'post',
    data
  })
}
