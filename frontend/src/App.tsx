import { FunctionComponent, PointerEventHandler, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router'
import { Detail } from './components/Detail'
import { Table } from './components/Table'
import { Columns } from './components/Table/types'
import { ThemeSwitcher } from './components/ThemeSwitch'
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
    return (
        <Routes>
            <Route path='/*' element={<Base />} />
        </Routes>
    )
}

const Base = () => {
    const [countries, setCounrties] = useState<Country[]>([])
    const [active, setActive] = useState('')

    useEffect(() => {
        CountriesService.getAllCountries().then(setCounrties)
    }, [])

    const country = countries.find(c => c.code === active)

    return (
        <div>
            <ThemeSwitcher />
            {!!country && <Detail country={country} onClose={() => setActive(null)} />}
            <Table
                code={active}
                columns={columns}
                countries={countries}
                onLongPressFail={failure}
                onLongPressSuccess={setActive}
            />
        </div>
    )
}
