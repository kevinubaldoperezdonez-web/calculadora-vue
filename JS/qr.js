
const boton = document.getElementById("btngenerar");
const textoInput = document.getElementById("textoinput");
const contenedorqr = document.getElementById("codigoqr");

boton.addEventListener("click", generarqr);
textoInput.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) {
        generarqr();
    }
});

function generarqr() {
    const texto = textoInput.value.normalize
        ? textoInput.value.normalize("NFC")
        : textoInput.value;

    if (!texto.trim()) {
        alert("teclea un texto o una url (direccion)");
        return;
    }

    contenedorqr.innerHTML = "";

    if (typeof QRCode === "undefined") {
        alert("La biblioteca QR todavia no termino de cargar. Espera un momento y vuelve a intentar.");
        return;
    }

    const partes = dividirTexto(texto, 2200);

    partes.forEach(function (parte, indice) {
        const envoltorio = document.createElement("div");
        envoltorio.className = "qr-parte";
        contenedorqr.appendChild(envoltorio);

        if (partes.length > 1) {
            const etiqueta = document.createElement("p");
            etiqueta.textContent = "Parte " + (indice + 1) + " de " + partes.length;
            envoltorio.appendChild(etiqueta);
        }

        try {
            new QRCode(envoltorio, {
                text: parte,
                width: 500,
                height: 500,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            });
        } catch (error) {
            envoltorio.remove();
            console.error(error);
            alert("No se pudo generar una parte del codigo QR.");
        }
    });
}

function dividirTexto(texto, bytesPorParte) {
    const partes = [];
    let parteActual = "";

    for (const caracter of texto) {
        const prueba = parteActual + caracter;

        if (contarBytes(prueba) > bytesPorParte) {
            if (parteActual) {
                partes.push(parteActual);
            }
            parteActual = caracter;
        } else {
            parteActual = prueba;
        }
    }

    if (parteActual) {
        partes.push(parteActual);
    }

    return partes;
}

function contarBytes(texto) {
    if (typeof TextEncoder !== "undefined") {
        return new TextEncoder().encode(texto).length;
    }

    return encodeURIComponent(texto).replace(/%[0-9A-F]{2}/g, "_").length;
}
