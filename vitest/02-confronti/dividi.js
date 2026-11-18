function dividi(a, b) {

    if (b === 0) {
        throw new Error('Non si divide per zero');
    }

    return a / b;
}

export default dividi;