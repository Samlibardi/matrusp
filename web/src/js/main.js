import State from './state.js';
import UI from './ui.js';
import SearchBox from './search.js';
import CourseBox from './modules/courses/courses.js';
import SaveBox from './save.js';
import PrintBox from './modules/print/print.js';
import ShareBox from './modules/share/share.js';
import './file.js';
import './contact.js';

global.version = '[AIV]{version}[/AIV]'; //Compiler directive

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceworker.js');
  navigator.serviceWorker.addEventListener('message', e => {
    ui.showBanner("Uma atualização está disponível. <a href=''>Atualize a página</a> para aplicar.");
  });
}

var dbworker = new Worker("dbupdate.worker.js");

global.matrusp_current_state_version = 7;

global.state = new State();
global.ui = new UI();
global.searchBox = new SearchBox();
global.courseBox = new CourseBox();
global.shareBox = new ShareBox();
global.saveBox = new SaveBox();
global.printBox = new PrintBox();

dbworker.onmessage = e => {
  ui.setLoadingBar(e.data);
  if (e.data == 1) {
    searchBox.populateOptions();
  }
}

var params = new URLSearchParams(window.location.search);
try{
  if(params && params.has("data")) {
    state.load(JSON.parse(atob(params.get("data"))));
  }
  else if(params && params.has("id")) {
    state.loadFromServer(params.get("id"));
  }
  else if (localStorage.getItem('state'))
    state.load(JSON.parse(localStorage.getItem('state')));
  else state.load();
  
  history.replaceState(history.state, "MatrUSP", window.location.pathname);
}
catch(e) {
  ui.showBanner("Ocorreu um erro e não foi possível carregar sua grade.", 2000);
  if (localStorage.getItem('state'))
    state.load(JSON.parse(localStorage.getItem('state')));
  else state.load();
}

state.saveOnLocalStorage();

setTimeout(function() { ui.scrollActiveCombinationToView() }, 100);