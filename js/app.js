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
