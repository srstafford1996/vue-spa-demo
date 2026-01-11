/*
// shared/util.ts
//
// shared utility functions
*/
const MONTH_STRING = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseUINumber(n?: number, singOrPlural?: [string, string]): string {
    let s = ''
    if (n == undefined) return s
    
    if (n != undefined) {

        if (n > 1000000) {
            s += `${(n / 1000000).toFixed(1)}M`
        } else if (n > 1000) {
            s += `${(n / 1000).toFixed(1)}K`
        } else {
            s += String(n)
        }
    }    

    if (singOrPlural != undefined) {
        if (n == 1) s += ` ${singOrPlural[0]}`
        else s += ` ${singOrPlural[1]}`
    }

    return s
}

export function parseUIDate(dateString: string): string {
    const date = new Date(dateString)

    // To express time passed (e.g. "4h" ago)
    const secondsPassed = (Date.now() - date.getTime()) / 1000

    // Longer than a day, just return the string
    if (secondsPassed >= 86400) {
        return `${MONTH_STRING[date.getMonth()]!} ${date.getDate() + 1}, ${date.getFullYear()}`
    }

    if (secondsPassed < 60) {
        return `${secondsPassed}s`
    } 

    if (secondsPassed < 3600) {
        return `${secondsPassed / 60}h`
    }

    let s = ''
    return s;
}