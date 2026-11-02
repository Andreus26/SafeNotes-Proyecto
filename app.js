
// SELECCIONAR LOS ELEMENTOS DEL HTML
const textoNota = document.querySelector("#textoNota");
const botonGuardar = document.querySelector("#guardarNota");
const mensaje = document.querySelector("#mensaje");
const listaNotas = document.querySelector("#listaNotas");
const contadorNotas = document.querySelector("#contadorNotas");
const categoriaNota = document.querySelector("#categoriaNota");
const notaImportante = document.querySelector("#notaImportante");
const filtroCategoria = document.querySelector("#filtroCategoria");
const listaImportantes = document.querySelector("#listaImportantes");
const contadorImportantes = document.querySelector("#contadorImportantes");

// FUNCION PARA CARGAR LAS NOTAS ALMACENADAS
function cargarNotas() {

    let notasGuardadas = localStorage.getItem("notasSafeNote");

    if (notasGuardadas !== null) {
        try {
            let datos = JSON.parse(notasGuardadas);

            if (Array.isArray(datos)) {
                return datos;
            }

        } catch (error) {
            console.log("Error al cargar las notas:", error);
        }
    }

    return [];
}

// ARREGLO PARA ALMACENAR LAS NOTAS
let notas = cargarNotas();

// FUNCION PARA GUARDAR LAS NOTAS EN LOCALSTORAGE
function guardarNotas() {

    localStorage.setItem("notasSafeNote", JSON.stringify(notas));

}

// EVENTO CLICK PARA GUARDAR UNA NOTA
botonGuardar.addEventListener("click", function() {

    // OBTENER LOS DATOS ESCRITOS
    let texto = textoNota.value;
    let categoria = categoriaNota.value;
    let importante = notaImportante.checked;

    // VALIDAR QUE LA NOTA NO ESTE VACIA
    if (texto.trim() === "") {

        mensaje.textContent = "Debes escribir una nota.";

    } else {

        // CREAR UN OBJETO CON LOS DATOS DE LA NOTA
        let nuevaNota = {
            texto: texto.trim(),
            categoria: categoria,
            importante: importante
        };

        // AGREGAR LA NOTA AL ARREGLO
        notas.push(nuevaNota);

        // GUARDAR LAS NOTAS
        guardarNotas();

        // ACTUALIZAR LAS LISTAS
        mostrarNotas();
        mostrarImportantes();

        // MOSTRAR MENSAJE
        mensaje.textContent = "Nota guardada correctamente.";

        // LIMPIAR LOS CAMPOS
        textoNota.value = "";
        notaImportante.checked = false;
    }

});

// FUNCION PARA MOSTRAR LAS NOTAS
function mostrarNotas() {

    // OBTENER LAS NOTAS SEGUN EL FILTRO
    let categoriaSeleccionada = filtroCategoria.value;

    // LIMPIAR LA LISTA ANTERIOR
    listaNotas.textContent = "";

    // RECORRER TODAS LAS NOTAS
    notas.forEach(function(nota, indiceReal) {

        // COMPROBAR SI LA NOTA COINCIDE CON EL FILTRO
        if (
            categoriaSeleccionada === "Todas" ||
            nota.categoria === categoriaSeleccionada
        ) {

            // CREAR EL ELEMENTO DE LA NOTA
            let nuevaNota = document.createElement("article");

            // AGREGAR DATA-ATTRIBUTE
            nuevaNota.dataset.categoria = nota.categoria;

            // MOSTRAR EL TEXTO DE LA NOTA
            let contenido = document.createElement("p");

            contenido.textContent = (indiceReal + 1) + ". " +
                                    nota.texto + " - " +
                                    nota.categoria;

            // AGREGAR CLASE SI ES IMPORTANTE
            if (nota.importante) {
                nuevaNota.classList.add("importante");
                contenido.textContent += " ★";
            }

            nuevaNota.appendChild(contenido);

            // CREAR BOTON PARA EDITAR
            let botonEditar = document.createElement("button");

            botonEditar.textContent = "Editar";
            botonEditar.classList.add("boton-editar");

            // EVENTO CLICK PARA EDITAR
            botonEditar.addEventListener("click", function() {

                editarNota(indiceReal, nuevaNota);

            });

            nuevaNota.appendChild(botonEditar);

            // CREAR BOTON PARA ELIMINAR
            let botonEliminar = document.createElement("button");

            botonEliminar.textContent = "Eliminar";
            botonEliminar.classList.add("boton-eliminar");

            // EVENTO CLICK PARA ELIMINAR
            botonEliminar.addEventListener("click", function() {

                eliminarNota(indiceReal);

            });

            nuevaNota.appendChild(botonEliminar);

            // AGREGAR LA NOTA A LA LISTA
            listaNotas.appendChild(nuevaNota);

        }

    });

    // ACTUALIZAR EL CONTADOR TOTAL
    contadorNotas.textContent = notas.length;

}

// FUNCION PARA EDITAR UNA NOTA
function editarNota(indice, elementoNota) {

    // OBTENER LA NOTA SELECCIONADA
    let nota = notas[indice];

    // LIMPIAR EL CONTENIDO ANTERIOR
    elementoNota.textContent = "";

    // CREAR CAMPO PARA EDITAR EL TEXTO
    let campoTexto = document.createElement("textarea");

    campoTexto.value = nota.texto;
    campoTexto.placeholder = "Escribe el contenido de la nota";

    // CREAR LISTA PARA CAMBIAR LA CATEGORIA
    let campoCategoria = document.createElement("select");

    let categorias = ["Estudio", "Personal", "Trabajo"];

    categorias.forEach(function(categoria) {

        let opcion = document.createElement("option");

        opcion.value = categoria;
        opcion.textContent = categoria;

        campoCategoria.appendChild(opcion);

    });

    campoCategoria.value = nota.categoria;

    // CREAR CASILLA PARA MARCAR COMO IMPORTANTE
    let campoImportante = document.createElement("input");

    campoImportante.type = "checkbox";
    campoImportante.checked = nota.importante;

    // CREAR TEXTO PARA LA CASILLA
    let textoImportante = document.createElement("label");

    textoImportante.textContent = " Nota importante ";
    textoImportante.prepend(campoImportante);

    // CREAR BOTON PARA GUARDAR LOS CAMBIOS
    let botonActualizar = document.createElement("button");

    botonActualizar.textContent = "Guardar cambios";

    // EVENTO CLICK PARA ACTUALIZAR
    botonActualizar.addEventListener("click", function() {

        // OBTENER LOS NUEVOS DATOS
        let nuevoTexto = campoTexto.value.trim();
        let nuevaCategoria = campoCategoria.value;
        let nuevoImportante = campoImportante.checked;

        // VALIDAR EL TEXTO
        if (nuevoTexto === "") {

            alert("La nota no puede estar vacia.");
            return;

        }

        // ACTUALIZAR LOS DATOS
        nota.texto = nuevoTexto;
        nota.categoria = nuevaCategoria;
        nota.importante = nuevoImportante;

        // GUARDAR LOS CAMBIOS
        guardarNotas();

        // ACTUALIZAR LAS LISTAS
        mostrarNotas();
        mostrarImportantes();

        // MOSTRAR MENSAJE
        mensaje.textContent = "Nota actualizada correctamente.";

    });

    // CREAR BOTON PARA CANCELAR
    let botonCancelar = document.createElement("button");

    botonCancelar.textContent = "Cancelar";

    // EVENTO CLICK PARA CANCELAR
    botonCancelar.addEventListener("click", function() {

        mostrarNotas();

    });

    // AGREGAR LOS CAMPOS A LA NOTA
    elementoNota.appendChild(campoTexto);
    elementoNota.appendChild(campoCategoria);
    elementoNota.appendChild(textoImportante);
    elementoNota.appendChild(document.createElement("br"));
    elementoNota.appendChild(botonActualizar);
    elementoNota.appendChild(botonCancelar);

}

// FUNCION PARA ELIMINAR UNA NOTA
function eliminarNota(indice) {

    // CONFIRMAR SI SE DESEA ELIMINAR
    let confirmar = confirm("¿Estas seguro de eliminar esta nota?");

    if (confirmar) {

        // ELIMINAR LA NOTA DEL ARREGLO
        notas.splice(indice, 1);

        // GUARDAR LOS CAMBIOS
        guardarNotas();

        // ACTUALIZAR LAS LISTAS
        mostrarNotas();
        mostrarImportantes();

        // MOSTRAR MENSAJE
        mensaje.textContent = "Nota eliminada correctamente.";

    }

}

// FUNCION PARA MOSTRAR LAS NOTAS IMPORTANTES
function mostrarImportantes() {

    listaImportantes.textContent = "";

    let importantes = notas.filter(function(nota) {
        return nota.importante === true;
    });

    importantes.forEach(function(nota) {

        let elemento = document.createElement("p");

        elemento.textContent = nota.texto + " - " + nota.categoria;

        listaImportantes.appendChild(elemento);

    });

    contadorImportantes.textContent =
        "Notas importantes: " + importantes.length;

}

// EVENTO CHANGE PARA FILTRAR POR CATEGORIA
filtroCategoria.addEventListener("change", function() {

    mostrarNotas();

});

// CARGAR Y MOSTRAR LAS NOTAS AL ABRIR LA PAGINA
mostrarNotas();
mostrarImportantes();
