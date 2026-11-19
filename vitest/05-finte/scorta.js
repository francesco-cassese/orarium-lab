function controllaScorta(nome, quantita, avvisa) {
    if (quantita < 5) {
        avvisa(`${nome}: scorta bassa`);
        return false;
    }
    return true;
}

export { controllaScorta };