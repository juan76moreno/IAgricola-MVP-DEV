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
function registrarDato(campo, valor){
const contextoBCAC = obtenerContextoBCAC(campo);    
      const captura = { 

   conceptoId: contextoBCAC.conceptoBCAC?.id ?? null,
   concepto: contextoBCAC.conceptoCompletoBCAC ?? null,
reglaId: contextoBCAC.reglaBCAC?.id ?? null,
entidadId: contextoBCAC.entidadBCAC?.id ?? null,

campoId: contextoBCAC.campoBCAC?.id ?? null,
unidadId: contextoBCAC.unidadBCAC?.id ?? null,
unidadCompletaBCAC: contextoBCAC.unidadCompletaBCAC ?? null,
fuenteId: contextoBCAC.fuenteBCAC?.id ?? null,

fuente: contextoBCAC.fuenteBCAC?.nombre ?? null,
modulo: obtenerModuloActual(),

objeto: estadoVisita.objeto,

campo: campo,

        valor: valor,

        fecha: expedienteInteligente.fechaSistema

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
    expedienteInteligente.fechaSistema =
    new Date().toISOString();
    expedienteInteligente.origenCaptura = campo;
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

        "rubroSecundario",

        "subsector",

        "tipoSubsector",

        "sectorProduccion"

    ]);

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

    document.getElementById("visit").style.display="block";
    cambiarModulo("visita");
    establecerObjetoActivo("Inicio de Visita");
    inicializarVoz();
    iniciarEscucha();
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
registrarPerfilRubro();
mostrarExpediente();
}
function continuarPerfilRubro(){

    document.getElementById("crop").style.display="none";

    alert("Aquí iniciará el siguiente módulo del expediente");

}
const rubroPrincipal = document.getElementById("rubroPrincipal");
const perfilRubroDinamico = document.getElementById("perfilRubroDinamico");

rubroPrincipal.addEventListener("change", function(){

const origenCaptura = "MANUAL";    
    const rubroSeleccionado = rubroPrincipal.options[
        rubroPrincipal.selectedIndex
    ].text;


    if(rubroPrincipal.value === ""){

        perfilRubroDinamico.innerHTML = "";

        return;

    }
    // PERFIL CAFÉ (Pendiente de migrar a js/perfiles/cafe.js)
if(rubroPrincipal.value === "Cafe"){

    const perfilCafe = cargarPerfilCafe();

perfilRubroDinamico.innerHTML = `
        <div class="field">
            <label for="variedadCafe">Variedad de café</label>
            <input
                type="text"
                id="variedadCafe"
                placeholder="Variedad o variedades cultivadas">
        </div>

        <div class="field">
            <label for="edadCafe">Edad de la plantación (años)</label>
            <input
                type="number"
                id="edadCafe"
                min="0"
                placeholder="Edad promedio de la plantación">
        </div>

        <div class="field">
            <label for="densidadCafe">Densidad de siembra (plantas/ha)</label>
            <input
                type="number"
                id="densidadCafe"
                min="0"
                placeholder="Número de plantas por hectárea">
        </div>

        <div class="field">
            <label for="estadoProductivoCafe">Estado productivo</label>
            <select id="estadoProductivoCafe">
                <option value="">Seleccione...</option>
                <option value="Establecimiento">Establecimiento</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Produccion">Producción</option>
                <option value="Renovacion">Renovación</option>
            </select>
        </div>

        <div class="field">
            <label for="sombraCafe">Sistema de sombra</label>
            <select id="sombraCafe">
                <option value="">Seleccione...</option>
                <option value="Sin sombra">Sin sombra</option>
                <option value="Temporal">Sombra temporal</option>
                <option value="Permanente">Sombra permanente</option>
                <option value="Mixta">Sombra mixta</option>
            </select>
        </div>

        <div class="field">
            <label for="rendimientoCafe">Rendimiento estimado (kg/ha)</label>
            <input
                type="number"
                id="rendimientoCafe"
                min="0"
                step="0.01"
                placeholder="Kilogramos por hectárea">
        </div>

        <div class="field">
            <label for="estadoFitosanitarioCafe">Estado fitosanitario</label>
            <select id="estadoFitosanitarioCafe">
                <option value="">Seleccione...</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Deficiente">Deficiente</option>
            </select>
        </div>
    `;

    return;
}

perfilRubroDinamico.innerHTML = `
    <div class="field">
        <strong>Perfil seleccionado:</strong>
        ${rubroSeleccionado}
    </div>
`;
});



const ReconocimientoVoz =
window.SpeechRecognition || window.webkitSpeechRecognition;

let reconocimiento = null;
function interpretarVoz(texto) {

    console.warn("Interpretando:", texto);

    const textoNormalizado = texto.toLowerCase().trim();
    const entidadesDetectadas = [];
const patrones = [

    {
        entidad: "cliente",
        expresion: /^cliente[:\s]+(.+)$/i
    },

    {
        entidad: "codigoCliente",
        expresion: /^c[oó]digo(?:\s+de)?\s+cliente[:\s]+([0-9\s]+)$/i
    }
for(const patron of patrones){

    const coincidencia = texto.match(patron.expresion);

    if(!coincidencia){

        continue;

    }

    const valor = coincidencia[1].trim();

    registrarDato(patron.entidad, valor);

    entidadesDetectadas.push(patron.entidad);

    const campo = document.getElementById(patron.entidad);

    if(campo){

        campo.value = valor;

    }

    console.log(patron.entidad, "interpretado:", valor);

}
];
    const patronCliente = /^cliente[:\s]+(.+)$/i;

const coincidenciaCliente = texto.match(patronCliente);
const nombreCliente = coincidenciaCliente
    ? coincidenciaCliente[1].trim()
    : "";
if(coincidenciaCliente){

        console.log("Entidad detectada: cliente");
        registrarDato("cliente", nombreCliente);

const campoCliente = document.getElementById("cliente");

if(campoCliente){

    campoCliente.value = nombreCliente;

}


        entidadesDetectadas.push("cliente");
        console.log("Cliente interpretado:",nombreCliente);

    }

    if (textoNormalizado.includes("09295372")) {

        console.log("Código de cliente detectado: 09295372");
        registrarDato("codigoCliente", "09295372");
        entidadesDetectadas.push("codigoCliente");

    }

    if (entidadesDetectadas.length > 0) {

        console.table(entidadesDetectadas);
        alert("interpretarVoz ejecutada");

    }
}

function inicializarVoz() {

    if (!ReconocimientoVoz) {

        console.error("Reconocimiento de voz no disponible.");

        return false;

    }

    reconocimiento = new ReconocimientoVoz();

    reconocimiento.lang = "es-VE";

    reconocimiento.continuous = false;

    reconocimiento.interimResults = false;

    reconocimiento.maxAlternatives = 1;

    reconocimiento.onstart = function () {

        console.log("Micrófono activo");

    };

    reconocimiento.onresult = function (evento) {

        const texto = evento.results[0][0].transcript.trim();

        console.log("Texto reconocido:", texto);
        registrarDato("voz", texto);
console.warn("Antes de interpretar");
interpretarVoz(texto);
mostrarExpediente();

console.log(obtenerExpediente());

    };

    reconocimiento.onerror = function (evento) {

        console.error("Error de voz:", evento.error);

    };

    reconocimiento.onend = function () {

        console.log("Micrófono detenido");

    };

    return true;

}

function iniciarEscucha() {

    if (!reconocimiento) {

        if (!inicializarVoz()) {

            return;

        }

    }


    reconocimiento.start();

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


