<h1 class="nombre-pagina" >Olvide Contraseña</h1>
<p class="descripcion-pagina" >Reestablece tu contraseña escribiendo tu email a continuacion</p>

<?php 

include_once __DIR__ . "/../templates/alertas.php";

?>

<form class="formulario" method="POST" action="/olvide-contrasena">

<div class="campo" >

    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="Tu Email" >

</div>

<input type="submit" class="boton" value="Enviar Instrucciones">

</form>

<div class="acciones">
    <a href="/crear-cuenta">¿Aún no tienes una cuenta? Crear una</a>
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
</div>