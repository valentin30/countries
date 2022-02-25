import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader } from './components/Loader'
import { Country } from './dto/Country'
import * as CountriesService from './services/CountryService'

interface Props {}

export const App: FunctionComponent<Props> = props => {
    const [countries, setCounrties] = useState<Country[]>([])
    const [page, setPage] = useState<number>(1)
    const [size, setSize] = useState<number>(20)
    const [loading, setLoading] = useState(false)

    const longPressTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

    const pageCount = useMemo<number>(
        () => (countries.length % size === 0 ? countries.length / size : Math.floor(countries.length / size) + 1),
        [countries.length, size]
    )

    const nextPageHandler = useCallback(() => {
        setPage(page => page + 1)
    }, [])

    const prevPageHandler = useCallback(() => {
        setPage(page => page - 1)
    }, [])

    const pointerDownEventHandler = useCallback(event => {
        setLoading(true)
        longPressTimeoutId.current = setTimeout(() => {
            alert(event.target.dataset.code)
        }, 2500)
    }, [])

    const pointerOutEventHandler = useCallback(() => {
        if (longPressTimeoutId.current !== null) {
            clearTimeout(longPressTimeoutId.current)
            setLoading(false)
            longPressTimeoutId.current = null
        }
    }, [])

    useEffect(() => {
        CountriesService.getAllCountries().then(setCounrties)
    }, [])

    return (
        <div>
            <div>
                <p>
                    page: {page} - {pageCount}
                </p>
                <button disabled={page >= pageCount} onClick={nextPageHandler}>
                    next
                </button>
                <button disabled={page <= 1} onClick={prevPageHandler}>
                    prev
                </button>
                <Loader loading={loading} size='huge' />
            </div>
            {countries.slice((page - 1) * size, (page - 1) * size + size).map(country => (
                <div
                    key={country.code}
                    data-code={country.code}
                    onPointerDown={pointerDownEventHandler}
                    onPointerLeave={pointerOutEventHandler}
                    onPointerUp={pointerOutEventHandler}
                >
                    {country.capitalName} - {country.code}
                </div>
            ))}
        </div>
    )
}
