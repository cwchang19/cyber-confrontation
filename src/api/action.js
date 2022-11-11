import request from '@/utils/request'

export function searchActionByCondition(params) {
  return request({
    url: '/api/action',
    method: 'get',
    params: params
  })
}

export function addAction(data) {
  return request({
    url: '/api/action',
    method: 'post',
    data
  })
}

export function alterAction(params, data) {
  return request({
    url: '/api/action',
    method: 'put',
    params: params,
    data
  })
}

export function deleteAction(params) {
  return request({
    url: '/api/action',
    method: 'delete',
    params: params
  })
}