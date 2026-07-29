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

    console.log({
        modulo: obtenerModuloActual(),
        objeto: estadoVisita.objeto
    });

}
function obtenerEstadoVisita(){

    return {

        modulo: estadoVisita.modulo,

        objeto: estadoVisita.objeto,

        estado: estadoVisita.estado

    };

}
function registrarDato(campo, valor){

    const captura = {

        modulo: estadoVisita.modulo,

        objeto: estadoVisita.objeto,

        campo,

        valor,

        fecha: new Date().toISOString()

    };

    console.log("Captura:", captura);
expedienteInteligente.capturas.push(captura);
if(!expedienteInteligente.historialCapturas){

    expedienteInteligente.historialCapturas = [];

}
expedienteInteligente.historialCapturas.push(captura);
expedienteInteligente.ultimaCaptura = captura;
if(estadoVisita.objeto){

    expedienteInteligente[
        estadoVisita.objeto
    ][campo]=valor;

}
expedienteInteligente.ultimaActualizacion = new Date().toISOString();
expedienteInteligente.totalCapturas =
    expedienteInteligente.capturas.length;
    expedienteInteligente.estadoActual = {

    modulo: estadoVisita.modulo,

   objeto: estadoVisita.objeto,
fecha: expedienteInteligente.ultimaActualizacion
};
expedienteInteligente.resumen = {

    modulo: estadoVisita.modulo,

    objeto: estadoVisita.objeto,

    capturas: expedienteInteligente.totalCapturas

};
expedienteInteligente.panel = {

    cliente: Object.keys(expedienteInteligente.cliente).length,

    visita: Object.keys(expedienteInteligente.visita).length,

    unidadProduccion: Object.keys(expedienteInteligente.unidadProduccion).length,

    perfilRubro: Object.keys(expedienteInteligente.perfilRubro).length

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
    console.table(expedienteInteligente.panel);
    console.table(expedienteInteligente.estadoActual);
    console.table(expedienteInteligente.resumen);

}
function preparar(){

  document.getElementById('card').style.display='none';

  document.getElementById('prep').style.display='block';
  cambiarModulo("preparacion");
establecerObjetoActivo("Preparación");
mostrarEstadoActual();
registrarDatosMinimos();
mostrarExpediente();
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

 reconocimiento.abort();
    reconocimiento.start();

}
