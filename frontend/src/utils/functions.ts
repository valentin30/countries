import { MIN_TIME_FOR_DOWNLOAD } from './constants'

export const simulateDownload = (start: number, cb: () => void) => {
    const duration = Date.now() - start
    const milisToWait = MIN_TIME_FOR_DOWNLOAD - duration
    setTimeout(cb, milisToWait)
}

export const isMobile = () => 'ontouchstart' in document.documentElement
