document.addEventListener('mouseover', (e) => {
    const li = (e.target as HTMLElement).closest('li[data-image]');
    if (li) {
        const indicator = document.querySelector('.active-movie-indicator');
        if (indicator) {
            const imgPath = li.getAttribute('data-image');
            if (imgPath) {
                indicator.setAttribute('data-image', imgPath);
            }
        }
    }
});