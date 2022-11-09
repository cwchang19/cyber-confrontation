import request from '@/utils/request'

export function searchTraining(id) {
  return request({
    url: '/vue-admin-template/training/search',
    method: 'get',
    params: { id }
  })
}

export function addTraining(data) {
  return request({
    url: '/vue-admin-template/training/add',
    method: 'post',
    data
  })
}

export function alterTraining(data) {
  return request({
    url: '/vue-admin-template/training/alter',
    method: 'post',
    data
  })
}

export function deleteTraining(data) {
  return request({
    url: '/vue-admin-template/training/delete',
    method: 'post',
    data
  })
}
