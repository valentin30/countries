import React, {
    ChangeEventHandler,
    FunctionComponent,
    MouseEventHandler,
    PointerEventHandler,
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
import { Columns, TableColumns } from '../../types'
import { INIT_PAGE, INIT_SIZE, MIN_TIME_FOR_DOWNLOAD, PAGE_SIZES } from '../../utils/constants'
import { Detail } from '../Detail'
import { Pager, PageSizer } from '../Paging'
import { TableHeader } from './TableHeader'
import { LoadingTableRow, TableRow } from './TableRow'
import { ErrorPopup } from '../ErrorPopup'
import { Actions, initialState, reducer } from '../../utils/reducer'

const columns: Columns = {
    code: true,
    capital: true,
    name: true,
    flag: true,
    region: true,
    population: true,
    subregion: true
}

const setValueAfterTime = (start: number, cb: () => void) => {
    const duration = Date.now() - start
    const milisToWait = MIN_TIME_FOR_DOWNLOAD - duration
    setTimeout(cb, milisToWait)
}

export interface Sort {
    name: TableColumns
    direction: 1 | -1
}

export const Table: FunctionComponent = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)

    // const [countries, setCounrties] = useState<Country[]>([])
    const [loading, setLoading] = useState<string | null>(null)
    const [active, setActive] = useState<string | null>(null)
    // const [error, setError] = useState<Error | null>(null)
    const [sort, setSort] = useState<Sort>({
        name: TableColumns.CODE,
        direction: 1
    })

    const tableRef = useRef<HTMLDivElement | null>(null)
    const tableTop = useRef(0)
    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const country = state.list.find(c => c.code === active)

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

    const longPressHandler = useCallback<PointerEventHandler>(event => {
        if (event.button === 0 && event.buttons === 1) {
            // For Chrome, Brave and Firefox event.button === 0 and event.buttons === 1 only on left click
            longPressDebounceTimerId.current = setTimeout(() => {
                setLoading(event.target.closest('.table__row').dataset.code)
                longPressTimeoutId.current = setTimeout(() => {
                    setActive(event.target.closest('.table__row').dataset.code)
                }, 2500)
            }, 500)
        }
    }, [])

    const longPressFailHandler = useCallback<PointerEventHandler>(event => {
        if (longPressDebounceTimerId.current !== null) {
            clearTimeout(longPressDebounceTimerId.current)
            longPressDebounceTimerId.current = null
        }
        if (longPressTimeoutId.current !== null) {
            clearTimeout(longPressTimeoutId.current)
            longPressTimeoutId.current = null
            setLoading(null)
        }
    }, [])

    const sortChangeHandler = useCallback<MouseEventHandler<HTMLButtonElement>>(e => {
        const name = e.currentTarget.dataset.sort as TableColumns
        tableTop.current = tableRef.current.scrollTop
        setSort(s => ({
            name,
            direction: name === s.name ? (-s.direction as -1 | 1) : 1
        }))
    }, [])

    const sizeChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
        event => {
            const total = state.list.length < size * page ? state.list.length : size * page
            const newSize = +event.target.value
            const newPage = Math.floor(total / newSize) || 1
            setSize(newSize)
            setPage(newPage)
        },
        [page, size, state.list, setPage, setSize]
    )

    const getCountriesData = useCallback(() => {
        const start = Date.now()
        dispatch({ type: Actions.REQUEST })
        CountriesService.getAllCountries()
            .then(data => setValueAfterTime(start, () => dispatch({ type: Actions.RESPONSE, payload: data })))
            .catch(error => setValueAfterTime(start, () => dispatch({ type: Actions.ERROR })))
    }, [])

    useEffect(() => {
        if (!page) setPage(INIT_PAGE)
        if (!size || !PAGE_SIZES.includes(size)) setSize(INIT_SIZE)
    }, [page, size, setPage, setSize])

    useEffect(() => {
        if (tableRef.current.scrollTop === tableTop.current) return
        tableRef.current.scrollTop = tableTop.current
    }, [sort])

    useEffect(getCountriesData, [getCountriesData])

    return (
        <>
            <Detail country={country} onClose={() => setActive(null)} />
            <ErrorPopup error={state.error} onClick={getCountriesData} />
            <div className='table'>
                <div className={`table__x-scroll-container${data.length ? '' : ' loading'}`} ref={tableRef}>
                    <TableHeader onSort={sortChangeHandler} sort={sort} columns={columns} />
                    <div className='table__body'>
                        {!state.loading &&
                            data.map(country => (
                                <TableRow
                                    key={country.code}
                                    country={country}
                                    onLongPress={longPressHandler}
                                    onLongPressFail={longPressFailHandler}
                                    loading={country.code === active || country.code === loading}
                                    columns={columns}
                                />
                            ))}
                        {state.loading &&
                            Array(size)
                                .fill(1)
                                .map((_, i) => <LoadingTableRow key={i} columns={columns} />)}
                        {state.error &&
                            Array(size)
                                .fill(1)
                                .map((_, i) => <div className='table__row' key={i} />)}
                    </div>
                    <div className='table__footer'>
                        <div className='table__row'>
                            <div className='table__paging'>
                                <PageSizer
                                    selected={size}
                                    options={PAGE_SIZES}
                                    disabled={!state.list.length}
                                    onChange={sizeChangeHandler}
                                />
                                <Pager
                                    page={page}
                                    count={size}
                                    totalCount={state.list.length}
                                    onBack={() => {
                                        setPage(page - 1)
                                        tableRef.current.scrollTop = 0
                                    }}
                                    onNext={() => {
                                        setPage(page + 1)
                                        tableRef.current.scrollTop = 0
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
