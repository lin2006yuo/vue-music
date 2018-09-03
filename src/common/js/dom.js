export function getData(el, name, val) {
    const prefix = 'data-'
    const lname = prefix + name
    if(val){
        return el.setAttribute(lname, val)
    }else{
        return el.getAttribute(lname)
    }
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        O: 'OTransform',
        Moz: 'MozTransform',
        ms: 'msTransform',
        standard: 'transform'
    }

    for(let key in transformNames){
        if(elementStyle[transformNames[key]] !== undefined){
            return key
        }
    }

    return false
})()

export function profixStyle(style) {
    if(vendor === false){
        return false
    }
    if(vendor === 'standard'){
        return style
    }
    return vendor + camelCase(style)
    
}

export function camelCase(params) {
    let arr = params.split('-')
    return arr.reduce((pre, item) => {
        return pre + item.charAt(0).toUpperCase() + item.substring(1)
    },'')
}