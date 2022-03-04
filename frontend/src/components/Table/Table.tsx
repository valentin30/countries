import React, {
    ChangeEventHandler,
    FunctionComponent,
    PointerEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { Country } from '../../dto/Country'
import { QueryTypes, useQuery } from '../../hooks/useQuery'
import * as CountriesService from '../../services/CountryService'
import { Detail } from '../Detail'
import { Pager, PageSizer } from '../Paging'
import { TableHeader } from './TableHeader'
import { LoadingTableRow, TableRow } from './TableRow'
import { Columns } from './types'

const columns: Columns = {
    code: true,
    capital: true,
    name: true,
    flag: true,
    region: true,
    population: true,
    subregion: true
}

const options = [5, 10, 20, 30, 40, 50]

const defaultPage = 1
const defaultSize = 10

export const Table: FunctionComponent = props => {
    const [page, setPage] = useQuery<number>('page', QueryTypes.Number)
    const [size, setSize] = useQuery<number>('size', QueryTypes.Number)

    const [countries, setCounrties] = useState<Country[]>([])
    const [loading, setLoading] = useState<string | null>(null)
    const [active, setActive] = useState<string | null>(null)

    const tableRef = useRef<HTMLDivElement | null>(null)
    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const country = countries.find(c => c.code === active)

    const data = useMemo(() => {
        return countries.slice((page - 1) * size, (page - 1) * size + size)
    }, [countries, page, size])

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

    const sizeChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
        event => {
            const total = countries.length < size * page ? countries.length : size * page
            const newSize = +event.target.value
            const newPage = Math.floor(total / newSize) || 1
            setSize(newSize)
            setPage(newPage)
        },
        [page, size, countries, setPage, setSize]
    )

    useEffect(() => {
        if (!page) setPage(defaultPage)
        if (!size || !options.includes(size)) setSize(defaultSize)
    }, [page, size, setPage, setSize])

    useCallback(() => {
        if (!page) return
        if (tableRef.current.scrollTop !== 0) {
            tableRef.current.scrollTop = 0
        }
    }, [page])

    useEffect(() => {
        // Simulate loading
        CountriesService.getAllCountries().then(data => {
            setTimeout(() => {
                setCounrties(data)
            }, 1250)
        })
    }, [])

    return (
        <>
            {!!country && <Detail country={country} onClose={() => setActive(null)} />}
            <div className='table'>
                <div className={`table__x-scroll-container${data.length ? '' : ' loading'}`} ref={tableRef}>
                    <TableHeader columns={columns} />
                    <div className='table__body'>
                        {data.map(country => (
                            <TableRow
                                key={country.code}
                                country={country}
                                onLongPress={longPressHandler}
                                onLongPressFail={longPressFailHandler}
                                loading={country.code === active || country.code === loading}
                                columns={columns}
                            />
                        ))}

                        {!data.length &&
                            Array(size)
                                .fill(1)
                                .map((_, i) => <LoadingTableRow key={i} columns={columns} />)}
                    </div>
                    <div className='table__footer'>
                        <div className='table__row'>
                            <div className='table__paging'>
                                <PageSizer
                                    selected={size}
                                    options={options}
                                    disabled={!countries.length}
                                    onChange={sizeChangeHandler}
                                />
                                <Pager
                                    page={page}
                                    count={size}
                                    totalCount={countries.length}
                                    onBack={() => setPage(page - 1)}
                                    onNext={() => setPage(page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
