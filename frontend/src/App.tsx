import { FunctionComponent, PointerEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { Table } from './components/Table'
import { Columns } from './components/Table/types'
import { Country } from './dto/Country'
import * as CountriesService from './services/CountryService'

interface Props {}

const failure: PointerEventHandler = event => {}

const columns: Columns = {
    code: true,
    capital: true,
    name: true,
    flag: true,
    region: true,
    population: true,
    subregion: true
}

export const App: FunctionComponent<Props> = props => {
    const [countries, setCounrties] = useState<Country[]>([])
    const [page, setPage] = useState<number>(1)
    const [size, setSize] = useState<number>(5)
    const [active, setActive] = useState<string>('')

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

    const data = useMemo(() => {
        return countries.slice((page - 1) * size, (page - 1) * size + size)
    }, [countries, page, size])

    const filters = countries.reduce(
        (filters, country) => {
            if (!filters.regions.includes(country.region)) filters.regions.push(country.region)
            if (!filters.subregions.includes(country.subregion)) filters.subregions.push(country.subregion)
            return filters
        },
        { regions: [] as string[], subregions: [] as string[] }
    )

    return (
        <div>
            <div>
                <p>
                    page: {page} - {pageCount} - ({active})
                </p>
                <button disabled={page >= pageCount} onClick={nextPageHandler}>
                    next
                </button>
                <button disabled={page <= 1} onClick={prevPageHandler}>
                    prev
                </button>
            </div>
            <Table columns={columns} countries={data} onLongPress={setActive} onLongPressCancel={failure} />
        </div>
    )
}
