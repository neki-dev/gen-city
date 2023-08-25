(()=>{"use strict";var t={895:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Building=void 0,e.Building=class{constructor(t){if(4!==t.length)throw Error("Invalid building vertices");this.vertices=t;const e=this.vertices.map((t=>t.x)),i=this.vertices.map((t=>t.y));this.position={x:Math.min(...e),y:Math.min(...i)},this.width=Math.max(...e)-this.position.x+1,this.height=Math.max(...i)-this.position.y+1}}},863:function(t,e,i){var n=this&&this.__awaiter||function(t,e,i,n){return new(i||(i=Promise))((function(s,r){function o(t){try{a(n.next(t))}catch(t){r(t)}}function h(t){try{a(n.throw(t))}catch(t){r(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,h)}a((n=n.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.City=void 0;const s=i(82),r=i(792),o=i(309),h=i(679),a=i(895);e.City=class{constructor({width:t,height:e}){this.seed=null,this.matrix=[],this.nodes=[],this.gauge=1,this.params={},this.width=t,this.height=e}getMatrix(){return this.matrix}getSeed(){return this.seed}getAllBuildings(){return this.getAllPaths().map((t=>t.getBuildings())).flat()}getBuildingAt(t){const e=this.getAt(t);return e instanceof a.Building?e:null}getAllNodes(){return this.nodes}getNodeAt(t){const e=this.getAt(t);return e instanceof r.Node?e:null}getAllPaths(){return this.nodes.map((t=>t.getOutputPaths())).flat()}getPathAt(t){const e=this.getAt(t);return e instanceof s.Path?e:null}getAt(t){var e,i;return null===(i=null===(e=this.matrix)||void 0===e?void 0:e[t.y])||void 0===i?void 0:i[t.x]}markAt(t,e){this.matrix[t.y][t.x]=e}isEmptyAt(t){return null===this.getAt(t)}generate(t={}){var e;return n(this,void 0,void 0,(function*(){this.reset(),this.params=Object.assign({mode:o.CityGenerationMode.RUNTIME,seed:[],startPosition:{x:Math.round(this.width/2),y:Math.round(this.height/2)},startDirections:[0,90,180,270],streetMinLength:0,buildingMinSize:3,buildingMaxSize:6,buildingMinSpace:1,buildingMaxSpace:3,probabilityIntersection:.1,probabilityTurn:.05,probabilityStreetEnd:.001},t),this.params.mode===o.CityGenerationMode.SEED&&(this.seed=null!==(e=this.params.seed)&&void 0!==e?e:(0,h.generateSeed)());const i=this.addNode(this.params.startPosition);this.markAt(this.params.startPosition,i),this.params.startDirections.forEach((t=>{i.addOutputPath(t)})),this.generatePaths(),this.generateBuildings()}))}reset(){for(let t=0;t<this.height;t++){this.matrix[t]=[];for(let e=0;e<this.width;e++)this.matrix[t][e]=null}this.seed=null,this.gauge=1,this.nodes=[]}generatePaths(){const t=()=>{const e=this.getAllPaths();for(let t=0,i=e.length;t<i;t++)this.processingPath(e[t]);e.every((t=>t.isCompleted()))||t()};t()}processingPath(t){if(t.isCompleted())return;const e=t.getNextCursor();if(void 0===this.getAt(e)||this.variability(this.params.probabilityStreetEnd))return void this.closePath(t);const i=this.getCross(t);if(null==i?void 0:i.tile){let e=null;return i.tile instanceof r.Node?e=i.tile:i.tile instanceof s.Path&&(e=this.splitPath(i.tile,i.position)),void(e&&t.setNodeEnd(e))}t.setCursor(e),this.markAt(t.getCursor(),t);const n=this.params.streetMinLength;t.getLength()>n&&!this.getCross(t,n)&&(this.variability(this.params.probabilityIntersection)?this.forkPath(t):this.variability(this.params.probabilityTurn)&&this.turnPath(t))}generateBuildings(){this.getAllPaths().forEach((t=>{const e=(0,h.getShift)(t.direction),i=t.getNodeBeg().position.x+e.x,n=t.getNodeBeg().position.y+e.y;(0,h.turnDirection)(t.direction).forEach((e=>{let s=0;for(;t.getLength()>s;){const r=(0,h.getShift)(t.direction,s),o=(0,h.getShift)(e),a={x:i+r.x+o.x,y:n+r.y+o.y},u=[(0,h.randomRange)(this.params.buildingMinSize,this.params.buildingMaxSize),(0,h.randomRange)(this.params.buildingMinSize,this.params.buildingMaxSize)];if(s+u[0]>t.getLength())break;this.processingBuilding(t,a,u,[t.direction,e]);const d=(0,h.randomRange)(this.params.buildingMinSpace,this.params.buildingMaxSpace);s+=u[0]+d}}))}))}processingBuilding(t,e,i,n){const s=[],r=[];for(let t=0;t<i[0];t++){const o=(0,h.getShift)(n[0],t),a={x:e.x+o.x,y:e.y+o.y};for(let e=0;e<i[1];e++){const o=(0,h.getShift)(n[1],e),u={x:a.x+o.x,y:a.y+o.y};if(!this.isEmptyAt(u))return;s.push(u),0!==t&&t!==i[0]-1||0!==e&&e!==i[1]-1||r.push(u)}}const o=t.addBuilding(r);s.forEach((t=>{this.markAt(t,o)}))}addNode(t){const e=new r.Node(this.nodes.length,t);return this.nodes.push(e),e}closePath(t){const e=t.getCursor(),i=this.addNode(e);return t.setNodeEnd(i),this.markAt(e,i),i}forkPath(t){let e=(0,h.forkDirection)(t.direction).sort((()=>this.variability(.5)?1:-1));if(e=this.filterDirections(t,e),0===e.length||1===e.length&&e[0]===t.direction)return;const i=this.closePath(t);for(let t=0;t<e.length;t++)(t<2||this.variability(.5))&&i.addOutputPath(e[t]);this.markAt(i.position,i)}turnPath(t){let e=(0,h.turnDirection)(t.direction).sort((()=>this.variability(.5)?1:-1));if(e=this.filterDirections(t,e),0===e.length)return;const i=this.closePath(t);i.addOutputPath(e[0]),this.markAt(i.position,i)}splitPath(t,e){const i=this.addNode(e),n=i.addOutputPath(t.direction);this.markAt(e,i);const r=t.getNodeEnd();return r?n.setNodeEnd(r):n.setCursor(t.getCursor()),n.each((t=>{this.getAt(t)instanceof s.Path&&this.markAt(t,n)})),t.setNodeEnd(i),i}getCross(t,e=1){const i=t.getCursor();for(let n=1;n<=e;n++){const e=(0,h.getShift)(t.direction,n),s={x:i.x+e.x,y:i.y+e.y};if(!this.isEmptyAt(s))return{tile:this.getAt(s),position:s}}return null}filterDirections(t,e){return e.filter((e=>{const i=(0,h.getShift)(e),n=t.getCursor(),s={x:n.x+i.x,y:n.y+i.y};return this.isEmptyAt(s)}))}variability(t){if(!this.seed)return(0,h.randomChance)(t);const e=this.seed[this.gauge%this.seed.length];return this.gauge++,e/1e3>=1-t}}},465:function(t,e,i){var n=this&&this.__createBinding||(Object.create?function(t,e,i,n){void 0===n&&(n=i);var s=Object.getOwnPropertyDescriptor(e,i);s&&!("get"in s?!e.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return e[i]}}),Object.defineProperty(t,n,s)}:function(t,e,i,n){void 0===n&&(n=i),t[n]=e[i]}),s=this&&this.__exportStar||function(t,e){for(var i in t)"default"===i||Object.prototype.hasOwnProperty.call(e,i)||n(e,t,i)};Object.defineProperty(e,"__esModule",{value:!0}),s(i(863),e),s(i(309),e)},792:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Node=void 0;const n=i(82),s=i(309);e.Node=class{constructor(t,e){this.outputPaths=[],this.inputPaths=[],this.id=t,this.position=e}addOutputPath(t){const e=new n.Path(this,t);return this.outputPaths.push(e),e}getOutputPaths(){return this.outputPaths}addInputPath(t){const e=t.getNodeEnd();e&&e.removeInputPath(t),this.inputPaths.push(t)}removeInputPath(t){const e=this.inputPaths.indexOf(t);-1!==e&&this.inputPaths.splice(e,1)}getInputPaths(){return this.inputPaths}getAllPaths(){return this.outputPaths.concat(this.inputPaths)}getType(){const t=this.outputPaths.length+this.inputPaths.length;return 2===t?s.NodeType.TURN:1===t?s.NodeType.END:s.NodeType.CROSS}}},82:(t,e,i)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Path=void 0;const n=i(679),s=i(895);e.Path=class{constructor(t,e){this.buildings=[],this.nodeEnd=null,this.direction=e,this.nodeBeg=t,this.cursor=t.position}getBuildings(){return this.buildings}getPositions(){var t,e;return{beg:this.nodeBeg.position,end:null!==(e=null===(t=this.nodeEnd)||void 0===t?void 0:t.position)&&void 0!==e?e:this.cursor}}isCompleted(){return Boolean(this.nodeEnd)}getNextCursor(){const t=(0,n.getShift)(this.direction);return{x:this.cursor.x+t.x,y:this.cursor.y+t.y}}getCursor(){return this.cursor}setCursor(t){this.cursor=t}getNodeBeg(){return this.nodeBeg}getNodeEnd(){return this.nodeEnd}setNodeEnd(t){t.addInputPath(this),this.nodeEnd=t,this.cursor=t.position}addBuilding(t){const e=new s.Building(t);return this.buildings.push(e),e}getLength(){return Math.hypot(this.nodeBeg.position.x-this.cursor.x,this.nodeBeg.position.y-this.cursor.y)}each(t){const e=(0,n.getShift)(this.direction),i=this.getLength(),s=Object.assign({},this.nodeBeg.position);for(let n=0;n<i;n++)t(s),s.x+=e.x,s.y+=e.y}}},309:(t,e)=>{var i,n;Object.defineProperty(e,"__esModule",{value:!0}),e.NodeType=e.CityGenerationMode=void 0,function(t){t.RUNTIME="RUNTIME",t.SEED="SEED"}(i||(e.CityGenerationMode=i={})),function(t){t.TURN="TURN",t.CROSS="CROSS",t.END="END"}(n||(e.NodeType=n={}))},679:(t,e)=>{function i(t){return t*(Math.PI/180)}function n(t){return[(t+90)%360,(t-90)%360]}Object.defineProperty(e,"__esModule",{value:!0}),e.between=e.getShift=e.forkDirection=e.turnDirection=e.degToRad=e.generateSeed=e.randomRange=e.randomItem=e.randomChance=void 0,e.randomChance=function(t){return Math.random()>1-t},e.randomItem=function(t){return t[Math.floor(Math.random()*t.length)]},e.randomRange=function(t,e){return Math.floor(t+Math.random()*(e-t+1))},e.generateSeed=function(t=32){const e=[];for(let i=0;i<t;i++)e.push(Math.round(1e3*Math.random()));return e},e.degToRad=i,e.turnDirection=n,e.forkDirection=function(t){return[t].concat(n(t))},e.getShift=function(t,e=1){return{x:Math.round(Math.cos(i(t)))*e,y:Math.round(Math.sin(i(t)))*e}},e.between=function(t,e){return t>=e[0]&&t<=e[1]}}},e={},i=function i(n){var s=e[n];if(void 0!==s)return s.exports;var r=e[n]={exports:{}};return t[n].call(r.exports,r,r.exports,i),r.exports}(465);module.exports=i})();