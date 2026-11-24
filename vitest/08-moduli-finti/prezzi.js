function prezzoAlChilo(nome) {
    return nome === 'farina' ? 2 : 5;
}

function sconto(prezzo, percento) {
    return prezzo - (prezzo * percento) / 100;
}

export { prezzoAlChilo, sconto };