let paso = 1;
let pasoInicial= 1;
let pasoFinal = 3;

const cita = {
    id: "",
    nombre: "",
    fecha: "",
    hora: "",
    servicios: []
}

document.addEventListener("DOMContentLoaded",function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); // Cambia la seccion cuando se presiones los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); //Consulta la API en el backend de PHP

    idCliente();
    nombreCliente(); //Añade el nombre del cliente al objeto de cita
    seleccionarFecha(); //Añada la fecha de la cita en el objeto
    seleccionarHora(); //Añada la hora de la cita en el objeto

    mostrarResumen(); //Muestra el resumen de la cita
}

function mostrarSeccion(){

    //Ocultar la seccion que tenga la clase mostrar

    const seccionAnterior = document.querySelector(".mostrar");
    if(seccionAnterior){
    seccionAnterior.classList.remove("mostrar");
    }


    //Seleccionar la seccion con el paso

    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add("mostrar");

    //Quita la clase de actual al tab anterior

    const tabAnteriror = document.querySelector(".actual");
    if(tabAnteriror){
        tabAnteriror.classList.remove("actual");
    }

    //Resalta el tab actual

    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add("actual");
}

function tabs(){
    const botones = document.querySelectorAll(".tabs button");

    botones.forEach(boton =>{
        boton.addEventListener("click", e =>{

            paso = parseInt(parseInt( e.target.dataset.paso));
            
            mostrarSeccion();
            botonesPaginador();

        })
    });
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");
    
    if(paso === 1){
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }else if(paso === 3){
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.add("ocultar");
        
        mostrarResumen();

    }else{
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }

    mostrarSeccion();

}

function paginaAnterior(){
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click",() =>{
        if(paso <= pasoInicial) return;

        paso--;

        botonesPaginador();
    })
}
function paginaSiguiente(){
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click",() =>{
        if(paso >= pasoFinal) return;

        paso++;

        botonesPaginador();
    })
}

async function consultarAPI(){
    try {
        const url = "/api/servicios";
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios){

    servicios.forEach(servicio =>{
        const {id,nombre,precio} = servicio;

        const nombreServicio = document.createElement("P");
        nombreServicio.classList.add("nombre-servicio");
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.classList.add("precio-servicio");
        precioServicio.textContent = `S/.${precio}`;

        const servicioDiv = document.createElement("DIV");
        servicioDiv.classList.add("servicio");
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        };

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector("#servicios").appendChild(servicioDiv);

        
    });

}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;

    //Identificar al elemento que se le da click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //Comprobar si un servicio ya fue agregado
    if(servicios.some(agregado => agregado.id === id)){
        //Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove("seleccionado");
    }else{
        //Agregarlo
        cita.servicios = [...servicios,servicio];
        divServicio.classList.add("seleccionado");
    }

    
   

}

function idCliente(){
    cita.id = document.querySelector("#id").value;

}

function nombreCliente(){
    cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha(){
    
    const inputFecha = document.querySelector("#fecha");
    inputFecha.addEventListener("input", function(e){

        const dia = new Date(e.target.value).getUTCDay();
        const diaFestivo = new Date(e.target.value).getUTCDate();
        const mes = new Date(e.target.value).getUTCMonth() +1;

        if([6,0].includes(dia)){
            e.target.value= "";
            mostrarAlerta("Fines de semana no permitido", "error", "#paso-2 p");
        }else if((1 === diaFestivo & 1 === mes) ||
                 ([4,5].includes(dia) & diaFestivo<10 & 4 === mes) ||
                 (1 === diaFestivo & 5 === mes) ||
                 ((7 === diaFestivo || 29 === diaFestivo) & 6 === mes) ||
                 ((28 === diaFestivo || 29 === diaFestivo) & 7 === mes) ||
                 ((6 === diaFestivo || 30 === diaFestivo) & 8 === mes) ||
                 (8 === diaFestivo & 10 === mes) ||
                 (1 === diaFestivo & 11 === mes) ||
                 ((8 === diaFestivo || 9 === diaFestivo || 25 === diaFestivo) & 12 === mes)
         
        ){
            e.target.value= "";
            mostrarAlerta("Feriados no hay atencion", "error", "#paso-2 p");
        }
        else{
            cita.fecha = e.target.value;
        }
    })
}

function seleccionarHora(){
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", function(e){
        

        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if(hora <10 || hora > 21){
            e.target.value = "";
            mostrarAlerta("Hora no Valida","error", "#paso-2 p");
        }else{
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje,tipo, elemento, desaparece = true){

    //Previene que se genere mas de 1 alerta
    const alertaPrevia = document.querySelector(".alerta");
    if(alertaPrevia){
        alertaPrevia.remove();
    };

    //Scripting para crear la alerta
    const alerta = document.createElement("DIV");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece === true){
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    
    //Eliminar la alerta
    
}

function mostrarResumen(){
    const resumen = document.querySelector(".contenido-resumen");
    //Limpiar el contenido de Resumen
     

    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }
    
    if(Object.values(cita).includes("") || cita.servicios.length === 0){
        mostrarAlerta("Faltan datos de servicios, Fecha u Hora", "error", ".contenido-resumen", false);
        
        return;
    }

    // Formatear el div de resumen

    const {nombre,fecha,hora,servicios} = cita;

    

    //Heading para servicios en resumen

    const headingServicios = document.createElement("H3");
    headingServicios.textContent = "Resumen de Servicios";
    resumen.appendChild(headingServicios);

    //Iterando y mostrando los servicios     
    servicios.forEach(servicio => {
        const  {id,precio,nombre} = servicio;
        const contenedorServicio = document.createElement("DIV");
        contenedorServicio.classList.add("contenedor-servicio");

        const textoServicio = document.createElement("P");
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement("P");
        precioServicio.innerHTML = `<span> Precio: </span> S/.${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);

    });

    //Heading para cita en Resumen
    const headingCita = document.createElement("H3");
    headingCita.textContent = "Resumen de Cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement("P");
    nombreCliente.innerHTML = `<span> Nombre: </span> ${nombre}`;

    //Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() +2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year,mes,dia));

    const opciones = {weekday: "long", year: "numeric", month: "long", day:"numeric"};
    const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);
    

    const fechaCita = document.createElement("P");
    fechaCita.innerHTML = `<span> Fecha: </span> ${fechaFormateada}`;

    const horaCita = document.createElement("P");
    horaCita.innerHTML = `<span> Hora: </span> ${hora} Horas`;

    //Boton para crear una cita
    const botonReservar = document.createElement("BUTTON");
    botonReservar.classList.add("boton");
    botonReservar.textContent = "Reservar Cita";
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);

}

async function reservarCita(){

    const {nombre, fecha,hora, servicios, id} = cita;

    const idServicios = servicios.map(servicio =>servicio.id);
    

    const datos = new FormData();
    datos.append("fecha",fecha);
    datos.append("hora",hora);
    datos.append("usuarioId",id);
    datos.append("servicios",idServicios);

    try{
        //Peticion hacia la api
    const url = "/api/citas";
    const respuesta = await fetch(url, {
        method: "POST",
        body: datos
    });

    const resultado = await respuesta.json();
    console.log(resultado.resultado);

    if(resultado.resultado){
        Swal.fire({
            icon: 'success',
            title: 'Cita Creada',
            text: 'Tu cita fue creada correctamente',
            button: "Ok"
          }).then(()=>{
            setTimeout(() => {
                window.location.reload();
            }, 3000);
          })
    }
    }catch(error){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al guardar la cita'
          })
    }

    
    
    
}