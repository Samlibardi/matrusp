import 'root/custom_lib.js';
import buttonHtml from './upload-button.html';
import overlayHtml from './upload-overlay.html';

function uploadFile(file) {
  var reader = new FileReader();
  reader.onload = (function parseAFile(aFile) {
    return function(e) {
      try {
        var jsonObj = JSON.parse(e.target.result);
        if (!jsonObj.version) {
          ui.showBanner("Não foi possível abrir o arquivo. Verifique se é um arquivo do MatrUSP.",2000);
          return false;
        }
        state.load(jsonObj);
      }
      catch(e) {
        ui.showBanner("Não foi possível abrir o arquivo. Verifique se é um arquivo do MatrUSP.",2000);
        return false;
      }
    };
  })(file);
  if(file) reader.readAsText(file);
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  this.classList.remove('overlay-show');

  var dt = e.dataTransfer;
  if (dt.items) {
    for (var i=0; i < dt.items.length; i++) {
      if (dt.items[i].kind == "file") {
        var f = dt.items[i].getAsFile();
        uploadFile(f);
        return;
      }
    }
  } 
  else if(dt.files) {
    for (var i=0; i < dt.files.length; i++) {
      var f = dt.files[i];
      uploadFile(f);
      return;
    }  
  }
}

ui.addHeaderButton(buttonHtml);
document.getElementById('upload-input').addEventListener('change', e => { uploadFile(e.target.files[0]); });
var tpl = document.createElement('template');
tpl.innerHTML = overlayHtml;
var dropoverlay = tpl.content.firstChild;
document.body.appendChild(dropoverlay);

document.addEventListener('dragenter', e => { dropoverlay.classList.add('overlay-show'); });
dropoverlay.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation();});
dropoverlay.addEventListener('drop', handleDrop);
dropoverlay.addEventListener('dragleave', e => { this.classList.remove('overlay-show'); });
