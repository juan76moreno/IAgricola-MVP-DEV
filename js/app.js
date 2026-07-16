function preparar(){

  document.getElementById('card').style.display='none';

  document.getElementById('prep').style.display='block';

  setTimeout(function(){

    document.getElementById('last').innerText='✓';

  },1000);

  setTimeout(function(){

    document.getElementById('prep').style.display='none';

    document.getElementById('ready').style.display='block';

  },2200);

}

function iniciarVisita(){

    document.getElementById("ready").style.display="none";

    document.getElementById("visit").style.display="block";

}
function continuarVisita(){

    document.getElementById("visit").style.display="none";

    document.getElementById("farm").style.display="block";

}
function continuarCaracterizacion(){

    document.getElementById("farm").style.display="none";

    alert("Siguiente bloque de Caracterización de la Finca");

}