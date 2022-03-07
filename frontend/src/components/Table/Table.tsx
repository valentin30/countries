import React, {
    FunctionComponent,
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react'
import { Country } from '../../dto/Country'
import { QueryTypes, useQuery } from '../../hooks/useQuery'
import * as CountriesService from '../../services/CountryService'
import { INIT_PAGE, INIT_SIZE, PAGE_SIZES, TableColumns, Map } from '../../utils/constants'
import { isMobile, simulateDownload } from '../../utils/functions'
import { Actions, initialState, reducer } from '../../utils/reducer'
import { ErrorPopup } from '../ErrorPopup'
import { MultipleSelect } from '../MultipleSelect'
import { TableBody } from './TableBody'
import { TableFooter } from './TableFooter'
import { TableHeader } from './TableHeader'
export interface Sort {
    name: TableColumns
    direction: 1 | -1
}

const getRegionSubRegionMaps = (list: Country[]) => {
    return list.reduce(
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
}

export const Table: FunctionComponent = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)

    const [sort, setSort] = useState<Sort>({
        name: TableColumns.CODE,
        direction: 1
    })

    const [name, setName] = useState<string>('')
    const [selectedRegions, setSelectedRegions] = useState<string[]>([])
    const [selectedSubRegions, setSelectedSubRegions] = useState<string[]>([])

    const tableRef = useRef<HTMLDivElement | null>(null)
    const tableTop = useRef(0)

    const filteredByName = useMemo(() => {
        return state.list.filter(country => country.name.toLowerCase().includes(name.toLowerCase()))
    }, [state, name, selectedRegions, selectedSubRegions])

    const filtered = useMemo(() => {
        return state.list.filter(country => {
            if (!country.name.toLowerCase().includes(name.toLowerCase())) return false
            if (selectedRegions.length && !selectedRegions.includes(country.region)) return false
            if (selectedSubRegions.length && !selectedSubRegions.includes(country.subregion)) return false
            return true
        })
    }, [state, name, selectedRegions, selectedSubRegions])

    const [regions, subRegions] = useMemo(() => getRegionSubRegionMaps(state.list), [state])
    const [filteredRegions, filteredSubRegions] = useMemo(
        () => getRegionSubRegionMaps(filteredByName),
        [filteredByName]
    )

    const totalCount = filtered.length

    const sorted = useMemo(() => {
        const sorted = filtered.sort((a, b) => {
            switch (sort.name) {
                case TableColumns.CAPITAL:
                    if (!a.capitalName) return 1
                    if (!b.capitalName) return -1
                    return a.capitalName.localeCompare(b.capitalName) * sort.direction
                case TableColumns.POPULATION:
                    if (!a.population) return 1
                    if (!b.population) return -1
                    return (a.population - b.population) * sort.direction
                default:
                    if (!a[sort.name]) return 1
                    if (!b[sort.name]) return -1
                    return a[sort.name].localeCompare(b[sort.name]) * sort.direction
            }
        })
        return sorted.slice((page - 1) * size, (page - 1) * size + size)
    }, [page, size, sort, filtered])

    const sortChangeHandler = useCallback<MouseEventHandler<HTMLButtonElement>>(e => {
        const name = e.currentTarget.dataset.sort as TableColumns
        tableTop.current = tableRef.current.scrollTop
        setSort(s => ({
            name,
            direction: name === s.name ? (-s.direction as -1 | 1) : 1
        }))
    }, [])

    const getCountriesData = useCallback(() => {
        const start = Date.now()
        dispatch({ type: Actions.REQUEST })
        CountriesService.getAllCountries()
            .then(data => simulateDownload(start, () => dispatch({ type: Actions.RESPONSE, payload: data })))
            .catch(() => simulateDownload(start, () => dispatch({ type: Actions.ERROR })))
    }, [])

    useEffect(() => {
        const firstElementNumberOnPage = (page - 1) * size + 1
        if (firstElementNumberOnPage > totalCount) setPage(INIT_PAGE)
    }, [totalCount, setPage, page, size])

    useEffect(() => {
        if (!size || !PAGE_SIZES.includes(size)) setSize(INIT_SIZE)
    }, [size, setSize])

    useEffect(() => {
        if (!page) setPage(INIT_PAGE)
        tableRef.current.scrollTop = 0
    }, [page, setPage])

    useEffect(() => {
        if (tableRef.current.scrollTop === tableTop.current) return
        tableRef.current.scrollTop = tableTop.current
    }, [sort])

    useEffect(getCountriesData, [getCountriesData])

    const [vissible, setVissible] = useState(false)

    return (
        <>
            <ErrorPopup error={state.error} onClick={getCountriesData} />
            <div className='table'>
                <div className={`table__x-scroll-container${state.list.length ? '' : ' loading'}`} ref={tableRef}>
                    <TableHeader
                        onSort={sortChangeHandler}
                        onFilterOpen={() => setVissible(true)}
                        sort={sort}
                        hasActiveFilters={!!name || !!selectedRegions.length || !!selectedSubRegions.length}
                    />
                    <TableBody error={state.error} loading={state.loading} list={sorted} />
                    <TableFooter totalCount={totalCount} />
                </div>
            </div>
            {vissible && (
                <>
                    <div className='filters__helper' onClick={() => setVissible(false)} />
                    <div className='filters__container'>
                        <div className='filters__name'>
                            <label className='filters__label' htmlFor='filter-name'>
                                Name
                            </label>
                            <input
                                id='filter-name'
                                type='text'
                                name='filter name'
                                placeholder='Enter keyword to filter results'
                                value={name}
                                onChange={e => setName(e.target.value.trim())}
                            />
                        </div>
                        <MultipleSelect
                            value={selectedRegions}
                            onClear={() => setSelectedRegions([])}
                            onChange={e => {
                                const { checked, value } = e.target as any
                                if (checked) setSelectedRegions(r => [...r, value])
                                else setSelectedRegions(r => r.filter(v => v !== value))
                            }}
                            name='Regions'
                            full={regions}
                            filtered={filteredRegions}
                        />
                        <MultipleSelect
                            value={selectedSubRegions}
                            onClear={() => setSelectedSubRegions([])}
                            onChange={e => {
                                const { checked, value } = e.target as any
                                if (checked) setSelectedSubRegions(r => [...r, value])
                                else setSelectedSubRegions(r => r.filter(v => v !== value))
                            }}
                            name='Subregions'
                            full={subRegions}
                            filtered={filteredSubRegions}
                        />
                    </div>
                </>
            )}
        </>
    )
}
