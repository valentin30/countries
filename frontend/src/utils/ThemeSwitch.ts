export class ThemeSwitch {
    private static instance

    private onChangeListeners: { [key: string]: Function } = {}

    private mq: MediaQueryList

    private constructor() {
        this.mq = window.matchMedia('(prefers-color-scheme: dark)')
        this.changeThemePreferenceHandler = this.changeThemePreferenceHandler.bind(this)
    }

    static getInstance(): ThemeSwitch {
        if (!ThemeSwitch.instance) {
            ThemeSwitch.instance = new ThemeSwitch()
        }
        return ThemeSwitch.instance
    }

    init(): void {
        this.mq.addEventListener('change', this.changeThemePreferenceHandler)
        if (this.mq.matches) {
            this.addDarkMode()
        }
    }

    destroy(): void {
        this.mq.removeEventListener('change', this.changeThemePreferenceHandler)
    }

    addUserPreferencesChangeListener(cb: Function): number {
        const id = Date.now()
        this.onChangeListeners[id] = cb
        return id
    }

    removeUserPreferencesChangeListener(id: number) {
        delete this.onChangeListeners[id]
    }

    private callChangeListeners() {
        Object.values(this.onChangeListeners).forEach(cb => {
            Promise.resolve().then(() => cb())
        })
    }

    private changeThemePreferenceHandler(mq: MediaQueryListEvent): void {
        if (mq.matches && this.isLightTheme()) {
            this.addDarkMode()
            this.callChangeListeners()
        } else if (!mq.matches && !this.isLightTheme()) {
            this.removeDarkMode()
            this.callChangeListeners()
        }
    }

    addDarkMode(): void {
        document.body.classList.add('dark')
    }

    removeDarkMode(): void {
        document.body.classList.remove('dark')
    }

    toggleDarkMode(): void {
        document.body.classList.toggle('dark')
    }

    isLightTheme(): boolean {
        return !document.body.classList.contains('dark')
    }
}
