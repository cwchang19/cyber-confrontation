import request from '@/utils/request'

export function searchDirectory(params) {
  return request({
    url: '/api/directory',
    method: 'get',
    params: params
  })
}

export function addDirectory(data) {
  return request({
    url: '/api/directory',
    method: 'post',
    data
  })
}

export function deleteDirectory(params) {
  return request({
    url: '/api/directory',
    method: 'delete',
    params: params
  })
}

export function alterDirectory(params) {
  return request({
    url: '/api/directory',
    method: 'put',
    params: params
  })
}