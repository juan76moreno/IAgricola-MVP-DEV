function cargarPerfilCafe(){

    return{
nombre: "Cafe",

    version: "1.0",

    estado: "Desarrollo",
        html: `

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
registrarPerfilTecnico("Cafe", {
nombre: "Café",
html: cargarPerfilCafe().html,
patronComun: "vegetal",
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