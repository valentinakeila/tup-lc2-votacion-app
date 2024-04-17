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





