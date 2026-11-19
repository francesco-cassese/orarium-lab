async function leggiIngrediente(id) {
    const risposta = await fetch(`/api/ingredients/${id}`);
    return risposta.json();
}

export { leggiIngrediente };