import request from '@/utils/request'

export function searchDirectory(params) {
  return request({
    url: '/api/directory/',
    method: 'get',
    params: params
  })
}

export function addDirectory(data) {
  return request({
    url: '/api/directory/',
    method: 'post',
    data
  })
}

export function deleteDirectory(id) {
  return request({
    url: '/api/directory/' + id,
    method: 'delete',
  })
}

export function alterDirectory(id, data) {
  return request({
    url: '/api/directory/' + id,
    method: 'put',
    data
    // params: params
  })
}