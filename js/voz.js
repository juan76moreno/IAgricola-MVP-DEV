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