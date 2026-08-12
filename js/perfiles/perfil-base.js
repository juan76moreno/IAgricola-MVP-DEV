// Base común para Perfiles Técnicos por Rubro.
// No contiene datos económicos ni sustituye perfiles específicos ya validados.

const perfilesTecnicos = {};

function registrarPerfilTecnico(nombreRubro, configuracion) {
    if (!nombreRubro || !configuracion) {
        console.warn("Perfil técnico no registrado: configuración incompleta.");
        return false;
    }

    perfilesTecnicos[nombreRubro] = configuracion;

    return true;
}

function obtenerPerfilTecnico(nombreRubro) {
    return perfilesTecnicos[nombreRubro] ?? null;
}

function existePerfilTecnico(nombreRubro) {
    return obtenerPerfilTecnico(nombreRubro) !== null;
}