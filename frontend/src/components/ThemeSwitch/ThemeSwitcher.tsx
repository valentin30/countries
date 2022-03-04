import React, { FunctionComponent, useEffect, useState } from 'react'
import { BsCloudMoon, BsCloudSun } from 'react-icons/bs'
import { ThemeSwitch } from '../../utils/ThemeSwitch'

export const ThemeSwitcher: FunctionComponent = () => {
    const [isLightTheme, setIsLightTheme] = useState(ThemeSwitch.getInstance().isLightTheme())

    useEffect(() => {
        const id = ThemeSwitch.getInstance().addUserPreferencesChangeListener(() => setIsLightTheme(l => !l))
        return () => {
            ThemeSwitch.getInstance().removeUserPreferencesChangeListener(id)
        }
    }, [])

    return (
        <button
            aria-label='Theme switcher'
            className='theme-switcher'
            onClick={() => {
                ThemeSwitch.getInstance().toggleDarkMode()
                setIsLightTheme(l => !l)
            }}
        >
            {isLightTheme ? (
                <BsCloudSun className='theme-switcher__icon' />
            ) : (
                <BsCloudMoon className='theme-switcher__icon' />
            )}
        </button>
    )
}
