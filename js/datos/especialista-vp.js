/* IAgrícola: selector aislado de especialista y VP */
(function () {
    "use strict";

    const directorio = [
        { nombre: "Especialista de prueba A", vp: "VP00001" },
        { nombre: "Especialista de prueba B", vp: "VP00002" }
    ];

    function normalizar(valor) {
        return String(valor || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    function iniciar() {
        const tecnico = document.getElementById("tecnico");

        if (!tecnico || document.getElementById("panelEspecialistaVP")) {
            return;
        }

        const panel = document.createElement("section");
        panel.id = "panelEspecialistaVP";
        panel.style.cssText =
            "margin:12px 0;padding:14px;border:1px solid #d9e2ec;" +
            "border-radius:10px;background:#f8fafc";

        const titulo = document.createElement("h3");
        titulo.textContent = "Especialista agrícola responsable";

        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = "selectorEspecialistaVP";
        etiqueta.textContent = "Seleccione el especialista";

        const selector = document.createElement("select");
        selector.id = "selectorEspecialistaVP";
        selector.style.cssText = "display:block;width:100%;padding:10px";

        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Seleccione un responsable...";
        selector.appendChild(inicial);

        directorio.forEach(function (persona) {
            const opcion = document.createElement("option");
            opcion.value = persona.vp;
            opcion.textContent = persona.nombre + " — " + persona.vp;
            selector.appendChild(opcion);
        });

        const etiquetaVP = document.createElement("label");
        etiquetaVP.htmlFor = "vpEspecialista";
        etiquetaVP.textContent = "VP del especialista";

        const campoVP = document.createElement("input");
        campoVP.id = "vpEspecialista";
        campoVP.type = "text";
        campoVP.placeholder = "VP del especialista";
        campoVP.autocomplete = "off";
        campoVP.style.cssText = "display:block;width:100%;padding:10px";

        const estado = document.createElement("p");
        estado.id = "estadoEspecialistaVP";
        estado.setAttribute("role", "status");
        estado.textContent = "PENDIENTE: seleccione al responsable.";

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Confirmar especialista y VP";

        selector.addEventListener("change", function () {
            const persona = directorio.find(p => p.vp === selector.value);

            tecnico.value = persona ? persona.nombre : "";
            campoVP.value = persona ? persona.vp : "";
            estado.textContent =
                "PENDIENTE: revise los datos y confirme la asignación.";
        });

        campoVP.addEventListener("input", function () {
            campoVP.value = campoVP.value.toUpperCase();
            estado.textContent =
                "PENDIENTE: confirme la correspondencia del nombre y VP.";
        });

        boton.addEventListener("click", function () {
            const nombre = tecnico.value.trim();
            const vp = campoVP.value.trim().toUpperCase();

            const coincidencias = directorio.filter(function (p) {
                return normalizar(p.nombre) === normalizar(nombre) &&
                    p.vp === vp;
            });

            if (coincidencias.length !== 1) {
                estado.textContent =
                    "PENDIENTE: el nombre y el VP no coinciden con el directorio.";
                return;
            }

            if (!window.confirm(
                "¿Confirma este responsable?\n\n" +
                coincidencias[0].nombre + "\n" + coincidencias[0].vp
            )) {
                estado.textContent = "PENDIENTE: falta confirmar.";
                return;
            }

            const resultado = {
                nombre: coincidencias[0].nombre,
                vp: coincidencias[0].vp,
                estado: "VALIDADO",
                fechaConfirmacion: new Date().toISOString()
            };

            window.IAgricolaResponsableVP = resultado;

            window.dispatchEvent(new CustomEvent(
                "especialistaVPConfirmado",
                { detail: resultado }
            ));

            estado.textContent =
                "VALIDADO: " + resultado.nombre + " — " + resultado.vp;

            console.log("[IAgrícola] Responsable confirmado:", resultado);
        });

        selector.value = "";
        tecnico.value = nombre;
        campoVP.value = vp;
    }

    estado.textContent = persona
        ? "HISTÓRICO RECUPERADO: confirme el responsable."
        : "PENDIENTE: compruebe el responsable histórico.";

    window.IAgricolaResponsableVP = {
        nombre: persona ? persona.nombre : nombre,
        vp: persona ? persona.vp : vp,
        estado: "PENDIENTE",
        origen: "HISTORICO",
        fuente: contexto.fuente || "",
        fechaFuente: contexto.fechaFuente || "",
        referenciaFuente: contexto.referenciaFuente || ""
    };

    return Boolean(persona);
};
        panel.append(
            titulo, etiqueta, selector, etiquetaVP, campoVP, boton, estado
        );

        const campo = tecnico.closest(".field");
        if (campo) {
            campo.insertAdjacentElement("afterend", panel);
        }
    }

    window.inicializarSelectorEspecialistaVP = iniciar;
    window.obtenerDirectorioEspecialistasVP = function () {
        return directorio.map(p => ({ ...p }));
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();