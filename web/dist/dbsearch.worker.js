!function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=197)}({197:function(e,t,r){"use strict";r.r(t);var o=r(3),n=r.n(o);function s(){for(var e=[],t=self.search,r=0;r<self.lastQueries.length;r++)if(self.lastQueries[r].search===t)return void a({search:t,result:lastQueries[r].result},!1);var o=new Object,s=dbutil.trigramsFromString(t.q,!0).map(t=>new Promise((e,r)=>{for(var o,n=0;o=lastTrigrams[n];n++)if(o[0]==t)return e(o[1]);return e(matruspDB.trigrams.get(t).then(e=>(e&&self.lastTrigrams.unshift([t,e])>32&&(self.lastTrigrams.length=32),e)))}).then(t=>{for(var r in t)o[r]||(o[r]=0,e.push(r)),o[r]+=t[r]}));Promise.all(s).then(async r=>{var s,i=[];t.options.unit?(s=t.options.department?matruspDB.lectures.where({unidade:t.options.unit,departamento:t.options.department}):matruspDB.lectures.where("[unidade+departamento]").between([t.options.unit,Dexie.minKey],[t.options.unit,Dexie.maxKey]),t.options.timeframes&&t.options.timeframes.length&&(s=s.and(e=>e.periodos.some(e=>t.options.timeframes.indexOf(e)>-1))),s=s.and(e=>o[e.codigo]),i=await s.toArray(),n()(i,50,(e,t)=>o[t.codigo]-o[e.codigo]),i=i.splice(0,50)):t.options.timeframes&&t.options.timeframes.length?(s=matruspDB.lectures.where("periodos").anyOf(t.options.timeframes).distinct(),t.options.campus&&(s=s.and(e=>e.campus==t.options.campus)),s=s.and(e=>o[e.codigo]),i=await s.toArray(),n()(i,50,(e,t)=>o[t.codigo]-o[e.codigo]),i=i.splice(0,50)):t.options.campus?(s=(s=matruspDB.lectures.where("campus").equals(t.options.campus)).and(e=>o[e.codigo]),i=await s.toArray(),n()(i,50,(e,t)=>o[t.codigo]-o[e.codigo]),i=i.splice(0,50)):(n()(e,50,(e,t)=>o[t]-o[e]),s=matruspDB.lectures.where("codigo").anyOf(e.splice(0,50)),i=await s.toArray()),i.forEach(e=>{o[e.codigo]/=Math.log(3+e.nome.length)}),i.sort((e,t)=>o[t.codigo]-o[e.codigo]),a({search:t,result:i},!0)})}function a(e,t){t&&self.lastQueries.unshift(e)>5&&(self.lastQueries.length=5),self.postMessage(e.result),self.search&&self.search!=e.search?s():delete self.search}self.importScripts("dblib.js"),self.onmessage=e=>{e.data&&""!==e.data.q&&(e.data.q=dbutil.canonize(e.data.q).trim(),self.search?self.search=e.data:(self.search=e.data,s()))},self.lastQueries=[],self.lastTrigrams=[]},3:function(e,t){var r=function(e,t){return e<t};function o(e,t,r){const o=e[t];e[t]=e[r],e[r]=o}function n(e,t,r,n,s){const a=e[n];o(e,n,r);for(var i=t,u=t;u<r;u+=1)s(e[u],a)&&(o(e,i,u),i+=1);return o(e,r,i),i}e.exports=function(e,t,o){var s=o||r;return e.length<t?(console.log("array too small."),e):e.length==t?e:(function(e,t,r){for(var o=0,s=e.length-1;;){if(o==s)return o;var a=o+Math.floor((s-o)/2);if(t==(a=n(e,o,s,a,r)))return t;t<a?s=a-1:o=a+1}}(e,t,s)!=t&&console.log("warning: could not complete quickselect"),e)}}});