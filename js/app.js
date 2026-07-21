console.log("Core expediente:", listarActivos());
function preparar(){

  document.getElementById('card').style.display='none';

  document.getElementById('prep').style.display='block';

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
document.getElementById("farm").style.display="none";

document.getElementById("crop").style.display="none";
}
function continuarVisita(){

    document.getElementById("visit").style.display="none";

    document.getElementById("farm").style.display="block";

}
function continuarCaracterizacion(){

    document.getElementById("farm").style.display="none";

    document.getElementById("crop").style.display="block";

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

actualizarActivo(
    "RUBRO.PRINCIPAL",
    rubroSeleccionado,
    origenCaptura
);

console.log(
    obtenerActivo("RUBRO.PRINCIPAL")
);
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