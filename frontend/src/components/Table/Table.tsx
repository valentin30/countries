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
import * as CountriesService from '../../services/CountryService'
import { Detail } from '../Detail'
import { Pager, PageSizer } from '../Paging'
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
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

export const Table: FunctionComponent = props => {
    const params = useRef(new URLSearchParams(window.location.search))
    const [countries, setCounrties] = useState<Country[]>([])
    const [page, setPage] = useState<number>(+(params.current.get('page') ?? 1))
    const [size, setSize] = useState<number>(+(params.current.get('size') ?? 20))
    const [loading, setLoading] = useState<string | null>(null)
    const [active, setActive] = useState<string | null>(null)
    const tableRef = useRef<HTMLDivElement | null>(null)
    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const country = countries.find(c => c.code === active)

    const data = useMemo(() => countries.slice((page - 1) * size, (page - 1) * size + size), [countries, page, size])

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

    const sizeCahngeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(event => {
        setSize(size => {
            const newSize = +event.target.value
            setPage(page => Math.floor((size * page) / newSize) || 1)
            return newSize
        })
    }, [])

    useEffect(() => {
        setTimeout(() => {
            CountriesService.getAllCountries().then(setCounrties)
        }, 1000)
    }, [])

    useEffect(() => {
        params.current.set('page', `${page}`)
        params.current.set('size', `${size}`)
        window.history.replaceState(null, null, `${window.location.origin}?${params.current.toString()}`)
        if (tableRef.current.scrollTop !== 0) {
            tableRef.current.scrollTop = 0
        }
    }, [page, size])

    useEffect(() => {
        document.body.addEventListener('resize', () => {
            alert('resize')
        })
    })

    return (
        <>
            {!!country && <Detail country={country} onClose={() => setActive(null)} />}
            <div className='table'>
                <div className='table__x-scroll-container' ref={tableRef}>
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
                            Array(size > 11 ? 11 : size)
                                .fill(1)
                                .map((_, i) => <div key={i} className='table__row'></div>)}
                    </div>
                    <div className='table__footer'>
                        <div className='table__row'>
                            <div className='table__paging'>
                                <PageSizer selected={size} options={options} onChange={sizeCahngeHandler} />
                                <Pager
                                    page={page}
                                    count={size}
                                    totalCount={countries.length}
                                    onBack={() => setPage(page => page - 1)}
                                    onNext={() => setPage(page => page + 1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
