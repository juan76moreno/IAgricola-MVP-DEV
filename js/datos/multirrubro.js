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
/* ============================================================
   Carga robusta de Base Maestra Multirrubro
   - Usa JSONP sin depender de CORS.
   - Recupera último estado válido desde localStorage.
   - Refresca en segundo plano.
   - Reintenta con espera creciente y cache-busting.
   - No borra datos válidos si una actualización de red falla.
============================================================ */

const BASE_MAESTRA_JSONP_URL =
    "https://script.google.com/a/macros/bbva.com/s/AKfycbzzXYN3bvfy_7j2vOZC9Dl8kiS4LA-ZH_GU_Owb5t6vEN04PetQsUxikEeO_mHwfU3d/exec";

const BASE_MAESTRA_CALLBACK = "iAgricolaRecibirDatos";
const BASE_MAESTRA_SCRIPT_ID = "iaAgricolaBaseMaestraJSONP";
const BASE_MAESTRA_CACHE_KEY = "IA_AGRICOLA_BASE_MAESTRA_CACHE_V1";
const BASE_MAESTRA_MAX_INTENTOS = 4;
const BASE_MAESTRA_TIMEOUT_MS = 12000;
const BASE_MAESTRA_REINTENTO_BASE_MS = 1000;

let baseMaestraIntentos = 0;
let baseMaestraCargando = false;
let baseMaestraUltimoError = null;
let baseMaestraTimeoutId = null;
let baseMaestraToken = 0;
let baseMaestraTieneCache = false;

function validarRespuestaBaseMaestra(respuesta) {
    return Boolean(
        respuesta &&
        respuesta.ok === true &&
        Array.isArray(respuesta.datos) &&
        respuesta.datos.length > 0
    );
}

function guardarBaseMaestraCache(respuesta) {
    try {
        localStorage.setItem(
            BASE_MAESTRA_CACHE_KEY,
            JSON.stringify({
                datos: respuesta.datos,
                total: respuesta.datos.length,
                fechaActualizacion: new Date().toISOString()
            })
        );
    } catch (error) {
        console.warn("No fue posible guardar cache de Base Maestra:", error);
    }
}

function cargarBaseMaestraDesdeCache() {
    try {
        const raw = localStorage.getItem(BASE_MAESTRA_CACHE_KEY);

        if (!raw) {
            return false;
        }

        const cache = JSON.parse(raw);

        if (
            !cache ||
            !Array.isArray(cache.datos) ||
            cache.datos.length === 0
        ) {
            localStorage.removeItem(BASE_MAESTRA_CACHE_KEY);
            return false;
        }

        const cargada = cargarDatosMultirrubro(
            cache.datos,
            {
                fuente: "BASE_MAESTRA_CACHE_LOCAL",
                total: cache.datos.length,
                fechaActualizacion:
                    cache.fechaActualizacion || null
            }
        );

        if (!cargada) {
            return false;
        }

        baseMaestraTieneCache = true;

        cargarSelectorRubrosMultirrubro();

        if (typeof window.inicializarRubrosExplotados === "function") {
            window.inicializarRubrosExplotados();
        }

        console.info(
            "Base Maestra restaurada desde cache:",
            cache.datos.length,
            "registros"
        );

        return true;

    } catch (error) {
        console.warn(
            "Cache de Base Maestra inválido; se ignorará:",
            error
        );

        try {
            localStorage.removeItem(BASE_MAESTRA_CACHE_KEY);
        } catch (_) {}

        return false;
    }
}

function construirUrlBaseMaestraJSONP() {
    const separador =
        BASE_MAESTRA_JSONP_URL.includes("?") ? "&" : "?";

    return (
        BASE_MAESTRA_JSONP_URL +
        separador +
        "callback=" +
        encodeURIComponent(BASE_MAESTRA_CALLBACK) +
        "&_ts=" +
        Date.now() +
        "&_r=" +
        Math.random().toString(36).slice(2)
    );
}

function limpiarScriptBaseMaestra() {
    const scriptAnterior =
        document.getElementById(BASE_MAESTRA_SCRIPT_ID);

    if (scriptAnterior && scriptAnterior.parentNode) {
        scriptAnterior.parentNode.removeChild(scriptAnterior);
    }

    if (baseMaestraTimeoutId) {
        clearTimeout(baseMaestraTimeoutId);
        baseMaestraTimeoutId = null;
    }
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

    guardarBaseMaestraCache(respuesta);
    baseMaestraTieneCache = true;

    cargarSelectorRubrosMultirrubro();

    if (typeof window.inicializarRubrosExplotados === "function") {
        window.inicializarRubrosExplotados();
    }

    baseMaestraCargando = false;
    baseMaestraUltimoError = null;

    if (baseMaestraTimeoutId) {
        clearTimeout(baseMaestraTimeoutId);
        baseMaestraTimeoutId = null;
    }

    console.log(
        "SUCCESS Base Maestra JSONP:",
        respuesta.datos.length,
        "registros"
    );

    return true;
}

function reintentarCargaBaseMaestra(motivo) {

    baseMaestraUltimoError =
        motivo || "Motivo no especificado";

    if (
        baseMaestraIntentos >= BASE_MAESTRA_MAX_INTENTOS
    ) {
        baseMaestraCargando = false;

        if (baseMaestraTieneCache) {
            console.warn(
                "Base Maestra no pudo actualizarse por red; " +
                "se conserva el último estado válido en cache.",
                {
                    intentos: baseMaestraIntentos,
                    ultimoError: baseMaestraUltimoError,
                    registros:
                        estadoMultirrubro.registros.length
                }
            );

        } else {
            console.error(
                "ERROR Base Maestra JSONP: se agotaron los reintentos.",
                {
                    intentos: baseMaestraIntentos,
                    ultimoError: baseMaestraUltimoError,
                    estado: estadoMultirrubro
                }
            );
        }

        return false;
    }

    const espera =
        BASE_MAESTRA_REINTENTO_BASE_MS *
        Math.pow(2, baseMaestraIntentos - 1);

    console.warn(
        "Reintentando carga Base Maestra JSONP:",
        {
            intentoSiguiente:
                baseMaestraIntentos + 1,
            esperaMs: espera,
            motivo: baseMaestraUltimoError
        }
    );

    setTimeout(function () {
        cargarBaseMaestraJSONP({ reintento: true });
    }, espera);

    return true;
}

window.iAgricolaRecibirDatos = function (respuesta) {

    if (!validarRespuestaBaseMaestra(respuesta)) {

        console.warn(
            "Base Maestra JSONP devolvió una respuesta inválida o vacía."
        );

        reintentarCargaBaseMaestra(
            "Respuesta inválida o sin datos"
        );

        return;
    }

    finalizarCargaBaseMaestraExitosa(respuesta);
};

function cargarBaseMaestraJSONP(opciones = {}) {

    if (
        baseMaestraCargando &&
        !opciones.reintento &&
        !opciones.forzar
    ) {
        console.warn("Carga Base Maestra ya está en curso.");
        return false;
    }

    if (!opciones.reintento) {
        baseMaestraIntentos = 0;
    }

    baseMaestraIntentos += 1;
    baseMaestraCargando = true;

    const tokenActual = ++baseMaestraToken;

    limpiarScriptBaseMaestra();

    const script = document.createElement("script");

    script.id = BASE_MAESTRA_SCRIPT_ID;
    script.src = construirUrlBaseMaestraJSONP();
    script.async = true;

    script.onload = function () {

        if (tokenActual !== baseMaestraToken) {
            return;
        }

        console.log(
            "Base Maestra JSONP solicitada.",
            {
                intento: baseMaestraIntentos,
                registros:
                    estadoMultirrubro.registros.length
            }
        );

        baseMaestraTimeoutId = setTimeout(function () {

            if (
                estadoMultirrubro.registros.length === 0
            ) {
                reintentarCargaBaseMaestra(
                    "El script cargó, pero no llenó registros"
                );
            } else {
                baseMaestraCargando = false;
                baseMaestraUltimoError = null;
            }

        }, BASE_MAESTRA_TIMEOUT_MS);
    };

    script.onerror = function () {

        if (tokenActual !== baseMaestraToken) {
            return;
        }

        reintentarCargaBaseMaestra(
            "Error de carga del script JSONP"
        );
    };

    document.head.appendChild(script);

    return true;
};

window.recargarBaseMaestraMultirrubro =
    function recargarBaseMaestraMultirrubro() {

        baseMaestraIntentos = 0;
        baseMaestraUltimoError = null;
        baseMaestraCargando = false;

        // No se borra el estado actual antes de confirmar
        // una nueva carga válida.
        return cargarBaseMaestraJSONP({
            forzar: true
        });
    };

window.diagnosticarMultirrubro =
    function diagnosticarMultirrubro() {

        return {
            registros:
                estadoMultirrubro.registros.length,

            rubros:
                window.obtenerRubrosMultirrubro().length,

            primerosRubros:
                window.obtenerRubrosMultirrubro().slice(0, 20),

            fuente:
                estadoMultirrubro.fuente,

            fechaActualizacion:
                estadoMultirrubro.fechaActualizacion,

            cargando:
                baseMaestraCargando,

            intentos:
                baseMaestraIntentos,

            ultimoError:
                baseMaestraUltimoError,

            cacheDisponible:
                baseMaestraTieneCache,

            scriptInsertado:
                Boolean(
                    document.getElementById(
                        BASE_MAESTRA_SCRIPT_ID
                    )
                ),

            scriptSrc:
                document.getElementById(
                    BASE_MAESTRA_SCRIPT_ID
                )?.src ?? null
        };
    };

// Restaurar inmediatamente el último estado válido.
// Después se intenta actualizar desde la fuente oficial.
cargarBaseMaestraDesdeCache();
cargarBaseMaestraJSONP();

