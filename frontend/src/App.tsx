import React, { FunctionComponent } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Search } from './components/Search'
import { Table } from './components/Table'
import { ThemeSwitcher } from './components/ThemeSwitch'

export const App: FunctionComponent = () => {
    return (
        <>
            <ThemeSwitcher />
            <BrowserRouter>
                <Table />
            </BrowserRouter>
            <Search />
        </>
    )
}
