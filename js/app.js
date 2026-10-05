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

const TIPOS_VISITA_VALIDOS = [
    "Programada",
    "Seguimiento",
    "SEGUIMIENTO AL CULTIVO",
    "ACTUALIZACION DE INFORME AVALUO",
    "SOLICITUD DE PRORROGA",
    "ACTUALIZACION INFORME TECNICO DE SOLICITUD",
    "CARTERAS (REPORTES)",
    "CONVENIO BBVA-AGROINDOCA",
    "CONVENIO BBVA-MISION AGROVENEZUELA",
    "CONVENIO BBVA-SOCA PORTUGUESA",
    "CONVENIO BBVA-SOCARISA",
    "SOLICITUD DE RECUPERACIONES",
    "SEGUIMIENTO DE LEY",
    "SOLICITUD DE CREDITO",
    "DE VALIDACION",
    "LEY DE ATENCION AL SECTOR AGRICOLA",
    "DE GARANTIA PIGNORADA",
    "MANTENIMIENTO DE AVALUO",
    "PETICIONES ESPECIALES",
    "INSPECCION DE CAFE",
    "PREDECIDIDO DE MAIZ",
    "RATIFICACION OFICINA",
    "DE REESTRUCTURACION",
    "SEGUNDA PARTIDA DE MAIZ"
];

function sincronizarOpcionesTipoVisita() {
    const selectorTipoVisita = document.getElementById("tipoVisita");

    if (!selectorTipoVisita) {
        return false;
    }

    const valorActual = selectorTipoVisita.value;
    const opcionesExistentes = Array.from(selectorTipoVisita.options).map(function(opcion) {
        return opcion.value || opcion.textContent;
    });

    TIPOS_VISITA_VALIDOS.forEach(function(tipoVisita) {
        const existe = opcionesExistentes.some(function(opcion) {
            return String(opcion).trim().toLowerCase() === tipoVisita.toLowerCase();
        });

        if (!existe) {
            const opcion = document.createElement("option");
            opcion.value = tipoVisita;
            opcion.textContent = tipoVisita;
            selectorTipoVisita.appendChild(opcion);
        }
    });

    if (valorActual) {
        const valorNormalizado = normalizarClaveTipoVisitaLocal(valorActual);
        const opcionActual = Array.from(selectorTipoVisita.options).find(function(opcion) {
            return normalizarClaveTipoVisitaLocal(opcion.value || opcion.textContent) === valorNormalizado;
        });

        if (opcionActual) {
            selectorTipoVisita.value = opcionActual.value;
        }
    }

    return true;
}

function normalizarClaveTipoVisitaLocal(valor) {
    return String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[()]/g, " ")
        .replace(/[\-_/]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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

function actualizarEtiquetaParroquiaInicioVisita(){

    const campoParroquia = document.getElementById("departamento");

    if(!campoParroquia){

        return;

    }

    campoParroquia.placeholder = "Parroquia";

    const etiquetaFor = document.querySelector('label[for="departamento"]');

    if(etiquetaFor){

        etiquetaFor.textContent = "Parroquia";

    }

    const contenedor = campoParroquia.parentElement;

    if(contenedor){

        contenedor
            .querySelectorAll("label, .label, .field-label, .form-label")
            .forEach(function(etiqueta){

                if(etiqueta.textContent.trim().toLowerCase() === "departamento"){

                    etiqueta.textContent = "Parroquia";

                }

            });

    }

    const elementoAnterior = campoParroquia.previousElementSibling;

    if(
        elementoAnterior &&
        elementoAnterior.textContent &&
        elementoAnterior.textContent.trim().toLowerCase() === "departamento"
    ){

        elementoAnterior.textContent = "Parroquia";

    }

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


function configurarCamposFechaHoraInicioVisita(){

    const campoFecha = document.getElementById("fechaVisita");

    if(campoFecha){
        campoFecha.type = "text";
        campoFecha.placeholder = "dd/mm/aaaa";
        campoFecha.inputMode = "numeric";
    }

    const campoHora = document.getElementById("horaInicio");

    if(campoHora){
        campoHora.type = "text";
        campoHora.placeholder = "HH:mm";
        campoHora.inputMode = "numeric";
    }
}

function iniciarVisita(){

    document.getElementById("ready").style.display="none";
estadoVisita.estado = "EN_VISITA";
    document.getElementById("visit").style.display="block";
    cambiarModulo("visita");
    establecerObjetoActivo("Inicio de Visita");
    sincronizarOpcionesTipoVisita();
    actualizarEtiquetaParroquiaInicioVisita();
    configurarCamposFechaHoraInicioVisita();
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
        identificacionCliente: "la cédula de identidad o RIF",
        finca: "la finca",
        cantidadRubrosExplotados: "la cantidad de rubros",
        rubroPrincipal: "el rubro principal",
        superficieTotal: "la superficie total",
        superficieAprovechable: "la superficie aprovechable",
        superficieCultivada: "la superficie cultivada",
        estadoFitosanitario: "el estado fitosanitario",
        departamento: "la parroquia"
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
        .replace(/\be\s*mail\b/gi, "email")
        .replace(/\bemail\b/gi, "email")
        .replace(/\bcorre[oó]\s+electr[oó]nico\b/gi, "correo electrónico")
        .replace(/\bcorreo\s+electronico\b/gi, "correo electrónico")
        .replace(/\bcorreo\s+electrónico\b/gi, "correo electrónico")
        .replace(/\bcorreo\s+eletr[oó]nico\b/gi, "correo electrónico")
        .replace(/\bcorreo\s+el[eé]ctronico\b/gi, "correo electrónico")
        .replace(/\barrova\b/gi, "arroba")
        .replace(/\ba\s+roba\b/gi, "arroba")
        .replace(/\bpunto\s+con\b/gi, "punto com")
        .replace(/\bcom\s+ve\b/gi, "com punto ve")
        .replace(/\bbe\b/gi, "V")
        .replace(/\bregistro\s+mat\b/gi, "registro MAT")
        .replace(/\bvene\s*zolan[oa]\b/gi, "venezolano")
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
        .replace(/\bcedula\b/gi, "cédula")
        .replace(/\br\s*i\s*f\b/gi, "RIF")
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
        .replace(/\btelefono\b/gi, "teléfono")
        .replace(/\bcedula\b/gi, "cédula")
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
                /^motivo\s+(?:de\s+)?(?:la\s+)?inspecci[oó]n[:\s]+(.+)$/i,
                /^motivo[:\s]+(.+)$/i,
                /^visita\s+(.+)$/i
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
                /^parroquia[:\s]+(.+)$/i,
                /^departamento[:\s]+(.+)$/i,
                /^estado[:\s]+(.+)$/i,
                /^entidad\s+federal[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "identificacionCliente",
            expresiones: [
                /^c[eé]dula\s+(?:de\s+identidad\s+)?(?:del\s+)?cliente[:\s]+(.+)$/i,
                /^c[eé]dula\s+(?:de\s+identidad\s+)?(?:de\s+)?cliente[:\s]+(.+)$/i,
                /^(?:rif|r\.?i\.?f\.?)\s+(?:del\s+)?cliente[:\s]+(.+)$/i,
                /^identificaci[oó]n\s+(?:del\s+)?cliente[:\s]+(.+)$/i,
                /^documento\s+(?:del\s+)?cliente[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "codigoCliente",
            expresiones: [
                /^c[oó]digo(?:\s+(?:de|del))?\s+cliente[:\s]+([0-9\s]+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve))*)$/i,
                /^cliente\s+n[uú]mero[:\s]+([0-9\s]+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve))*)$/i,
                /^n[uú]mero\s+de\s+cliente[:\s]+([0-9\s]+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve))*)$/i,
                /^cliente[:\s]+([0-9\s]+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve))*)$/i
            ]
        },
        {
            entidad: "identificacionRepresentanteLegal",
            expresiones: [
                /^representante\s+legal\s+(?:venezolan[oa]|v|ve|e|extranjero|extranjera)\s*(?:es)?[:\s]+([0-9\s]+)$/i,
                /^identificaci[oó]n\s+(?:del\s+)?representante\s+legal[:\s]+(.+)$/i,
                /^documento\s+(?:del\s+)?representante\s+legal[:\s]+(.+)$/i,
                /^n[uú]mero\s+de\s+c[eé]dula\s+(?:del\s+)?representante\s+legal[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "representanteLegal",
            expresiones: [
                /^representante\s+legal[:\s]+(.+)$/i,
                /^nombre\s+del\s+representante\s+legal[:\s]+(.+)$/i,
                /^representante[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "identificacionRepresentanteLegal",
            expresiones: [
                /^c[eé]dula\s+o\s+registro\s+de\s+informaci[oó]n\s+fiscal\s+del\s+representante\s+legal[:\s]+(.+)$/i,
                /^c[eé]dula\s+(?:de\s+identidad\s+)?del\s+representante\s+legal[:\s]+(.+)$/i,
                /^c[eé]dula\s+del\s+representante\s+legal[:\s]+(.+)$/i,
                /^(?:rif|r\.?i\.?f\.?)\s+del\s+representante\s+legal[:\s]+(.+)$/i,
                /^identificaci[oó]n\s+del\s+representante\s+legal[:\s]+(.+)$/i,
                /^documento\s+del\s+representante\s+legal[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "telefonoPrincipal",
            expresiones: [
                /^tel[eé]fono\s+principal[:\s]+(.+)$/i,
                /^n[uú]mero\s+de\s+tel[eé]fono\s+principal[:\s]+(.+)$/i,
                /^tel[eé]fono(?!\s+alternativo\b)[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "telefonoAlternativo",
            expresiones: [
                /^tel[eé]fono\s+alternativo(?:\s+cuando\s+aplique)?[:\s]+(.+)$/i,
                /^n[uú]mero\s+de\s+tel[eé]fono\s+alternativo[:\s]+(.+)$/i,
                /^celular\s+alternativo[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "correoElectronico",
            expresiones: [
                /^correo\s+electr[oó]nico(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i,
                /^correo(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i,
                /^email(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i,
                /^e\s*mail(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "direccionHabitacion",
            expresiones: [
                /^direcci[oó]n\s+de\s+habitaci[oó]n(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i,
                /^direcci[oó]n\s+habitaci[oó]n(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i,
                /^domicilio(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i,
                /^direcci[oó]n(?:\s+(?:del\s+)?cliente)?[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "registroMinisterioAgricultura",
            expresiones: [
                /(?:^|\s)n[uú]mero\s+de\s+registro\s+del\s+ministerio\s+de\s+agricultura\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:(?:la\s+)?fecha\s+(?:de\s+)?vencimiento|vencimiento\s+(?:del\s+|de\s+)?registro|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i,
                /(?:^|\s)registro\s+(?:del\s+)?ministerio\s+de\s+agricultura\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:(?:la\s+)?fecha\s+(?:de\s+)?vencimiento|vencimiento\s+(?:del\s+|de\s+)?registro|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i,
                /(?:^|\s)registro\s+agr[ií]cola\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:(?:la\s+)?fecha\s+(?:de\s+)?vencimiento|vencimiento\s+(?:del\s+|de\s+)?registro|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i,
                /(?:^|\s)registro\s+mat\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:(?:la\s+)?fecha\s+(?:de\s+)?vencimiento|vencimiento\s+(?:del\s+|de\s+)?registro|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i
            ]
        },
        {
            entidad: "fechaVencimientoRegistro",
            expresiones: [
                /(?:^|\s)(?:la\s+)?fecha\s+de\s+vencimiento\s+del\s+registro\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:n[uú]mero\s+de\s+registro\s+del\s+ministerio|registro\s+(?:del\s+)?ministerio|registro\s+mat|registro\s+agr[ií]cola|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i,
                /(?:^|\s)(?:la\s+)?fecha\s+de\s+vencimiento\s+de\s+registro\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:n[uú]mero\s+de\s+registro\s+del\s+ministerio|registro\s+(?:del\s+)?ministerio|registro\s+mat|registro\s+agr[ií]cola|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i,
                /(?:^|\s)vencimiento\s+(?:del\s+|de\s+)?registro\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:n[uú]mero\s+de\s+registro\s+del\s+ministerio|registro\s+(?:del\s+)?ministerio|registro\s+mat|registro\s+agr[ií]cola|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i,
                /(?:^|\s)fecha\s+vencimiento\s+(?:del\s+|de\s+)?registro\s*(?:es\s+|:\s*)?(.+?)(?=\s+(?:n[uú]mero\s+de\s+registro\s+del\s+ministerio|registro\s+(?:del\s+)?ministerio|registro\s+mat|registro\s+agr[ií]cola|n[uú]mero\s+de\s+registro\s+tributario|registro\s+tributario)\b|$)/i
            ]
        },
        {
            entidad: "numeroRegistroTributario",
            expresiones: [
                /^n[uú]mero\s+de\s+registro\s+tributario[:\s]+(.+)$/i,
                /^registro\s+tributario[:\s]+(.+)$/i,
                /^nrt[:\s]+(.+)$/i,
                /^n\.?\s*r\.?\s*t\.?[:\s]+(.+)$/i
            ]
        },
        {
            entidad: "identificacionCliente",
            expresiones: [
                /^c[eé]dula\s+de\s+identidad\s+o\s+registro\s+de\s+informaci[oó]n\s+fiscal[:\s]+(.+)$/i,
                /^c[eé]dula\s+o\s+(?:rif|r\.?i\.?f\.?)[:\s]+(.+)$/i,
                /^c[eé]dula(?:\s+de\s+identidad)?[:\s]+(.+)$/i,
                /^n[uú]mero\s+de\s+c[eé]dula[:\s]+(.+)$/i,
                /^registro\s+de\s+informaci[oó]n\s+fiscal[:\s]+(.+)$/i,
                /^(?:rif|r\.?i\.?f\.?)(?!\s+del\s+representante\s+legal)[:\s]+(.+)$/i,
                /^identificaci[oó]n\s+(?:del\s+cliente|fiscal)[:\s]+(.+)$/i,
                /^documento\s+de\s+identidad[:\s]+(.+)$/i
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

    function normalizarIdentificacionClienteVoz(valorOriginal) {
        let valor = String(valorOriginal ?? "")
            .trim()
            .replace(/\s{2,}/g, " ");

        valor = valor
            .replace(/\b(r\s*\.?\s*i\s*\.?\s*f\.?)\b/gi, "RIF")
            .replace(/\bvenezolan[oa]\b/gi, "V")
            .replace(/\bve\b/gi, "V")
            .replace(/\bextranjera?\b/gi, "E")
            .replace(/\s*-\s*/g, "-")
            .trim();

        const soloDigitosSeparados = valor.match(/^[0-9\s]+$/);

        if (soloDigitosSeparados) {
            return valor.replace(/\s+/g, "");
        }

        const rifSeparado = valor.match(/^([VEJGP])\s*-?\s*([0-9\s]+)(?:\s*-?\s*([0-9]))?$/i);

        if (rifSeparado) {
            const letra = rifSeparado[1].toUpperCase();
            const numero = rifSeparado[2].replace(/\s+/g, "");
            const digito = rifSeparado[3] ? "-" + rifSeparado[3] : "";

            return letra + "-" + numero + digito;
        }

        return valor.toUpperCase();
    }

    function normalizarCodigoClienteVoz(valorOriginal) {
        const mapaNumeros = {
            cero: "0",
            uno: "1",
            un: "1",
            una: "1",
            dos: "2",
            tres: "3",
            cuatro: "4",
            cinco: "5",
            seis: "6",
            siete: "7",
            ocho: "8",
            nueve: "9"
        };

        let valor = normalizarClave(valorOriginal)
            .replace(/\./g, " ")
            .replace(/,/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        if (!valor) {
            return "";
        }

        const partes = valor.split(" ");
        const digitos = partes
            .map(function(parte) {
                if (/^\d+$/.test(parte)) {
                    return parte;
                }

                return mapaNumeros[parte] ?? "";
            })
            .join("");

        if (digitos) {
            return digitos.padStart(8, "0");
        }

        return String(valorOriginal ?? "")
            .replace(/\s+/g, "")
            .padStart(8, "0");
    }



    function normalizarFechaVisitaVoz(valorOriginal) {
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

        const numerosDia = {
            uno: 1,
            un: 1,
            una: 1,
            dos: 2,
            tres: 3,
            cuatro: 4,
            cinco: 5,
            seis: 6,
            siete: 7,
            ocho: 8,
            nueve: 9,
            diez: 10,
            once: 11,
            doce: 12,
            trece: 13,
            catorce: 14,
            quince: 15,
            dieciseis: 16,
            dieciséis: 16,
            diecisiete: 17,
            dieciocho: 18,
            diecinueve: 19,
            veinte: 20,
            veintiuno: 21,
            veintidos: 22,
            veintidós: 22,
            veintitres: 23,
            veintitrés: 23,
            veinticuatro: 24,
            veinticinco: 25,
            veintiseis: 26,
            veintiséis: 26,
            veintisiete: 27,
            veintiocho: 28,
            veintinueve: 29,
            treinta: 30,
            "treinta y uno": 31
        };

        function convertirDia(valorDia) {
            const claveDia = normalizarClave(valorDia);
            if (/^\d{1,2}$/.test(claveDia)) {
                return Number(claveDia);
            }
            return numerosDia[claveDia] ?? null;
        }

        function normalizarAnio(valorAnio) {
            const textoAnio = normalizarClave(valorAnio);

            if (/^\d{4}$/.test(textoAnio)) {
                return textoAnio;
            }

            if (textoAnio === "dos mil veintiseis" || textoAnio === "dos mil veintiséis") {
                return "2026";
            }

            if (textoAnio === "dos mil veinticinco") {
                return "2025";
            }

            if (textoAnio === "dos mil veintisiete") {
                return "2027";
            }

            return textoAnio.replace(/\D/g, "");
        }

        const textoFecha = normalizarClave(valorOriginal)
            .replace(/^fecha\s+(?:de\s+)?(?:visita|inspeccion|inspección)\s+/i, "")
            .replace(/^visita\s+fecha\s+/i, "")
            .replace(/\./g, "")
            .replace(/,/g, " ")
            .replace(/\s*\/\s*/g, "/")
            .replace(/\s*-\s*/g, "-")
            .replace(/\s+/g, " ")
            .trim();

        const textoFechaDepurado = textoFecha
            .replace(/\s+(?:hora\s+de\s+inicio|representante\s+legal|t[eé]cnico\s+responsable|tipo\s+de\s+visita|cliente|finca|municipio|parroquia|departamento|c[eé]dula|c[oó]digo\s+cliente)\b.*$/i, "")
            .trim();

        if (textoFechaDepurado !== textoFecha) {
            return normalizarFechaVisitaVoz(textoFechaDepurado);
        }

        if (textoFecha === "hoy") {
            {
                const fechaHoy = new Date();
                return (
                    String(fechaHoy.getDate()).padStart(2, "0") + "/" +
                    String(fechaHoy.getMonth() + 1).padStart(2, "0") + "/" +
                    fechaHoy.getFullYear()
                );
            }
        }

        let coincidenciaFechaCompacta = textoFecha.match(/^(\d{1,2})(\d{2})\s+(\d{4})$/);

        if (coincidenciaFechaCompacta) {
            return (
                coincidenciaFechaCompacta[1].padStart(2, "0") + "/" +
                coincidenciaFechaCompacta[2] + "/" +
                coincidenciaFechaCompacta[3]
            );
        }

        coincidenciaFechaCompacta = textoFecha.match(/^(\d{2})(\d{2})(\d{4})$/);

        if (coincidenciaFechaCompacta) {
            return (
                coincidenciaFechaCompacta[1] + "/" +
                coincidenciaFechaCompacta[2] + "/" +
                coincidenciaFechaCompacta[3]
            );
        }

        let coincidenciaFecha = textoFecha.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);

        if (coincidenciaFecha) {
            return (
                coincidenciaFecha[1].padStart(2, "0") + "/" +
                coincidenciaFecha[2].padStart(2, "0") + "/" +
                coincidenciaFecha[3]
            );
        }

        coincidenciaFecha = textoFecha.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);

        if (coincidenciaFecha) {
            return (
                coincidenciaFecha[3].padStart(2, "0") + "/" +
                coincidenciaFecha[2].padStart(2, "0") + "/" +
                coincidenciaFecha[1]
            );
        }

        coincidenciaFecha = textoFecha.match(/^(\d{1,2})\s+(\d{1,2})\s+(\d{4})$/);

        if (coincidenciaFecha) {
            return (
                coincidenciaFecha[1].padStart(2, "0") + "/" +
                coincidenciaFecha[2].padStart(2, "0") + "/" +
                coincidenciaFecha[3]
            );
        }

        coincidenciaFecha = textoFecha.match(/^(.+?)\s+de\s+([a-zñ]+)(?:\s+de)?\s+(.+)$/i);

        if (coincidenciaFecha && meses[coincidenciaFecha[2]]) {
            const dia = convertirDia(coincidenciaFecha[1]);
            const anio = normalizarAnio(coincidenciaFecha[3]);

            if (dia && /^\d{4}$/.test(anio)) {
                return (
                    String(dia).padStart(2, "0") + "/" +
                    meses[coincidenciaFecha[2]] + "/" +
                    anio
                );
            }
        }

        coincidenciaFecha = textoFecha.match(/^(.+?)\s+([a-zñ]+)\s+(.+)$/i);

        if (coincidenciaFecha && meses[coincidenciaFecha[2]]) {
            const dia = convertirDia(coincidenciaFecha[1]);
            const anio = normalizarAnio(coincidenciaFecha[3]);

            if (dia && /^\d{4}$/.test(anio)) {
                return (
                    String(dia).padStart(2, "0") + "/" +
                    meses[coincidenciaFecha[2]] + "/" +
                    anio
                );
            }
        }

        return String(valorOriginal ?? "").trim();
    }

    function normalizarHoraInicioVoz(valorOriginal) {
        let textoHora = normalizarClave(valorOriginal)
            .replace(/^hora\s+(?:de\s+)?(?:inicio|la\s+visita)\s+/i, "")
            .replace(/^inicio\s+(?:de\s+)?visita\s+/i, "")
            .replace(/\./g, "")
            .replace(/,/g, " ")
            .replace(/\s+horas?$/, "")
            .replace(/\ba\s*m\b/g, "am")
            .replace(/\bp\s*m\b/g, "pm")
            .replace(/\bde\s+la\s+mañana\b/g, "am")
            .replace(/\bde\s+la\s+manana\b/g, "am")
            .replace(/\bde\s+la\s+tarde\b/g, "pm")
            .replace(/\bde\s+la\s+noche\b/g, "pm")
            .replace(/\ben\s+la\s+mañana\b/g, "am")
            .replace(/\ben\s+la\s+manana\b/g, "am")
            .replace(/\ben\s+la\s+tarde\b/g, "pm")
            .replace(/\ben\s+la\s+noche\b/g, "pm")
            .replace(/\s+/g, " ")
            .trim();

        textoHora = textoHora
            .replace(/\s+(?:representante\s+legal|t[eé]cnico\s+responsable|tipo\s+de\s+visita|cliente|finca|municipio|parroquia|departamento|c[eé]dula|c[oó]digo\s+cliente|tel[eé]fono|correo|direcci[oó]n|registro|fecha\s+de\s+vencimiento)\b.*$/i, "")
            .trim();

        const numerosHora = {
            una: 1,
            uno: 1,
            un: 1,
            dos: 2,
            tres: 3,
            cuatro: 4,
            cinco: 5,
            seis: 6,
            siete: 7,
            ocho: 8,
            nueve: 9,
            diez: 10,
            once: 11,
            doce: 12
        };

        function convertirHora(valorHora) {
            const claveHora = normalizarClave(valorHora);
            if (/^\d{1,2}$/.test(claveHora)) {
                return Number(claveHora);
            }
            return numerosHora[claveHora] ?? null;
        }

        function aplicarMeridiano(hora, meridiano) {
            if (meridiano === "pm" && hora < 12) {
                return hora + 12;
            }

            if (meridiano === "am" && hora === 12) {
                return 0;
            }

            return hora;
        }

        function formatearHora(hora, minutos, meridiano = null) {
            if (!Number.isFinite(hora) || hora < 0 || hora > 23) {
                return String(valorOriginal ?? "").trim();
            }

            const minutoNumero = Number(minutos);

            if (!Number.isFinite(minutoNumero) || minutoNumero < 0 || minutoNumero > 59) {
                return String(valorOriginal ?? "").trim();
            }

            const horaNormalizada = meridiano
                ? aplicarMeridiano(hora, meridiano)
                : hora;

            return (
                String(horaNormalizada).padStart(2, "0") +
                ":" +
                String(minutoNumero).padStart(2, "0")
            );
        }

        let coincidenciaHora = textoHora.match(/^(\d{1,2})[:](\d{1,2})\s*(am|pm)?$/i);

        if (coincidenciaHora) {
            return formatearHora(
                Number(coincidenciaHora[1]),
                coincidenciaHora[2],
                coincidenciaHora[3] ?? null
            );
        }

        coincidenciaHora = textoHora.match(/^(\d{1,2})\s+(?:y|con)\s+(\d{1,2})\s*(am|pm)?$/i);

        if (coincidenciaHora) {
            return formatearHora(
                Number(coincidenciaHora[1]),
                coincidenciaHora[2],
                coincidenciaHora[3] ?? null
            );
        }

        coincidenciaHora = textoHora.match(/^([a-zñ]+|\d{1,2})\s*(am|pm)$/i);

        if (coincidenciaHora) {
            const hora = convertirHora(coincidenciaHora[1]);

            if (hora !== null) {
                return formatearHora(hora, "00", coincidenciaHora[2]);
            }
        }

        coincidenciaHora = textoHora.match(/^([a-zñ]+|\d{1,2})$/i);

        if (coincidenciaHora) {
            const hora = convertirHora(coincidenciaHora[1]);

            if (hora !== null) {
                return formatearHora(hora, "00", null);
            }
        }

        return String(valorOriginal ?? "").trim();
    }

    function normalizarTipoVisitaVoz(valorOriginal) {
        const clave = normalizarClave(valorOriginal)
            .replace(/^motivo\s+(?:de\s+)?(?:la\s+)?inspecci[oó]n\s+/, "")
            .replace(/^tipo\s+(?:de\s+)?visita\s+/, "")
            .trim();

        const mapaTipoVisita = {
            programada: "Programada",
            planificada: "Programada",
            ordinaria: "Programada",
            seguimiento: "Seguimiento",
            "de seguimiento": "Seguimiento",

            "seguimiento al cultivo": "SEGUIMIENTO AL CULTIVO",
            "seguimiento cultivo": "SEGUIMIENTO AL CULTIVO",
            cultivo: "SEGUIMIENTO AL CULTIVO",

            "actualizacion de informe avaluo": "ACTUALIZACION DE INFORME AVALUO",
            "actualizacion informe avaluo": "ACTUALIZACION DE INFORME AVALUO",
            "actualizacion de avaluo": "ACTUALIZACION DE INFORME AVALUO",

            "solicitud de prorroga": "SOLICITUD DE PRORROGA",
            prorroga: "SOLICITUD DE PRORROGA",

            "actualizacion informe tecnico de solicitud": "ACTUALIZACION INFORME TECNICO DE SOLICITUD",
            "actualizacion de informe tecnico de solicitud": "ACTUALIZACION INFORME TECNICO DE SOLICITUD",
            "informe tecnico de solicitud": "ACTUALIZACION INFORME TECNICO DE SOLICITUD",

            "carteras reportes": "CARTERAS (REPORTES)",
            "cartera reportes": "CARTERAS (REPORTES)",
            reportes: "CARTERAS (REPORTES)",

            "convenio bbva agroindoca": "CONVENIO BBVA-AGROINDOCA",
            agroindoca: "CONVENIO BBVA-AGROINDOCA",

            "convenio bbva mision agrovenezuela": "CONVENIO BBVA-MISION AGROVENEZUELA",
            "mision agrovenezuela": "CONVENIO BBVA-MISION AGROVENEZUELA",
            agrovenezuela: "CONVENIO BBVA-MISION AGROVENEZUELA",

            "convenio bbva soca portuguesa": "CONVENIO BBVA-SOCA PORTUGUESA",
            "soca portuguesa": "CONVENIO BBVA-SOCA PORTUGUESA",

            "convenio bbva socarisa": "CONVENIO BBVA-SOCARISA",
            socarisa: "CONVENIO BBVA-SOCARISA",

            "solicitud de recuperaciones": "SOLICITUD DE RECUPERACIONES",
            recuperaciones: "SOLICITUD DE RECUPERACIONES",

            "seguimiento de ley": "SEGUIMIENTO DE LEY",

            "solicitud de credito": "SOLICITUD DE CREDITO",
            credito: "SOLICITUD DE CREDITO",
            crédito: "SOLICITUD DE CREDITO",

            "de validacion": "DE VALIDACION",
            validacion: "DE VALIDACION",
            validación: "DE VALIDACION",

            "ley de atencion al sector agricola": "LEY DE ATENCION AL SECTOR AGRICOLA",
            "ley atencion al sector agricola": "LEY DE ATENCION AL SECTOR AGRICOLA",
            "ley del sector agricola": "LEY DE ATENCION AL SECTOR AGRICOLA",

            "de garantia pignorada": "DE GARANTIA PIGNORADA",
            "garantia pignorada": "DE GARANTIA PIGNORADA",
            pignorada: "DE GARANTIA PIGNORADA",

            "mantenimiento de avaluo": "MANTENIMIENTO DE AVALUO",

            "peticiones especiales": "PETICIONES ESPECIALES",
            "peticion especial": "PETICIONES ESPECIALES",
            "peticiones especial": "PETICIONES ESPECIALES",

            "inspeccion de cafe": "INSPECCION DE CAFE",
            "inspeccion cafe": "INSPECCION DE CAFE",

            "predecidido de maiz": "PREDECIDIDO DE MAIZ",
            "predecidido maiz": "PREDECIDIDO DE MAIZ",

            "ratificacion oficina": "RATIFICACION OFICINA",
            "ratificacion de oficina": "RATIFICACION OFICINA",

            "de reestructuracion": "DE REESTRUCTURACION",
            reestructuracion: "DE REESTRUCTURACION",

            "segunda partida de maiz": "SEGUNDA PARTIDA DE MAIZ",
            "segunda partida maiz": "SEGUNDA PARTIDA DE MAIZ",

            extraordinaria: "Extraordinaria",
            "no programada": "No programada",
            imprevista: "No programada"
        };

        const valorMapeado = mapaTipoVisita[clave] || null;

        if (valorMapeado) {
            return valorMapeado;
        }

        const opcionExistente = TIPOS_VISITA_VALIDOS.find(function(tipoVisita) {
            return normalizarClaveTipoVisitaLocal(tipoVisita) === normalizarClaveTipoVisitaLocal(valorOriginal);
        });

        return opcionExistente || capitalizarTexto(valorOriginal);
    }

    function normalizarTelefonoVoz(valorOriginal) {
        const mapaNumeros = {
            cero: "0",
            uno: "1",
            un: "1",
            una: "1",
            dos: "2",
            tres: "3",
            cuatro: "4",
            cinco: "5",
            seis: "6",
            siete: "7",
            ocho: "8",
            nueve: "9"
        };

        const texto = normalizarClave(valorOriginal)
            .replace(/\bmas\b/g, "+")
            .replace(/\bmás\b/g, "+")
            .replace(/\./g, " ")
            .replace(/,/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const partes = texto.split(" ");
        let salida = "";

        for (const parte of partes) {
            if (parte === "+") {
                salida += "+";
            } else if (/^\+?\d+$/.test(parte)) {
                salida += parte;
            } else if (mapaNumeros[parte] !== undefined) {
                salida += mapaNumeros[parte];
            }
        }

        return salida || String(valorOriginal ?? "").trim();
    }

    function normalizarCorreoVoz(valorOriginal) {
        let correo = normalizarClave(valorOriginal)
            .replace(/^(?:correo\s+electr[oó]nico|correo|email|e\s*mail)\s+/i, "")
            .replace(/^(?:del\s+cliente|cliente|del|de)\s+/i, "")
            .replace(/\s+arroba\s+/g, "@")
            .replace(/\s+at\s+/g, "@")
            .replace(/\s+a\s+la\s+arroba\s+/g, "@")
            .replace(/\s+punto\s+/g, ".")
            .replace(/\s+dot\s+/g, ".")
            .replace(/\s+guion\s+bajo\s+/g, "_")
            .replace(/\s+guión\s+bajo\s+/g, "_")
            .replace(/\s+guion\s+/g, "-")
            .replace(/\s+guión\s+/g, "-")
            .replace(/\s+/g, "")
            .replace(/\.com\.ve$/i, ".com.ve")
            .replace(/gmail\.com$/i, "gmail.com")
            .replace(/hotmail\.com$/i, "hotmail.com")
            .replace(/outlook\.com$/i, "outlook.com")
            .replace(/yahoo\.com$/i, "yahoo.com")
            .trim();

        correo = correo
            .replace(/^del/i, "")
            .replace(/^cliente/i, "")
            .trim();

        return correo;
    }

    function esCorreoElectronicoValidoVoz(valorCorreo) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valorCorreo ?? "").trim());
    }

    function limpiarControlCorreoInvalido() {
        const campoCorreo = buscarControlVoz("correoElectronico");

        if (!campoCorreo) {
            return;
        }

        const valorActual = normalizarCorreoVoz(campoCorreo.value);

        if (!esCorreoElectronicoValidoVoz(valorActual)) {
            campoCorreo.value = "";
        }
    }

    function cortarValorInicioVisita(valorOriginal) {
        return String(valorOriginal ?? "")
            .replace(/\s+(?=(?:la\s+)?fecha\s+(?:de\s+)?vencimiento\s+(?:del\s+|de\s+)?registro\b)/i, "\n")
            .replace(/\s+(?=fecha\s+vencimiento\s+(?:del\s+|de\s+)?registro\b)/i, "\n")
            .replace(/\s+(?=vencimiento\s+(?:del\s+|de\s+)?registro\b)/i, "\n")
            .replace(/\s+(?=registro\s+mat\b)/i, "\n")
            .replace(/\s+(?=n[uú]mero\s+de\s+registro\s+tributario\b)/i, "\n")
            .replace(/\s+(?=registro\s+tributario\b)/i, "\n")
            .split("\n")[0]
            .trim();
    }

    function normalizarRegistroAlfanumericoVoz(valorOriginal) {
        return cortarValorInicioVisita(valorOriginal)
            .trim()
            .replace(/\s*-\s*/g, "-")
            .replace(/\s{2,}/g, " ")
            .toUpperCase();
    }

    function normalizarRegistroTributarioVoz(valorOriginal) {
        let valor = String(valorOriginal ?? "")
            .trim()
            .replace(/\b(r\s*\.?\s*i\s*\.?\s*f\.?)\b/gi, "")
            .replace(/\s*-\s*/g, "-")
            .replace(/\s{2,}/g, " ")
            .toUpperCase();

        const compacto = valor.replace(/[^A-Z0-9]/g, "");
        const rifCompacto = compacto.match(/^([VEJGP])([0-9]{7,9})$/i);

        if (rifCompacto) {
            const letra = rifCompacto[1].toUpperCase();
            const numeros = rifCompacto[2];
            if (numeros.length >= 2) {
                return letra + "-" + numeros.slice(0, -1) + "-" + numeros.slice(-1);
            }
        }

        const rifSeparado = valor.match(/^([VEJGP])\s*-?\s*([0-9\s]+)\s*-?\s*([0-9])$/i);

        if (rifSeparado) {
            return (
                rifSeparado[1].toUpperCase() +
                "-" +
                rifSeparado[2].replace(/\s+/g, "") +
                "-" +
                rifSeparado[3]
            );
        }

        return valor.replace(/\s+/g, "");
    }

    function normalizarFechaParaInput(valorFecha) {
        const coincidencia = String(valorFecha ?? "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

        if (!coincidencia) {
            return valorFecha;
        }

        return coincidencia[3] + "-" + coincidencia[2] + "-" + coincidencia[1];
    }

    function normalizarIdentificacionRepresentanteVoz(valorOriginal) {
        const valorDepurado = String(valorOriginal ?? "")
            .replace(/^c[eé]dula\s+(?:de\s+identidad\s+)?(?:del\s+)?representante\s+legal\s+/i, "")
            .replace(/^(?:rif|r\.?i\.?f\.?)\s+(?:del\s+)?representante\s+legal\s+/i, "")
            .replace(/^identificaci[oó]n\s+(?:del\s+)?representante\s+legal\s+/i, "")
            .replace(/^documento\s+(?:del\s+)?representante\s+legal\s+/i, "")
            .replace(/^del\s+representante\s+legal\s+/i, "")
            .replace(/^representante\s+legal\s+/i, "")
            .replace(/\bvenezolan[oa]\b/gi, "V")
            .replace(/\bextranjera?\b/gi, "E")
            .trim();

        const valorNormalizado = normalizarIdentificacionClienteVoz(valorDepurado);

        if (/^\d{5,9}$/.test(valorNormalizado)) {
            return "V-" + valorNormalizado;
        }

        return valorNormalizado;
    }

    function esValorResidualInicioVisita(entidad, valorOriginal) {
        const valorTexto = String(valorOriginal ?? "").trim();
        const clave = normalizarClave(valorTexto);

        if (!clave) {
            return true;
        }

        const residuosGenericos = [
            "de",
            "del",
            "de la",
            "de el",
            "el",
            "la",
            "los",
            "las",
            "cliente",
            "del cliente",
            "representante",
            "representante legal",
            "del representante legal",
            "rif",
            "rif del",
            "r i f",
            "cedula",
            "cédula",
            "identificacion",
            "identificación"
        ];

        if (residuosGenericos.includes(clave)) {
            return true;
        }

        if (entidad === "correoElectronico") {
            const correoNormalizado = normalizarCorreoVoz(valorTexto);
            return !esCorreoElectronicoValidoVoz(correoNormalizado);
        }

        if (
            entidad === "direccionHabitacion" &&
            /^(?:de|del|de la|cliente|del cliente)$/i.test(clave)
        ) {
            return true;
        }

        if (
            entidad === "registroMinisterioAgricultura" &&
            /^(?:fecha\s+(?:de\s+)?vencimiento|vencimiento\s+(?:del\s+|de\s+)?registro)/i.test(clave)
        ) {
            return true;
        }

        return false;
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

    const ALIASES_CONTROL_VOZ = {
        representanteLegal: ["representanteLegal", "representante", "nombreRepresentanteLegal"],
        identificacionRepresentanteLegal: ["identificacionRepresentanteLegal", "identificacionRepresentante", "rifRepresentanteLegal", "cedulaRepresentanteLegal", "identificacionFiscalRepresentanteLegal"],
        telefonoPrincipal: ["telefonoPrincipal", "telefono", "numeroTelefonoPrincipal"],
        telefonoAlternativo: ["telefonoAlternativo", "telefonoSecundario", "numeroTelefonoAlternativo"],
        correoElectronico: ["correoElectronico", "correoCliente", "correo", "email"],
        direccionHabitacion: ["direccionHabitacion", "direccion", "direccionCliente"],
        registroMinisterioAgricultura: ["registroMinisterioAgricultura", "numeroRegistroMinisterioAgricultura", "registroAgricola", "numeroRegistroAgricultura"],
        fechaVencimientoRegistro: ["fechaVencimientoRegistro", "vigenciaRegistroMinisterio", "vencimientoRegistro", "fechaVencimientoMinisterioAgricultura"],
        numeroRegistroTributario: ["numeroRegistroTributario", "registroTributario", "nrt"]
    };

    const ETIQUETAS_CONTROL_VOZ = {
        representanteLegal: ["representante legal"],
        identificacionRepresentanteLegal: ["identificación del representante legal", "identificacion del representante legal", "cédula o registro de información fiscal del representante legal", "cedula o registro de informacion fiscal del representante legal", "registro de información fiscal del representante legal", "registro de informacion fiscal del representante legal"],
        telefonoPrincipal: ["teléfono principal", "telefono principal"],
        telefonoAlternativo: ["teléfono alternativo", "telefono alternativo"],
        correoElectronico: ["correo electrónico", "correo electronico"],
        direccionHabitacion: ["dirección de habitación", "direccion de habitacion"],
        registroMinisterioAgricultura: ["número de registro del ministerio de agricultura", "numero de registro del ministerio de agricultura", "registro del ministerio de agricultura"],
        fechaVencimientoRegistro: ["fecha de vencimiento del registro", "vencimiento del registro"],
        numeroRegistroTributario: ["número de registro tributario", "numero de registro tributario", "registro tributario"]
    };

    function buscarControlVoz(entidad) {
        const directo = document.getElementById(entidad);

        if (directo) {
            return directo;
        }

        const alias = ALIASES_CONTROL_VOZ[entidad] || [];

        for (const idAlias of alias) {
            const campoAlias = document.getElementById(idAlias);

            if (campoAlias) {
                return campoAlias;
            }
        }

        const etiquetas = (ETIQUETAS_CONTROL_VOZ[entidad] || []).map(normalizarClave);

        if (etiquetas.length === 0) {
            return null;
        }

        const controles = Array.from(document.querySelectorAll("input, select, textarea"));

        return controles.find(function(control) {
            const id = control.id || "";
            const placeholder = control.getAttribute("placeholder") || "";
            const aria = control.getAttribute("aria-label") || "";
            const labelFor = id
                ? document.querySelector('label[for="' + CSS.escape(id) + '"]')?.textContent || ""
                : "";
            const textoPrevio = control.previousElementSibling?.textContent || "";
            const textoContenedor = control.parentElement?.textContent || "";
            const textoControl = normalizarClave([
                id,
                placeholder,
                aria,
                labelFor,
                textoPrevio,
                textoContenedor
            ].join(" "));

            return etiquetas.some(function(etiqueta) {
                return textoControl.includes(etiqueta);
            });
        }) || null;
    }

    function sincronizarControl(entidad, valor, unidadSuperficieDetectada = null) {
        const campo = buscarControlVoz(entidad);

        if (!campo) {
            console.debug({
                control: entidad,
                actualizado: false,
                valor: valor
            });
            return false;
        }

        const valorControl = (
            campo.type === "date" &&
            /^\d{2}\/\d{2}\/\d{4}$/.test(String(valor ?? ""))
        )
            ? normalizarFechaParaInput(valor)
            : valor;

        campo.value = valorControl;

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

            let entidadDestino = patron.entidad;

            const textoNormalizado = normalizarClave(valor);
            const digitosValor = String(valor ?? "").replace(/\D/g, "");

            if (
                entidadDestino === "representanteLegal" &&
                (
                    /\b(?:c[eé]dula|cedula|rif|r\.?i\.?f\.?|identificaci[oó]n|documento|venezolan[oa]|extranjera?|v|e)\b/i.test(valor) &&
                    digitosValor.length >= 5
                )
            ) {
                entidadDestino = "identificacionRepresentanteLegal";
            }

            if (
                entidadDestino === "identificacionCliente" &&
                /^(?:del\s+)?representante\s+legal\b/.test(textoNormalizado)
            ) {
                entidadDestino = "identificacionRepresentanteLegal";
                valor = valor
                    .replace(/^del\s+representante\s+legal\s*/i, "")
                    .replace(/^representante\s+legal\s*/i, "")
                    .trim();
            }

            if (
                entidadDestino === "identificacionCliente" &&
                /^(?:rif\s+)?del$/.test(textoNormalizado)
            ) {
                console.warn("Se ignora residuo de identificación sin valor útil:", valor);
                return true;
            }

            if (
                entidadDestino === "representanteLegal" &&
                /^[0-9\s]+$/.test(textoNormalizado)
            ) {
                entidadDestino = "identificacionRepresentanteLegal";
            }

            if (
                entidadDestino === "telefonoPrincipal" &&
                /^alternativo\b/.test(textoNormalizado)
            ) {
                entidadDestino = "telefonoAlternativo";
                valor = valor.replace(/^alternativo\s*/i, "").trim();
            }

            if (
                entidadDestino === "cliente" &&
                /^([0-9\s]+|cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)(?:\s+(?:cero|uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve))*$/.test(textoNormalizado)
            ) {
                entidadDestino = "codigoCliente";
            }

            if (
                textoNormalizado.includes("sin informacion") ||
                textoNormalizado.includes("sin dato") ||
                textoNormalizado.includes("sin datos")
            ) {
                valor = "sin información";
            }

            if (
                entidadDestino === "correoElectronico" ||
                entidadDestino === "direccionHabitacion"
            ) {
                valor = valor
                    .replace(/^(?:del\s+cliente|cliente|del|de)\s+/i, "")
                    .trim();
            }

            let unidadSuperficieDetectada = null;

            switch (entidadDestino) {

                case "codigoCliente":
                    valor = normalizarCodigoClienteVoz(valor);
                    break;

                case "identificacionCliente":
                    valor = normalizarIdentificacionClienteVoz(valor);
                    break;

                case "identificacionRepresentanteLegal":
                    valor = normalizarIdentificacionRepresentanteVoz(valor);
                    break;

                case "telefonoPrincipal":
                case "telefonoAlternativo":
                    valor = normalizarTelefonoVoz(valor);
                    break;

                case "correoElectronico":
                    valor = normalizarCorreoVoz(valor);
                    break;

                case "registroMinisterioAgricultura":
                    valor = normalizarRegistroAlfanumericoVoz(valor);
                    break;

                case "numeroRegistroTributario":
                    valor = normalizarRegistroTributarioVoz(valor);
                    break;

                case "fechaVencimientoRegistro":
                    valor = normalizarFechaVisitaVoz(valor);
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
                        .replace(/\s+\b(?:el|la|los|las|de|del)\b$/i, "")
                        .replace(/\s{2,}/g, " ")
                        .trim();
                    valor = normalizarTextoLibreVoz(valor);
                    break;

                case "finca":
                    valor = capitalizarNombreFinca(valor.replace(/\s{2,}/g, " ").trim());
                    break;

                case "cliente":
                case "representanteLegal":
                case "direccionHabitacion":
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
                    valor = normalizarCampoTecnico(entidadDestino, valor);
                    break;

                default:
                    valor = valor.trim();
                    break;
            }

            if (esValorResidualInicioVisita(entidadDestino, valor)) {
                console.warn(
                    "Se ignora valor residual o incompleto de voz:",
                    entidadDestino,
                    valor
                );

                if (entidadDestino === "correoElectronico") {
                    limpiarControlCorreoInvalido();
                }

                return true;
            }

            const registro = registrarDato(
                entidadDestino,
                valor,
                (
                    entidadDestino === "superficieTotal" ||
                    entidadDestino === "superficieAprovechable" ||
                    entidadDestino === "superficieCultivada"
                )
                    ? unidadSuperficieDetectada
                    : null
            );

            if (registro === null) {
                return true;
            }

            console.log(
                "Dato registrado:",
                entidadDestino,
                valor
            );

            entidadesDetectadas.push({
                entidad: entidadDestino,
                destino: entidadDestino,
                valor: valor,
                fecha: new Date().toISOString()
            });

            if (entidadDestino === "rubroPrincipal") {
                sincronizarRubroPrincipal(valor, patron);

            } else if (entidadDestino === "rubroSecundario") {
                sincronizarRubroSecundario(valor, patron);

            } else {
                sincronizarControl(
                    entidadDestino,
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
        /(?:^|\s)(?:el\s+)?t[eé]cnico\s+responsable/i,
        /nombre\s+del\s+t[eé]cnico/i,
        /responsable\s+t[eé]cnico/i,
        /especialista\s+agr[ií]cola/i,
        /(?<!responsable\s)(?:^|\s)(?:el\s+)?t[eé]cnico/i,
        /(?:^|\s)(?:el\s+)?tipo\s+(?:de\s+)?visita/i,
        /(?:^|\s)motivo\s+(?:de\s+)?(?:la\s+)?inspecci[oó]n/i,
        /(?:^|\s)motivo/i,
        /(?:^|\s)c[eé]dula\s+o\s+registro\s+de\s+informaci[oó]n\s+fiscal\s+del\s+representante\s+legal/i,
        /(?:^|\s)c[eé]dula\s+(?:de\s+identidad\s+)?del\s+representante\s+legal/i,
        /(?:^|\s)c[eé]dula\s+del\s+representante\s+legal/i,
        /(?:^|\s)(?:rif|r\.?i\.?f\.?)\s+del\s+representante\s+legal/i,
        /(?:^|\s)identificaci[oó]n\s+del\s+representante\s+legal/i,
        /(?:^|\s)documento\s+del\s+representante\s+legal/i,
        /(?:^|\s)representante\s+legal\s+(?:venezolan[oa]|v|e|extranjera?)/i,
        /(?:^|\s)nombre\s+del\s+representante\s+legal/i,
        /(?:^|\s)representante\s+legal/i,
        /(?:^|\s)c[eé]dula\s+o\s+registro\s+de\s+informaci[oó]n\s+fiscal\s+del\s+representante\s+legal/i,
        /(?:^|\s)c[eé]dula\s+(?:de\s+identidad\s+)?del\s+representante\s+legal/i,
        /(?:^|\s)c[eé]dula\s+del\s+representante\s+legal/i,
        /(?:^|\s)(?:rif|r\.?i\.?f\.?)\s+del\s+representante\s+legal/i,
        /(?:^|\s)identificaci[oó]n\s+del\s+representante\s+legal/i,
        /(?:^|\s)tel[eé]fono\s+principal/i,
        /(?:^|\s)tel[eé]fono\s+alternativo/i,
        /(?:^|\s)correo\s+electr[oó]nico(?:\s+(?:del\s+)?cliente)?/i,
        /(?:^|\s)(?:email|e\s*mail)/i,
        /(?:^|\s)direcci[oó]n\s+(?:de\s+)?habitaci[oó]n/i,
        /(?:^|\s)n[uú]mero\s+de\s+registro\s+del\s+ministerio\s+de\s+agricultura/i,
        /(?:^|\s)registro\s+(?:del\s+)?ministerio\s+de\s+agricultura/i,
        /(?:^|\s)registro\s+mat\b/i,
        /(?:^|\s)mat\s+(?:n[uú]mero\s+)?/i,
        /(?:^|\s)fecha\s+de\s+vencimiento\s+(?:del\s+|de\s+)?registro/i,
        /(?:^|\s)(?:la\s+)?fecha\s+de\s+vencimiento\s+(?:del\s+|de\s+)?registro/i,
        /(?:^|\s)fecha\s+vencimiento\s+(?:del\s+|de\s+)?registro/i,
        /(?:^|\s)vencimiento\s+(?:del\s+|de\s+)?registro/i,
        /(?:^|\s)n[uú]mero\s+de\s+registro\s+tributario/i,
        /(?:^|\s)registro\s+tributario/i,
        /(?:^|\s)c[eé]dula\s+(?:de\s+identidad\s+)?(?:del\s+)?cliente/i,
        /(?:^|\s)(?:rif|r\.?i\.?f\.?)\s+(?:del\s+)?cliente/i,
        /(?:^|\s)identificaci[oó]n\s+(?:del\s+)?cliente/i,
        /(?:^|\s)documento\s+(?:del\s+)?cliente/i,
        /(?:^|\s)c[eé]dula\s+de\s+identidad\s+o\s+registro\s+de\s+informaci[oó]n\s+fiscal/i,
        /c[oó]digo(?:\s+(?:de|del))?\s+cliente/i,
        /(?:^|\s)c[eé]dula\s+o\s+(?:rif|r\.?i\.?f\.?)\b/i,
        /(?:^|\s)c[eé]dula(?:\s+de\s+identidad)?/i,
        /(?:^|\s)n[uú]mero\s+de\s+c[eé]dula/i,
        /(?:^|\s)registro\s+de\s+informaci[oó]n\s+fiscal/i,
        /(?:^|\s)(?:rif|r\.?i\.?f\.?)\b/i,
        /(?:^|\s)identificaci[oó]n\s+(?:del\s+cliente|fiscal)/i,
        /(?:^|\s)documento\s+de\s+identidad/i,
        /(?<!c[oó]digo\s)(?<!c[oó]digo\sde\s)(?<!c[oó]digo\sdel\s)(?:^|\s)(?:el\s+)?cliente/i,
        /nombre\s+de\s+la\s+finca/i,
        /nombre\s+(?:de\s+)?finca/i,
        /unidad\s+de\s+producci[oó]n/i,
        /(?:^|\s)(?:la\s+)?finca/i,
        /(?:^|\s)(?:el\s+)?municipio/i,
        /(?:^|\s)(?:la\s+)?parroquia/i,
        /(?:^|\s)(?:el\s+)?departamento/i,
        /(?:^|\s)(?:el\s+)?estado/i,
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

    const coincidenciasInicioEntidad = [];

    for (const inicio of iniciosEntidad) {
        const banderas = inicio.flags.includes("g")
            ? inicio.flags
            : inicio.flags + "g";
        const expresionGlobal = new RegExp(inicio.source, banderas);
        let coincidenciaInicio = null;

        while ((coincidenciaInicio = expresionGlobal.exec(texto)) !== null) {
            const textoCoincidenciaInicio = String(coincidenciaInicio[0] ?? "");
            const textoPrevioInicio = texto
                .slice(Math.max(0, coincidenciaInicio.index - 16), coincidenciaInicio.index)
                .toLowerCase();

            if (
                /cliente/i.test(textoCoincidenciaInicio) &&
                /\b(?:de|del)\s*$/.test(textoPrevioInicio)
            ) {
                if (coincidenciaInicio[0].length === 0) {
                    expresionGlobal.lastIndex += 1;
                }
                continue;
            }

            coincidenciasInicioEntidad.push({
                inicio: coincidenciaInicio.index,
                fin: coincidenciaInicio.index + coincidenciaInicio[0].length
            });

            if (coincidenciaInicio[0].length === 0) {
                expresionGlobal.lastIndex += 1;
            }
        }
    }

    const coincidenciasOrdenadas = coincidenciasInicioEntidad
        .sort(function(a, b) {
            if (a.inicio !== b.inicio) {
                return a.inicio - b.inicio;
            }

            return b.fin - a.fin;
        });

    const coincidenciasFiltradas = [];

    for (const coincidencia of coincidenciasOrdenadas) {
        const mismaPosicion = coincidenciasFiltradas.find(function(item) {
            return item.inicio === coincidencia.inicio;
        });

        if (mismaPosicion) {
            continue;
        }

        const contenida = coincidenciasFiltradas.some(function(item) {
            return coincidencia.inicio > item.inicio && coincidencia.inicio < item.fin;
        });

        if (!contenida) {
            coincidenciasFiltradas.push(coincidencia);
        }
    }

    const posicionesUnicas = coincidenciasFiltradas
        .map(function(item) { return item.inicio; })
        .sort((a, b) => a - b);

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

    console.warn(
        "Texto reconocido sin campo suficiente para registrar:",
        texto
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

window.reconocimiento.maxAlternatives = 3;

window.reconocimiento.onstart = function () {

    console.log("Micrófono activo");

};

window.reconocimiento.onresult = function (evento) {

    let texto = "";

for (let i = evento.resultIndex; i < evento.results.length; i++) {
    if (evento.results[i].isFinal) {
        const alternativasVoz = Array.from(evento.results[i])
            .map(function(alternativa) {
                return alternativa.transcript;
            })
            .filter(Boolean);

        const textoPreferido = alternativasVoz.find(function(alternativa) {
            return /(?:correo|email|arroba|c[eé]dula|rif|representante|registro|fecha|tel[eé]fono|direcci[oó]n|cliente|finca|municipio|parroquia|c[oó]digo)/i.test(alternativa);
        }) || alternativasVoz[0] || evento.results[i][0].transcript;

        texto += textoPreferido + " ";
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


