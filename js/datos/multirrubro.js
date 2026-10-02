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

    estadoMultirrubro.registros = datos.map(registro =>
    normalizarRegistroMultirrubro(registro)
);
    estadoMultirrubro.version = metadatos.version ?? null;
    estadoMultirrubro.fechaActualizacion =
        metadatos.fechaActualizacion ?? null;
    estadoMultirrubro.fuente = metadatos.fuente ?? null;

    return true;
}

window.obtenerDatosMultirrubro = function() {
  return estadoMultirrubro;
};
window.obtenerRubrosMultirrubro = function obtenerRubrosMultirrubro() {
    const rubros = estadoMultirrubro.registros
    .map(registro => registro.rubro)
    .filter(Boolean);

    return [...new Set(rubros)];
};
function normalizarTextoCasuistica(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function resolverCasuisticaVoz(texto) {

  const consulta = normalizarTextoCasuistica(texto);

  if (!consulta) {
    return {
      estado: "VACIO",
      coincidencias: []
    };
  }

  const registros = estadoMultirrubro.registros || [];

  const coincidencias = registros.filter(function(registro) {

    const rubro = normalizarTextoCasuistica(registro.rubro);
    const variante = normalizarTextoCasuistica(
      registro.varianteCasuistica
    );
    const origen = normalizarTextoCasuistica(
      registro.rubroCasuisticaOrigen
    );

    return (
      rubro === consulta ||
      variante === consulta ||
      origen === consulta ||
      rubro.includes(consulta) ||
      variante.includes(consulta) ||
      origen.includes(consulta)
    );

  });

  if (coincidencias.length === 0) {
    return {
      estado: "NO_ENCONTRADO",
      coincidencias: []
    };
  }

  if (coincidencias.length === 1) {
    return {
      estado: "UNICA",
      coincidencias: coincidencias
    };
  }

  return {
    estado: "AMBIGUA",
    coincidencias: coincidencias
  };
}
window.resolverCasuisticaVoz = resolverCasuisticaVoz;
window.cargarSelectorRubrosMultirrubro = function cargarSelectorRubrosMultirrubro() {
    const selector = document.getElementById("rubroPrincipal");

    if (!selector) {
        console.warn("No existe el selector rubroPrincipal.");
        return false;
    }

    const rubros = window.obtenerRubrosMultirrubro().sort();

    selector.innerHTML = '<option value="">Seleccione...</option>';

    rubros.forEach(function(rubro) {
        const opcion = document.createElement("option");
        opcion.value = rubro;
        opcion.textContent = rubro;
        selector.appendChild(opcion);
    });

    return true;
}
window.inicializarRubrosExplotados = function inicializarRubrosExplotados() {
    const cantidad = document.getElementById("cantidadRubrosExplotados");
    const contenedor = document.getElementById("contenedorRubrosExplotados");
    const rubroPrincipal = document.getElementById("rubroPrincipal");

    if (!cantidad || !contenedor) {
        return;
    }

    function renderizarRubros() {
        contenedor.innerHTML = "";

        const totalRubros =
            Number.parseInt(cantidad.value, 10) || 0;

        const totalAdicionales = Math.max(totalRubros - 1, 0);

        const rubrosDisponibles =
            window.obtenerRubrosMultirrubro()
                .sort()
                .filter(Boolean);

        for (let i = 1; i <= totalAdicionales; i++) {
            const campo = document.createElement("div");
            campo.className = "field";

            const etiqueta = document.createElement("label");
            etiqueta.textContent = `Rubro ${i + 1}`;

            const selector = document.createElement("select");
            selector.id = `rubroExplotado_${i}`;
            selector.dataset.rubroExplotado = "true";

            const opcionInicial = document.createElement("option");
            opcionInicial.value = "";
            opcionInicial.textContent = "Seleccione...";
            selector.appendChild(opcionInicial);

            rubrosDisponibles.forEach(function (rubro) {
                if (
                    rubroPrincipal &&
                    rubro === rubroPrincipal.value
                ) {
                    return;
                }

                const opcion = document.createElement("option");
                opcion.value = rubro;
                opcion.textContent = rubro;
                selector.appendChild(opcion);
            });

            campo.appendChild(etiqueta);
            campo.appendChild(selector);
            contenedor.appendChild(campo);
        }
    }

    cantidad.addEventListener("input", renderizarRubros);

    if (rubroPrincipal) {
        rubroPrincipal.addEventListener(
            "change",
            renderizarRubros
        );
    }

    renderizarRubros();
};

window.inicializarRubrosExplotados();
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
// DEV-FIX: carga robusta con cache-buster, reintentos y diagnóstico.
// Objetivo: preservar la Base Maestra como fuente única y evitar que
// una redirección 302/404 deje el catálogo de rubros vacío.

const BASE_MAESTRA_JSONP_URL =
    "https://script.google.com/a/macros/bbva.com/s/AKfycbzzXYN3bvfy_7j2vOZC9Dl8kiS4LA-ZH_GU_Owb5t6vEN04PetQsUxikEeO_mHwfU3d/exec";

const BASE_MAESTRA_CALLBACK = "iAgricolaRecibirDatos";
const BASE_MAESTRA_SCRIPT_ID = "baseMaestraMultirrubroJSONP";
const BASE_MAESTRA_MAX_INTENTOS = 3;

let baseMaestraIntentos = 0;
let baseMaestraCargando = false;
let baseMaestraUltimoError = null;

function construirUrlBaseMaestraJSONP() {
    const separador = BASE_MAESTRA_JSONP_URL.includes("?") ? "&" : "?";

    return BASE_MAESTRA_JSONP_URL +
        separador +
        "callback=" +
        encodeURIComponent(BASE_MAESTRA_CALLBACK) +
        "&_ts=" +
        Date.now();
}

function limpiarScriptBaseMaestra() {
    const scriptAnterior = document.getElementById(BASE_MAESTRA_SCRIPT_ID);

    if (scriptAnterior && scriptAnterior.parentNode) {
        scriptAnterior.parentNode.removeChild(scriptAnterior);
    }
}

function validarRespuestaBaseMaestra(respuesta) {
    return (
        respuesta &&
        respuesta.ok === true &&
        Array.isArray(respuesta.datos) &&
        respuesta.datos.length > 0
    );
}

function finalizarCargaBaseMaestraExitosa(respuesta) {
    cargarDatosMultirrubro(
        respuesta.datos,
        {
            fuente: "BASE_MAESTRA_APPS_SCRIPT_JSONP",
            total: respuesta.datos.length,
            fechaActualizacion: new Date().toISOString()
        }
    );

    cargarSelectorRubrosMultirrubro();

    if (typeof window.inicializarRubrosExplotados === "function") {
        window.inicializarRubrosExplotados();
    }

    baseMaestraCargando = false;
    baseMaestraUltimoError = null;

    console.log(
        "SUCCESS Base Maestra JSONP:",
        respuesta.datos.length,
        "registros"
    );

    return true;
}

function reintentarCargaBaseMaestra(motivo) {
    baseMaestraUltimoError = motivo || "Motivo no especificado";

    if (baseMaestraIntentos >= BASE_MAESTRA_MAX_INTENTOS) {
        baseMaestraCargando = false;

        console.error(
            "ERROR Base Maestra JSONP: se agotaron los reintentos.",
            {
                intentos: baseMaestraIntentos,
                ultimoError: baseMaestraUltimoError,
                estado: estadoMultirrubro
            }
        );

        return false;
    }

    console.warn(
        "Reintentando carga Base Maestra JSONP:",
        {
            intentoSiguiente: baseMaestraIntentos + 1,
            motivo: baseMaestraUltimoError
        }
    );

    setTimeout(function () {
        cargarBaseMaestraJSONP({ reintento: true });
    }, 1200);

    return true;
}

window.iAgricolaRecibirDatos = function (respuesta) {

    if (!validarRespuestaBaseMaestra(respuesta)) {
        console.error("ERROR Base Maestra JSONP: respuesta inválida o vacía.", respuesta);

        reintentarCargaBaseMaestra("Respuesta inválida o sin datos");

        return;
    }

    finalizarCargaBaseMaestraExitosa(respuesta);
};

function cargarBaseMaestraJSONP(opciones = {}) {
    if (baseMaestraCargando && !opciones.reintento && !opciones.forzar) {
        console.warn("Carga Base Maestra ya está en curso.");
        return false;
    }

    if (!opciones.reintento) {
        baseMaestraIntentos = 0;
    }

    baseMaestraIntentos += 1;
    baseMaestraCargando = true;

    limpiarScriptBaseMaestra();

    const script = document.createElement("script");

    script.id = BASE_MAESTRA_SCRIPT_ID;
    script.src = construirUrlBaseMaestraJSONP();
    script.async = true;

    script.onload = function () {
        console.log("Base Maestra JSONP solicitada.", {
            intento: baseMaestraIntentos,
            registros: estadoMultirrubro.registros.length
        });

        setTimeout(function () {
            if (estadoMultirrubro.registros.length === 0) {
                reintentarCargaBaseMaestra(
                    "El script cargó, pero no llenó registros"
                );
            } else {
                baseMaestraCargando = false;
            }
        }, 1500);
    };

    script.onerror = function (error) {
        console.error(
            "ERROR cargando Base Maestra JSONP:",
            error
        );

        reintentarCargaBaseMaestra("Error de carga del script JSONP");
    };

    document.head.appendChild(script);

    return true;
}

window.recargarBaseMaestraMultirrubro = function recargarBaseMaestraMultirrubro() {
    estadoMultirrubro.registros = [];
    estadoMultirrubro.version = null;
    estadoMultirrubro.fechaActualizacion = null;
    estadoMultirrubro.fuente = null;

    baseMaestraIntentos = 0;
    baseMaestraUltimoError = null;
    baseMaestraCargando = false;

    return cargarBaseMaestraJSONP({ forzar: true });
};

window.diagnosticarMultirrubro = function diagnosticarMultirrubro() {
    return {
        registros: estadoMultirrubro.registros.length,
        rubros: window.obtenerRubrosMultirrubro().length,
        primerosRubros: window.obtenerRubrosMultirrubro().slice(0, 20),
        fuente: estadoMultirrubro.fuente,
        fechaActualizacion: estadoMultirrubro.fechaActualizacion,
        cargando: baseMaestraCargando,
        intentos: baseMaestraIntentos,
        ultimoError: baseMaestraUltimoError,
        scriptInsertado: Boolean(
            document.getElementById(BASE_MAESTRA_SCRIPT_ID)
        ),
        scriptSrc: document.getElementById(BASE_MAESTRA_SCRIPT_ID)?.src ?? null
    };
};

cargarBaseMaestraJSONP();
