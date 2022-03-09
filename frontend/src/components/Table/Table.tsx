import React, {
    FormEventHandler,
    FunctionComponent,
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react'
import { QueryTypes, useQuery } from '../../hooks/useQuery'
import * as CountriesService from '../../services/CountryService'
import { INIT_PAGE, INIT_SIZE, PAGE_SIZES, TableColumns } from '../../utils/constants'
import { getRegionSubRegionMaps, getSortedList, simulateDownload } from '../../utils/functions'
import { Actions, initialState, reducer } from '../../utils/reducer'
import { ErrorPopup } from '../ErrorPopup'
import { Filters } from '../Filters'
import { TableBody } from './TableBody'
import { TableFooter } from './TableFooter'
import { TableHeader } from './TableHeader'

export interface Sort {
    name: TableColumns
    direction: 1 | -1
}

const multiSelectChangeHandlerGenerator = (
    setState: React.Dispatch<React.SetStateAction<string[]>>
): FormEventHandler<HTMLFieldSetElement> => {
    return event => {
        const { checked, value } = event.target as any
        if (checked) setState(selected => [...selected, value])
        else setState(selected => selected.filter(v => v !== value))
    }
}

export const Table: FunctionComponent = () => {
    const tableRef = useRef<HTMLDivElement | null>(null)
    const tableTop = useRef(0)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)
    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [selectedRegions, setSelectedRegions] = useState<string[]>([])
    const [selectedSubRegions, setSelectedSubRegions] = useState<string[]>([])
    const [sort, setSort] = useState<Sort>({
        name: TableColumns.CODE,
        direction: 1
    })

    const filteredByName = useMemo(() => {
        return state.list.filter(country => country.name.toLowerCase().includes(name.toLowerCase()))
    }, [state, name])
    const filtered = useMemo(
        () =>
            filteredByName.filter(country => {
                if (selectedRegions.length && !selectedRegions.includes(country.region)) return false
                if (selectedSubRegions.length && !selectedSubRegions.includes(country.subregion)) return false
                return true
            }),
        [filteredByName, selectedRegions, selectedSubRegions]
    )
    const [regions, subRegions] = useMemo(() => getRegionSubRegionMaps(state.list), [state])
    const [filteredRegions, filteredSubRegions] = useMemo(
        () => getRegionSubRegionMaps(filteredByName),
        [filteredByName]
    )
    const sorted = useMemo(
        () => getSortedList(filtered, sort.name, sort.direction).slice((page - 1) * size, (page - 1) * size + size),
        [filtered, sort, page, size]
    )
    const totalCount = filtered.length

    const sortChangeHandler: MouseEventHandler<HTMLButtonElement> = e => {
        const name = e.currentTarget.dataset.sort as TableColumns
        tableTop.current = tableRef.current.scrollTop
        setSort(s => ({
            name,
            direction: name === s.name ? (-s.direction as -1 | 1) : 1
        }))
    }

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

    return (
        <>
            <ErrorPopup error={state.error} onClick={getCountriesData} />
            <div className='table'>
                <div className={`table__x-scroll-container${state.list.length ? '' : ' loading'}`} ref={tableRef}>
                    <TableHeader
                        onSort={sortChangeHandler}
                        onFilterOpen={() => setOpen(true)}
                        sort={sort}
                        hasActiveFilters={!!name || !!selectedRegions.length || !!selectedSubRegions.length}
                    />
                    <TableBody error={state.error} loading={state.loading} list={sorted} />
                    <TableFooter totalCount={totalCount} />
                </div>
            </div>
            <Filters
                open={open}
                filterName={name}
                fullRegions={regions}
                fullSubRegions={subRegions}
                selectedRegions={selectedRegions}
                filteredRegions={filteredRegions}
                selectedSubRegions={selectedSubRegions}
                filteredSubRegions={filteredSubRegions}
                onClose={() => setOpen(false)}
                onFilterNameClear={() => setName('')}
                onRegionsClear={() => setSelectedRegions([])}
                onSubRegionsClear={() => setSelectedSubRegions([])}
                onFilterNameChange={event => setName(event.target.value.trim())}
                onRegionsChange={multiSelectChangeHandlerGenerator(setSelectedRegions)}
                onSubRegionsChange={multiSelectChangeHandlerGenerator(setSelectedSubRegions)}
            />
        </>
    )
}
