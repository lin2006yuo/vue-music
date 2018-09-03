import { commonParams, options } from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getTopList() {
    const url = '/api/getTopList'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1,
        rnd: Math.random(),
        format: 'json',
        notice: 0,
        g_tk: 5381
    })
    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getDetailTopList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        page: 'detail',
        tpl: 3,
        topid: topid,
        type: 'top',
        needNewCode: 1,
    })

    return jsonp(url, data, options)
}