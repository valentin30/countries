type Theme = 'dark-theme' | 'light-theme'

export class ThemeSwitch {
    private static instance

    private constructor() {}

    static getInstance(): ThemeSwitch {
        if (!ThemeSwitch.instance) {
            ThemeSwitch.instance = new ThemeSwitch()
        }
        return ThemeSwitch.instance
    }

    private getTheme(): Theme {
        const theme = localStorage.getItem('theme')
        if (theme) return theme as Theme
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : 'light-theme'
    }

    public isLightTheme(): boolean {
        return this.getTheme() === 'light-theme'
    }

    public changeTheme() {
        const theme = this.getTheme()
        const newTheme = theme === 'dark-theme' ? 'light-theme' : 'dark-theme'
        document.body.classList.replace(theme, newTheme)
        localStorage.setItem('theme', newTheme)
    }

    public initTheme() {
        document.body.classList.add(this.getTheme())
    }
}
