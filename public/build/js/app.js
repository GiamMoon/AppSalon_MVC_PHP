let paso=1,pasoInicial=1,pasoFinal=3;const cita={id:"",nombre:"",fecha:"",hora:"",servicios:[]};function iniciarApp(){mostrarSeccion(),tabs(),botonesPaginador(),paginaSiguiente(),paginaAnterior(),consultarAPI(),idCliente(),nombreCliente(),seleccionarFecha(),seleccionarHora(),mostrarResumen()}function mostrarSeccion(){const e=document.querySelector(".mostrar");e&&e.classList.remove("mostrar");const t="#paso-"+paso;document.querySelector(t).classList.add("mostrar");const a=document.querySelector(".actual");a&&a.classList.remove("actual");document.querySelector(`[data-paso="${paso}"]`).classList.add("actual")}function tabs(){document.querySelectorAll(".tabs button").forEach(e=>{e.addEventListener("click",e=>{paso=parseInt(parseInt(e.target.dataset.paso)),mostrarSeccion(),botonesPaginador()})})}function botonesPaginador(){const e=document.querySelector("#anterior"),t=document.querySelector("#siguiente");1===paso?(e.classList.add("ocultar"),t.classList.remove("ocultar")):3===paso?(e.classList.remove("ocultar"),t.classList.add("ocultar"),mostrarResumen()):(e.classList.remove("ocultar"),t.classList.remove("ocultar")),mostrarSeccion()}function paginaAnterior(){document.querySelector("#anterior").addEventListener("click",()=>{paso<=pasoInicial||(paso--,botonesPaginador())})}function paginaSiguiente(){document.querySelector("#siguiente").addEventListener("click",()=>{paso>=pasoFinal||(paso++,botonesPaginador())})}async function consultarAPI(){try{const e="/api/servicios",t=await fetch(e);mostrarServicios(await t.json())}catch(e){console.log(e)}}function mostrarServicios(e){e.forEach(e=>{const{id:t,nombre:a,precio:o}=e,n=document.createElement("P");n.classList.add("nombre-servicio"),n.textContent=a;const r=document.createElement("P");r.classList.add("precio-servicio"),r.textContent="S/."+o;const c=document.createElement("DIV");c.classList.add("servicio"),c.dataset.idServicio=t,c.onclick=function(){seleccionarServicio(e)},c.appendChild(n),c.appendChild(r),document.querySelector("#servicios").appendChild(c)})}function seleccionarServicio(e){const{id:t}=e,{servicios:a}=cita,o=document.querySelector(`[data-id-servicio="${t}"]`);a.some(e=>e.id===t)?(cita.servicios=a.filter(e=>e.id!==t),o.classList.remove("seleccionado")):(cita.servicios=[...a,e],o.classList.add("seleccionado"))}function idCliente(){cita.id=document.querySelector("#id").value}function nombreCliente(){cita.nombre=document.querySelector("#nombre").value}function seleccionarFecha(){document.querySelector("#fecha").addEventListener("input",(function(e){const t=new Date(e.target.value).getUTCDay(),a=new Date(e.target.value).getUTCDate(),o=new Date(e.target.value).getUTCMonth()+1;[6,0].includes(t)?(e.target.value="",mostrarAlerta("Fines de semana no permitido","error","#paso-2 p")):1===a&1===o||[4,5].includes(t)&a<10&4===o||1===a&5===o||(7===a||29===a)&6===o||(28===a||29===a)&7===o||(6===a||30===a)&8===o||8===a&10===o||1===a&11===o||(8===a||9===a||25===a)&12===o?(e.target.value="",mostrarAlerta("Feriados no hay atencion","error","#paso-2 p")):cita.fecha=e.target.value}))}function seleccionarHora(){document.querySelector("#hora").addEventListener("input",(function(e){const t=e.target.value.split(":")[0];t<10||t>21?(e.target.value="",mostrarAlerta("Hora no Valida","error","#paso-2 p")):cita.hora=e.target.value}))}function mostrarAlerta(e,t,a,o=!0){const n=document.querySelector(".alerta");n&&n.remove();const r=document.createElement("DIV");r.textContent=e,r.classList.add("alerta"),r.classList.add(t);document.querySelector(a).appendChild(r),!0===o&&setTimeout(()=>{r.remove()},3e3)}function mostrarResumen(){const e=document.querySelector(".contenido-resumen");for(;e.firstChild;)e.removeChild(e.firstChild);if(Object.values(cita).includes("")||0===cita.servicios.length)return void mostrarAlerta("Faltan datos de servicios, Fecha u Hora","error",".contenido-resumen",!1);const{nombre:t,fecha:a,hora:o,servicios:n}=cita,r=document.createElement("H3");r.textContent="Resumen de Servicios",e.appendChild(r),n.forEach(t=>{const{id:a,precio:o,nombre:n}=t,r=document.createElement("DIV");r.classList.add("contenedor-servicio");const c=document.createElement("P");c.textContent=n;const i=document.createElement("P");i.innerHTML="<span> Precio: </span> S/."+o,r.appendChild(c),r.appendChild(i),e.appendChild(r)});const c=document.createElement("H3");c.textContent="Resumen de Cita",e.appendChild(c);const i=document.createElement("P");i.innerHTML="<span> Nombre: </span> "+t;const s=new Date(a),d=s.getMonth(),l=s.getDate()+2,u=s.getFullYear(),m=new Date(Date.UTC(u,d,l)).toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),p=document.createElement("P");p.innerHTML="<span> Fecha: </span> "+m;const v=document.createElement("P");v.innerHTML=`<span> Hora: </span> ${o} Horas`;const h=document.createElement("BUTTON");h.classList.add("boton"),h.textContent="Reservar Cita",h.onclick=reservarCita,e.appendChild(i),e.appendChild(p),e.appendChild(v),e.appendChild(h)}async function reservarCita(){const{nombre:e,fecha:t,hora:a,servicios:o,id:n}=cita,r=o.map(e=>e.id),c=new FormData;c.append("fecha",t),c.append("hora",a),c.append("usuarioId",n),c.append("servicios",r);try{const e="/api/citas",t=await fetch(e,{method:"POST",body:c}),a=await t.json();console.log(a.resultado),a.resultado&&Swal.fire({icon:"success",title:"Cita Creada",text:"Tu cita fue creada correctamente",button:"Ok"}).then(()=>{setTimeout(()=>{window.location.reload()},3e3)})}catch(e){Swal.fire({icon:"error",title:"Error",text:"Hubo un error al guardar la cita"})}}document.addEventListener("DOMContentLoaded",(function(){iniciarApp()}));