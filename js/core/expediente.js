const expediente = {};

function actualizarActivo(
    id,
    valor,
    origen,
    evidencia = null,
    usuario = null
){

    expediente[id] = {

        id,

        valor,

        origen,

        evidencia,

        usuario,

        fechaActualizacion: new Date().toISOString()

    };

}

function obtenerActivo(id){

    return expediente[id] ?? null;

}

function existeActivo(id){

    return expediente.hasOwnProperty(id);

}

function listarActivos(){

    return expediente;

}