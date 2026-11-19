import { listino } from './listino.js';

function costo(nome, chili) {
    return listino.prezzoAlChilo(nome) * chili;
}

export { costo };