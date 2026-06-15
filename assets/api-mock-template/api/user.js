import { request } from './request.js'

export function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'GET',
  })
}
