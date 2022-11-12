import request from '@/utils/request'

export function searchScenario(params) {
  return request({
    url: '/api/scenario',
    method: 'get',
    params: params
  })
}

export function addScenario(data) {
  return request({
    url: '/api/scenario',
    method: 'post',
    data
  })
}

export function alterScenario(params, data) {
  return request({
    url: '/api/scenario',
    method: 'put',
    params: params,
    data
  })
}

export function deleteScenario(params) {
  return request({
    url: '/api/scenario',
    method: 'delete',
    params: params
  })
}
