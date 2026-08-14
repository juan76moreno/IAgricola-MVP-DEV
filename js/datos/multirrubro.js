// Adaptador de datos multirrubro.
// La aplicación consume esta capa sin depender de la fuente externa.

const estadoMultirrubro = {
    registros: [],
    version: null,
    fechaActualizacion: null,
    fuente: null
};
const URL_BASE_MAESTRA_MULTIRRUBRO =
  "https://script.google.com/a/macros/bbva.com/s/AKfycbwI5Al6upMDp_fozikS2_Vz7MQd6o9eXFrCJjpJ8onu8EszjRAuL3GaFmKmM7iO5Z1H/exec";

async function sincronizarDatosMultirrubro() {
  try {
    const respuesta = await fetch(URL_BASE_MAESTRA_MULTIRRUBRO);

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const resultado = await respuesta.json();

    if (!resultado.ok || !Array.isArray(resultado.datos)) {
      throw new Error("Respuesta inválida de la Base Maestra");
    }

    cargarDatosMultirrubro(resultado.datos, {
      fuente: "BASE_MAESTRA_APPS_SCRIPT"
    });

    console.log(
      `Multirrubro sincronizado: ${resultado.datos.length} registros`
    );

    return true;

  } catch (error) {
    console.error("Error sincronizando Multirrubro:", error);
    return false;
  }
}
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