import request from '@/utils/request'

export function searchUserByCondition(params) {
  return request({
    url: '/api/user/',
    method: 'get',
    params: params
  })
}

export function searchUserById(params) {
  return request({
    url: '/api/user/' + params,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/',
    method: 'post',
    data
  })
}

export function alterUser(params, data) {
  return request({
    url: '/api/user/' + params,
    method: 'put',
    data
  })
}

export function deleteUser(params) {
  return request({
    url: '/api/user/forever/' + params,
    method: 'delete'
  })
}