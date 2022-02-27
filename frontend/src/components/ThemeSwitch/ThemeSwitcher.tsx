import React, { FunctionComponent, MouseEventHandler } from 'react'
import { BsCloudMoon, BsCloudSun } from 'react-icons/bs'
import { ThemeSwitch } from '../../utils/ThemeSwitch'

const changeThemeClickEventHandler: MouseEventHandler<HTMLButtonElement> = event => {
    ThemeSwitch.getInstance().changeTheme()
    const deg = +event.currentTarget.style.getPropertyValue('--rotate').replace('deg', '') || 0
    if (deg === 1260) {
        event.currentTarget.style.setProperty('--rotate', `0deg`)
        return
    }
    event.currentTarget.style.setProperty('--rotate', `${180 + deg}deg`)
}

export const ThemeSwitcher: FunctionComponent = () => {
    const [a, b] = ThemeSwitch.getInstance().isLightTheme() ? ['init', 'next'] : ['next', 'init']

    return (
        <button aria-label='Theme switcher' className='theme-switcher' onClick={changeThemeClickEventHandler}>
            <div className='theme-switcher__icon-container'>
                <BsCloudSun className={`theme-switcher__${a}`} />
                <BsCloudMoon className={`theme-switcher__${b}`} />
            </div>
        </button>
    )
}
