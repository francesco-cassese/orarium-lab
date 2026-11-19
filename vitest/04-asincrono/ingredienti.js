function leggiIngrediente(id) {
    return Promise.resolve({ id, nome: 'farina' });
}

function leggiIngredienteMancante() {
    return Promise.reject(new Error('Ingrediente non trovato'));
}

function caricaDopo(callback) {
    setTimeout(callback, 100, 'burro');
}

export { leggiIngrediente, leggiIngredienteMancante, caricaDopo };