export const hump = (str: string, sign: string) => {
    const strs = str.split(sign)
    let result = ''
    for (let i = 0, len = strs.length; i < len; i++) {
        if (i !== 0) {
            strs[i] = strs[i].charAt(0).toLocaleUpperCase() + strs[i].slice(1)
        }
    }
    return strs.join('')
}