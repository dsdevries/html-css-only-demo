function initTheme(): void {
    const lightInput = document.getElementById('theme-light') as HTMLInputElement | null;
    const systemInput = document.getElementById('theme-system') as HTMLInputElement | null;
    const darkInput = document.getElementById('theme-dark') as HTMLInputElement | null;
    const themeInputs = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');

    if (themeInputs.length === 0) {
        return;
    }

    const applyTheme = (): void => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' && darkInput) {
            darkInput.checked = true;
        } else if (savedTheme === 'light' && lightInput) {
            lightInput.checked = true;
        } else if (systemInput) {
            systemInput.checked = true;
        }
    };

    // 1. Initialize radio state from localStorage or default to system
    applyTheme();

    // 2. Persist manual changes to localStorage
    themeInputs.forEach((input) => {
        input.addEventListener('change', () => {
            if (input.checked) {
                localStorage.setItem('theme', input.value);
            }
        });
    });

    // 3. Sync state if restored from back-forward cache
    window.addEventListener('pageshow', applyTheme);

    // 4. Sync state across browser tabs/windows
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
