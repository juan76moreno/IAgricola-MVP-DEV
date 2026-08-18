// Adaptador de datos multirrubro.
// La aplicación consume esta capa sin depender de la fuente externa.

const estadoMultirrubro = {
    registros: [],
    version: null,
    fechaActualizacion: null,
    fuente: null
};


function recibirDatosMultirrubro(event) {
    if (
    event.origin !== "https://script.google.com" &&
    !event.origin.endsWith(".googleusercontent.com")
) {
    return;
}

    const mensaje = event.data;

    if (
        !mensaje ||
        mensaje.tipo !== "IA_AGRICOLA_MULTIRRUBRO" ||
        !mensaje.ok ||
        !Array.isArray(mensaje.datos)
    ) {
        return;
    }

    cargarDatosMultirrubro(mensaje.datos, {
        fuente: "BASE_MAESTRA_APPS_SCRIPT",
        fechaActualizacion: new Date().toISOString()
    });

    cargarSelectorRubrosMultirrubro();

    console.log(
        `SUCCESS Multirrubro: ${mensaje.datos.length} registros`
    );
}

window.addEventListener("message", recibirDatosMultirrubro);
function cargarDatosMultirrubro(datos, metadatos = {}) {
    if (!Array.isArray(datos)) {
        console.warn("Datos multirrubro inválidos.");
        return false;
    }

    estadoMultirrubro.registros = datos;
    estadoMultirrubro.version = metadatos.version ?? null;
    estadoMultirrubro.fechaActualizacion =
        metadatos.fechaActualizacion ?? null;
    estadoMultirrubro.fuente = metadatos.fuente ?? null;

    return true;
}

function obtenerDatosMultirrubro() {
    return estadoMultirrubro;
}
function obtenerRubrosMultirrubro() {
    const rubros = estadoMultirrubro.registros
        .map(registro => registro.rubro)
        .filter(rubro => rubro);

    return [...new Set(rubros)];
}
function cargarSelectorRubrosMultirrubro() {
    const selector = document.getElementById("rubroPrincipal");

    if (!selector) {
        console.warn("No existe el selector rubroPrincipal.");
        return false;
    }

    const rubros = obtenerRubrosMultirrubro().sort();

    selector.innerHTML = '<option value="">Seleccione...</option>';

    rubros.forEach(function(rubro) {
        const opcion = document.createElement("option");
        opcion.value = rubro;
        opcion.textContent = rubro;
        selector.appendChild(opcion);
    });

    return true;
}
function obtenerCasuisticasRubro(rubro) {
    if (!rubro) {
        return [];
    }

    return estadoMultirrubro.registros.filter(
        registro => registro.rubro === rubro
    );
}

function obtenerParametrosCasuistica(id) {
    if (!id) {
        return null;
    }

    return estadoMultirrubro.registros.find(
        registro => registro.id === id
    ) ?? null;
}
function normalizarRegistroMultirrubro(registro, clasificacion = {}) {
    if (!registro || typeof registro !== "object") {
        return null;
    }

    const rubroCasuisticaOrigen =
        registro.rubroCasuisticaOrigen ??
        registro.rubro ??
        null;

    return {
        ...registro,

        rubroCasuisticaOrigen,

        rubro:
            clasificacion.rubro ??
            registro.rubro ??
            null,

        varianteCasuistica:
            clasificacion.varianteCasuistica ??
            registro.varianteCasuistica ??
            null,

        estadoClasificacion:
            clasificacion.estado ??
            registro.estadoClasificacion ??
            "PENDIENTE"
    };
}
// Recepción de datos de la Base Maestra mediante JSONP
window.iAgricolaRecibirDatos = function (respuesta) {

    if (
        !respuesta ||
        respuesta.ok !== true ||
        !Array.isArray(respuesta.datos)
    ) {
        console.error("ERROR Base Maestra JSONP:", respuesta);
        return;
    }

    cargarDatosMultirrubro(
        respuesta.datos,
        {
            fuente: "BASE_MAESTRA_APPS_SCRIPT_JSONP",
            total: respuesta.datos.length
        }
    );

    console.log(
        "SUCCESS Base Maestra JSONP:",
        respuesta.datos.length,
        "registros"
    );
};


// Carga de la Base Maestra
(function cargarBaseMaestraJSONP() {

    const script = document.createElement("script");

    script.src =
        "https://script.google.com/a/macros/bbva.com/s/AKfycbzzXYN3bvfy_7j2vOZC9Dl8kiS4LA-ZH_GU_Owb5t6vEN04PetQsUxikEeO_mHwfU3d/exec" +
        "?callback=iAgricolaRecibirDatos";

    script.async = true;

    script.onload = function () {
        console.log("Base Maestra JSONP cargada.");
    };

    script.onerror = function (error) {
        console.error(
            "ERROR cargando Base Maestra JSONP:",
            error
        );
    };

    document.head.appendChild(script);

})();