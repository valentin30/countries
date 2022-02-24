import React, { FunctionComponent, useState } from 'react'
import { Country } from '../../dto/Country'

export interface ICountriesContext {
    counrties: Country[] | null
    setCounrties: React.Dispatch<React.SetStateAction<Country[] | null>>
}

export const CounrtiesContext = React.createContext<ICountriesContext>({
    counrties: null,
    setCounrties: () => {}
})

interface Props {
    children: React.ReactNode
}

export const CounrtiesContextProvider: FunctionComponent<Props> = (props) => {
    const [counrties, setCounrties] = useState<Country[] | null>(null)
    return <CounrtiesContext.Provider value={{ counrties, setCounrties }}>{props.children}</CounrtiesContext.Provider>
}
