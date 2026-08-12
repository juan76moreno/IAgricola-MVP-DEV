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
function obtenerCamposPerfilTecnico(nombreRubro) {

    const perfil = obtenerPerfilTecnico(nombreRubro);

    if (!perfil || !Array.isArray(perfil.campos)) {
        return [];
    }

    return perfil.campos;
}

function obtenerDiscriminadoresPerfilTecnico(nombreRubro) {

    const perfil = obtenerPerfilTecnico(nombreRubro);

    if (!perfil || !Array.isArray(perfil.discriminadores)) {
        return [];
    }

    return perfil.discriminadores;
}
function resolverValorExistentePerfil(campo) {

    if (!campo || !campo.origenExistente) {
        return null;
    }

    const control = document.getElementById(campo.origenExistente);

    if (!control) {
        return null;
    }

    const valor = control.value;

    if (valor === undefined || valor === null || valor === "") {
        return null;
    }

    return valor;
}
function resolverCampoPerfil(campo) {

    if (!campo) {
        return {
            estado: "INVALIDO",
            valor: null,
            campo: null
        };
    }

    const valorExistente = resolverValorExistentePerfil(campo);

    if (valorExistente !== null) {
        return {
            estado: "REUTILIZADO",
            valor: valorExistente,
            campo: campo
        };
    }

    return {
        estado: "PENDIENTE",
        valor: null,
        campo: campo
    };
}
function resolverDiscriminadoresPerfil(nombreRubro) {

    const discriminadores =
        obtenerDiscriminadoresPerfilTecnico(nombreRubro);

    return discriminadores.map(function(discriminador) {
        return resolverCampoPerfil(discriminador);
    });
}