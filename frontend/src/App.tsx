import React, { FunctionComponent, PointerEventHandler, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router'
import { Detail } from './components/Detail'
import { Table } from './components/Table'
import { Columns } from './components/Table/types'
import { ThemeSwitcher } from './components/ThemeSwitch'
import { Country } from './dto/Country'
import * as CountriesService from './services/CountryService'
import { IoSearch } from 'react-icons/io5'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

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

interface P {
    highlight: string
    children: string
}
const HighLighter = (props: P) => {
    const getComponents = () => {
        let len = 0
        return props.children
            .toLowerCase()
            .split(props.highlight.toLowerCase())
            .reduce(
                (
                    array: React.DetailedReactHTMLElement<{}, HTMLElement>[],
                    value,
                    index
                ): React.DetailedReactHTMLElement<{}, HTMLElement>[] => {
                    if (index) {
                        const text = props.children.substr(len, props.highlight.length)
                        array.push(React.createElement('b', { key: text }, text))
                        len += text.length
                    }
                    const text = props.children.substr(len, value.length)
                    array.push(React.createElement('span', { key: text }, text))
                    len += text.length
                    return array
                },
                []
            )
    }

    return <>{getComponents()}</>
}

const Base = () => {
    const [countries, setCounrties] = useState<Country[]>([])
    const [filterList, setFilterList] = useState<Country[]>([])
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [value, setValue] = useState('')
    const [active, setActive] = useState('')
    const searchTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        CountriesService.getAllCountries().then(setCounrties)
    }, [])

    useEffect(() => {
        if (searchTimeoutId.current) {
            clearTimeout(searchTimeoutId.current)
            searchTimeoutId.current = null
        }
        if (notFound) {
            setNotFound(false)
        }
        if (!value.length) {
            setFilterList([])
            return
        }
        searchTimeoutId.current = setTimeout(() => {
            setLoading(true)
            CountriesService.getCountriesByName(value).then(results => {
                if (!results.length) {
                    setNotFound(true)
                }
                setFilterList(results.slice(0, 10))
                setLoading(false)
            })
        }, 500)
    }, [value])

    useEffect(() => {
        console.log(filterList)
    }, [filterList])

    const country = countries.find(c => c.code === active)

    return (
        <div>
            <ThemeSwitcher />
            <div className='search'>
                <div className='search__container'>
                    <IoSearch className='search__icon' />
                    <input
                        type='text'
                        className='search__input'
                        onChange={e => setValue(e.target.value.trim())}
                        onFocus={() => setVisible(true)}
                        onBlur={() => {
                            setTimeout(() => setVisible(false), 100)
                        }}
                    />
                    {loading && <AiOutlineLoading3Quarters className='search__loading' />}
                </div>
                <div className='search__results-list'>
                    {visible &&
                        filterList.map(c => {
                            return (
                                <div className='search__result' onClick={() => setActive(c.code)}>
                                    <img src={c.flag} alt={c.code} />
                                    <div>
                                        <p className='search__result__title'>
                                            <HighLighter highlight={value}>{c.name}</HighLighter>
                                        </p>
                                        <p className='search__result__subtitle'>{c.capitalName}</p>
                                    </div>
                                </div>
                            )
                        })}
                    {visible && notFound && (
                        <div className='search__result empty'>
                            <p>Noting found!</p>
                        </div>
                    )}
                </div>
            </div>
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
