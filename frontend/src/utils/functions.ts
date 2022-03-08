import { Country } from '../dto/Country'
import { Map, MIN_TIME_FOR_DOWNLOAD, TableColumns } from './constants'

export const simulateDownload = (start: number, cb: () => void) => {
    const duration = Date.now() - start
    const milisToWait = MIN_TIME_FOR_DOWNLOAD - duration
    setTimeout(cb, milisToWait)
}

export const getSortedList = (list: Country[], name: TableColumns, direction: 1 | -1): Country[] => {
    return list.sort((a, b) => {
        switch (name) {
            case TableColumns.CAPITAL:
                if (!a.capitalName) return 1
                if (!b.capitalName) return -1
                return a.capitalName.localeCompare(b.capitalName) * direction
            case TableColumns.POPULATION:
                if (!a.population) return 1
                if (!b.population) return -1
                return (a.population - b.population) * direction
            default:
                if (!a[name]) return 1
                if (!b[name]) return -1
                return a[name].localeCompare(b[name]) * direction
        }
    })
}

export const getRegionSubRegionMaps = (list: Country[]): [Map, Map] => {
    const result = list.reduce(
        ([regions, subRegions]: [Map, Map], country): [Map, Map] => {
            const { region, subregion } = country
            if (!regions[region]) regions[region] = 0
            if (!subRegions[subregion]) subRegions[subregion] = 0
            regions[region]++
            subRegions[subregion]++
            return [regions, subRegions]
        },
        [{}, {}]
    )
    return result
}

export const isMobile = () => 'ontouchstart' in document.documentElement
