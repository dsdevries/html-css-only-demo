function initTheme(): void {
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement | null;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (!themeToggle) {
        return;
    }

    const applyTheme = (): void => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme !== null) {
            themeToggle.checked = savedTheme === 'dark';
        } else {
            themeToggle.checked = mediaQuery.matches;
        }
    };

    // 1. Initialize checkbox state from localStorage or system preference
    applyTheme();

    // 2. Persist manual changes to localStorage
    themeToggle.addEventListener('change', () => {
        localStorage.setItem('theme', themeToggle.checked ? 'dark' : 'light');
    });

    // 3. Update toggle if user changes OS/browser preference (unless overridden)
    mediaQuery.addEventListener('change', (e: MediaQueryListEvent) => {
        if (localStorage.getItem('theme') === null) {
            themeToggle.checked = e.matches;
        }
    });

    // Sync state if restored from back-forward cache
    window.addEventListener('pageshow', applyTheme);

    // Sync state across browser tabs/windows
    window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key === 'theme') {
            applyTheme();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
