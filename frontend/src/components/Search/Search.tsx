import React, { FunctionComponent, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IoMdClose } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'
import { CountryContext } from '../../context/country/CountryContext'
import * as CountriesService from '../../services/CountryService'
import { Actions, initialState, reducer } from '../../utils/reducer'
import { HighLighter } from '../HighLighter'

export const Search: FunctionComponent = () => {
    const { setCountry } = useContext(CountryContext)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [visible, setVisible] = useState(false)
    const [value, setValue] = useState('')
    const searchTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (searchTimeoutId.current) {
            clearTimeout(searchTimeoutId.current)
            searchTimeoutId.current = null
        }

        if (!value) {
            dispatch({ type: Actions.INIT })
            return
        }
        searchTimeoutId.current = setTimeout(() => {
            dispatch({ type: Actions.REQUEST })
            CountriesService.getCountriesByName(value)
                .then(results => dispatch({ type: Actions.RESPONSE, payload: results.slice(0, 10) }))
                .catch(() => dispatch({ type: Actions.ERROR }))
        }, 500)
    }, [value])

    return (
        <div className='search'>
            <div className='search__container'>
                <IoSearch className='search__icon' />
                <label htmlFor='search'>Search</label>
                <input
                    id='search'
                    type='text'
                    placeholder='Search...'
                    className='search__input'
                    onFocus={() => setVisible(true)}
                    onBlur={() => setTimeout(() => setVisible(false), 100)}
                    onChange={event => setValue(event.target.value.trim())}
                />
                {visible && (
                    <button onClick={() => setVisible(false)} className='search__close-btn'>
                        <IoMdClose />
                    </button>
                )}
                {state.loading && <AiOutlineLoading3Quarters className='search__loading' />}
            </div>
            {visible && (
                <div className='search__results-list'>
                    {state.list.map(country => (
                        <div className='search__result' key={country.code} onClick={() => setCountry(country)}>
                            <img src={country.flag} alt={country.code} />
                            <div>
                                <p className='search__result__title'>
                                    <HighLighter highlight={value}>{country.name}</HighLighter>
                                </p>
                                <p className='search__result__subtitle'>{country.capitalName}</p>
                            </div>
                        </div>
                    ))}
                    {state.error && (
                        <div className='search__result empty'>
                            <p>Noting found!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
