import request from '@/utils/request'

export function searchScenario(params) {
  return request({
    url: '/api/scenario',
    method: 'get',
    params: params
  })
}

export function searchScenarioById(id) {
  return request({
    url: '/api/scenario/' + id,
    method: 'get',
  })
}

export function searchScenarioAll() {
  return request({
    url: '/api/scenario/all',
    method: 'get'
  })
}

export function addScenario(params, data) {
  return request({
    url: '/api/scenario/',
    method: 'post',
    params: params,
    data
  })
}

export function alterScenario(id, params, data) {
  return request({
    url: '/api/scenario/' + id,
    method: 'put',
    params: params,
    data
  })
}

export function deleteScenario(id) {
  return request({
    url: '/api/scenario/' + id,
    method: 'delete',
  })
}

export function generateScenario(params) {
  return request({
    url: '/api/scenario/generate',
    method: 'get',
    params: params
  })
}
