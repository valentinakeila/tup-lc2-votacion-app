const tipoEleccion = 2 ; 
const tipoRecuento = 1; 


const periodoSelect = document.getElementById('periodoSelect');
const cargoSelect = document.getElementById('cargoSelect');
const distritoSelect = document.getElementById('distritoSelect');

fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
  .then(response => response.json())
  .then(data => {
    console.log(data); 
  })
  .catch(error => {
    console.error('Ocurrió un error:', error);
  });
   // devuelve los años ajajajaj me fije en consola y cada año tiene un value numerico calculo que con eso se identifica el select */

  
   

  

 
  


      
  





 