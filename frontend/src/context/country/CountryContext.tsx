import React, { FunctionComponent, useState } from 'react'
import { Country } from '../../dto/Country'

export interface ICountriesContext {
    country: Country | null
    setCountry: React.Dispatch<React.SetStateAction<Country | null>>
}

export const CountryContext = React.createContext<ICountriesContext>({
    country: null,
    setCountry: () => {}
})

interface Props {
    children: React.ReactNode
}

export const CountryContextProvider: FunctionComponent<Props> = props => {
    const [country, setCountry] = useState<Country | null>(null)
    return <CountryContext.Provider value={{ country, setCountry }}>{props.children}</CountryContext.Provider>
}
