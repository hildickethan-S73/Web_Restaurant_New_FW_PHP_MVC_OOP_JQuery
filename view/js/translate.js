function changeLang(lang) {
  lang = lang ||                             // chosen lang
         localStorage.getItem('app-lang') || // lang in local storage
         'en';                               // default

  localStorage.setItem('app-lang', lang);

  $.ajax({
    type: 'GET', 
    url: 'view/lang/'+lang+'.json',
    dataType: 'JSON',
    mimeType: 'application/json',
    success: function (data) {
      // json parse breaks on windows
      // data = JSON.parse(data);
      // console.log(data); 

      var elems = document.querySelectorAll('[data-tr]');
      for (var x = 0; x < elems.length; x++) {
        elems[x].innerHTML = data.hasOwnProperty(lang) // if (elems[x].innerHTML = data.hasOwnProperty(lang)){
          ? data[lang][elems[x].dataset.tr]            //   data[lang][elems[x].dataset.tr];
          : elems[x].dataset.tr;                         // } else { elems[x].dataset.tr; }
      }
    }
  });
}

window.onload = function(){
  changeLang();

  // check local storage for language to set to appropriate lang
  switch(localStorage.getItem('app-lang')){
    case 'en':
    document.getElementById('select-lang').selectedIndex = 0;
    break;
    
    case 'es':
    document.getElementById('select-lang').selectedIndex = 1;
    break;

    case 'va':
    document.getElementById('select-lang').selectedIndex = 2;
    break;
  }

  $('#select-lang').on('change', function() {
    if(this.selectedIndex == 0)
      changeLang('en');
    if(this.selectedIndex == 1)
      changeLang('es');
    if(this.selectedIndex == 2)
      changeLang('va');
  });
}
