import request from '@/utils/request'

export function searchActionByCondition(params) {
  return request({
    url: '/api/action/',
    method: 'get',
    params: params
  })
}

export function searchActionById(params) {
  return request({
    url: '/api/action/' + params,
    method: 'get'
  })
}

export function addAction(data) {
  return request({
    url: '/api/action/',
    method: 'post',
    data
  })
}

export function alterAction(params, data) {
  return request({
    url: '/api/action/' + params,
    method: 'put',
    data
  })
}

export function deleteAction(params) {
  return request({
    url: '/api/action/' + params,
    method: 'delete'
  })
}
