(()=>{"use strict";var t={895:(t,i)=>{Object.defineProperty(i,"__esModule",{value:!0}),i.Building=void 0,i.Building=class{constructor(t,i){if(4!==i.length)throw Error("Invalid building vertices");this.path=t,this.vertices=i;const e=this.vertices.map((t=>t.x)),s=this.vertices.map((t=>t.y));this.position={x:Math.min(...e),y:Math.min(...s)},this.width=Math.max(...e)-this.position.x+1,this.height=Math.max(...s)-this.position.y+1}remove(){const t=this.path.getBuildings(),i=t.findIndex((t=>t===this));-1!==i&&t.splice(i,1)}each(t){for(let i=0;i<this.width;i++)for(let e=0;e<this.height;e++)t({x:this.position.x+i,y:this.position.y+e})}}},863:function(t,i,e){var s=this&&this.__awaiter||function(t,i,e,s){return new(e||(e=Promise))((function(n,r){function o(t){try{a(s.next(t))}catch(t){r(t)}}function h(t){try{a(s.throw(t))}catch(t){r(t)}}function a(t){var i;t.done?n(t.value):(i=t.value,i instanceof e?i:new e((function(t){t(i)}))).then(o,h)}a((s=s.apply(t,i||[])).next())}))};Object.defineProperty(i,"__esModule",{value:!0}),i.City=void 0;const n=e(82),r=e(792),o=e(309),h=e(679);i.City=class{constructor({width:t,height:i}){this.seed=null,this.matrix=[],this.nodes=[],this.gauge=1,this.params={},this.width=t,this.height=i}getSeed(){return this.seed}getAllBuildings(){return this.getAllPaths().map((t=>t.getBuildings())).flat()}getAllNodes(){return this.nodes}getAllPaths(){return this.nodes.map((t=>t.getOutputPaths())).flat()}generate(t={}){return s(this,void 0,void 0,(function*(){this.reset(),this.params=Object.assign({mode:o.CityGenerationMode.RUNTIME,seed:[],startPosition:{x:Math.round(this.width/2),y:Math.round(this.height/2)},startDirections:[0,90,180,270],streetMinLength:10,buildingMinSize:3,buildingMaxSize:6,buildingMinSpace:1,buildingMaxSpace:3,buildingOffset:0,probabilityIntersection:.1,probabilityTurn:.05,probabilityStreetEnd:.001},t),this.params.mode===o.CityGenerationMode.SEED&&(this.seed=0===this.params.seed.length?(0,h.generateSeed)():this.params.seed);const i=this.addNode(this.params.startPosition);this.markAt(this.params.startPosition,i),this.params.startDirections.forEach((t=>{i.addOutputPath(t)})),this.generatePaths(),this.generateBuildings()}))}reset(){for(let t=0;t<this.height;t++){this.matrix[t]=[];for(let i=0;i<this.width;i++)this.matrix[t][i]=null}this.seed=null,this.gauge=1,this.nodes=[]}generatePaths(){const t=()=>{const i=this.getAllPaths();for(let t=0,e=i.length;t<e;t++)this.processingPath(i[t]);i.every((t=>t.isCompleted()))||t()};t()}processingPath(t){if(t.isCompleted())return;const i=t.getNextCursor();if(void 0===this.getAt(i)||this.variabilityChance(this.params.probabilityStreetEnd))return void this.closePath(t);const e=this.getCross(t);if(null==e?void 0:e.tile){let i=null;return e.tile instanceof r.Node?i=e.tile:e.tile instanceof n.Path&&(i=this.splitPath(e.tile,e.position)),void(i&&t.setNodeEnd(i))}t.setCursor(i),this.markAt(t.getCursor(),t);const s=this.params.streetMinLength;t.getLength()>s&&!this.getCross(t,s)&&(this.variabilityChance(this.params.probabilityIntersection)?this.forkPath(t):this.variabilityChance(this.params.probabilityTurn)&&this.turnPath(t))}generateBuildings(){this.getAllPaths().forEach((t=>{const i=(0,h.getShift)(t.direction),e=t.getNodeBeg().position.x+i.x,s=t.getNodeBeg().position.y+i.y;(0,h.turnDirection)(t.direction).forEach((i=>{let n=this.params.buildingOffset;for(;t.getLength()>n;){const r=(0,h.getShift)(t.direction,n),o=(0,h.getShift)(i,this.params.buildingOffset+1),a={x:e+r.x+o.x,y:s+r.y+o.y},d=[this.variabilityRange(this.params.buildingMinSize,this.params.buildingMaxSize),this.variabilityRange(this.params.buildingMinSize,this.params.buildingMaxSize)];if(n+d[0]+this.params.buildingOffset>t.getLength())break;this.processingBuilding(t,a,d,[t.direction,i]);const u=this.variabilityRange(this.params.buildingMinSpace,this.params.buildingMaxSpace);n+=d[0]+u}}))}))}processingBuilding(t,i,e,s){const n=[],r=[];for(let t=0;t<e[0];t++){const o=(0,h.getShift)(s[0],t),a={x:i.x+o.x,y:i.y+o.y};for(let i=0;i<e[1];i++){const o=(0,h.getShift)(s[1],i),d={x:a.x+o.x,y:a.y+o.y};if(!this.isEmptyAt(d))return;n.push(d),0!==t&&t!==e[0]-1||0!==i&&i!==e[1]-1||r.push(d)}}const o=t.addBuilding(r);n.forEach((t=>{this.markAt(t,o)}))}getAt(t){var i,e;return null===(e=null===(i=this.matrix)||void 0===i?void 0:i[t.y])||void 0===e?void 0:e[t.x]}markAt(t,i){this.matrix[t.y][t.x]=i}isEmptyAt(t){return null===this.getAt(t)}addNode(t,i){const e=new r.Node(this.nodes.length,t);return void 0===i?this.nodes.push(e):this.nodes.splice(i,0,e),e}closePath(t){const i=t.getCursor(),e=this.addNode(i);return t.setNodeEnd(e),this.markAt(i,e),e}forkPath(t){let i=(0,h.forkDirection)(t.direction).sort((()=>this.variabilityChance(.5)?1:-1));if(i=this.filterDirections(t,i),0===i.length||1===i.length&&i[0]===t.direction)return;const e=this.closePath(t);for(let t=0;t<i.length;t++)(t<2||this.variabilityChance(.5))&&e.addOutputPath(i[t]);this.markAt(e.position,e)}turnPath(t){let i=(0,h.turnDirection)(t.direction).sort((()=>this.variabilityChance(.5)?1:-1));if(i=this.filterDirections(t,i),0===i.length)return;const e=this.closePath(t);e.addOutputPath(i[0]),this.markAt(e.position,e)}splitPath(t,i){const e=t.getNodeBeg(),s=this.nodes.findIndex((t=>t===e)),r=this.addNode(i,s+1),o=r.addOutputPath(t.direction);this.markAt(i,r);const h=t.getNodeEnd();return h?o.setNodeEnd(h):o.setCursor(t.getCursor()),o.each((t=>{this.getAt(t)instanceof n.Path&&this.markAt(t,o)})),t.setNodeEnd(r),r}getCross(t,i=1){const e=t.getCursor();for(let s=1;s<=i;s++){const i=(0,h.getShift)(t.direction,s),n={x:e.x+i.x,y:e.y+i.y};if(!this.isEmptyAt(n))return{tile:this.getAt(n),position:n}}return null}filterDirections(t,i){return i.filter((i=>{const e=(0,h.getShift)(i),s=t.getCursor(),n={x:s.x+e.x,y:s.y+e.y};return this.isEmptyAt(n)}))}variabilityChance(t){if(!this.seed)return(0,h.randomChance)(t);const i=this.seed[this.gauge%this.seed.length];return this.gauge++,i/1e3>=1-t}variabilityRange(t,i){if(!this.seed)return(0,h.randomRange)(t,i);const e=this.seed[this.gauge%this.seed.length];return this.gauge++,Math.floor(t+e/1e3*(i-t+1))}}},465:function(t,i,e){var s=this&&this.__createBinding||(Object.create?function(t,i,e,s){void 0===s&&(s=e);var n=Object.getOwnPropertyDescriptor(i,e);n&&!("get"in n?!i.__esModule:n.writable||n.configurable)||(n={enumerable:!0,get:function(){return i[e]}}),Object.defineProperty(t,s,n)}:function(t,i,e,s){void 0===s&&(s=e),t[s]=i[e]}),n=this&&this.__exportStar||function(t,i){for(var e in t)"default"===e||Object.prototype.hasOwnProperty.call(i,e)||s(i,t,e)};Object.defineProperty(i,"__esModule",{value:!0}),n(e(863),i),n(e(895),i),n(e(792),i),n(e(82),i),n(e(309),i)},792:(t,i,e)=>{Object.defineProperty(i,"__esModule",{value:!0}),i.Node=void 0;const s=e(82),n=e(309);i.Node=class{constructor(t,i){this.outputPaths=[],this.inputPaths=[],this.id=t,this.position=i}addOutputPath(t){const i=new s.Path(this,t);return this.outputPaths.push(i),i}removeOutputPath(t){const i=this.outputPaths.indexOf(t);-1!==i&&this.outputPaths.splice(i,1)}getOutputPaths(){return this.outputPaths}addInputPath(t){const i=t.getNodeEnd();i&&i.removeInputPath(t),this.inputPaths.push(t)}removeInputPath(t){const i=this.inputPaths.indexOf(t);-1!==i&&this.inputPaths.splice(i,1)}getInputPaths(){return this.inputPaths}getAllPaths(){return this.outputPaths.concat(this.inputPaths)}getType(){const t=this.outputPaths.length+this.inputPaths.length;return 2===t?n.NodeType.TURN:1===t?n.NodeType.END:n.NodeType.CROSS}}},82:(t,i,e)=>{Object.defineProperty(i,"__esModule",{value:!0}),i.Path=void 0;const s=e(679),n=e(895);i.Path=class{constructor(t,i){this.buildings=[],this.nodeEnd=null,this.direction=i,this.nodeBeg=t,this.cursor=t.position}getBuildings(){return this.buildings}getPositions(){var t,i;return{beg:this.nodeBeg.position,end:null!==(i=null===(t=this.nodeEnd)||void 0===t?void 0:t.position)&&void 0!==i?i:this.cursor}}isCompleted(){return Boolean(this.nodeEnd)}getNextCursor(){const t=(0,s.getShift)(this.direction);return{x:this.cursor.x+t.x,y:this.cursor.y+t.y}}getCursor(){return this.cursor}setCursor(t){this.cursor=t}getNodeBeg(){return this.nodeBeg}getNodeEnd(){return this.nodeEnd}setNodeEnd(t){t.addInputPath(this),this.nodeEnd=t,this.cursor=t.position}addBuilding(t){const i=new n.Building(this,t);return this.buildings.push(i),i}getLength(){const t=this.getPositions();return Math.hypot(t.beg.x-t.end.x,t.beg.y-t.end.y)}remove(){this.nodeBeg.removeOutputPath(this),this.nodeEnd&&this.nodeEnd.removeInputPath(this)}each(t){const i=(0,s.getShift)(this.direction),e=this.getLength(),n=Object.assign({},this.nodeBeg.position);for(let s=0;s<=e;s++)t(n),n.x+=i.x,n.y+=i.y}}},309:(t,i)=>{var e,s;Object.defineProperty(i,"__esModule",{value:!0}),i.NodeType=i.CityGenerationMode=void 0,function(t){t.RUNTIME="RUNTIME",t.SEED="SEED"}(e||(i.CityGenerationMode=e={})),function(t){t.TURN="TURN",t.CROSS="CROSS",t.END="END"}(s||(i.NodeType=s={}))},679:(t,i)=>{function e(t){return t*(Math.PI/180)}function s(t){return[(t+90)%360,(t-90)%360]}Object.defineProperty(i,"__esModule",{value:!0}),i.between=i.getShift=i.forkDirection=i.turnDirection=i.degToRad=i.generateSeed=i.randomRange=i.randomItem=i.randomChance=void 0,i.randomChance=function(t){return Math.random()>1-t},i.randomItem=function(t){return t[Math.floor(Math.random()*t.length)]},i.randomRange=function(t,i){return Math.floor(t+Math.random()*(i-t+1))},i.generateSeed=function(t=32){const i=[];for(let e=0;e<t;e++)i.push(Math.round(1e3*Math.random()));return i},i.degToRad=e,i.turnDirection=s,i.forkDirection=function(t){return[t].concat(s(t))},i.getShift=function(t,i=1){return{x:Math.round(Math.cos(e(t)))*i,y:Math.round(Math.sin(e(t)))*i}},i.between=function(t,i){return t>=i[0]&&t<=i[1]}}},i={},e=function e(s){var n=i[s];if(void 0!==n)return n.exports;var r=i[s]={exports:{}};return t[s].call(r.exports,r,r.exports,e),r.exports}(465);module.exports=e})();