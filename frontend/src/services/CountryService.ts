import { Country } from '../dto/Country'

export const getAllCountries = (): Promise<Country[]> => getResource<Country[]>('/countries')
export const getCountriesByName = (name: string): Promise<Country[]> => getResource<Country[]>(`/countries/${name}`)

const getResource = <T>(route: string): Promise<T> => {
    return fetch(process.env.REACT_APP_API_URL + route)
        .then(res => res.json())
        .then(data => {
            if (!data.length) throw new Error()
            return data
        })
}
