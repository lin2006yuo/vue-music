import { commonParams, options } from './config'
import axios from 'axios'

export function getHotKey() {
    const url = '/api/getHotKey'
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        _: 1534733467641      
    })

    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function search(query, page, zhida, perpage = 20) {
    const url = '/api/search'
    const data = Object.assign({}, commonParams, {
        w: query,
        p: page,
        catZhida: zhida ? 1 : 0,
        zhidaqu: 1,
        perpage: perpage,
        n: perpage,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        remoteplace: 'txt.mqq.all',
        _: 1534737410607,
        uni: 0,
        needNewCode: 1,
        platform: 'h5'
    })
    
    return axios(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}