import { Country } from '../dto/Country'

export interface State {
    loading: boolean
    error: boolean
    list: Country[]
}

export interface Action {
    type: Actions
    payload?: Country[]
}

export enum Actions {
    REQUEST,
    RESPONSE,
    ERROR,
    INIT
}

export const initialState: State = { loading: false, list: [], error: false }

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case Actions.REQUEST:
            return { error: false, loading: true, list: state.list }
        case Actions.RESPONSE:
            return { error: false, loading: false, list: action.payload }
        case Actions.ERROR:
            return { error: true, loading: false, list: [] }
        case Actions.INIT:
            return { error: false, loading: false, list: [] }
        default:
            return initialState
    }
}
