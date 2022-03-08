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
import { MultipleSelect } from '../MultipleSelect'
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
    const [state, dispatch] = useReducer(reducer, initialState)

    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)

    const [open, setOpen] = useState<boolean>(false)
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
    }, [state, name])

    const filtered = useMemo(() => {
        return getSortedList(
            filteredByName.filter(country => {
                if (selectedRegions.length && !selectedRegions.includes(country.region)) return false
                if (selectedSubRegions.length && !selectedSubRegions.includes(country.subregion)) return false
                return true
            }),
            sort.name,
            sort.direction
        )
    }, [filteredByName, selectedRegions, selectedSubRegions, sort])

    const [regions, subRegions] = useMemo(() => getRegionSubRegionMaps(state.list), [state])
    const [filteredRegions, filteredSubRegions] = useMemo(
        () => getRegionSubRegionMaps(filteredByName),
        [filteredByName]
    )

    const totalCount = filtered.length
    const sorted = filtered.slice((page - 1) * size, (page - 1) * size + size)

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
            {open && (
                <>
                    <div className='filters__helper' onClick={() => setOpen(false)} />
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
                                onChange={event => setName(event.target.value.trim())}
                            />
                        </div>
                        <MultipleSelect
                            value={selectedRegions}
                            onClear={() => setSelectedRegions([])}
                            onChange={multiSelectChangeHandlerGenerator(setSelectedRegions)}
                            name='Regions'
                            full={regions}
                            filtered={filteredRegions}
                        />
                        <MultipleSelect
                            value={selectedSubRegions}
                            onClear={() => setSelectedSubRegions([])}
                            onChange={multiSelectChangeHandlerGenerator(setSelectedSubRegions)}
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
