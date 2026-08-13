function cargarPerfilCafe(){

    return{
nombre: "Cafe",

    version: "1.0",

    estado: "Desarrollo",
        html: `

        `,

        validar(){

            return true;

        },

        guardar(){

            // Se implementará posteriormente.

        },

        cargarDatos(){

            // Se implementará posteriormente.

        }

    };

}
nombre: "Café",

    discriminadores: [

        {
            campo: "variedadCafe",
            origenExistente: "variedadCafe"
        },

        {
            campo: "edadCafe",
            origenExistente: "edadCafe"
        },

        {
            campo: "densidadCafe",
            origenExistente: "densidadCafe"
        },

        {
            campo: "estadoProductivoCafe",
            origenExistente: "estadoProductivoCafe"
        },

        {
            campo: "sombraCafe",
            origenExistente: "sombraCafe"
        },

        {
            campo: "rendimientoCafe",
            origenExistente: "rendimientoCafe"
        },

        {
            campo: "estadoFitosanitarioCafe",
            origenExistente: "estadoFitosanitarioCafe"
        }

    ]

});