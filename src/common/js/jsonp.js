import Jsonp from 'jsonp'

export default function jsonp(url, data, options) {
    url += (url.indexOf('?')<0 ? '?' : '&') + param(data)
    return new Promise((resolve, reject) => {
        Jsonp(url, options, (err, data) => {
            if(!err){
                resolve(data)
            }else{
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = ''
    let value
    for(let k in data){
        value = data[k] !== 'undefined' ? data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
}