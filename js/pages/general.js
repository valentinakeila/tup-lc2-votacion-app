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
const selectSeccion = document.getElementById('select-seccion');

const url = "https://resultados.mininterior.gob.ar/api/menu";
const urlPeriodos = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const urlCargos = "https://resultados.mininterior.gob.ar/api/menu?año=";

localStorage.clear()
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
    let secContenido = document.getElementById('sec-contenido');
    secContenido.style.display = 'flex'; // o 'flex' si prefieres

    let recuadros = document.getElementById('recuadros');
    recuadros.style.display = 'flex'; // o 'flex' si prefieres
    

    partidos.forEach(box => {
        box.remove();
    });
    // Validar que los campos no estén vacíos
    let selectedDistrito = document.getElementById("distritoSelect")
    if (periodosSelect.value === "Año" ||
        idCargo.value === "Cargo" ||
        idDistritoOption.value === "Distrito" ||
        selectSeccion.value === "Seccion" && selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
            let sec = document.getElementById('sec-contenido');
            sec.style.display = 'none';
            let secRecruadros = document.getElementById('recuadros');
            secRecruadros.style.display = 'none';
            mostrarMensaje("rojo-vacio");
        return;
    }

    
    let sin_datos = document.getElementById('sin_datos');
    sin_datos.style.display = "none";


    // Recuperar valores de los filtros
    let anioEleccion = periodosSelect.value;
    let categoriaId = idCargo.value;
    let idDistrito = idDistritoOption.value;
    let seccionProvincialId = selectSeccion.value;
    let seccionId = selectSeccion.value;
    let selectedSeccion = selectSeccion.options[selectSeccion.selectedIndex];
   
    if (selectedDistrito.options[selectedDistrito.selectedIndex].text == "ARGENTINA") {
        seccionTexto = "";
    }
    else {
        seccionTexto = selectedSeccion.textContent
    }
    let tipoEleccionGlobal = tipoEleccion; // Asegúrate de que esta variable está definida correctamente en tu script
    let circuitoIdGlobal = circuitoId; // Asegúrate de que esta variable está definida correctamente en tu script
    let mesaIdGlobal = mesaId;

    crearTitulo(seccionTexto);


    // Construir la URL con los parámetros
    let url = `https://resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccionGlobal}&categoriaId=${categoriaId}&distritoId=${idDistrito}&seccionId=${seccionId}&circuitoId=${circuitoIdGlobal}&mesaId=${mesaIdGlobal}`;
    console.log(url);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            datosJSON2 = data;
          console.log(datosJSON2);
          cargarDatos();
          mostrarMensaje("verde-cargado");
          
          // Ordenar los datos por cantidad de votos de mayor a menor
          const partidosOrdenados = data.valoresTotalizadosPositivos.sort((a, b) => b.votos - a.votos);
      
          // Agregamos al DOM los nombres de los 7 partidos políticos con más votos
          const barras = document.getElementById("grid");
          const divAgrupaciones = document.createElement("div");
          document.getElementById("estadisticas_partidos").appendChild(divAgrupaciones);
          
          let indice = 0;
          let limite = 7; // Establecemos el límite en 7
      
          for (let i = 0; i < partidosOrdenados.length && i < limite; i++) {
              let partido = partidosOrdenados[i];
              console.log(partido);
              console.log(partido.nombreAgrupacion);
      
              let divPartido = document.createElement("div");
              divPartido.classList.add("partido");
              divPartido.innerHTML = 
                  `<h4 class="partido_nombre">${partido.nombreAgrupacion}</h4>
                  <h4 class="partido_porcentaje">${partido.votosPorcentaje}%</h4>
                  <h4 class="partido_votos">${partido.votos}  VOTOS</h4>
                  <label class="barra_porcentaje barras" style="width: ${partido.votosPorcentaje}%; background: ${colores[indice % colores.length].color};"></label>
                  <label class="barra_fondo barras" style="background: ${colores[indice % colores.length].colorClaro}"></label>`;
      
              divAgrupaciones.appendChild(divPartido);
      
              const bar = `<div class="bar" style="--bar-value:${partido.votosPorcentaje}%;" data-name="${partido.nombreAgrupacion}" title="${partido.nombreAgrupacion} ${partido.votosPorcentaje}%"></div>`;
              barras.innerHTML += bar;
              indice++;
          }
      
          let secBlank = document.getElementById('blank');
          secBlank.style.display = 'none';
        
            })
        .catch(error => {
            mostrarMensaje("amarillo-no-cargado");
        });
    

    
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

        // Limpiamos el contenido del textoMensaje
        textoMensaje.innerHTML = '';

        // Creamos un elemento <span> para contener el texto
        const textoSpan = document.createElement('span');
        textoSpan.innerText = mensajes[color].texto;

        // Creamos un elemento <i> para el icono
        const iconoElemento = document.createElement('i');
        iconoElemento.className = mensajes[color].icono; // Asigna la clase del icono
        iconoElemento.style.marginRight = '2%'; // Aplica el margen derecho

        // Insertamos el icono y el texto dentro del textoMensaje
        textoMensaje.appendChild(iconoElemento);
        textoMensaje.appendChild(textoSpan);

        // Oculta el mensaje después de un tiempo
        setTimeout(function () {
            colorMensaje.className = 'hidden';
            textoMensaje.innerHTML = ''; // Remueve el contenido del mensaje
        }, 4000);
    }
}


function crearTitulo(distritoTexto = "", seccionTexto = "") {

    const titulo = document.getElementById('sec-titulo');
    let selectedDistrito = document.getElementById("distritoSelect")
    console.log("Valor de cargoTexto:", cargoTexto);

    // Verificar el valor de distritoTexto
    console.log("Valor de distritoTexto:", distritoTexto);

    // Verificar el valor de seccionTexto
    console.log("Valor de seccionTexto:", seccionTexto);


    if (selectedDistrito.options[selectedDistrito.selectedIndex].text != "ARGENTINA") {
        titulo.innerHTML = `
        <div class="" id="sec-titulo">-
            <h2>Elecciones ${periodosSelect.value} | Generales</h2>
            <p class="texto-path">${periodosSelect.value} > Generales > Provisorio > ${cargoTexto} > ${distritoTexto} > ${seccionTexto}</p>
        </div>`
    }
    else {
        titulo.innerHTML = `
        <div class="" id="sec-titulo">-
            <h2>Elecciones ${periodosSelect.value} | Generales</h2>
            <p class="texto-path">${periodosSelect.value} > Generales > Provisorio > ${cargoTexto}</p>
        </div>`
    }
}


function cargarDatos() {
    const mesasEscrutadas = document.getElementById("mesas");
    const electores = document.getElementById("electores");
    const participacionEscrutado = document.getElementById("participacion");
    const mapa = document.getElementById("mapa");
    const nombreMapa = document.getElementById("nombreMapa");

    let contentMesa = datosJSON2.estadoRecuento.mesasTotalizadas;
    let contentElectores = datosJSON2.estadoRecuento.cantidadElectores;
    let contentParticipacion = datosJSON2.estadoRecuento.participacionPorcentaje;

    mesasEscrutadas.textContent = `Mesas Escrutadas ${contentMesa}`;
    electores.textContent = `Electores ${contentElectores}`;
    participacionEscrutado.textContent = `Participacion sobre escrutado ${contentParticipacion}%`;
   
    //esto da error pq arg no tiene mapa y como no lo encuentra no se ejecuta el resto

    if (typeof distritoTexto !== "undefined" && distritoTexto !== null) {
        nombreMapa.textContent = `${distritoTexto}`;
        mapa.innerHTML = provincias[idDistrito];
    }


     
}

function agregarInforme() {
    try {
        if (Object.keys(datosJSON2).length !== 0) {

            var dataInforme = {
                año: periodosSelect.value,
                tipo: 'Generales',
                recuento: 'Provisorio',
                cargo: cargoTexto,
                distrito: (idDistritoOption.value === "0") ? "ARGENTINA" : distritoTexto, // Verificar si el distrito es "ARGENTINA"
                seccion: seccionTexto,
                distritoId: parseInt(idDistritoOption.value),
                informe: datosJSON2
            };
        } else {
            console.error('infoJSON está vacío. No se guardará en localStorage.');

            mostrarMensaje("rojo-informe");
        }

        var storageActual = localStorage.getItem('dataInforme');

        if (storageActual) {

            var existente = JSON.parse(storageActual);
            var existe = false;

            for (var i = 0; i < existente.length; i++) {
                if (JSON.stringify(existente[i]) === JSON.stringify(dataInforme)) {
                    existe = true;
                    break;
                }
            }

            if (!existe) {
                existente.push(dataInforme);

                // Guardar el objeto actualizado en el localStorage
                localStorage.setItem('dataInforme', JSON.stringify(existente));
                console.log('JSON agregado correctamente.');
                mostrarMensaje("verde-informe");
            } else {

                mostrarMensaje("amarillo-informe");
                console.log('El JSON ya existe, no se puede agregar.');
            }
        } else {
            localStorage.setItem('dataInforme', JSON.stringify([dataInforme]));
            console.log('Primer JSON guardado correctamente.');
            mostrarMensaje("verde-informe");
        }
    } catch (error) {
        console.error('Se produjo un error:', error);
        mensajito = 'rojo';
    }
}