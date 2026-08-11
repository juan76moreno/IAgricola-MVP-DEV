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

const opcionSeleccionada =
    rubroPrincipal.options[rubroPrincipal.selectedIndex];

const rubroSeleccionado =
    opcionSeleccionada ? opcionSeleccionada.text : rubroPrincipal.value;


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
});
let superficiePendienteUnidad = null;
function interpretarVoz(texto) {

    console.warn("Interpretando:", texto);
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

        console.warn(
            "Unidad de superficie no reconocida. Indique hectáreas, metros cuadrados, acres o leguas."
        );

        return;
    }
    const entidadesDetectadas = [];

    const patrones = [

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
        /^unidad\s+de\s+producci[oó]n[:\s]+(.+)$/i,
        /^parcela[:\s]+(.+)$/i,
        /^hato[:\s]+(.+)$/i,
        /^hacienda[:\s]+(.+)$/i
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
    entidad: "rubroSecundario",
    expresiones: [
        /^rubro\s+secundario[:\s]+(.+)$/i
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

    for (const patron of patrones) {

        let coincidencia = null;

for (const expresion of patron.expresiones) {

    coincidencia = texto.match(expresion);

    if (coincidencia) {
        break;
    }

}

if (!coincidencia) {
    continue;
}

        let valor = coincidencia[1].trim();
let unidadSuperficieDetectada = null;

switch (patron.entidad) {

    case "codigoCliente":

        valor = valor.replace(/\s+/g, "");
         valor = valor.padStart(8, "0");

        break;

    case "cliente":

        valor = valor.replace(/\s{2,}/g, " ");
        

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
                return;
            }
        if (unidadDictada) {

            const unidadNormalizada = unidadDictada
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();

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
    }

    break;
}
case "rubroSecundario":
    case "rubroPrincipal":

    valor = valor
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const rubrosValidos = {
        cafe: "Cafe",
        cacao: "Cacao",
        maiz: "Maiz",
        frijol: "Frijol",
        hortalizas: "Hortalizas",
        frutales: "Frutales",
        ganaderia: "Ganaderia",
        mixto: "Mixto",
        otro: "Otro"
    };

    valor = rubrosValidos[valor] || valor;

    break;

}

       registrarDato(
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

const campo = document.getElementById(patron.entidad);

if (campo) {

    campo.value = valor;

    if (unidadSuperficieDetectada) {

        const indicadoresUnidad = {
            superficieTotal: "unidadSuperficieTotal",
            superficieAprovechable: "unidadSuperficieAprovechable",
            superficieCultivada: "unidadSuperficieCultivada"
        };

        const idIndicadorUnidad = indicadoresUnidad[patron.entidad];

        if (idIndicadorUnidad) {

            const indicadorUnidad = document.getElementById(idIndicadorUnidad);

            if (indicadorUnidad) {
                indicadorUnidad.textContent = unidadSuperficieDetectada;
            }
        }
    }

    if (campo.tagName === "SELECT") {

        campo.dispatchEvent(new Event("change"));

    }

}

       console.debug({

    control: patron.entidad,

    actualizado: campo !== null,

    valor: valor

});

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

window.reconocimiento.continuous = false;

window.reconocimiento.interimResults = false;

window.reconocimiento.maxAlternatives = 1;

window.reconocimiento.onstart = function () {

    console.log("Micrófono activo");

};

window.reconocimiento.onresult = function (evento) {

    const texto = evento.results[0][0].transcript.trim();

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

        console.log("Micrófono ya activo.");

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


