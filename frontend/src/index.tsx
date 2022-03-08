import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { CountryContextProvider } from './context/country/CountryContext'
import reportWebVitals from './reportWebVitals'
import './styles/index.scss'
import { ThemeSwitch } from './utils/ThemeSwitch'

ThemeSwitch.getInstance().init()

ReactDOM.render(
    <React.StrictMode>
        <CountryContextProvider>
            <App />
        </CountryContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
