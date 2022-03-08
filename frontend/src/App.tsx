import React, { FunctionComponent, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Detail } from './components/Detail'
import { Search } from './components/Search'
import { Table } from './components/Table'
import { ThemeSwitcher } from './components/ThemeSwitch'
import { CountryContext } from './context/country/CountryContext'

export const App: FunctionComponent = () => {
    const { country, setCountry } = useContext(CountryContext)
    return (
        <>
            <ThemeSwitcher />
            <BrowserRouter>
                <Table />
            </BrowserRouter>
            <Search />
            <Detail country={country} onClose={() => setCountry(null)} />
        </>
    )
}
