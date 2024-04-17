const tipoEleccion = 1; //PASO
const tipoRecuento = 1; //Recuento definitivo.
let banderaAnio = false;
let banderaCargo = false;
let banderaDistrito = false;
let consultaPeriodos;
let consultaCargos;
let consultaResultados;


const periodoSelect = document.getElementById('periodoSelect');
const cargoSelect = document.getElementById('cargoSelect');
const distritoSelect = document.getElementById('distritoSelect');

const url = "https://resultados.mininterior.gob.ar/api/menu";
const urlPeriodos = "https://resultados.mininterior.gob.ar/api/menu/periodos";
const urlCargos = "https://resultados.mininterior.gob.ar/api/menu?año=";

fetch(urlPeriodos)
  .then(response => response.json())
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error('Ocurrió un error:', error);
  });




