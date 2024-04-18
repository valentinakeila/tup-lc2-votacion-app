const tipoEleccion = 2;
const anioEleccion = 0;
const tipoRecuento = 1;
const categoriaId = 2;
let idDistrito = 0;
let circuitoId = "";
let mesaId = "";
let idCargos = "";
let datosJSON = "";
let datosJSON2 = "";
let seccionProvincialId = "";
let seccionTexto = "";

const periodosSelect = document.getElementById("periodoSelect");
const idCargo= document.getElementById("cargoSelect");
const idDistritoOption  = document.getElementById("distritoSelect");
var selectSeccion = document.getElementById('select-seccion');

const url = "https://resultados.mininterior.gob.ar/api/menu";
const urlPeriodos = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const urlCargos = "https://resultados.mininterior.gob.ar/api/menu?año=";

fetch(urlPeriodos)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((periodo) => {
      let option = document.createElement("option");
      option.text = periodo;
      option.value = periodo;
      periodoSelect.add(option);
    });
    console.log(data);
  })
  .catch((error) => console.log(error));



  function seleccionarAnio() {
    if (periodosSelect.value) {
        idCargo.innerHTML = '';
        idCargo.appendChild(new Option("Seleccione un Cargo", ""));
        fetch(urlCargos + periodosSelect.value) //periodosSelect = eleccion del año por el usuario
            .then(response => response.json())
            .then(data => {
                datosJSON = data;

                datosJSON.forEach((eleccion) => {
                    if (eleccion.IdEleccion == tipoEleccion) {
                        eleccion.Cargos.forEach(cargo => {
                            let option = document.createElement('option');
                            option.text = cargo.Cargo;
                            option.value = cargo.IdCargo;
                            idCargo.appendChild(option);
                        });
                    }
                });
            })
            .catch(error => console.log(error));
    } else {
        console.log("No se ha seleccionado un período.");
    }
}

function seleccionarDistrito() {
    idDistritoOption.innerHTML = '';
    idDistritoOption.appendChild(new Option("Seleccione un Distrito", ""));
    idCargos = idCargo.value;
    let selectCargo = idCargo.options[idCargo.selectedIndex];
    cargoTexto = selectCargo.textContent;

    datosJSON.forEach((eleccion) => {
        if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
                if (cargo.IdCargo == idCargos) {
                    cargo.Distritos.forEach(distrito => {
                        let option = document.createElement('option');
                        option.text = distrito.Distrito;
                        option.value = distrito.IdDistrito;
                        idDistritoOption.add(option);
                    });
                }

            });
        }
    })
} 


function seleccionarSeccion() {
    let selectedDistrito = document.getElementById("distritoSelect")
    selectSeccion.innerHTML = '';
    if (selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        document.getElementById("select-seccion").style.display = "Inline"; //si el valor no es "ARGENTINA", hace que vuelva a ser visible si ya se había seleccionado esa opción antes
        selectSeccion.appendChild(new Option("Seleccione una Sección", ""));
        idDistrito = idDistritoOption.value;
        let selectDistrito = idDistritoOption.options[idDistritoOption.selectedIndex];
        distritoTexto = selectDistrito.textContent;

        datosJSON.forEach((eleccion) => {
            if (eleccion.IdEleccion == tipoEleccion) {
                eleccion.Cargos.forEach(cargo => {
                    if (cargo.IdCargo == idCargos) {
                        cargo.Distritos.forEach(distrito => {
                            if (distrito.IdDistrito == idDistrito) {
                                distrito.SeccionesProvinciales.forEach(seccionesProvinciales => {
                                    seccionesProvinciales.Secciones.forEach(distrito => {
                                        let option = document.createElement("option");
                                        option.value = distrito.IdSeccion;
                                        option.text = distrito.Seccion;
                                        selectSeccion.appendChild(option);
                                    });
                                })
                            }
                        });
                    }
                });
            }
        })
    }
    else {
        document.getElementById("select-seccion").style.display = "none"; // si se quieren buscar los resultados presidenciales a nivel nacional, esconde el selector de sección ya que es innecesario y su unica opción es "null"

        console.log(selectedDistrito.options[selectedDistrito.selectedIndex].text) // debería solo logear "ARGENTINA" por razones de debugeo, borrar más adelante
    }
}



function filtrarInformacion() {
    const partidos = document.querySelectorAll('.partido');

    partidos.forEach(box => {
        box.remove();
    });
    // Validar que los campos no estén vacíos
    let selectedDistrito = document.getElementById("distritoSelect")
    if (periodosSelect.value === "Año" ||
        idCargo.value === "Cargo" ||
        idDistritoOption.value === "Distrito" ||
        selectSeccion.value === "Seccion" &&
        selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        mostrarMensaje("rojo-vacio");
        return;
    }

   

    
}

async function mostrarMensaje(color) {
    const colorMensaje = document.getElementById('color-mensaje');
    const textoMensaje = document.getElementById('texto-mensaje');

    // Define los mensajes y clases de estilo para cada color
    const mensajes = {
        'amarillo-no-cargado': {
            clase: 'amarillo',
            texto: ' No se logro completar lo solicitado',
            icono: 'fas fa-exclamation'
        },
        'amarillo-informe': {
            clase: 'amarillo',
            texto: ' El informe ya existe',
            icono: 'fas fa-exclamation'
        },
        'rojo-vacio': {
            clase: 'rojo',
            texto: ' Seleccione todos los datos antes de filtrar.',
            icono: 'fas fa-exclamation-triangle'
        },
        'verde-cargado': {
            clase: 'verde',
            texto: ' Los datos se cargaron de forma correcta.',
            icono: 'fas fa-thumbs-up'
        },
        'verde-informe': {
            clase: 'verde',
            texto: ' Los datos del informe se agregaron correctamente.',
            icono: 'fas fa-thumbs-up'
        },
        'rojo-informe': {
            clase: 'rojo',
            texto: ' No se guardará el informe vacío.',
            icono: 'fas fa-exclamation-triangle'
        },
        'rojo-error': {
            clase: 'rojo',
            texto: ' Los datos se encuentran vacios, No se guardaron en local Storage.',
            icono: 'fas fa-exclamation-triangle'
        }
    };

    if (mensajes[color]) {
        colorMensaje.className = 'mensajesUsuario-' + mensajes[color].clase; // Asigna la clase de estilo
        textoMensaje.innerText = mensajes[color].texto; // Asigna el texto del mensaje
        textoMensaje.className = mensajes[color].icono; // Asigna la clase del icono
        // Oculta el mensaje después de un tiempo
        setTimeout(function () {
            colorMensaje.className = 'hidden';
            textoMensaje.className = ''; // Remueve la clase del icono
        }, 4000);
    }
}





