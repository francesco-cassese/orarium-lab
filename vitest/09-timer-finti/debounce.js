function debounce(callback, ms) {
    let timer;

    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), ms);
    };
}

export { debounce };
