const CACHE_NAME_STATIC = "Matrusp_static";
const CACHE_NAME_DATA = "Matrusp_data";
const CACHE_NAME_OLD = "Matrusp";

self.importScripts('dblib.js');

var swdb = new Dexie("Matrusp-sw");
swdb.version(1).stores({dirs: ''});

self.path = self.location.href.substring(0,self.location.href.lastIndexOf('/'));

self.recentFetches = [];

//Lista de diretórios que seguem o modelo Network-Cache
const NCDirs = [
  "/data/.+" //Identificadores baixados não mostrarão mensagem de atualização
].map(dir => new RegExp(`^${self.path}.+${dir}$`));

self.addEventListener('install', e => {
  e.waitUntil(updateStaticCache());
  self.skipWaiting(); 
}); // Ativar o SW imediatamente

async function updateStaticCache() {
  self.caches.delete(CACHE_NAME_OLD);

  var cache = await self.caches.open(CACHE_NAME_STATIC);

  //Obter o manifest.json, enviando a ETag para ver se houve alteração
  var oldManifestResponse = await cache.match('manifest.json');
  var manifestResponse = oldManifestResponse? 
    await fetch('manifest.json', {method: 'GET', headers: {'If-None-Match': (oldManifestResponse.headers.get("ETag")||'').replace('-gzip','')}}).catch(e => {}) :
    await fetch('manifest.json').catch(e => {});
    
  //Se não for possível obter o manifest, ou se não tiver sido alterado, não há necessidade de alterar
  //Sempre que o webpack é compilado, o manifest é alterado, logo se houver alteração em qualquer arquivo, o manifest terá um novo ETag
  if(!manifestResponse || !manifestResponse.ok)
    return;

  cache.put('manifest.json', manifestResponse.clone()); //Salvar o manifest no cache
   
  var manifest = await manifestResponse.json();
  manifest[''] = ''; //ensure root will be cached
  var manifestValues = Object.values(manifest);
  manifest = new Set(manifestValues);

  await swdb.dirs.put(manifestValues.map(dir => new RegExp(`^${self.path}/${dir.replace(/^\//,'')}$`)),'CURDirs');

  var keys = await cache.keys();

  var updatedFiles = 0;


  //Verificar os arquivos que já estão em cache, para atualizá-los
  await Promise.all(keys.map(async request => {
    var requestpath = request.url.replace(self.path,'').slice(1);
    if(requestpath == 'manifest.json') {
      manifest.delete(requestpath);
      return; //não é necessário atualizar manifest.json
    }
    if(!manifest.has(requestpath)){
      cache.delete(request); //remover do cache se o arquivo não estiver no manifesto
    } else {
      //Pedir cada arquivo do cache para o serivdor, enviando a ETag para verificar modificações.
      var oldResponse = await cache.match(request);
      var newResponse = await fetch(request.url, {method: 'GET', headers: {'If-None-Match': (oldResponse.headers.get("ETag")||'').replace('-gzip','')}}).catch(e => {});
      if(newResponse.status == 200) {
        cache.put(request, newResponse.clone());
        updatedFiles++;
      }
      manifest.delete(requestpath); //Remover o arquivo do manifesto, pois já foi verificado
    }
  }));

  //Adicionar arquivos novos ao cache
  await cache.addAll(manifest);

  //Enviar mensagem de atualização caso algum arquivo tenha sido baixado
  if(updatedFiles || manifest.size) {
    sendRefreshMessage();
  }
}

self.addEventListener('fetch', e => {
  e.respondWith((async() => {
    if(e.request.mode == 'navigate') {
      updateStaticCache();
    }

    // Responder a um fetch com uma resposta do cache(se o diretório estiver na lista)
    if((await swdb.dirs.get('CURDirs')).some(dir => dir.test(e.request.url))) {
      return await cacheUpdateRefresh(e.request.clone()); //Envia mensagem de atualização ao cliente
    }
    else if(NCDirs.some(dir => dir.test(e.request.url))) {
      return await networkCache(e.request.clone()); //Não envia mensagem de atualização
    }

    // Senão, responder com um pedido para a rede
    else return await fetch(e.request.clone());
  })());
});

function cacheUpdateRefresh(request) {
  return self.caches.open(CACHE_NAME_STATIC).then(cache => cache.match(request).then(response => {
    if(!response) {
      // Se o pedido não for encontrado em cache, retornar da network e colocar o resultado em cache
      var fetchPromise = fetch(request);
      fetchPromise.then(async newresponse => {
        newresponse = newresponse.clone();
        cache = await self.caches.open(CACHE_NAME_STATIC);
        cache.put(request,newresponse);
      });
      return fetchPromise;
    }

    // Se o pedido for encontrado em cache, fazer um pedido para a rede e colocar em cache, mas retornar a resposta do cache
    //  antes que ele seja concluido. Enviar o ETag da resposta salva para evitar baixar conteúdo repetido.
    var promise = fetch(request.url, {method: 'GET', headers: {'If-None-Match': (response.headers.get("ETag")||'').replace('-gzip','')}}).then(async newresponse => {
      if(newresponse.ok) {
        cache = await self.caches.open(CACHE_NAME_STATIC);
        cache.put(request,newresponse);
        //sendRefreshMessage();
      }
    }).catch(e => {});
    self.recentFetches.push(promise);
    return response;
  }));
}

function sendRefreshMessage() {
  //Esperar 1s para enviar a mensagem ao cliente, para evitar que seja enviada antes de a UI estar carregada
  //Verificar se após 1s ainda existe algum fetch pendente, e esperar
  if(self.refreshTimeout) clearTimeout(self.refreshTimeout);
  self.refreshTimeout = setTimeout(() => self.clients.matchAll().then(clients => {
    Promise.all(self.recentFetches).then(() => {
      clients.forEach(client => {
        client.postMessage('refresh');
      });
    });
    self.recentFetches = [];
  }),1000);
}

async function networkCache(request) {
  var cacheResponse = await self.caches.open(CACHE_NAME_DATA).then(cache => cache.match(request));

  //Tentar obter a resposta da rede, se não conseguir, retornar a do cache
  try {
    var netResponse = await fetch(request.url, {method: 'GET', headers: {'If-None-Match': cacheResponse ? cacheResponse.headers.get("ETag").replace('-gzip','') : ''}});
    if(netResponse.ok) {
      await self.caches.open(CACHE_NAME_DATA).then(cache => cache.put(request,netResponse.clone()));
      return netResponse;
    }
    else return cacheResponse;
  }

  //Caso ocorra algum erro, retornar a resposta do cache. Se não houver, propagar o erro
  catch(e) {
    if(cacheResponse)
      return cacheResponse;
    else throw e;
  }
}