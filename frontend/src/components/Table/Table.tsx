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
import { QueryTypes, useQuery } from '../../hooks/useQuery'
import * as CountriesService from '../../services/CountryService'
import { INIT_PAGE, INIT_SIZE, PAGE_SIZES, TableColumns } from '../../utils/constants'
import { simulateDownload } from '../../utils/functions'
import { Actions, initialState, reducer } from '../../utils/reducer'
import { ErrorPopup } from '../ErrorPopup'
import { TableBody } from './TableBody'
import { TableFooter } from './TableFooter'
import { TableHeader } from './TableHeader'
export interface Sort {
    name: TableColumns
    direction: 1 | -1
}

export const Table: FunctionComponent = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)

    const [sort, setSort] = useState<Sort>({
        name: TableColumns.CODE,
        direction: 1
    })

    const tableRef = useRef<HTMLDivElement | null>(null)
    const tableTop = useRef(0)

    const data = useMemo(() => {
        const sorted = state.list.sort((a, b) => {
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
    }, [state, page, size, sort])

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
                <div className={`table__x-scroll-container${data.length ? '' : ' loading'}`} ref={tableRef}>
                    <TableHeader onSort={sortChangeHandler} sort={sort} />
                    <TableBody error={state.error} loading={state.loading} list={data} />
                    <TableFooter totalCount={state.list.length} />
                </div>
            </div>
        </>
    )
}
