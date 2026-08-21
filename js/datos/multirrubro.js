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

function obtenerDatosMultirrubro() {
    return estadoMultirrubro;
}
window.obtenerDatosMultirubro = function() {
  return estadoMultirubro;
};
window.obtenerRubrosMultirrubro = function obtenerRubrosMultirrubro() {
    const rubros = estadoMultirrubro.registros
    .map(registro => registro.rubro)
    .filter(Boolean);

    return [...new Set(rubros)];
};
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
cargarSelectorRubrosMultirrubro();
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