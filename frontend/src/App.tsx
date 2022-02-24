import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { Country } from './dto/Country'
import * as CountriesService from './services/CountryService'

interface Props {}

export const App: FunctionComponent<Props> = props => {
    const [countries, setCounrties] = useState<Country[]>([])
    const [page, setPage] = useState<number>(1)
    const [size, setSize] = useState<number>(20)

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
            </div>
            {countries.slice((page - 1) * size, (page - 1) * size + size).map(country => (
                <div key={country?.capitalName + country.name}>{country.capitalName}</div>
            ))}
        </div>
    )
}
