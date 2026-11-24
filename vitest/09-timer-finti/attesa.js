function chiamaDopo(callback, ms) {

    return setTimeout(callback, ms);
}

function ripeti(callback, ms) {

    return setInterval(callback, ms);
}

function adesso() {
    return Date.now();
}

export { chiamaDopo, ripeti, adesso };