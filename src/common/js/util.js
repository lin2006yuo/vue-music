export function shuffle(arr) {
    let len = [...arr]
    len.sort((a, b) => {
        return 0.5 - Math.random()
    })
    return len
}


//节流
export function debounce(func, delay) {
    let timer 
    
    return function (...args) {
        if(timer){
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}