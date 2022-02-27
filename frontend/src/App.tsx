import { FunctionComponent, PointerEventHandler, useEffect, useState } from 'react'
import { Table } from './components/Table'
import { Columns } from './components/Table/types'
import { Country } from './dto/Country'
import * as CountriesService from './services/CountryService'
import { IoMdClose } from 'react-icons/io'
import { BsCloudMoon, BsCloudSun } from 'react-icons/bs'
import { Route, Routes, Outlet, useNavigate } from 'react-router'
import { Detail } from './components/Detail'

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
    const [active, setActive] = useState<string>('')

    useEffect(() => {
        CountriesService.getAllCountries().then(setCounrties)
    }, [])

    const country = countries.find(c => c.code === active)

    const [theme, setTheme] = useState<string>(localStorage.getItem('theme'))

    useEffect(() => {
        localStorage.setItem('theme', theme)
    }, [theme])
    return (
        <div className={`theme-switcher ${theme}`}>
            <button
                aria-label='Theme switcher'
                className='theme-switcher__button'
                onClick={() => setTheme(t => (t === 'dark-theme' ? 'light-theme' : 'dark-theme'))}
            >
                <div className='theme-switcher__icon-container'>
                    <BsCloudSun className='theme-switcher__light' />
                    <BsCloudMoon className='theme-switcher__dark' />
                </div>
            </button>
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
