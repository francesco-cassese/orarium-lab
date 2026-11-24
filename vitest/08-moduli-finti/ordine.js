import { prezzoAlChilo, sconto } from './prezzi.js';

function costoOrdine(nome, chili) {
    return prezzoAlChilo(nome) * chili;
}

function costoScontato(nome, chili, percento) {
    return sconto(prezzoAlChilo(nome) * chili, percento);
}

export { costoOrdine, costoScontato };