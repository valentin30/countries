import { FunctionComponent, useContext, useEffect } from 'react'
import { CounrtiesContext } from './context/countries/CountriesContext'
import * as CountriesService from './services/CountryService'

interface Props {}

export const App: FunctionComponent<Props> = props => {
    const { counrties, setCounrties } = useContext(CounrtiesContext)

    useEffect(() => {
        CountriesService.getAllCountries().then(setCounrties)
    }, [setCounrties])

    return <div>{counrties}</div>
}
