// Base común para Perfiles Técnicos por Rubro.
// No contiene datos económicos ni sustituye perfiles específicos ya validados.

const perfilesTecnicos = {};
const perfilVegetalComun = {
    nombre: "Perfil vegetal común",

    reutilizables: [
        {
            campo: "superficieTotal",
            origenExistente: "superficieTotal"
        },
        {
            campo: "superficieCultivada",
            origenExistente: "superficieCultivada"
        }
    ],

    estructuraProductiva: {
    tipo: "coleccion",
    campo: "lotes",

    camposPorLote: [
        {
            campo: "identificacionLote"
        },
        {
            campo: "hectareas"
        },
        {
            campo: "fechaSiembraMantenimiento"
        }
    ]
}
};
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
function obtenerEstructuraProductivaPerfil(nombreRubro) {

    const perfil = obtenerPerfilTecnico(nombreRubro);

    if (!perfil) {
        return null;
    }

    if (perfil.estructuraProductiva) {
        return perfil.estructuraProductiva;
    }

    if (perfil.patronComun === "vegetal") {
        return perfilVegetalComun.estructuraProductiva;
    }

    return null;
}
function resolverValorExistentePerfil(campo) {

    if (!campo) {
        return null;
    }

    if (campo.origenExistente) {

        const control = document.getElementById(campo.origenExistente);

        if (control) {

            const valor = control.value;

            if (
                valor !== undefined &&
                valor !== null &&
                valor !== ""
            ) {
                return valor;
            }
        }
    }

    const capturaExistente = buscarCapturaExistentePerfil(campo);

    if (
        capturaExistente &&
        capturaExistente.valor !== undefined &&
        capturaExistente.valor !== null &&
        capturaExistente.valor !== ""
    ) {
        return capturaExistente.valor;
    }

    return null;
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

function buscarCapturaExistentePerfil(campo) {

    if (!campo || typeof obtenerExpediente !== "function") {
        return null;
    }

    const expediente = obtenerExpediente();

    if (!expediente || !Array.isArray(expediente.capturas)) {
        return null;
    }

    const capturasCoincidentes = expediente.capturas.filter(function(captura) {

        if (!captura) {
            return false;
        }

        if (campo.campoId && captura.campoId !== campo.campoId) {
            return false;
        }

        if (campo.campo && captura.campo !== campo.campo) {
            return false;
        }

        if (campo.modulo && captura.modulo !== campo.modulo) {
            return false;
        }

        if (campo.objeto && captura.objeto !== campo.objeto) {
            return false;
        }

        return campo.campoId || campo.campo;
    });

    if (capturasCoincidentes.length === 0) {
        return null;
    }

    return capturasCoincidentes[capturasCoincidentes.length - 1];
}