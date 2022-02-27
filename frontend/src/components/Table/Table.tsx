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
import { TableHeader } from './TableHeader'
import { TableRow } from './TableRow'
import { Columns } from './types'
import { Pager } from '../Paging'
import { PageSizer } from '../Paging/PageSizer'
import { useLocation, useNavigate } from 'react-router'

interface Props {
    countries: Country[]
    columns: Columns
    code: string | null
    onLongPressSuccess: (code: string) => void
    onLongPressFail: PointerEventHandler
}

const options = [5, 10, 15, 25, 50]

const params = new URLSearchParams(window.location.search)

export const Table: FunctionComponent<Props> = props => {
    const navigate = useNavigate()
    const [page, setPage] = useState<number>(+(params.get('page') ?? 1))
    const [size, setSize] = useState<number>(+(params.get('size') ?? 5))
    const [active, setActive] = useState<string | null>(null)
    const tableBodyRef = useRef<HTMLDivElement | null>(null)
    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressDebounceTimerId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { onLongPressSuccess, onLongPressFail, countries, code } = props
    const data = useMemo(() => countries.slice((page - 1) * size, (page - 1) * size + size), [countries, page, size])

    const longPressHandler = useCallback<PointerEventHandler>(
        event => {
            if (event.button === 0 && event.buttons === 1) {
                // For Chrome, Brave and Firefox event.button === 0 and event.buttons === 1 only on left click
                longPressDebounceTimerId.current = setTimeout(() => {
                    setActive(event.target.closest('.table__row').dataset.code)
                    longPressTimeoutId.current = setTimeout(() => {
                        onLongPressSuccess(event.target.closest('.table__row').dataset.code)
                    }, 2500)
                }, 500)
            }
        },
        [onLongPressSuccess]
    )

    const longPressFailHandler = useCallback<PointerEventHandler>(
        event => {
            if (longPressDebounceTimerId.current !== null) {
                clearTimeout(longPressDebounceTimerId.current)
                longPressDebounceTimerId.current = null
            }
            if (longPressTimeoutId.current !== null) {
                clearTimeout(longPressTimeoutId.current)
                longPressTimeoutId.current = null
                setActive(null)
                onLongPressFail(event)
            }
        },
        [onLongPressFail]
    )

    const nextPageHandler = useCallback(() => {
        setPage(page => {
            params.set('page', `${page + 1}`)
            navigate(`${window.location.pathname}?${params.toString()}`)
            return page + 1
        })
    }, [])

    const prevPageHandler = useCallback(() => {
        setPage(page => {
            params.set('page', `${page - 1}`)
            navigate(`${window.location.pathname}?${params.toString()}`)
            return page - 1
        })
    }, [])

    const sizeCahngeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(event => {
        params.set('size', event.target.value)
        setSize(size => {
            const newSize = +event.target.value
            setPage(page => {
                const to = size * page
                const newPage = Math.floor(to / newSize) || 1
                params.set('page', `${newPage}`)
                navigate(`${window.location.pathname}?${params.toString()}`)
                return newPage
            })
            return newSize
        })
    }, [])

    useEffect(() => {
        if (tableBodyRef.current.scrollTop !== 0) {
            tableBodyRef.current.firstChild.scrollIntoView({ behavior: 'smooth' })
        }
    }, [page])

    return (
        <div className='table'>
            <div className='table__x-scroll-container'>
                <TableHeader columns={props.columns} />
                <div ref={tableBodyRef} className='table__body'>
                    {data.map(country => (
                        <TableRow
                            key={country.code}
                            country={country}
                            onLongPress={longPressHandler}
                            onLongPressFail={longPressFailHandler}
                            loading={country.code === active || country.code === code}
                            columns={props.columns}
                        />
                    ))}
                </div>
            </div>
            <div className='table__footer'>
                <div className='table__row'>
                    <div className='table__paging'>
                        <PageSizer selected={size} options={options} onChange={sizeCahngeHandler} />
                        <Pager
                            page={page}
                            count={size}
                            totalCount={countries.length}
                            onBack={prevPageHandler}
                            onNext={nextPageHandler}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
