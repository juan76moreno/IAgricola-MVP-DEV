console.log("Core expediente:", listarActivos());
const estadoVisita = {

    modulo: "agenda",

    objeto: null,

    estado: "INICIO"

};
function cambiarModulo(nombreModulo){

    estadoVisita.modulo = nombreModulo;

    console.log("Módulo activo:", estadoVisita.modulo);

}
function obtenerModuloActual(){

    return estadoVisita.modulo;

}
function establecerObjetoActivo(nombreObjeto){

    estadoVisita.objeto = nombreObjeto;
if(!expedienteInteligente[nombreObjeto]){

    expedienteInteligente[nombreObjeto] = {};

}
    console.log("Objeto activo:", estadoVisita.objeto);

}
function mostrarEstadoActual(){

    if(!expedienteInteligente.estadoActual){

        console.warn("Estado actual no disponible.");

        return;

    }

    console.log({

        modulo: obtenerModuloActual(),

        objeto: estadoVisita.objeto,

        estadoActual: expedienteInteligente.estadoActual,

        concepto: expedienteInteligente.estadoActual.concepto,

        unidad: expedienteInteligente.estadoActual.unidad,

        fuente: expedienteInteligente.estadoActual.fuente

    });

}
function obtenerEstadoVisita(){

    return {

        modulo: estadoVisita.modulo,

        objeto: estadoVisita.objeto,

        estado: estadoVisita.estado

    };

}
function buscarCampoBCAC(codigoCampo) {

    const campoBCAC = BCAC.campos.find(function(campo) {

        return campo.codigo === codigoCampo;

    });

    return campoBCAC || null;

}
function buscarConceptoBCAC(conceptoId) {

    const conceptoBCAC = BCAC.conceptos.find(function(concepto) {

        return concepto.id === conceptoId;

    });

    return conceptoBCAC || null;

}
function obtenerContextoBCAC(campo) {
const campoBCAC = buscarCampoBCAC(campo);
const conceptoBCAC = campoBCAC
    ? buscarConceptoBCAC(campoBCAC.conceptoId)
    : null;
    const reglaBCAC = campoBCAC
    ? BCAC.reglas.find(function(regla) {

        return regla.campoId === campoBCAC.id &&
               regla.activo === true;

    })
    : null;
    const entidadBCAC = campoBCAC
    ? BCAC.entidades.find(function(entidad) {

        return entidad.id === campoBCAC.entidadId &&
               entidad.activo === true;

    })
    : null;
    const unidadBCAC = campoBCAC
    ? BCAC.unidades.find(function(unidad) {

        return unidad.id === campoBCAC.unidadId &&
               unidad.activo === true;

    })
    : null;
    const fuenteBCAC = BCAC.fuentes.find(function(fuente) {

    return fuente.id === expedienteInteligente.origenCaptura &&
           fuente.activo === true;

}) || null;
return {

    campoBCAC,

    conceptoBCAC,

    reglaBCAC,

    entidadBCAC,

    unidadBCAC,

   fuenteBCAC,
conceptoCompletoBCAC: conceptoBCAC 
    ? {
        id: conceptoBCAC.id,
        nombre: conceptoBCAC.concepto,
        codigo: conceptoBCAC.id
    }
    : null,
    unidadCompletaBCAC: unidadBCAC
    ? {
        id: unidadBCAC.id,
        nombre: unidadBCAC.nombre,
        simbolo: unidadBCAC.simbolo,
        codigo: unidadBCAC.id
    }
    : null,
};
}
function formatearNumeroVE(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    let numero;

    if (typeof valor === "number") {
        numero = valor;
    } else {
        const texto = String(valor).trim();

        const normalizado = texto
            .replace(/\./g, "")
            .replace(",", ".");

        numero = Number(normalizado);

        if (!Number.isFinite(numero)) {
            return texto;
        }
    }

    if (!Number.isFinite(numero)) {
        return String(valor);
    }

    return numero.toLocaleString("es-VE", {
        useGrouping: true,
        maximumFractionDigits: 20
    });
}
function registrarDato(campo, valor, unidadConfirmada = null){

    const fechaCaptura = new Date().toISOString();

    expedienteInteligente.fechaSistema = fechaCaptura;

    const contextoBCAC = obtenerContextoBCAC(campo); 
    const unidadBCACConfirmada = unidadConfirmada
        ? BCAC.unidades.find(function(unidad) {
            return unidad.activo === true &&
                   unidad.simbolo === unidadConfirmada;
        }) ?? null
        : null;

    const unidadEfectiva = unidadConfirmada
    ? unidadBCACConfirmada
    : contextoBCAC.unidadBCAC;
     if (unidadConfirmada && !unidadBCACConfirmada) {
        console.warn(
            "Unidad reconocida pero aún no habilitada en BCAC:",
            unidadConfirmada
        );

        return null;
    }
      const captura = { 

   conceptoId: contextoBCAC.conceptoBCAC?.id ?? null,
   concepto: contextoBCAC.conceptoCompletoBCAC ?? null,
reglaId: contextoBCAC.reglaBCAC?.id ?? null,
entidadId: contextoBCAC.entidadBCAC?.id ?? null,

campoId: contextoBCAC.campoBCAC?.id ?? null,
unidadId: unidadEfectiva?.id ?? null,
unidadCompletaBCAC: unidadEfectiva
    ? {
        id: unidadEfectiva.id,
        nombre: unidadEfectiva.nombre,
        simbolo: unidadEfectiva.simbolo,
        codigo: unidadEfectiva.id
    }
    : null,
fuenteId: contextoBCAC.fuenteBCAC?.id ?? null,

fuente: contextoBCAC.fuenteBCAC?.nombre ?? null,
modulo: obtenerModuloActual(),

objeto: estadoVisita.objeto,

campo: campo,

        valor: valor,

        fecha: fechaCaptura

    };

    console.log("Captura:", captura);
expedienteInteligente.capturas.push(captura);
if(!expedienteInteligente.historialCapturas){

    expedienteInteligente.historialCapturas = [];

}
expedienteInteligente.historialCapturas.push(captura);
expedienteInteligente.ultimaCaptura = captura;
if (estadoVisita.objeto) {

    expedienteInteligente[
        estadoVisita.objeto
    ][campo] = valor;

    expedienteInteligente[
        estadoVisita.objeto
    ].conceptoId = captura.conceptoId;

    expedienteInteligente[
        estadoVisita.objeto
    ].entidadId = captura.entidadId;

    expedienteInteligente[
        estadoVisita.objeto
    ].campoId = captura.campoId;

}
expedienteInteligente.ultimaActualizacion = new Date().toISOString();
expedienteInteligente.totalCapturas =
    expedienteInteligente.capturas.length;
    expedienteInteligente.estadoActual = {

    modulo: estadoVisita.modulo,

   objeto: estadoVisita.objeto,
   conceptoId: captura.conceptoId,

entidadId: captura.entidadId,

campoId: captura.campoId,
unidad: captura.unidadCompletaBCAC ?? null,



fuente: captura.fuente ?? null,
fecha: expedienteInteligente.ultimaActualizacion
};
expedienteInteligente.resumen = {

    modulo: estadoVisita.modulo,

    objeto: estadoVisita.objeto,

    capturas: expedienteInteligente.totalCapturas,
concepto: captura.concepto,

unidad: captura.unidadCompletaBCAC ?? null,

fuente: captura.fuente ?? null,
};
expedienteInteligente.panel = {
concepto: captura.concepto,

unidad: captura.unidadCompletaBCAC ?? null,

fuente: captura.fuente ?? null,
    cliente: Object.keys(expedienteInteligente.cliente).length,

    visita: Object.keys(expedienteInteligente.visita).length,

    unidadProduccion: Object.keys(expedienteInteligente.unidadProduccion).length,

    perfilRubro: Object.keys(expedienteInteligente.perfilRubro).length,

};
expedienteInteligente.version = "0.1.0";
expedienteInteligente.estado = estadoVisita.estado;
expedienteInteligente.moduloActual =
    estadoVisita.modulo;
    expedienteInteligente.objetoActual =
    estadoVisita.objeto;
    expedienteInteligente.fechaSistema = fechaCaptura;
    expedienteInteligente.origenCaptura = "FUE-000001";
    expedienteInteligente.estadoActual.version =
    expedienteInteligente.version;
    expedienteInteligente.estadoActual.totalCapturas =
    expedienteInteligente.totalCapturas;
    expedienteInteligente.estadoActual.origenCaptura =
    expedienteInteligente.origenCaptura;
    expedienteInteligente.estadoActual.fechaSistema =
    expedienteInteligente.fechaSistema;
    expedienteInteligente.estadoActual.ultimaCaptura =
    expedienteInteligente.ultimaCaptura;
    expedienteInteligente.estadoActual.ultimaActualizacion =
    expedienteInteligente.ultimaActualizacion;
mostrarEstadoActual();
console.table(expedienteInteligente.capturas);
console.log("Expediente estructurado:", expedienteInteligente);
mostrarExpediente();
    return captura;


}
function registrarDatoFormulario(idCampo){

    const control = document.getElementById(idCampo);

    if(!control){

        return;

    }

    registrarDato(idCampo, control.value);

}
function registrarFormulario(idsCampos){

    idsCampos.forEach(function(idCampo){

        registrarDatoFormulario(idCampo);

    });

}
function registrarDatosMinimos(){

    registrarFormulario([

        "fechaVisita",

        "horaInicio",

        "tecnico",

        "tipoVisita"

    ]);

}
function registrarDatosCliente(){

    registrarFormulario([

        "cliente",

        "finca",

        "municipio",

        "departamento",

        "codigoCliente",

        "identificacionCliente"

    ]);

}
function registrarCaracterizacion(){

    registrarFormulario([

        "parroquia",

        "direccionUnidadProduccion",

        "centroMercado",

        "tipoMercado",

        "destinoProduccion",

        "viasAcceso",

        "tenenciaTierra",

        "superficieTotal",

        "superficieAprovechable",

        "superficieCultivada"

    ]);

}
function registrarPerfilRubro(){

    registrarFormulario([
        "rubroPrincipal",
        "cantidadRubrosExplotados",
        "subsector",
        "tipoSubsector",
        "sectorProduccion"
    ]);

    const rubroPrincipal =
        document.getElementById("rubroPrincipal")?.value || "";

    const rubrosSecundarios = Array.from(
        document.querySelectorAll(
            'select[data-rubro-explotado="true"]'
        )
    )
    .map(function(select){
        return select.value;
    })
    .filter(Boolean);

    const rubrosExplotados = [
        rubroPrincipal,
        ...rubrosSecundarios
    ].filter(Boolean);

    registrarDato(
        "rubrosExplotados",
        rubrosExplotados
    );
}
function registrarCapturaCompleta(){

    registrarDatosMinimos();

    registrarDatosCliente();

    registrarCaracterizacion();

    registrarPerfilRubro();

}
const expedienteInteligente = {

    visita:{},

    cliente:{},

    unidadProduccion:{},

    perfilRubro:{},

    capturas:[],

    evidencias:[],

    alertas:[],

    seguimientos:[]

};
function obtenerExpediente(){

    return expedienteInteligente;

}
function mostrarExpediente(){

    console.log(obtenerExpediente());

console.table(expedienteInteligente.panel ?? {});

console.table(expedienteInteligente.estadoActual ?? {});

console.table(expedienteInteligente.resumen ?? {});

if(expedienteInteligente.estadoActual){

    console.table({

    concepto: expedienteInteligente.estadoActual?.concepto ?? null,

    unidad: expedienteInteligente.estadoActual?.unidad ?? null,

    fuente: expedienteInteligente.estadoActual?.fuente ?? null

});

}
}
function preparar(){

  document.getElementById('card').style.display='none';

  document.getElementById('prep').style.display='block';
  cambiarModulo("preparacion");
establecerObjetoActivo("Preparación");
mostrarEstadoActual();
mostrarExpediente();
registrarDatosMinimos();

  setTimeout(function(){

    document.getElementById('last').innerText='✓';

  },1000);

  setTimeout(function(){

    document.getElementById('prep').style.display='none';

    document.getElementById('ready').style.display='block';

  },2200);

}

function iniciarVisita(){

    document.getElementById("ready").style.display="none";
estadoVisita.estado = "EN_VISITA";
    document.getElementById("visit").style.display="block";
    cambiarModulo("visita");
    establecerObjetoActivo("Inicio de Visita");
    inicializarVoz();
    
    registrarDatosCliente();
    mostrarExpediente();
document.getElementById("farm").style.display="none";

document.getElementById("crop").style.display="none";
}
function continuarVisita(){

    document.getElementById("visit").style.display="none";

    document.getElementById("farm").style.display="block";
    cambiarModulo("caracterizacion");
establecerObjetoActivo("Caracterización");
registrarCaracterizacion();
mostrarEstadoActual();
mostrarExpediente();
}
function continuarCaracterizacion(){

    document.getElementById("farm").style.display="none";

    document.getElementById("crop").style.display="block";
   cambiarModulo("perfilRubro");
establecerObjetoActivo("Perfil Técnico por Rubro");
mostrarEstadoActual();

mostrarExpediente();
}
function continuarPerfilRubro(){
registrarPerfilRubro();
    

    alert("Aquí iniciará el siguiente módulo del expediente");

}
function volverACaracterizacion() {
    document.getElementById("crop").style.display = "none";
    document.getElementById("farm").style.display = "block";

    cambiarModulo("caracterizacion");
    establecerObjetoActivo("Caracterización");

    mostrarEstadoActual();
    mostrarExpediente();
}

function volverAVisita() {
    document.getElementById("farm").style.display = "none";
    document.getElementById("visit").style.display = "block";

    cambiarModulo("visita");
    establecerObjetoActivo("Inicio de Visita");

    mostrarEstadoActual();
    mostrarExpediente();
}
const rubroPrincipal = document.getElementById("rubroPrincipal");
const perfilRubroDinamico = document.getElementById("perfilRubroDinamico");

rubroPrincipal.addEventListener("change", function(){

const origenCaptura = "MANUAL";

const opcionSeleccionada =
    rubroPrincipal.options[rubroPrincipal.selectedIndex];

const rubroSeleccionado =
    opcionSeleccionada ? opcionSeleccionada.text : rubroPrincipal.value;


    if(rubroPrincipal.value === ""){

        perfilRubroDinamico.innerHTML = "";

        return;

    }
    registrarDato("rubroPrincipal", rubroPrincipal.value);
    // PERFIL CAFÉ (Pendiente de migrar a js/perfiles/cafe.js)
const perfilTecnicoSeleccionado =
    obtenerPerfilTecnico(rubroPrincipal.value);

if (perfilTecnicoSeleccionado) {

    let htmlPerfil = "";

    if (perfilTecnicoSeleccionado.html) {
        htmlPerfil += perfilTecnicoSeleccionado.html;
    }

    const estructuraProductivaHTML =
        typeof construirEstructuraProductivaHTML === "function"
            ? construirEstructuraProductivaHTML(
                rubroPrincipal.value
            )
            : "";

    htmlPerfil += estructuraProductivaHTML;

    perfilRubroDinamico.innerHTML = htmlPerfil;

    return;
}


perfilRubroDinamico.innerHTML = "";
});
let superficiePendienteUnidad = null;
function obtenerNombreCampoVoz(patron) {
    if (!patron) {
        return "el dato indicado";
    }

    if (patron.entidad === "rubroSecundario") {
        return Number.isInteger(patron.indiceRubro)
            ? "Rubro " + (patron.indiceRubro + 2)
            : "rubro secundario";
    }

    const nombres = {
        fechaVisita: "la fecha de visita",
        horaInicio: "la hora de inicio",
        tecnico: "el técnico responsable",
        tipoVisita: "el tipo de visita",
        cliente: "el nombre del cliente",
        codigoCliente: "el código de cliente",
        finca: "la finca",
        cantidadRubrosExplotados: "la cantidad de rubros",
        rubroPrincipal: "el rubro principal",
        superficieTotal: "la superficie total",
        superficieAprovechable: "la superficie aprovechable",
        superficieCultivada: "la superficie cultivada",
        estadoFitosanitario: "el estado fitosanitario"
    };

    return nombres[patron.entidad] || patron.entidad;
}

function obtenerEjemploVoz(patron) {
    if (!patron) {
        return "Código de cliente 00000001";
    }

    if (patron.entidad === "rubroSecundario") {
        const ejemplosRubros = {
            0: "Rubro dos maíz",
            1: "Rubro tres arroz",
            2: "Rubro cuatro yuca",
            3: "Rubro cinco frijol"
        };

        return ejemplosRubros[patron.indiceRubro] || "Rubro secundario maíz";
    }

    const ejemplos = {
        fechaVisita: "Fecha de visita 02/10/2026",
        horaInicio: "Hora de inicio 08:30",
        tecnico: "Técnico responsable Juan Moreno",
        tipoVisita: "Tipo de visita programada",
        cliente: "Cliente Juan Moreno",
        codigoCliente: "Código de cliente 00000001",
        finca: "Finca La Esperanza",
        cantidadRubrosExplotados: "Cantidad de rubros cinco",
        rubroPrincipal: "Rubro principal café",
        superficieTotal: "Superficie total 12 hectáreas",
        superficieAprovechable: "Superficie aprovechable 10 hectáreas",
        superficieCultivada: "Superficie cultivada 8 hectáreas",
        estadoFitosanitario: "Estado fitosanitario bueno"
    };

    return ejemplos[patron.entidad] || "Código de cliente 00000001";
}

function notificarFalloVoz(patron, detalle = "") {
    const campo = obtenerNombreCampoVoz(patron);
    const ejemplo = obtenerEjemploVoz(patron);

    const mensaje = detalle
    ? "No pude registrar " + campo + ". " + detalle + ". Repita lentamente, por ejemplo: '" + ejemplo + "'."
    : "No pude registrar " + campo + ". Repita lentamente, por ejemplo: '" + ejemplo + "'.";

    console.warn(mensaje);

    if (typeof alert === "function") {
        alert(mensaje);
    }

    return mensaje;
}
function normalizarTextoVoz(texto) {
    return String(texto ?? "")
        .replace(/\bruro\b/gi, "rubro")
        .replace(/\bruvo\b/gi, "rubro")
        .replace(/\brubo\b/gi, "rubro")
        .replace(/\brublo\b/gi, "rubro")
        .replace(/\brubro\s+tree\b/gi, "rubro tres")
        .replace(/\brubro\s+tercero\b/gi, "rubro tres")
        .replace(/\bclente\b/gi, "cliente")
        .replace(/\bclienta\b/gi, "cliente")
        .replace(/\bcodico\b/gi, "código")
        .replace(/\bcodgo\b/gi, "código")
        .replace(/\bcodigo\b/gi, "código")
        .replace(/\bfinca\s+el\b/gi, "finca El")
        .replace(/\bsuperfisie\b/gi, "superficie")
        .replace(/\bsuperficie\s+totao\b/gi, "superficie total")
        .replace(/\baprobechable\b/gi, "aprovechable")
        .replace(/\baprovechavle\b/gi, "aprovechable")
        .replace(/\bcultibada\b/gi, "cultivada")
        .replace(/\bcultivao\b/gi, "cultivada")
        .replace(/\bfitosanitareo\b/gi, "fitosanitario")
        .replace(/\bfitosanitaria\b/gi, "fitosanitario")
        .replace(/\bte\s+invito\s+responsable\b/gi, "técnico responsable")
        .replace(/\bte\s+cnico\s+responsable\b/gi, "técnico responsable")
        .replace(/\btecnico\s+responsable\b/gi, "técnico responsable")
        .replace(/\bt[eé]cnico\s+responsable\b/gi, "técnico responsable")
        .replace(/\bt[eé]cnica\s+responsable\b/gi, "técnico responsable")
        .replace(/\bt[eé]cnico\s+responsable\s+responsable\b/gi, "técnico responsable")
        .replace(/\s+/g, " ")
        .trim();
}

function interpretarVoz(texto) {

    console.warn("Interpretando:", texto);

    texto = normalizarTextoVoz(texto);

    if (superficiePendienteUnidad) {

        const unidadRespuesta = texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

        let unidadConfirmada = null;

        if (
            unidadRespuesta === "ha" ||
            unidadRespuesta.startsWith("hectarea")
        ) {
            unidadConfirmada = "ha";

        } else if (
            unidadRespuesta === "m2" ||
            unidadRespuesta === "m²" ||
            /^metros?\s+cuadrados?$/.test(unidadRespuesta)
        ) {
            unidadConfirmada = "m²";

        } else if (
            unidadRespuesta.startsWith("acre")
        ) {
            unidadConfirmada = "acre";

        } else if (
            unidadRespuesta.startsWith("legua")
        ) {
            unidadConfirmada = "legua";
        }

        if (unidadConfirmada) {

            const pendiente = superficiePendienteUnidad;

            const campoPendiente =
                document.getElementById(pendiente.entidad);

            const indicadoresUnidad = {
                superficieTotal: "unidadSuperficieTotal",
                superficieAprovechable: "unidadSuperficieAprovechable",
                superficieCultivada: "unidadSuperficieCultivada"
            };

            const indicadorUnidad = document.getElementById(
                indicadoresUnidad[pendiente.entidad]
            );

            const registroUnidad = registrarDato(
                pendiente.entidad,
                pendiente.valor,
                unidadConfirmada
            );

            if (registroUnidad === null) {
                console.warn(
                    "La unidad se mantiene pendiente de habilitación BCAC:",
                    unidadConfirmada
                );

                alert(
                    "La unidad " +
                    unidadConfirmada +
                    " fue reconocida, pero aún no está habilitada para su registro estructurado. " +
                    "El dato se mantiene pendiente."
                );

                return;
            }

            if (campoPendiente) {
                campoPendiente.value = pendiente.valor;
            }

            if (indicadorUnidad) {
                indicadorUnidad.textContent = unidadConfirmada;
            }

            superficiePendienteUnidad = null;

            console.info(
                "Unidad de superficie confirmada:",
                unidadConfirmada
            );

            return;
        }

        notificarFalloVoz(
            { entidad: superficiePendienteUnidad.entidad },
            "Detecté la superficie, pero no pude identificar la unidad indicada"
        );

        return;
    }

    const entidadesDetectadas = [];

    const numerosVoz = {
        uno: "1",
        dos: "2",
        tres: "3",
        cuatro: "4",
        cinco: "5",
        seis: "6",
        siete: "7",
        ocho: "8",
        nueve: "9",
        diez: "10"
    };

    const patrones = [
        {
            entidad: "fechaVisita",
            expresiones: [
                /^fecha\s+(?:de\s+)?visita[:\s]+(.+)$/i,
                /^fecha\s+(?:de\s+)?inspecci[oó]n[:\s]+(.+)$/i,
                /^visita\s+fecha[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "horaInicio",
            expresiones: [
                /^hora\s+(?:de\s+)?inicio[:\s]+(.+)$/i,
                /^hora\s+(?:de\s+)?la\s+visita[:\s]+(.+)$/i,
                /^inicio\s+(?:de\s+)?visita[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "tecnico",
            expresiones: [
                /^t[eé]cnico\s+responsable[:\s]+(.+)$/i,
                /^t[eé]cnica\s+responsable[:\s]+(.+)$/i,
                /^nombre\s+del\s+t[eé]cnico[:\s]+(.+)$/i,
                /^nombre\s+de\s+la\s+t[eé]cnica[:\s]+(.+)$/i,
                /^responsable\s+t[eé]cnico[:\s]+(.+)$/i,
                /^responsable\s+t[eé]cnica[:\s]+(.+)$/i,
                /^especialista\s+agr[ií]cola[:\s]+(.+)$/i,
                /^t[eé]cnico[:\s]+(.+)$/i,
                /^t[eé]cnica[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "tipoVisita",
            expresiones: [
                /^tipo\s+(?:de\s+)?visita[:\s]+(.+)$/i,
                /^visita\s+(programada|planificada|ordinaria|seguimiento|extraordinaria|no\s+programada|imprevista)$/i
            ]
        },
        {
            entidad: "cliente",
            expresiones: [
                /^cliente[:\s]+(.+)$/i,
                /^nombre\s+del\s+cliente[:\s]+(.+)$/i,
                /^productor[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "finca",
            expresiones: [
                /^finca[:\s]+(.+)$/i,
                /^nombre\s+de\s+la\s+finca[:\s]+(.+)$/i,
                /^nombre\s+(?:de\s+)?finca[:\s]+(.+)$/i,
                /^unidad\s+de\s+producci[oó]n[:\s]+(.+)$/i,
                /^parcela[:\s]+(.+)$/i,
                /^hato[:\s]+(.+)$/i,
                /^hacienda[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "municipio",
            expresiones: [
                /^municipio[:\s]+(.+)$/i,
                /^municipio\s+de[:\s]+(.+)$/i,
                /^ubicaci[oó]n\s+municipio[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "departamento",
            expresiones: [
                /^departamento[:\s]+(.+)$/i,
                /^estado[:\s]+(.+)$/i,
                /^entidad\s+federal[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "codigoCliente",
            expresiones: [
                /^c[oó]digo(?:\s+de)?\s+cliente[:\s]+([0-9\s]+)$/i,
                /^cliente\s+n[uú]mero[:\s]+([0-9\s]+)$/i
            ]
        },
        {
            entidad: "cantidadRubrosExplotados",
            expresiones: [
                /^cantidad\s+de\s+rubros(?:\s+explotados)?(?:\s*:\s*|\s+)(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)$/i,
                /^n[uú]mero\s+de\s+rubros(?:\s+explotados)?(?:\s*:\s*|\s+)(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)$/i,
                /^(?:tengo|exploto|manejo)\s+(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+rubros(?:\s+explotados)?$/i,
                /^cantidad\s+de\s+actividades\s*:?\s*(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)$/i,
                /^(?:tengo|exploto|manejo)\s+(\d+|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+actividades$/i
            ]
        },
        {
            entidad: "rubroSecundario",
            indiceRubro: 0,
            expresiones: [
                /^rubro\s+secundario[:\s]+(.+)$/i,
                /^rubro\s+(?:2|dos|segundo)[:\s]+(.+)$/i,
                /^segundo\s+rubro[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "rubroSecundario",
            indiceRubro: 1,
            expresiones: [
                /^rubro\s+(?:3|tres|tercero)[:\s]+(.+)$/i,
                /^tercer\s+rubro[:\s]+(.+)$/i,
                /^tercero\s+rubro[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "rubroSecundario",
            indiceRubro: 2,
            expresiones: [
                /^rubro\s+(?:4|cuatro|cuarto)[:\s]+(.+)$/i,
                /^cuarto\s+rubro[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "rubroSecundario",
            indiceRubro: 3,
            expresiones: [
                /^rubro\s+(?:5|cinco|quinto)[:\s]+(.+)$/i,
                /^quinto\s+rubro[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "rubroPrincipal",
            expresiones: [
                /^rubro\s+principal[:\s]+(.+)$/i,
                /^rubro(?!\s+secundario\b)[:\s]+(.+)$/i,
                /^cultivo[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "subsector",
            expresiones: [
                /^sub\s*sector[:\s]+(.+)$/i,
                /^subsector[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "tipoSubsector",
            expresiones: [
                /^tipo\s+de\s+sub\s*sector[:\s]+(.+)$/i,
                /^tipo\s+de\s+subsector[:\s]+(.+)$/i,
                /^tipo\s+sub\s*sector[:\s]+(.+)$/i,
                /^tipo\s+subsector[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "sectorProduccion",
            expresiones: [
                /^sector\s+de\s+la\s+producci[oó]n[:\s]+(.+)$/i,
                /^sector\s+producci[oó]n[:\s]+(.+)$/i,
                /^sector[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "superficieTotal",
            expresiones: [
                /^superficie\s+total[:\s]+(.+)$/i,
                /^superficie[:\s]+(?!aprovechable\b|cultivada\b)(.+)$/i,
                /^tiene\s+sembradas[:\s]+(.+)$/i,
                /^tiene\s+(.+)\s+hect[aá]reas$/i
            ]
        },
        {
            entidad: "superficieAprovechable",
            expresiones: [
                /^superficie\s+aprovechable[:\s]+(.+)$/i,
                /^área\s+aprovechable[:\s]+(.+)$/i,
                /^area\s+aprovechable[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "superficieCultivada",
            expresiones: [
                /^superficie\s+cultivada[:\s]+(.+)$/i,
                /^área\s+cultivada[:\s]+(.+)$/i,
                /^area\s+cultivada[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "estadoFitosanitario",
            expresiones: [
                /^estado\s+fitosanitario[:\s]+(.+)$/i,
                /^condici[oó]n\s+fitosanitaria[:\s]+(.+)$/i
            ]
        }
    ];

    function normalizarClave(textoClave) {
        return String(textoClave ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function capitalizarTexto(textoValor) {
        return String(textoValor ?? "")
            .trim()
            .toLowerCase()
            .replace(/(^|\s)\S/g, function(letra) {
                return letra.toUpperCase();
            });
    }

    function capitalizarNombreFinca(textoValor) {
        return capitalizarTexto(textoValor)
            .replace(/\bC\.\s*A\.?\b/gi, "C.A.")
            .replace(/\bS\.\s*A\.?\b/gi, "S.A.")
            .replace(/\bS\.\s*R\.\s*L\.?\b/gi, "S.R.L.");
    }
    function normalizarTextoLibreVoz(valorOriginal) {
        return capitalizarTexto(valorOriginal)
            .replace(/\bC\.\s*A\.?\b/gi, "C.A.")
            .replace(/\bS\.\s*A\.?\b/gi, "S.A.")
            .replace(/\bS\.\s*R\.\s*L\.?\b/gi, "S.R.L.")
            .replace(/\bRif\b/g, "RIF")
            .replace(/\bGps\b/g, "GPS");
    }


    function normalizarFechaVisitaVoz(valorOriginal) {
        const textoFecha = normalizarClave(valorOriginal);

        if (textoFecha === "hoy") {
            return new Date().toISOString().slice(0, 10);
        }

        const meses = {
            enero: "01",
            febrero: "02",
            marzo: "03",
            abril: "04",
            mayo: "05",
            junio: "06",
            julio: "07",
            agosto: "08",
            septiembre: "09",
            setiembre: "09",
            octubre: "10",
            noviembre: "11",
            diciembre: "12"
        };

        let coincidenciaFecha = textoFecha.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);

        if (coincidenciaFecha) {
            return (
                coincidenciaFecha[3] + "-" +
                coincidenciaFecha[2].padStart(2, "0") + "-" +
                coincidenciaFecha[1].padStart(2, "0")
            );
        }

        coincidenciaFecha = textoFecha.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);

        if (coincidenciaFecha) {
            return (
                coincidenciaFecha[1] + "-" +
                coincidenciaFecha[2].padStart(2, "0") + "-" +
                coincidenciaFecha[3].padStart(2, "0")
            );
        }

        coincidenciaFecha = textoFecha.match(/^(\d{1,2})\s+de\s+([a-zñ]+)(?:\s+de)?\s+(\d{4})$/i);

        if (coincidenciaFecha && meses[coincidenciaFecha[2]]) {
            return (
                coincidenciaFecha[3] + "-" +
                meses[coincidenciaFecha[2]] + "-" +
                coincidenciaFecha[1].padStart(2, "0")
            );
        }

        return String(valorOriginal ?? "").trim();
    }

    function normalizarHoraInicioVoz(valorOriginal) {
        const textoHora = normalizarClave(valorOriginal)
            .replace(/\./g, "")
            .replace(/\s+horas?$/, "")
            .trim();

        let coincidenciaHora = textoHora.match(/^(\d{1,2})(?::| y | con )(\d{1,2})\s*(am|pm)?$/i);

        if (coincidenciaHora) {
            let hora = Number(coincidenciaHora[1]);
            const minutos = coincidenciaHora[2].padStart(2, "0");
            const meridiano = coincidenciaHora[3];

            if (meridiano === "pm" && hora < 12) {
                hora += 12;
            }

            if (meridiano === "am" && hora === 12) {
                hora = 0;
            }

            return String(hora).padStart(2, "0") + ":" + minutos;
        }

        coincidenciaHora = textoHora.match(/^(\d{1,2})\s*(am|pm)$/i);

        if (coincidenciaHora) {
            let hora = Number(coincidenciaHora[1]);
            const meridiano = coincidenciaHora[2];

            if (meridiano === "pm" && hora < 12) {
                hora += 12;
            }

            if (meridiano === "am" && hora === 12) {
                hora = 0;
            }

            return String(hora).padStart(2, "0") + ":00";
        }

        coincidenciaHora = textoHora.match(/^(\d{1,2})$/);

        if (coincidenciaHora) {
            return coincidenciaHora[1].padStart(2, "0") + ":00";
        }

        return String(valorOriginal ?? "").trim();
    }

    function normalizarTipoVisitaVoz(valorOriginal) {
        const clave = normalizarClave(valorOriginal);

        const mapaTipoVisita = {
            programada: "Programada",
            planificada: "Programada",
            ordinaria: "Programada",
            seguimiento: "Seguimiento",
            "de seguimiento": "Seguimiento",
            extraordinaria: "Extraordinaria",
            "no programada": "No programada",
            imprevista: "No programada"
        };

        return mapaTipoVisita[clave] || capitalizarTexto(valorOriginal);
    }

    function normalizarCampoTecnico(entidad, valorOriginal) {
        const clave = normalizarClave(valorOriginal);

        if (entidad === "subsector") {
            const mapaSubsector = {
                vegetal: "Vegetal",
                agricola: "Vegetal",
                agrícola: "Vegetal",
                pecuario: "Pecuario",
                animal: "Pecuario",
                agroindustrial: "Agroindustrial",
                agroindustria: "Agroindustrial",
                comercializador: "Comercialización",
                comercializacion: "Comercialización",
                comercialización: "Comercialización",
                pesquero: "Pesquero",
                acuicola: "Pesquero",
                acuícola: "Pesquero",
                forestal: "Forestal"
            };

            return mapaSubsector[clave] || capitalizarTexto(valorOriginal);
        }

        if (entidad === "tipoSubsector") {
            const mapaTipoSubsector = {
                cereal: "Cereales",
                cereales: "Cereales",
                semilla: "Semillas",
                semillas: "Semillas",
                leguminosa: "Leguminosas",
                leguminosas: "Leguminosas",
                hortaliza: "Hortalizas",
                hortalizas: "Hortalizas",
                tuberculo: "Tubérculos",
                tuberculos: "Tubérculos",
                tubérculo: "Tubérculos",
                tubérculos: "Tubérculos",
                frutal: "Frutales",
                frutales: "Frutales",
                cana: "Caña",
                caña: "Caña",
                cafe: "Café",
                café: "Café",
                bovino: "Bovino",
                bovinos: "Bovino",
                bufalino: "Bufalino",
                bufalinos: "Bufalino",
                avicola: "Avícola",
                avícola: "Avícola",
                porcino: "Porcino",
                porcinos: "Porcino",
                piscicola: "Piscícola",
                piscícola: "Piscícola",
                ovino: "Ovino",
                ovinos: "Ovino",
                caprino: "Caprino",
                caprinos: "Caprino"
            };

            return mapaTipoSubsector[clave] || capitalizarTexto(valorOriginal);
        }

        if (entidad === "sectorProduccion") {
            const mapaSector = {
                primaria: "Producción primaria",
                primario: "Producción primaria",
                "produccion primaria": "Producción primaria",
                "producción primaria": "Producción primaria",
                "productor primario": "Producción primaria",
                agroindustrial: "Agroindustrial",
                agroindustria: "Agroindustrial",
                comercializador: "Comercialización",
                comercializacion: "Comercialización",
                "produccion agroindustrial": "Agroindustrial",
                "producción agroindustrial": "Agroindustrial"
            };

            return mapaSector[clave] || capitalizarTexto(valorOriginal);
        }

        return valorOriginal;
    }

    function sincronizarControl(entidad, valor, unidadSuperficieDetectada = null) {
        const campo = document.getElementById(entidad);

        if (!campo) {
            console.debug({
                control: entidad,
                actualizado: false,
                valor: valor
            });
            return false;
        }

        campo.value = valor;

        if (campo.id === "cantidadRubrosExplotados") {
            campo.dispatchEvent(new Event("input", { bubbles: true }));
        }

        if (unidadSuperficieDetectada) {
            const indicadoresUnidad = {
                superficieTotal: "unidadSuperficieTotal",
                superficieAprovechable: "unidadSuperficieAprovechable",
                superficieCultivada: "unidadSuperficieCultivada"
            };

            const idIndicadorUnidad = indicadoresUnidad[entidad];

            if (idIndicadorUnidad) {
                const indicadorUnidad = document.getElementById(idIndicadorUnidad);

                if (indicadorUnidad) {
                    indicadorUnidad.textContent = unidadSuperficieDetectada;
                }
            }
        }

        if (campo.tagName === "SELECT") {
            campo.dispatchEvent(new Event("change", { bubbles: true }));
        }

        console.debug({
            control: entidad,
            actualizado: true,
            valor: valor
        });

        return true;
    }

    function sincronizarRubroPrincipal(valor, patron) {
        const selectorRubro = document.getElementById("rubroPrincipal");

        if (!selectorRubro) {
            return false;
        }

        const valorNormalizado = normalizarClave(valor);

        const opcionRubro = Array.from(selectorRubro.options).find(
            opcion =>
                normalizarClave(opcion.value) === valorNormalizado ||
                normalizarClave(opcion.textContent) === valorNormalizado
        );

        if (!opcionRubro) {
            notificarFalloVoz(
                patron,
                "Reconocí el rubro '" + valor + "', pero no lo encontré en la lista disponible"
            );

            return false;
        }

        selectorRubro.value = opcionRubro.value;

        selectorRubro.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        console.log(
            "Rubro principal sincronizado por voz:",
            opcionRubro.value
        );

        return true;
    }

    function sincronizarRubroSecundario(valor, patron) {
        const selectores = Array.from(
            document.querySelectorAll(
                'select[data-rubro-explotado="true"]'
            )
        );

        const selectorDisponible =
            Number.isInteger(patron.indiceRubro)
                ? selectores[patron.indiceRubro]
                : selectores.find(function (select) {
                    return !select.value;
                });

        if (!selectorDisponible) {
            notificarFalloVoz(
                patron,
                "No encontré el campo disponible en pantalla"
            );

            return false;
        }

        const valorNormalizado = normalizarClave(valor);

        const opcionRubro = Array.from(selectorDisponible.options).find(
            opcion =>
                normalizarClave(opcion.value) === valorNormalizado ||
                normalizarClave(opcion.textContent) === valorNormalizado
        );

        if (!opcionRubro) {
            notificarFalloVoz(
                patron,
                "Reconocí el rubro '" + valor + "', pero no lo encontré en la lista disponible"
            );

            return false;
        }

        selectorDisponible.value = opcionRubro.value;

        selectorDisponible.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        console.log(
            "Rubro secundario sincronizado por voz:",
            patron.indiceRubro !== undefined
                ? "Rubro " + (patron.indiceRubro + 2)
                : "Primer disponible",
            opcionRubro.value
        );

        return true;
    }

    function resolverRubro(valor, patron) {
        let valorRubro = normalizarClave(valor);
        let rubroCoincidente = null;

        const rubrosDisponibles =
            typeof window.obtenerRubrosMultirrubro === "function"
                ? window.obtenerRubrosMultirrubro()
                : [];

        rubroCoincidente = rubrosDisponibles.find(function (rubro) {
            return normalizarClave(rubro) === valorRubro;
        });

        if (rubroCoincidente) {
            return rubroCoincidente;
        }

        if (typeof window.resolverCasuisticaVoz === "function") {
            const resultadoCasuistica = window.resolverCasuisticaVoz(valorRubro);

            if (resultadoCasuistica.estado === "UNICA") {
                const registro = resultadoCasuistica.coincidencias[0];

                console.log(
                    "Casuística reconocida por voz:",
                    registro.varianteCasuistica ||
                    registro.rubroCasuisticaOrigen ||
                    registro.rubro
                );

                console.log(
                    "Rubro asociado a casuística:",
                    registro.rubro
                );

                return registro.rubro;
            }

            if (resultadoCasuistica.estado === "AMBIGUA") {
                notificarFalloVoz(
                    patron,
                    "El rubro indicado es ambiguo y puede corresponder a más de una opción"
                );

                return null;
            }
        }

        return valorRubro;
    }

    function procesarTextoVoz(textoProcesar) {
        for (const patron of patrones) {

            let coincidencia = null;

            for (const expresion of patron.expresiones) {

                coincidencia = textoProcesar.match(expresion);

                if (coincidencia) {
                    break;
                }
            }

            if (!coincidencia) {
                continue;
            }

            let valor = coincidencia[1].trim();

            valor = numerosVoz[valor.toLowerCase()] ?? valor;

            const textoNormalizado = normalizarClave(valor);

            if (
                textoNormalizado.includes("sin informacion") ||
                textoNormalizado.includes("sin dato") ||
                textoNormalizado.includes("sin datos")
            ) {
                valor = "sin información";
            }

            let unidadSuperficieDetectada = null;

            switch (patron.entidad) {

                case "codigoCliente":
                    valor = valor.replace(/\s+/g, "");
                    valor = valor.padStart(8, "0");
                    break;

                case "fechaVisita":
                    valor = normalizarFechaVisitaVoz(valor);
                    break;

                case "horaInicio":
                    valor = normalizarHoraInicioVoz(valor);
                    break;

                case "tipoVisita":
                    valor = normalizarTipoVisitaVoz(valor);
                    break;

                case "tecnico":
                    valor = valor
                        .replace(/^(responsable\s+)+/i, "")
                        .replace(/^t[eé]cnic[oa]\s+responsable\s+/i, "")
                        .replace(/^especialista\s+agr[ií]cola\s+/i, "")
                        .replace(/\s{2,}/g, " ")
                        .trim();
                    valor = normalizarTextoLibreVoz(valor);
                    break;

                case "finca":
                    valor = capitalizarNombreFinca(valor.replace(/\s{2,}/g, " ").trim());
                    break;

                case "cliente":
                case "municipio":
                case "departamento":
                case "estadoFitosanitario":
                    valor = normalizarTextoLibreVoz(valor.replace(/\s{2,}/g, " ").trim());
                    break;

                case "superficieTotal":
                case "superficieAprovechable":
                case "superficieCultivada": {

                    const superficieDetectada = coincidencia[1].match(
                        /(\d+(?:[.,]\d+)?)\s*(hectareas?|hectáreas?|ha|metros?\s*cuadrados?|m2|m²|acres?|leguas?)?/i
                    );

                    if (superficieDetectada) {

                        valor = superficieDetectada[1].replace(",", ".");

                        const unidadDictada = superficieDetectada[2];

                        if (!unidadDictada) {
                            superficiePendienteUnidad = {
                                entidad: patron.entidad,
                                valor: valor
                            };

                            console.warn(
                                "Unidad de superficie pendiente para",
                                patron.entidad,
                                "valor:",
                                valor
                            );

                            alert(
                                "Se reconoció una superficie de " +
                                formatearNumeroVE(valor) +
                                ". Indique la unidad: hectáreas, metros cuadrados, acres o leguas."
                            );

                            return true;
                        }

                        const unidadNormalizada = normalizarClave(unidadDictada);

                        if (
                            unidadNormalizada === "ha" ||
                            unidadNormalizada.startsWith("hectarea")
                        ) {
                            unidadSuperficieDetectada = "ha";

                        } else if (
                            unidadNormalizada === "m2" ||
                            unidadNormalizada === "m²" ||
                            /^metros?\s+cuadrados?$/.test(unidadNormalizada)
                        ) {
                            unidadSuperficieDetectada = "m²";

                        } else if (
                            unidadNormalizada.startsWith("acre")
                        ) {
                            unidadSuperficieDetectada = "acre";

                        } else if (
                            unidadNormalizada.startsWith("legua")
                        ) {
                            unidadSuperficieDetectada = "legua";
                        }
                    }

                    break;
                }

                case "rubroSecundario":
                case "rubroPrincipal": {
                    const rubroResuelto = resolverRubro(valor, patron);

                    if (!rubroResuelto) {
                        return true;
                    }

                    valor = rubroResuelto;
                    break;
                }

                case "subsector":
                case "tipoSubsector":
                case "sectorProduccion":
                    valor = normalizarCampoTecnico(patron.entidad, valor);
                    break;

                default:
                    valor = valor.trim();
                    break;
            }

            const registro = registrarDato(
                patron.entidad,
                valor,
                (
                    patron.entidad === "superficieTotal" ||
                    patron.entidad === "superficieAprovechable" ||
                    patron.entidad === "superficieCultivada"
                )
                    ? unidadSuperficieDetectada
                    : null
            );

            if (registro === null) {
                return true;
            }

            console.log(
                "Dato registrado:",
                patron.entidad,
                valor
            );

            entidadesDetectadas.push({
                entidad: patron.entidad,
                destino: patron.entidad,
                valor: valor,
                fecha: new Date().toISOString()
            });

            if (patron.entidad === "rubroPrincipal") {
                sincronizarRubroPrincipal(valor, patron);

            } else if (patron.entidad === "rubroSecundario") {
                sincronizarRubroSecundario(valor, patron);

            } else {
                sincronizarControl(
                    patron.entidad,
                    valor,
                    unidadSuperficieDetectada
                );
            }

            return true;
        }

        return false;
    }

    const iniciosEntidad = [
        /fecha\s+(?:de\s+)?visita/i,
        /fecha\s+(?:de\s+)?inspecci[oó]n/i,
        /hora\s+(?:de\s+)?inicio/i,
        /hora\s+(?:de\s+)?la\s+visita/i,
        /t[eé]cnico\s+responsable/i,
        /nombre\s+del\s+t[eé]cnico/i,
        /responsable\s+t[eé]cnico/i,
        /especialista\s+agr[ií]cola/i,
        /(?<!responsable\s)t[eé]cnico/i,
        /tipo\s+(?:de\s+)?visita/i,
        /c[oó]digo(?:\s+(?:de|del))?\s+cliente/i,
        /(?<!c[oó]digo\s)(?<!c[oó]digo\sde\s)(?<!c[oó]digo\sdel\s)cliente/i,
        /nombre\s+de\s+la\s+finca/i,
        /nombre\s+(?:de\s+)?finca/i,
        /unidad\s+de\s+producci[oó]n/i,
        /(?:^|\s)finca/i,
        /(?:^|\s)municipio/i,
        /(?:^|\s)departamento/i,
        /(?:^|\s)estado/i,
        /superficie\s+total/i,
        /superficie\s+aprovechable/i,
        /superficie\s+cultivada/i,
        /rubro\s+principal/i,
        /rubro\s+secundario/i,
        /rubro\s+(?:2|dos|segundo)/i,
        /segundo\s+rubro/i,
        /rubro\s+(?:3|tres|tercero)/i,
        /tercer\s+rubro/i,
        /tercero\s+rubro/i,
        /rubro\s+(?:4|cuatro|cuarto)/i,
        /cuarto\s+rubro/i,
        /rubro\s+(?:5|cinco|quinto)/i,
        /quinto\s+rubro/i,
        /tipo\s+de\s+sub\s*sector/i,
        /tipo\s+de\s+subsector/i,
        /tipo\s+sub\s*sector/i,
        /tipo\s+subsector/i,
        /(?<!tipo de )sub\s*sector/i,
        /(?<!tipo de )subsector/i,
        /(?:^|\s)sector\s+de\s+la\s+producci[oó]n/i,
        /(?:^|\s)sector\s+producci[oó]n/i
    ];

    const posiciones = [];

    for (const inicio of iniciosEntidad) {
        const coincidenciaInicio = inicio.exec(texto);

        if (coincidenciaInicio) {
            posiciones.push(coincidenciaInicio.index);
        }
    }

    const posicionesUnicas = [...new Set(posiciones)].sort((a, b) => a - b);

    if (posicionesUnicas.length > 1) {

        const segmentos = posicionesUnicas
            .map((inicio, indice) => {
                const fin = posicionesUnicas[indice + 1] ?? texto.length;
                return texto.slice(inicio, fin).trim();
            })
            .filter(Boolean);

        console.log("Dictado multientidad:", segmentos);

        for (const segmento of segmentos) {
            procesarTextoVoz(segmento);
        }

    } else {

        procesarTextoVoz(texto);
    }

    const entidadesUnicas = [...new Map(

        entidadesDetectadas.map(function(item){

            return [
                item.entidad + "_" + item.valor,
                item
            ];

        })

    ).values()];

    if (entidadesUnicas.length > 0) {

        console.table(entidadesUnicas);
        console.table(
            expedienteInteligente.capturas
        );
        console.info(
            "Entidades reconocidas:",
            entidadesUnicas.length
        );
        console.log(
            "Motor de Voz finalizado correctamente."
        );

        return;
    }

    notificarFalloVoz(
        null,
        "No pude identificar el campo ni el valor indicado"
    );
}












function inicializarVoz() {

   const ReconocimientoVoz =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!ReconocimientoVoz) {

        console.error("Reconocimiento de voz no disponible.");

        return false;

    }

    window.reconocimiento = new ReconocimientoVoz();

    window.reconocimiento.lang = "es-VE";

window.reconocimiento.continuous = true;

window.reconocimiento.interimResults = false;

window.reconocimiento.maxAlternatives = 1;

window.reconocimiento.onstart = function () {

    console.log("Micrófono activo");

};

window.reconocimiento.onresult = function (evento) {

    let texto = "";

for (let i = evento.resultIndex; i < evento.results.length; i++) {
    if (evento.results[i].isFinal) {
        texto += evento.results[i][0].transcript + " ";
    }
}

texto = texto.trim();

if (!texto) {
    return;
}

    console.log("Texto reconocido:", texto);

    registrarDato("voz", texto);

    console.warn("Antes de interpretar");
    interpretarVoz(texto);

    mostrarExpediente();

    console.log(obtenerExpediente());

};

window.reconocimiento.onerror = function (evento) {

    console.error("Error de voz:", evento.error);

};

window.reconocimiento.onend = function () {

    window.reconocimientoActivo = false;

    console.log("Micrófono detenido");

};

    return true;

}

function iniciarEscucha() {
if (estadoVisita.estado !== "EN_VISITA") {
    console.warn("Micrófono bloqueado: la visita aún no ha iniciado.");
    return;
}
    if (!window.reconocimiento) {

        if (!inicializarVoz()) {

            return;

        }

    }

    if (window.reconocimientoActivo) {

    console.log("Deteniendo micrófono por solicitud del especialista.");

    window.reconocimiento.stop();

    return;
}

    window.reconocimientoActivo = true;

    try {

        window.reconocimiento.start();

    } catch (error) {

        window.reconocimientoActivo = false;

        console.error("No se pudo iniciar el micrófono:", error);

    }

}


/* ============================================================
   BCAC - Base de Conocimiento Agronómico Corporativa
   DEV-0007
============================================================ */
const BCAC = {
    version: "1.0.0",
    paisBase: "Universal",
    idiomaBase: "es",
conceptos: [
    {
        id: "BCAC-000001",
        concepto: "Superficie Total",
        entidad: "UnidadProduccion",
        campo: "superficieTotal",
        tipoDato: "numero",
        unidad: "ha",
        sinonimos: [
            "ha",
            "hectárea",
            "hectáreas",
            "área",
            "superficie",
            "extensión"
        ],
        idioma: "es",
        pais: "Universal",
        activo: true
    }
],
entidades: [
    {
        id: "ENT-000001",
        nombre: "Unidad de Producción",
        codigo: "UnidadProduccion",
        activo: true
    },
    {
        id: "ENT-000002",
        nombre: "Perfil Agrícola del Cliente",
        codigo: "Cliente",
        activo: true
    },
    {
        id: "ENT-000003",
        nombre: "Perfil Técnico por Rubro",
        codigo: "PerfilRubro",
        activo: true
    }
],
campos: [
    {
        id: "CAM-000001",
        nombre: "Superficie Total",
        codigo: "superficieTotal",
        entidadId: "ENT-000001",
        tipoDato: "numero",
        unidadId: "UNI-000002",
        activo: true
    },
    {
        id: "CAM-000002",
        nombre: "Estado Fitosanitario",
        codigo: "estadoFitosanitario",
        entidadId: "ENT-000003",
        tipoDato: "texto",
        activo: true
    },
    {
        id: "CAM-000003",
        nombre: "Rubro Principal",
        codigo: "rubroPrincipal",
        entidadId: "ENT-000003",
        tipoDato: "texto",
        activo: true
    }
],
unidades: [
    {
        id: "UNI-000001",
        nombre: "Metro cuadrado",
        simbolo: "m²",
        magnitud: "superficie",
        canonica: true,
        activo: true
    },
    {
        id: "UNI-000002",
        nombre: "Hectárea",
        simbolo: "ha",
        magnitud: "superficie",
        canonica: false,
        unidadCanonicaId: "UNI-000001",
        factorConversion: 10000,
        activo: true
    }
],
monedas: [
    {
        id: "MON-000001",
        codigoISO: "VES",
        nombre: "Bolívar",
        pais: "VE",
        activo: true
    },
    {
        id: "MON-000002",
        codigoISO: "USD",
        nombre: "Dólar estadounidense",
        pais: "Universal",
        activo: true
    },
    {
        id: "MON-000003",
        codigoISO: "EUR",
        nombre: "Euro",
        pais: "Universal",
        activo: true
    }
],
sistemasUnidades: [
    {
        id: "SUN-000001",
        nombre: "Sistema Internacional de Unidades",
        codigo: "SI",
        activo: true
    },
    {
        id: "SUN-000002",
        nombre: "Sistema Comercial Local",
        codigo: "SCL",
        activo: true
    }
],
factoresConversion: [
    {
        id: "FCV-000001",
        magnitud: "superficie",
        unidadOrigenId: "UNI-000002",
        unidadDestinoId: "UNI-000001",
        sistemaUnidadesId: "SUN-000001",
        factor: 10000,
        activo: true
    }
],
reglas: [
    {
        id: "RGL-000001",
        conceptoId: "BCAC-000001",
        campoId: "CAM-000001",
        tipo: "valorMinimo",
        valor: 0,
        activo: true
    },
    {
        id: "RGL-000002",
        conceptoId: "BCAC-000001",
        campoId: "CAM-000001",
        tipo: "unidadPermitida",
        unidades: [
            "UNI-000001",
            "UNI-000002"
        ],
        activo: true
    }
],
fuentes: [
    {
        id: "FUE-000001",
        nombre: "Especialista Agrícola",
        tipo: "Humana",
        nivelConfiabilidad: "Alta",
        activo: true
    },
    {
        id: "FUE-000002",
        nombre: "Documento Técnico",
        tipo: "Documental",
        nivelConfiabilidad: "Alta",
        activo: true
    },
    {
        id: "FUE-000003",
        nombre: "Reconocimiento de Voz",
        tipo: "Sistema",
        nivelConfiabilidad: "Media",
        activo: true
    }
],
paises: [
    {
        id: "PAI-000001",
        codigoISO: "VE",
        nombre: "Venezuela",
        idioma: "es",
        monedaId: "MON-000001",
        sistemaUnidadesId: "SUN-000001",
        activo: true
    },
    {
        id: "PAI-000002",
        codigoISO: "UN",
        nombre: "Universal",
        idioma: "es",
        monedaId: "MON-000002",
        sistemaUnidadesId: "SUN-000001",
        activo: true
    }
],
sinonimos: [
    {
        id: "SIN-000001",
        conceptoId: "BCAC-000001",
        termino: "ha",
        idioma: "es",
        paisId: "PAI-000002",
        activo: true
    },
    {
        id: "SIN-000002",
        conceptoId: "BCAC-000001",
        termino: "hectárea",
        idioma: "es",
        paisId: "PAI-000002",
        activo: true
    },
    {
        id: "SIN-000003",
        conceptoId: "BCAC-000001",
        termino: "hectáreas",
        idioma: "es",
        paisId: "PAI-000002",
        activo: true
    },
    {
        id: "SIN-000004",
        conceptoId: "BCAC-000001",
        termino: "superficie",
        idioma: "es",
        paisId: "PAI-000002",
        activo: true
    }
],
cultivos: [
    {
        id: "CUL-000001",
        nombre: "Café",
        nombreCientifico: "Coffea arabica",
        paisId: "PAI-000002",
        activo: true
    },
    {
        id: "CUL-000002",
        nombre: "Maíz",
        nombreCientifico: "Zea mays",
        paisId: "PAI-000002",
        activo: true
    }
],
plagas: [
    {
        id: "PLG-000001",
        nombre: "Cogollero",
        nombreCientifico: "Spodoptera frugiperda",
        activo: true
    },
    {
        id: "PLG-000002",
        nombre: "Broca del Café",
        nombreCientifico: "Hypothenemus hampei",
        activo: true
    }
],
enfermedades: [
    {
        id: "ENF-000001",
        nombre: "Roya del Café",
        nombreCientifico: "Hemileia vastatrix",
        activo: true
    },
    {
        id: "ENF-000002",
        nombre: "Antracnosis",
        nombreCientifico: "Colletotrichum spp.",
        activo: true
    }
],
fenologia: [
    {
        id: "FEN-000001",
        nombre: "Establecimiento",
        orden: 1,
        activo: true
    },
    {
        id: "FEN-000002",
        nombre: "Desarrollo Vegetativo",
        orden: 2,
        activo: true
    },
    {
        id: "FEN-000003",
        nombre: "Floración",
        orden: 3,
        activo: true
    },
    {
        id: "FEN-000004",
        nombre: "Fructificación",
        orden: 4,
        activo: true
    },
    {
        id: "FEN-000005",
        nombre: "Cosecha",
        orden: 5,
        activo: true
    }
],
laboresAgricolas: [
    {
        id: "LAB-000001",
        nombre: "Preparación del terreno",
        orden: 1,
        activo: true
    },
    {
        id: "LAB-000002",
        nombre: "Siembra",
        orden: 2,
        activo: true
    },
    {
        id: "LAB-000003",
        nombre: "Fertilización",
        orden: 3,
        activo: true
    },
    {
        id: "LAB-000004",
        nombre: "Control fitosanitario",
        orden: 4,
        activo: true
    },
    {
        id: "LAB-000005",
        nombre: "Cosecha",
        orden: 5,
        activo: true
    }
],
riesgos: [
    {
        id: "RIE-000001",
        nombre: "Climático",
        activo: true
    },
    {
        id: "RIE-000002",
        nombre: "Fitosanitario",
        activo: true
    },
    {
        id: "RIE-000003",
        nombre: "Hídrico",
        activo: true
    },
    {
        id: "RIE-000004",
        nombre: "Nutricional",
        activo: true
    },
    {
        id: "RIE-000005",
        nombre: "Operacional",
        activo: true
    }
]
};


