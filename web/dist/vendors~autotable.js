(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{198:function(t,e,o){
/*!
 * 
 *             jsPDF AutoTable plugin v3.1.1
 *             
 *             Copyright (c) 2014 Simon Bengtsson, https://github.com/simonbengtsson/jsPDF-AutoTable
 *             Licensed under the MIT License.
 *             http://opensource.org/licenses/mit-license
 *             
 *             * /if (typeof window === 'object') window.jspdfAutoTableVersion = '" + newVersion + "';/*"
 *         
 */
var n;window,n=function(t){return function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=5)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n,r=null,a=null;e.globalDefaults={},e.documentDefaults={},e.default=function(){return a},e.getGlobalOptions=function(){return e.globalDefaults},e.getDocumentOptions=function(){return e.documentDefaults};var l=function(){function t(t){this.doc=t}return t.prototype.pageHeight=function(){return this.pageSize().height},t.prototype.pageWidth=function(){return this.pageSize().width},t.prototype.pageSize=function(){var t=this.doc.internal.pageSize;return null==t.width&&(t={width:t.getWidth(),height:t.getHeight()}),t},t.prototype.scaleFactor=function(){return this.doc.internal.scaleFactor},t.prototype.pageNumber=function(){return this.doc.internal.getCurrentPageInfo().pageNumber},t}();e.setupState=function(t){n=a,a=new l(t),t!==r&&(r=t,e.documentDefaults={})},e.resetState=function(){a=n},e.setDefaults=function(t,o){void 0===o&&(o=null),o?(e.documentDefaults=t||{},r=o):e.globalDefaults=t||{}}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(2),r=o(0),a=o(3);function l(t,e){var o=e.fontSize/r.default().scaleFactor();s(e),t=Array.isArray(t)?t:[t];var n=0;t.forEach(function(t){var e=r.default().doc.getStringUnitWidth(t);e>n&&(n=e)});var a=1e4*r.default().scaleFactor();return(n=Math.floor(n*a)/a)*o}function i(t){var e=t.lineWidth>0,o=t.fillColor||0===t.fillColor;return e&&o?"DF":e?"S":!!o&&"F"}function s(t){var e=r.default().doc,o={fillColor:e.setFillColor,textColor:e.setTextColor,fontStyle:e.setFontStyle,lineColor:e.setDrawColor,lineWidth:e.setLineWidth,font:e.setFont,fontSize:e.setFontSize};Object.keys(o).forEach(function(e){var n=t[e],r=o[e];void 0!==n&&(Array.isArray(n)?r.apply(this,n):r(n))})}e.getStringWidth=l,e.ellipsize=function t(e,o,n,a){if(void 0===a&&(a="..."),Array.isArray(e)){var i=[];return e.forEach(function(e,r){i[r]=t(e,o,n,a)}),i}var s=1e4*r.default().scaleFactor();if((o=Math.ceil(o*s)/s)>=l(e,n))return e;for(;o<l(e+a,n)&&!(e.length<=1);)e=e.substring(0,e.length-1);return e.trim()+a},e.addTableBorder=function(){var t=r.default().table,e={lineWidth:t.settings.tableLineWidth,lineColor:t.settings.tableLineColor};s(e);var o=i(e);o&&r.default().doc.rect(t.pageStartX,t.pageStartY,t.width,t.cursor.y-t.pageStartY,o)},e.getFillStyle=i,e.applyUserStyles=function(){s(r.default().table.userStyles)},e.applyStyles=s,e.marginOrPadding=function(t,e){var o={};if(Array.isArray(t))t.length>=4?o={top:t[0],right:t[1],bottom:t[2],left:t[3]}:3===t.length?o={top:t[0],right:t[1],bottom:t[2],left:t[1]}:2===t.length?o={top:t[0],right:t[1],bottom:t[0],left:t[1]}:t=1===t.length?t[0]:e;else if("object"==typeof t){t.vertical&&(t.top=t.vertical,t.bottom=t.vertical),t.horizontal&&(t.right=t.horizontal,t.left=t.horizontal);for(var n=0,r=["top","right","bottom","left"];n<r.length;n++){var a=r[n];o[a]=t[a]||0===t[a]?t[a]:e}}return"number"==typeof t&&(o={top:t,right:t,bottom:t,left:t}),o},e.styles=function(t){return t=Array.isArray(t)?t:[t],a.assign.apply(void 0,[n.defaultStyles()].concat(t))}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.FONT_ROW_RATIO=1.15;var n=o(0);e.defaultConfig=function(){return{html:null,head:null,body:null,foot:null,includeHiddenHtml:!1,startY:null,margin:40/n.default().scaleFactor(),pageBreak:"auto",rowPageBreak:"auto",tableWidth:"auto",showHead:"everyPage",showFoot:"everyPage",tableLineWidth:0,tableLineColor:200,tableId:null,theme:"striped",useCss:!1,styles:{},headStyles:{},bodyStyles:{},footStyles:{},alternateRowStyles:{},columnStyles:{},didParseCell:function(t){},willDrawCell:function(t){},didDrawCell:function(t){},didDrawPage:function(t){}}},e.defaultStyles=function(){return{font:"helvetica",fontStyle:"normal",overflow:"linebreak",fillColor:!1,textColor:20,halign:"left",valign:"top",fontSize:10,cellPadding:5/n.default().scaleFactor(),lineColor:200,lineWidth:0/n.default().scaleFactor(),cellWidth:"auto",minCellHeight:0}},e.getTheme=function(t){return{striped:{table:{fillColor:255,textColor:80,fontStyle:"normal"},head:{textColor:255,fillColor:[41,128,185],fontStyle:"bold"},body:{},foot:{textColor:255,fillColor:[41,128,185],fontStyle:"bold"},alternateRow:{fillColor:245}},grid:{table:{fillColor:255,textColor:80,fontStyle:"normal",lineWidth:.1},head:{textColor:255,fillColor:[26,188,156],fontStyle:"bold",lineWidth:0},body:{},foot:{textColor:255,fillColor:[26,188,156],fontStyle:"bold",lineWidth:0},alternateRow:{}},plain:{head:{fontStyle:"bold"},foot:{fontStyle:"bold"}}}[t]}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.assign=function(t){for(var e=[],o=1;o<arguments.length;o++)e[o-1]=arguments[o];if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var n=Object(t),r=1;r<arguments.length;r++){var a=arguments[r];if(null!=a)for(var l in a)Object.prototype.hasOwnProperty.call(a,l)&&(n[l]=a[l])}return n}},function(e,o){e.exports=t},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(6),r=o(7),a=o(8),l=o(0);o(15);var i=o(1),s=o(4);s.API.autoTable=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];l.setupState(this);var o=a.parseInput(t);return r.calculateWidths(o),n.drawTable(o),o.finalY=o.cursor.y,this.previousAutoTable=o,this.lastAutoTable=o,this.autoTable.previous=o,i.applyUserStyles(),l.resetState(),this},s.API.lastAutoTable=!1,s.API.previousAutoTable=!1,s.API.autoTable.previous=!1,s.API.autoTableSetDefaults=function(t){return l.setDefaults(t,this),this},s.autoTableSetDefaults=function(t,e){return l.setDefaults(t,e),this},s.API.autoTableHtmlToJson=function(t,e){if(console.error("Use of deprecated function: autoTableHtmlToJson. Use html option instead."),e=e||!1,!(t&&t instanceof HTMLTableElement))return console.error("A HTMLTableElement has to be sent to autoTableHtmlToJson"),null;for(var o={},n=[],r=t.rows[0],a=0;a<r.cells.length;a++){var l=r.cells[a],i=window.getComputedStyle(l);(e||"none"!==i.display)&&(o[a]=l)}var s=function(r){var a=t.rows[r],l=window.getComputedStyle(a);if(e||"none"!==l.display){var i=[];Object.keys(o).forEach(function(t){var e=a.cells[t];i.push(e)}),n.push(i)}};for(a=1;a<t.rows.length;a++)s(a);return{columns:Object.keys(o).map(function(t){return o[t]}),rows:n,data:n}},s.API.autoTableEndPosY=function(){console.error("Use of deprecated function: autoTableEndPosY. Use doc.previousAutoTable.finalY instead.");var t=this.previousAutoTable;return t.cursor&&"number"==typeof t.cursor.y?t.cursor.y:0},s.API.autoTableAddPageContent=function(t){return console.error("Use of deprecated function: autoTableAddPageContent. Use jsPDF.autoTableSetDefaults({didDrawPage: () => {}}) instead."),s.API.autoTable.globalDefaults||(s.API.autoTable.globalDefaults={}),s.API.autoTable.globalDefaults.addPageContent=t,this},s.API.autoTableAddPage=function(){return console.error("Use of deprecated function: autoTableAddPage. Use doc.addPage()"),this.addPage(),this}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(2),r=o(1),a=o(0);function l(t){var e=a.default().table;e.cursor.x=e.margin("left"),t.y=e.cursor.y,t.x=e.cursor.x,e.cursor.x=e.margin("left"),t.y=e.cursor.y,t.x=e.cursor.x;for(var o=0,n=e.columns;o<n.length;o++){var l=n[o],i=t.cells[l.dataKey];if(i)if(r.applyStyles(i.styles),i.x=e.cursor.x,i.y=t.y,"top"===i.styles.valign?i.textPos.y=e.cursor.y+i.padding("top"):"bottom"===i.styles.valign?i.textPos.y=e.cursor.y+i.height-i.padding("bottom"):i.textPos.y=e.cursor.y+i.height/2,"right"===i.styles.halign?i.textPos.x=i.x+i.width-i.padding("right"):"center"===i.styles.halign?i.textPos.x=i.x+i.width/2:i.textPos.x=i.x+i.padding("left"),!1!==e.callCellHooks(e.cellHooks.willDrawCell,i,t,l)){var s=r.getFillStyle(i.styles);s&&a.default().doc.rect(i.x,e.cursor.y,i.width,i.height,s),a.default().doc.autoTableText(i.text,i.textPos.x,i.textPos.y,{halign:i.styles.halign,valign:i.styles.valign,maxWidth:i.width-i.padding("left")-i.padding("right")}),e.callCellHooks(e.cellHooks.didDrawCell,i,t,l),e.cursor.x+=l.width}else e.cursor.x+=l.width;else e.cursor.x+=l.width}e.cursor.y+=t.height}function i(){var t=a.default().table;r.applyUserStyles(),!0!==t.settings.showFoot&&"everyPage"!==t.settings.showFoot||t.foot.forEach(function(t){return l(t)}),t.finalY=t.cursor.y,t.callEndPageHooks(),r.addTableBorder(),s(a.default().doc),t.pageNumber++,t.cursor={x:t.margin("left"),y:t.margin("top")},t.pageStartX=t.cursor.x,t.pageStartY=t.cursor.y,!0!==t.settings.showHead&&"everyPage"!==t.settings.showHead||t.head.forEach(function(t){return l(t)})}function s(t){var e=a.default().pageNumber();t.setPage(e+1),a.default().pageNumber()===e&&t.addPage()}e.drawTable=function(t){var e=t.settings;t.cursor={x:t.margin("left"),y:null==e.startY?t.margin("top"):e.startY};var o=e.startY+t.margin("bottom")+t.headHeight+t.footHeight;"avoid"===e.pageBreak&&(o+=t.height),("always"===e.pageBreak||null!=e.startY&&!1!==e.startY&&o>a.default().pageHeight())&&(s(a.default().doc),t.cursor.y=t.margin("top")),t.pageStartX=t.cursor.x,t.pageStartY=t.cursor.y,t.startPageNumber=a.default().pageNumber(),r.applyUserStyles(),!0!==e.showHead&&"firstPage"!==e.showHead&&"everyPage"!==e.showHead||t.head.forEach(function(t){return l(t)}),r.applyUserStyles(),t.body.forEach(function(e,o){!function t(e,o){var r=0,s={},u=a.default().table,d=function(t){var e=a.default().table,o=e.margin("bottom"),n=e.settings.showFoot;return(!0===n||"everyPage"===n||"lastPage"===n&&t)&&(o+=e.footHeight),a.default().pageHeight()-e.cursor.y-o}(o);if(d<e.maxCellHeight)if(d<function(t){return a.default().table.columns.reduce(function(e,o){var r=t.cells[o.dataKey];if(!r)return 0;var l=r.styles.fontSize/a.default().scaleFactor()*n.FONT_ROW_RATIO,i=r.padding("vertical"),s=i+l;return s>e?s:e},0)}(e)||"avoid"===u.settings.rowPageBreak&&!function(t){var e=a.default().table,o=a.default().pageHeight()-e.margin("top")-e.margin("bottom");return t.maxCellHeight>o}(e))i();else{e.spansMultiplePages=!0;for(var c=0;c<u.columns.length;c++){var f=u.columns[c],h=e.cells[f.dataKey];if(h){var g=h.styles.fontSize/a.default().scaleFactor()*n.FONT_ROW_RATIO,p=h.padding("vertical"),y=Math.floor((d-p)/g);if(Array.isArray(h.text)&&h.text.length>y){s[f.dataKey]=h.text.splice(y,h.text.length);var b=h.height-d;b>r&&(r=b)}h.height=Math.min(d,h.height)}}}if(l(e),Object.keys(s).length>0){for(var v=0,c=0;c<u.columns.length;c++){var m=u.columns[c],h=e.cells[m.dataKey];h&&(h.height=r,h.height>v&&(v=h.height),h&&(h.text=s[m.dataKey]||""))}i(),e.pageNumber++,e.height=r,e.maxCellHeight=v,t(e,o)}}(e,o===t.body.length-1)}),r.applyUserStyles(),!0!==e.showFoot&&"lastPage"!==e.showFoot&&"everyPage"!==e.showFoot||t.foot.forEach(function(t){return l(t)}),r.addTableBorder(),t.callEndPageHooks()},e.addPage=i},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(2),r=o(1),a=o(0);e.calculateWidths=function(t){10/a.default().scaleFactor()*t.columns.length>t.width?console.error("Columns could not fit on page"):t.minWidth>t.width&&console.error("Column widths to wide and can't fit page"),function t(e,o,n){for(var r=0;r<e.length;r++){var l=e[r],i=l.wrappedWidth/n,s=o*i,u=l.wrappedWidth+s;if(!(u>=l.minWidth)){l.width=l.minWidth+1/a.default().scaleFactor(),n-=l.wrappedWidth,e.splice(r,1),t(e,o,n);break}l.width=u}}(t.columns.slice(0),t.width-t.wrappedWidth,t.wrappedWidth),function(t){for(var e=t.allRows(),o=0;o<e.length;o++)for(var n=e[o],r=null,a=0,l=0,i=0;i<t.columns.length;i++){var s=t.columns[i],u=null;if((l-=1)>1&&t.columns[i+1])a+=s.width,delete n.cells[s.dataKey];else{if(r)u=r,delete n.cells[s.dataKey],r=null;else{if(!(u=n.cells[s.dataKey]))continue;if(l=u.colSpan,a=0,u.colSpan>1){r=u,a+=s.width;continue}}u.width=s.width+a}}}(t),function(t){for(var e={count:0,height:0},o=0,l=t.allRows();o<l.length;o++){for(var i=l[o],s=0,u=t.columns;s<u.length;s++){var d=u[s],c=i.cells[d.dataKey];if(c){r.applyStyles(c.styles);var f=c.width-c.padding("horizontal");"linebreak"===c.styles.overflow?c.text=a.default().doc.splitTextToSize(c.text,f+1/(a.default().scaleFactor()||1),{fontSize:c.styles.fontSize}):"ellipsize"===c.styles.overflow?c.text=r.ellipsize(c.text,f,c.styles):"hidden"===c.styles.overflow?c.text=r.ellipsize(c.text,f,c.styles,""):"function"==typeof c.styles.overflow&&(c.text=c.styles.overflow(c.text,f));var h=Array.isArray(c.text)?c.text.length:1,g=c.styles.fontSize/a.default().scaleFactor()*n.FONT_ROW_RATIO;c.contentHeight=h*g+c.padding("vertical"),c.styles.minCellHeight>c.contentHeight&&(c.contentHeight=c.styles.minCellHeight);var p=c.contentHeight/c.rowSpan;c.rowSpan>1&&e.count*e.height<p*c.rowSpan?e={height:p,count:c.rowSpan}:e&&e.count>0&&e.height>p&&(p=e.height),p>i.height&&(i.height=p,i.maxCellHeight=p,i.maxCellLineCount=h)}}e.count--}}(t),function(t){for(var e={},o=1,n=t.allRows(),r=0;r<n.length;r++){for(var a=n[r],l=0,i=t.columns;l<i.length;l++){var s=i[l],u=e[s.dataKey];if(o>1)o--,delete a.cells[s.dataKey];else if(u)u.cell.height+=a.height,u.cell.height>a.maxCellHeight&&(u.row.maxCellHeight=u.cell.height,u.row.maxCellLineCount=Array.isArray(u.cell.text)?u.cell.text.length:1),o=u.cell.colSpan,delete a.cells[s.dataKey],u.left--,u.left<=1&&delete e[s.dataKey];else{var d=a.cells[s.dataKey];if(!d)continue;if(d.height=a.height,d.rowSpan>1){var c=n.length-r,f=d.rowSpan>c?c:d.rowSpan;e[s.dataKey]={cell:d,left:f,row:a}}}}"head"===a.section&&(t.headHeight+=a.maxCellHeight),"foot"===a.section&&(t.footHeight+=a.maxCellHeight),t.height+=a.height}}(t)}},function(t,e,o){"use strict";var n=this&&this.__assign||function(){return(n=Object.assign||function(t){for(var e,o=1,n=arguments.length;o<n;o++)for(var r in e=arguments[o])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)};Object.defineProperty(e,"__esModule",{value:!0});var r=o(9),a=o(2),l=o(12),i=o(3),s=o(1),u=o(0),d=o(14);function c(t,e,o){var n=u.default().table,r=a.getTheme(n.settings.theme),l=[r.table,r[t],n.styles.styles,n.styles[t+"Styles"]],s="body"===t&&n.styles.columnStyles[e]||{},d="body"===t&&o%2==0?i.assign({},r.alternateRow,n.styles.alternateRowStyles):{};return i.assign.apply(void 0,[a.defaultStyles()].concat(l.concat([d,s])))}e.parseInput=function(t){var e=function(t){if(1===t.length)return t[0];var e=t[2]||{};return e.body=t[1],e.columns=t[0],e.columns.forEach(function(t){null==t.header&&(t.header=t.title)}),e}(t),o=[u.getGlobalOptions(),u.getDocumentOptions(),e];d.default(o);var f=new r.Table;u.default().table=f,f.id=e.tableId;var h=u.default().doc;f.userStyles={textColor:h.getTextColor?h.getTextColor():0,fontSize:h.internal.getFontSize(),fontStyle:h.internal.getFont().fontStyle,font:h.internal.getFont().fontName};for(var g=function(t){var e=o.map(function(e){return e[t]||{}});f.styles[t]=i.assign.apply(void 0,[{}].concat(e))},p=0,y=Object.keys(f.styles);p<y.length;p++)g(y[p]);for(var b=0,v=o;b<v.length;b++)for(var m=v[b],w=0,S=Object.keys(f.cellHooks);w<S.length;w++){var P=S[w];m&&"function"==typeof m[P]&&(f.cellHooks[P].push(m[P]),delete m[P])}f.settings=i.assign.apply(void 0,[{},a.defaultConfig()].concat(o)),f.settings.margin=s.marginOrPadding(f.settings.margin,a.defaultConfig().margin),"auto"===f.settings.theme&&(f.settings.theme=f.settings.useCss?"plain":"striped"),!1===f.settings.startY&&delete f.settings.startY;var C=u.default().doc.previousAutoTable,x=C&&C.startPageNumber+C.pageNumber-1===u.default().pageNumber();null==f.settings.startY&&x&&(f.settings.startY=C.finalY+20/u.default().scaleFactor());var W={};return f.settings.html&&(W=l.parseHtml(f.settings.html,f.settings.includeHiddenHtml,f.settings.useCss)||{}),f.settings.head=W.head||f.settings.head||[],f.settings.body=W.body||f.settings.body||[],f.settings.foot=W.foot||f.settings.foot||[],function(t){var e=t.settings;t.columns=function(t){if(t.columns)return t.columns.map(function(t,e){var o=t.dataKey||t.key||e,n=null!=t?t:e;return new r.Column(o,n,e)});var e=n({},t.head[0],t.body[0],t.foot[0]);delete e._element;var o=Object.keys(e);return o.map(function(t){return new r.Column(t,t,t)})}(e);for(var o=function(o){var n={},a=e[o];if(0===a.length&&e.columns){var l={};t.columns.forEach(function(t){var e=t.raw;if("head"===o){var n="object"==typeof e?e.header:e;n&&(l[t.dataKey]=n)}else"foot"===o&&e.footer&&(l[t.dataKey]=e.footer)}),Object.keys(l).length&&a.push(l)}a.forEach(function(e,a){var l=0,i=new r.Row(e,a,o);t[o].push(i);for(var s=0,u=0,d=0,f=t.columns;d<f.length;d++){var h=f[d];if(null==n[h.dataKey]||0===n[h.dataKey].left)if(0===u){var g=void 0;g=Array.isArray(e)?e[h.dataKey-s-l]:e[h.dataKey];var p=c(o,h.dataKey,a),y=new r.Cell(g,p,o);i.cells[h.dataKey]=y,t.callCellHooks(t.cellHooks.didParseCell,y,i,h),u=y.colSpan-1,n[h.dataKey]={left:y.rowSpan-1,times:u}}else u--,s++;else n[h.dataKey].left--,u=n[h.dataKey].times,l++}})},a=0,l=["head","body","foot"];a<l.length;a++){var i=l[a];o(i)}t.allRows().forEach(function(e){for(var o=0,n=t.columns;o<n.length;o++){var r=n[o],a=e.cells[r.dataKey];a&&1===a.colSpan&&(a.wrappedWidth>r.wrappedWidth&&(r.wrappedWidth=a.wrappedWidth),a.minWidth>r.minWidth&&(r.minWidth=a.minWidth))}})}(f),f.minWidth=f.columns.reduce(function(t,e){return t+e.minWidth},0),f.wrappedWidth=f.columns.reduce(function(t,e){return t+e.wrappedWidth},0),"number"==typeof f.settings.tableWidth?f.width=f.settings.tableWidth:"wrap"===f.settings.tableWidth?f.width=f.wrappedWidth:f.width=u.default().pageWidth()-f.margin("left")-f.margin("right"),f}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(2),r=o(0),a=o(10),l=o(1),i=o(11),s=function(){return function(){this.didParseCell=[],this.willDrawCell=[],this.didDrawCell=[],this.didDrawPage=[]}}(),u=function(){function t(){this.columns=[],this.head=[],this.body=[],this.foot=[],this.height=0,this.width=0,this.preferredWidth=0,this.wrappedWidth=0,this.minWidth=0,this.headHeight=0,this.footHeight=0,this.startPageNumber=1,this.pageNumber=1,this.styles={styles:{},headStyles:{},bodyStyles:{},footStyles:{},alternateRowStyles:{},columnStyles:{}},this.cellHooks=new s}return Object.defineProperty(t.prototype,"pageCount",{get:function(){return this.pageNumber},enumerable:!0,configurable:!0}),t.prototype.allRows=function(){return this.head.concat(this.body).concat(this.foot)},t.prototype.callCellHooks=function(t,e,o,n){for(var r=0,l=t;r<l.length;r++){if(!1===(0,l[r])(new a.CellHookData(e,o,n)))return!1}return!0},t.prototype.callEndPageHooks=function(){l.applyUserStyles();for(var t=0,e=this.cellHooks.didDrawPage;t<e.length;t++){(0,e[t])(new a.HookData)}},t.prototype.margin=function(t){return l.marginOrPadding(this.settings.margin,n.defaultConfig().margin)[t]},t}();e.Table=u;var d=function(){function t(t,e,o){this.cells={},this.height=0,this.maxCellLineCount=1,this.maxCellHeight=0,this.pageNumber=1,this.spansMultiplePages=!1,this.raw=t,t._element&&(this.raw=t._element),this.index=e,this.section=o}return Object.defineProperty(t.prototype,"pageCount",{get:function(){return this.pageNumber},enumerable:!0,configurable:!0}),t}();e.Row=d;var c=function(){function t(t,e,o){this.contentWidth=0,this.wrappedWidth=0,this.minWidth=0,this.textPos={},this.height=0,this.width=0,this.rowSpan=t&&t.rowSpan||1,this.colSpan=t&&t.colSpan||1,this.styles=i(e,t&&t.styles||{}),this.section=o;var n="",a=t&&void 0!==t.content?t.content:t;a=null!=a&&null!=a.dataKey?a.title:a;var s="object"==typeof window&&window.HTMLElement&&a instanceof window.HTMLElement;this.raw=s?a:t,n=a&&s?(a.innerText||"").replace(/' '+/g," ").trim():null!=a?""+a:"";if(this.text=n.split(/\r\n|\r|\n/g),this.contentWidth=this.padding("horizontal")+l.getStringWidth(this.text,this.styles),"number"==typeof this.styles.cellWidth)this.minWidth=this.styles.cellWidth,this.wrappedWidth=this.styles.cellWidth;else if("wrap"===this.styles.cellWidth)this.minWidth=this.contentWidth,this.wrappedWidth=this.contentWidth;else{var u=10/r.default().scaleFactor();this.minWidth=this.styles.minCellWidth||u,this.wrappedWidth=this.contentWidth,this.minWidth>this.wrappedWidth&&(this.wrappedWidth=this.minWidth)}}return t.prototype.padding=function(t){var e=l.marginOrPadding(this.styles.cellPadding,l.styles([]).cellPadding);return"vertical"===t?e.top+e.bottom:"horizontal"===t?e.left+e.right:e[t]},t}();e.Cell=c;var f=function(){return function(t,e,o){this.preferredWidth=0,this.minWidth=0,this.wrappedWidth=0,this.width=0,this.dataKey=t,this.raw=e,this.index=o}}();e.Column=f},function(t,e,o){"use strict";var n,r=this&&this.__extends||(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])})(t,e)},function(t,e){function o(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)});Object.defineProperty(e,"__esModule",{value:!0});var a=o(0),l=function(){function t(){var t=a.default().table;this.table=t,this.pageNumber=t.pageNumber,this.settings=t.settings,this.cursor=t.cursor,this.doc=a.default().doc}return Object.defineProperty(t.prototype,"pageCount",{get:function(){return this.pageNumber},enumerable:!0,configurable:!0}),t}();e.HookData=l;var i=function(t){function e(e,o,n){var r=t.call(this)||this;return r.cell=e,r.row=o,r.column=n,r.section=o.section,r}return r(e,t),e}(l);e.CellHookData=i},function(t,e,o){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var n=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable;t.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},o=0;o<10;o++)e["_"+String.fromCharCode(o)]=o;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(t){n[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var o,l,i=function(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}(t),s=1;s<arguments.length;s++){for(var u in o=Object(arguments[s]))r.call(o,u)&&(i[u]=o[u]);if(n){l=n(o);for(var d=0;d<l.length;d++)a.call(o,l[d])&&(i[l[d]]=o[l[d]])}}return i}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(13),r=o(0);function a(t,e,o,a){var l=[];if(!e)return l;for(var i=0;i<e.rows.length;i++){for(var s=e.rows[i],u=[],d=a?n.parseCss(s,r.default().scaleFactor(),["cellPadding","lineWidth","lineColor"]):{},c=0;c<s.cells.length;c++){var f=s.cells[c],h=t.getComputedStyle(f);if(o||"none"!==h.display){var g=a?n.parseCss(f,r.default().scaleFactor()):{};u.push({rowSpan:f.rowSpan,colSpan:f.colSpan,styles:a?g:null,content:f})}}u.length>0&&(o||"none"!==d.display)&&(u._element=s,l.push(u))}return l}e.parseHtml=function(t,e,o){var n;if(void 0===e&&(e=!1),void 0===o&&(o=!1),n="string"==typeof t?window.document.querySelector(t):t){for(var r=a(window,n.tHead,e,o),l=[],i=0;i<n.tBodies.length;i++)l=l.concat(a(window,n.tBodies[i],e,o));return{head:r,body:l,foot:a(window,n.tFoot,e,o)}}console.error("Html table could not be found with input: ",t)}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(1);function r(t,e){var o=function t(e,o){if(!e)return null;var n=window.getComputedStyle(e)[o];return"rgba(0, 0, 0, 0)"===n||"transparent"===n||"initial"===n||"inherit"===n?t(e.parentElement,o):n}(t,e);if(!o)return null;var n=o.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d*))?\)$/);if(!n||!Array.isArray(n))return null;var r=[parseInt(n[1]),parseInt(n[2]),parseInt(n[3])];return 0===parseInt(n[4])||isNaN(r[0])||isNaN(r[1])||isNaN(r[2])?null:r}e.parseCss=function(t,e,o){void 0===o&&(o=[]);var a={},l=window.getComputedStyle(t);function i(t,e,n){void 0===n&&(n=[]),0!==n.length&&-1===n.indexOf(e)||-1!==o.indexOf(t)||(0===e||e)&&(a[t]=e)}return i("fillColor",r(t,"backgroundColor")),i("lineColor",r(t,"borderColor")),i("fontStyle",function(t){var e="";return("bold"===t.fontWeight||"bolder"===t.fontWeight||parseInt(t.fontWeight)>=700)&&(e+="bold"),"italic"!==t.fontStyle&&"oblique"!==t.fontStyle||(e+="italic"),e}(l)),i("textColor",r(t,"color")),i("halign",l.textAlign,["left","right","center","justify"]),i("valign",l.verticalAlign,["middle","bottom","top"]),i("fontSize",parseInt(l.fontSize||"")/(96/72)),i("cellPadding",function(t,e,o,r){if(!t)return null;var a=96/(72/r),l=(parseInt(o)-parseInt(e))/r/2,i=t.split(" ").map(function(t){return parseInt(t)/a});return i=n.marginOrPadding(i,0),l>i.top&&(i.top=l),l>i.bottom&&(i.bottom=l),i}(l.padding,l.fontSize,l.lineHeight,e)),i("lineWidth",parseInt(l.borderWidth||"")/(96/72)/e),i("font",(l.fontFamily||"").toLowerCase()),a}},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=o(1);function r(t){t.rowHeight?(console.error("Use of deprecated style rowHeight. It is renamed to minCellHeight."),t.minCellHeight||(t.minCellHeight=t.rowHeight)):t.columnWidth&&(console.error("Use of deprecated style columnWidth. It is renamed to cellWidth."),t.cellWidth||(t.cellWidth=t.columnWidth))}e.default=function(t){for(var e=function(t){t&&"object"!=typeof t&&console.error("The options parameter should be of type object, is: "+typeof t),void 0!==t.extendWidth&&(t.tableWidth=t.extendWidth?"auto":"wrap",console.error("Use of deprecated option: extendWidth, use tableWidth instead.")),void 0!==t.margins&&(void 0===t.margin&&(t.margin=t.margins),console.error("Use of deprecated option: margins, use margin instead.")),!t.didDrawPage&&(t.afterPageContent||t.beforePageContent||t.afterPageAdd)&&(console.error("The afterPageContent, beforePageContent and afterPageAdd hooks are deprecated. Use didDrawPage instead"),t.didDrawPage=function(e){n.applyUserStyles(),t.beforePageContent&&t.beforePageContent(e),n.applyUserStyles(),t.afterPageContent&&t.afterPageContent(e),n.applyUserStyles(),t.afterPageAdd&&e.pageNumber>1&&e.afterPageAdd(e),n.applyUserStyles()}),["createdHeaderCell","drawHeaderRow","drawRow","drawHeaderCell"].forEach(function(e){t[e]&&console.error('The "'+e+'" hook has changed in version 3.0, check the changelog for how to migrate.')}),[["showFoot","showFooter"],["showHead","showHeader"],["didDrawPage","addPageContent"],["didParseCell","createdCell"],["headStyles","headerStyles"]].forEach(function(e){var o=e[0],n=e[1];t[n]&&(console.error("Use of deprecated option "+n+". Use "+o+" instead"),t[o]=t[n])}),[["padding","cellPadding"],["lineHeight","rowHeight"],"fontSize","overflow"].forEach(function(e){var o="string"==typeof e?e:e[0],n="string"==typeof e?e:e[1];void 0!==t[o]&&(void 0===t.styles[n]&&(t.styles[n]=t[o]),console.error("Use of deprecated option: "+o+", use the style "+n+" instead."))});for(var e=0,o=["styles","bodyStyles","headStyles","footStyles"];e<o.length;e++)r(t[o[e]]||{});for(var a=t.columnStyles||{},l=0,i=Object.keys(a);l<i.length;l++)r(a[i[l]]||{})},o=0,a=t;o<a.length;o++)e(a[o])}},function(t,e,o){o(4).API.autoTableText=function(t,e,o,n){n=n||{};"number"==typeof e&&"number"==typeof o||console.error("The x and y parameters are required. Missing for text: ",t);var r=this.internal.scaleFactor,a=this.internal.getFontSize()/r,l=null,i=1;if("middle"!==n.valign&&"bottom"!==n.valign&&"center"!==n.halign&&"right"!==n.halign||(i=(l="string"==typeof t?t.split(/\r\n|\r|\n/g):t).length||1),o+=a*(2-1.15),"middle"===n.valign?o-=i/2*a*1.15:"bottom"===n.valign&&(o-=i*a*1.15),"center"===n.halign||"right"===n.halign){var s=a;if("center"===n.halign&&(s*=.5),i>=1){for(var u=0;u<l.length;u++)this.text(l[u],e-this.getStringUnitWidth(l[u])*s,o),o+=a;return this}e-=this.getStringUnitWidth(t)*s}return"justify"===n.halign?this.text(t,e,o,{maxWidth:n.maxWidth||100,align:"justify"}):this.text(t,e,o),this}}])},t.exports=n(o(196))}}]);