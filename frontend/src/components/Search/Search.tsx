import React, { FunctionComponent, useEffect, useRef, useState, useReducer } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IoSearch } from 'react-icons/io5'
import { Country } from '../../dto/Country'
import * as CountriesService from '../../services/CountryService'
import { Detail } from '../Detail'
import { HighLighter } from '../HighLighter'

interface Props {}

interface State {
    loading: boolean
    empty: boolean
    list: Country[]
}

interface Action {
    type: Actions
    payload?: Country[]
}

enum Actions {
    REQUEST,
    RESPONSE,
    ERROR,
    EMPTY
}

const initialState: State = { loading: false, list: [], empty: false }

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case Actions.REQUEST:
            return { empty: false, loading: true, list: state.list }
        case Actions.RESPONSE:
            return { empty: false, loading: false, list: action.payload }
        case Actions.ERROR:
            return { empty: true, loading: false, list: [] }
        case Actions.EMPTY:
            return { empty: false, loading: false, list: [] }
        default:
            return initialState
    }
}

export const Search: FunctionComponent<Props> = props => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [visible, setVisible] = useState(false)
    const [country, setCountry] = useState<Country>(null)
    const [value, setValue] = useState('')
    const searchTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (searchTimeoutId.current) {
            clearTimeout(searchTimeoutId.current)
            searchTimeoutId.current = null
        }

        if (!value) {
            dispatch({ type: Actions.EMPTY })
            return
        }
        searchTimeoutId.current = setTimeout(() => {
            dispatch({ type: Actions.REQUEST })
            CountriesService.getCountriesByName(value).then(results => {
                if (!results.length) {
                    dispatch({ type: Actions.ERROR })
                } else {
                    dispatch({ type: Actions.RESPONSE, payload: results.slice(0, 10) })
                }
            })
        }, 500)
    }, [value])

    return (
        <>
            {!!country && <Detail country={country} onClose={() => setCountry(null)} />}
            <div className='search'>
                <div className='search__container'>
                    <IoSearch className='search__icon' />
                    <input
                        type='text'
                        className='search__input'
                        onFocus={() => setVisible(true)}
                        onBlur={() => setTimeout(() => setVisible(false), 100)}
                        onChange={event => setValue(event.target.value.trim())}
                    />
                    {state.loading && <AiOutlineLoading3Quarters className='search__loading' />}
                </div>
                {/* <div className='search__results-list'>
                    {visible &&
                        state.list.map(country => {
                            return (
                                <div className='search__result' key={country.code} onClick={() => setCountry(country)}>
                                    <img src={country.flag} alt={country.code} />
                                    <div>
                                        <p className='search__result__title'>
                                            <HighLighter highlight={value}>{country.name}</HighLighter>
                                        </p>
                                        <p className='search__result__subtitle'>{country.capitalName}</p>
                                    </div>
                                </div>
                            )
                        })}
                    {visible && state.empty && (
                        <div className='search__result empty'>
                            <p>Noting found!</p>
                        </div>
                    )}
                </div> */}
            </div>
        </>
    )
}
