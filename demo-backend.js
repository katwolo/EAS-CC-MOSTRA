/*************************************************************************
 * EAS CC — MOSTRA · Backend simulat (demo-backend.js)
 *
 * Reprodueix, dins del navegador, les accions del backend real (Code.gs)
 * sense cap connexió a Google Sheets ni a cap altre servei extern.
 *
 * - Totes les dades són FICTÍCIES i es generen aquí mateix.
 * - Els canvis que fa cada visitant es guarden al seu navegador
 *   (localStorage) i es poden restablir amb DemoBackend.reset().
 *************************************************************************/
(function(global){
'use strict';

var STORE_KEY = 'eascc_demo_db_v1';

/* ============================ CONSTANTS ============================ */
var CAPS = ['c1','c2','c3','c4','c5','c6','c7'];
var CAP_COLORS = { c1:'B4A7D6', c2:'FFE599', c3:'A4C2F4', c4:'B6D7A8', c5:'A2C4C9', c6:'F9CB9C', c7:'EA9999' };
var CAP_SOFT   = { c1:'D9D2E9', c2:'FFF2CC', c3:'C9DAF8', c4:'D9EAD3', c5:'D0E0E3', c6:'FCE5CD', c7:'F4CCCC' };
var RESUM_NOMS = { c1:'Organització', c3:'Responsabilitat', c5:'Treball equip', c4:'Autonomia', c2:'Iniciativa', c6:'Relacions personals', c7:'Resolució de problemes' };
var CAP_NOMS = { c1:'Organització del treball', c2:'Iniciativa', c3:'Responsabilitat en el treball', c4:'Autonomia', c5:'Treball en equip', c6:'Relacions interpersonals', c7:'Resolució de problemes' };
var FIXED_CLASSES = ['1A','1B','1C','2A','2B','2C'];
var FIXED_EXEMPLES = ['lleure','mp1139','mp1136','mp0179','mp1709','mg-esports','ianimacio'];

/* ===================== DADES FICTÍCIES (llavor) ===================== */
var INDICADORS_TXT = {
  c1:[ 'Planifica les tasques i el temps abans de començar',
       'Prepara i ordena el material i l\'espai de treball',
       'Segueix la seqüència de passos prevista',
       'Lliura el treball dins del termini establert' ],
  c2:[ 'Proposa idees o millores sense que se li demani',
       'Es mostra disposat/da a assumir rols nous',
       'Busca informació addicional per ampliar la tasca',
       'Pren decisions davant d\'imprevistos senzills' ],
  c3:[ 'És puntual i assisteix amb regularitat',
       'Compleix les normes de seguretat i d\'ús de les instal·lacions',
       'Té cura del material i de l\'equipament',
       'Assumeix les conseqüències dels seus actes' ],
  c4:[ 'Treballa sense necessitat de supervisió constant',
       'Resol dubtes consultant fonts abans de preguntar',
       'Avalua el propi treball i en detecta errors',
       'Gestiona el seu aprenentatge i en fa el seguiment' ],
  c5:[ 'Col·labora activament amb el grup',
       'Respecta els acords i els rols de l\'equip',
       'Comparteix informació i recursos amb els companys',
       'Contribueix a assolir l\'objectiu comú' ],
  c6:[ 'Es comunica amb respecte amb companys i usuaris',
       'Escolta activament i respecta el torn de paraula',
       'Gestiona els conflictes de manera assertiva',
       'Adapta el llenguatge a l\'interlocutor' ],
  c7:[ 'Identifica el problema i les seves causes',
       'Planteja alternatives de solució',
       'Aplica la solució escollida i en valora el resultat',
       'Aprèn dels errors i ho aplica en situacions noves' ]
};

var MODULS = [
  { codi:'1139', nom:'Esports individuals', curs:'1' },
  { codi:'1136', nom:'Valoració de la condició física i intervenció en accidents', curs:'1' },
  { codi:'0179', nom:'Anglès professional', curs:'1' },
  { codi:'1140', nom:'Esports d\'equip i d\'implements', curs:'2' },
  { codi:'1138', nom:'Inclusió i animació turística', curs:'2' }
];

var CATALEG = [
  { nom:'Exposició oral', inds:{'c1.1':'#planificació','c4.3':'#autoavaluació','c6.4':'#comunicació','c7.1':''} },
  { nom:'Treball en grup a l\'aula', inds:{'c5.1':'#equip','c5.2':'#rols','c6.2':'#escolta','c3.1':''} },
  { nom:'Sessió pràctica dirigida', inds:{'c1.2':'#material','c3.2':'#seguretat','c6.1':'#tracte','c2.4':'#imprevistos','c4.1':''} },
  { nom:'Sortida o visita', inds:{'c3.1':'#puntualitat','c3.3':'#material','c6.1':'#tracte','c5.4':''} },
  { nom:'Debat', inds:{'c6.2':'#torn','c6.3':'#assertivitat','c2.1':'#idees','c7.2':''} },
  { nom:'Organització d\'un esdeveniment', inds:{'c1.1':'#planificació','c1.4':'#terminis','c2.2':'#rols','c5.4':'#objectiu','c7.3':''} },
  { nom:'Autoavaluació i coavaluació', inds:{'c4.3':'#autoavaluació','c4.4':'#seguiment','c7.4':'#errors'} },
  { nom:'Resolució d\'un cas pràctic', inds:{'c7.1':'#diagnòstic','c7.2':'#alternatives','c7.3':'#solució','c4.2':''} }
];

var NOMS = [
  // [nom, cognom, classe]
  ['Aina','Puig Serra','1A'],['Biel','Roca Martí','1A'],['Carla','Font Vidal','1A'],['Dídac','Soler Pons','1A'],
  ['Emma','Riera Camps','1A'],['Ferran','Sala Bosch','1A'],['Gemma','Prat Mas','1A'],['Hugo','Vila Ferrer','1A'],
  ['Irene','Costa Pujol','1B'],['Jan','Llobet Rius','1B'],['Laia','Torres Coll','1B'],['Marc','Sanz Roig','1B'],
  ['Nora','Badia Grau','1B'],['Oriol','Casals Feliu','1B'],['Paula','Bonet Riba','1B'],
  ['Queralt','Mir Esteve','2A'],['Roger','Pi Comas','2A'],['Sara','Duran Valls','2A'],['Tomàs','Gil Ferran','2A'],
  ['Úrsula','Oller Bru','2A'],['Víctor','Nadal Rovira','2A'],['Xènia','Marín Planas','2A'],['Yeray','Ramos Noguera','2A'],
  ['Zoe','Sabaté Pou','2B'],['Arnau','Cortés Font','2B'],['Berta','Miró Salvat','2B'],['Cesc','Garcia Ribes','2B'],
  ['Duna','Fabregat Ros','2B'],['Eloi','Comas Vidal','2B'],['Fiona','Carbó Martí','2B']
];

/* Generador pseudoaleatori determinista (sempre les mateixes dades inicials) */
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; var t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

function buildSeed(){
  var rnd = mulberry32(20261116);
  var db = { users:[], moduls:MODULS.map(function(m){ return {codi:m.codi,nom:m.nom,curs:m.curs}; }),
    indicadors:{}, cataleg:{}, catalegKw:{}, org:{}, modAct:{}, modActKw:{}, regs:{}, classes:{}, exemples:null,
    pesos:{p1r:null,p2n:null}, nextBlockId:1 };

  // --- Indicadors
  CAPS.forEach(function(cap){
    INDICADORS_TXT[cap].forEach(function(t,i){
      var codi=cap+'.'+(i+1);
      db.indicadors[codi]={ codi:codi, capacitatId:cap, capacitat:CAP_NOMS[cap], requisit:'', text:t,
        colorCap:'#'+CAP_COLORS[cap], colorInd:'#'+CAP_SOFT[cap] };
    });
  });

  // --- Catàleg comú d'activitats
  CATALEG.forEach(function(a){ db.cataleg[a.nom]=Object.keys(a.inds); db.catalegKw[a.nom]={};
    Object.keys(a.inds).forEach(function(c){ if(a.inds[c]) db.catalegKw[a.nom][c]=a.inds[c]; }); });

  // --- Usuaris
  var id=1;
  function addUser(u){ u.id=String(id++); u.correu=u.correu||(u.username+'@centre-demo.cat');
    ['pendents','noMat','desdoblaments','resetRequest','moduls','classe'].forEach(function(k){ if(u[k]===undefined) u[k]=''; });
    db.users.push(u); return u; }
  addUser({ nom:'Joana', cognom:'Admin Demo', username:'admin.demo', password:'demo', rol:'admin', moduls:'tots' });
  addUser({ nom:'Laia', cognom:'Ferrer Demo', username:'professor.demo', password:'demo', rol:'professor', moduls:'1139,1136,1140,1138' });
  addUser({ nom:'Marc', cognom:'Soler Ribas', username:'msoler', password:'demo', rol:'professor', moduls:'0179,1138' });
  addUser({ nom:'Núria', cognom:'Vidal Casas', username:'nvidal', password:'demo', rol:'professor', moduls:'1139,1140' });
  addUser({ nom:'Pere', cognom:'Mas Orriols', username:'pmas', password:'demo', rol:'professor', moduls:'1136,0179' });
  NOMS.forEach(function(n){
    var uname=(n[0].charAt(0)+n[1].split(' ')[0]).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    addUser({ nom:n[0], cognom:n[1], username:uname, password:'demo', rol:'alumne', classe:n[2], moduls:'tots' });
  });
  // usuari alumne de la demo: primer alumne de 1A
  var demoAlumne=db.users.filter(function(u){return u.rol==='alumne'&&u.classe==='1A';})[0];
  demoAlumne.username='alumne.demo';
  // casos especials per mostrar funcionalitats
  function byName(nom){ return db.users.filter(function(u){return u.nom===nom;})[0]; }
  byName('Queralt').pendents='1139';            // alumna de 2A amb 1139 pendent
  byName('Hugo').noMat='1136';                  // alumne de 1A no matriculat a Valoració de la condició física
  ['Queralt','Roger','Sara','Tomàs'].forEach(function(n){ byName(n).desdoblaments='1140:1'; });
  ['Úrsula','Víctor','Xènia','Yeray'].forEach(function(n){ byName(n).desdoblaments='1140:2'; });
  byName('Marc').resetRequest='14/11/2026 09:42';
  byName('Pere').resetRequest='15/11/2026 18:05';

  // --- Organització (projectes) per mòdul
  db.org = {
    '1139':[ {num:'1',nom:'Natació i activitats aquàtiques',profs:['professor.demo','nvidal']},
             {num:'2',nom:'Atletisme a l\'escola',profs:['professor.demo']},
             {num:'3',nom:'Organitzem un aquatló',profs:['nvidal','professor.demo']} ],
    '1136':[ {num:'1',nom:'Valoració de la condició física',profs:['professor.demo','pmas']},
             {num:'2',nom:'Primers auxilis i RCP',profs:['professor.demo','pmas']} ],
    '0179':[ {num:'1',nom:'Sports vocabulary & communication',profs:['msoler','pmas']},
             {num:'2',nom:'Job interview',profs:['msoler']} ],
    '1140':[ {num:'1',nom:'Jocs i esports col·lectius',profs:['professor.demo','nvidal']},
             {num:'2',nom:'Torneig d\'esports d\'implements',profs:['professor.demo']} ],
    '1138':[ {num:'1',nom:'Activitats inclusives',profs:['professor.demo','msoler']},
             {num:'2',nom:'Animació en un hotel',profs:['msoler','professor.demo']} ]
  };

  // --- Activitats pròpies de mòdul
  db.modAct = { '1139':{'Test de natació':['c1.3','c3.2','c4.1']}, '1136':{'Pràctica de RCP':['c3.2','c7.1','c7.3','c5.1']},
    '0179':{'Role play: job interview':['c6.4','c2.4','c4.2']}, '1140':{'Arbitratge d\'un partit':['c3.4','c6.3','c7.2','c2.4']},
    '1138':{'Disseny d\'una estació adaptada':['c2.1','c5.3','c7.2','c1.1']} };
  db.modActKw = { '1139':{'Test de natació':{'c1.3':'#seqüència','c3.2':'#seguretat'}}, '1136':{'Pràctica de RCP':{'c3.2':'#seguretat','c7.1':'#diagnòstic'}},
    '0179':{'Role play: job interview':{'c6.4':'#register'}}, '1140':{'Arbitratge d\'un partit':{'c6.3':'#conflicte','c7.2':'#decisió'}},
    '1138':{'Disseny d\'una estació adaptada':{'c2.1':'#inclusió','c5.3':'#recursos'}} };

  // --- Registres (evidències) generats
  // "Perfil" de cada alumne: tendència general + punt fort/feble
  var profile={};
  db.users.forEach(function(u){ if(u.rol!=='alumne') return;
    var base=rnd(); var strong=CAPS[Math.floor(rnd()*7)], weak=CAPS[Math.floor(rnd()*7)];
    profile[u.id]={base:base,strong:strong,weak:weak}; });
  profile[demoAlumne.id].base=0.62; profile[demoAlumne.id].strong='c5'; profile[demoAlumne.id].weak='c1';
  function grade(sid, cap){
    var p=profile[sid]; var x=0.18+p.base*0.5+rnd()*0.32;
    if(cap===p.strong) x+=0.15; if(cap===p.weak) x-=0.18;
    if(rnd()<0.03) return 'NA';
    if(x<0.3) return '1'; if(x<0.5) return '4'; if(x<0.8) return '7'; return '10';
  }
  var DATES=['2026-09-22','2026-09-29','2026-10-06','2026-10-14','2026-10-21','2026-10-28','2026-11-04','2026-11-11'];
  var plans = {
    '1139':[ ['1','Test de natació',0], ['1','Sessió pràctica dirigida',1], ['2','Exposició oral',3], ['2','Treball en grup a l\'aula',4], ['3','Organització d\'un esdeveniment',6] ],
    '1136':[ ['1','Sessió pràctica dirigida',0], ['1','Autoavaluació i coavaluació',2], ['2','Pràctica de RCP',5], ['2','Resolució d\'un cas pràctic',7] ],
    '0179':[ ['1','Exposició oral',1], ['2','Role play: job interview',4], ['','Debat',6] ],
    '1140':[ ['1','Sessió pràctica dirigida',0], ['1','Arbitratge d\'un partit',3], ['2','Organització d\'un esdeveniment',5], ['','Sortida o visita',7] ],
    '1138':[ ['1','Disseny d\'una estació adaptada',1], ['1','Treball en grup a l\'aula',3], ['2','Debat',6] ]
  };
  var tmp={ db:db };
  Object.keys(plans).forEach(function(codi){
    var mod=db.moduls.filter(function(m){return m.codi===codi;})[0];
    db.regs[codi]={};
    ['A','B'].forEach(function(letter){
      var classe=mod.curs+letter; db.regs[codi][letter]=[];
      var roster=rosterFor_(db, codi, classe);
      plans[codi].forEach(function(pl, pi){
        if(letter==='B' && pi===plans[codi].length-1) return; // el grup B va una mica més endarrerit
        var inds=sortInds_(activityIndicators_(db, pl[1], codi));
        var proj=(db.org[codi]||[]).filter(function(p){return p.num===pl[0];})[0];
        var notes={};
        roster.forEach(function(s){ notes[s.id]=inds.map(function(ind){ return grade(s.id, ind.capacitatId); }); });
        db.regs[codi][letter].push(makeBlock_(db, pl[0], proj?proj.nom:'', pl[1], DATES[Math.min(DATES.length-1,pl[2]+(letter==='B'?0:0))], inds, notes));
      });
    });
  });

  // --- Classes amb historial actiu per a l'alumnat
  FIXED_CLASSES.forEach(function(c){ db.classes[c]=(c==='1A'||c==='2A'); });

  // --- Exemples pràctics (format nou)
  var exActs=[];
  var EXT={ 'mp1139':['Dirigim un joc d’estils','La fitxa de sessió','Una ruta per a tothom','Revisem la ruta','El comitè organitzador','Repte Aquatló','Dinamitzem el Trotacorts'],
    'mp1136':['El cos abans de classe','Dirigim un exercici','Una bateria per a cada perfil','Valorem l’IEB','L’informe de valoració','Suplements: evidència o màrqueting?','Accident a la pista','La RCP en vídeo','Llitera de fortuna'],
    'mp0179':['Game Leaders','Who’s Playing?','Moving Together','Cover Letter Lab','Pitch Perfect','Interview Detectives','Trial Shift','The Event Challenge','Who Pays for the Game?'],
    'mg-esports':['Dirigim la sessió de jocs','Quadre de competició i memòria','Ens avaluem a pista','Inventa un esport','Guanyar a qualsevol preu?','Conflicte a pista','Platja segura','Muntem i registrem','Jornada al Bogatell'],
    'ianimacio':['La primera visita','Guió i cronograma definitiu','Una estació per a tothom','Esport adaptat o esport inclusiu?','L’estació en 45 minuts','Revisem el Moll de la Fusta','Assaig de franja','Tres dies a l’Eldorado'],
    'lleure':['El full de ruta del joc','Assaig de joc','Donem joc al parc','Tradició o adaptació?','La caixa de Carnestoltes','Les dades de la festa','Conflicte a la tenda','I si plou?','Tornem de l’acampada'],
    'mp1709':['Accident de treball?','Caçadors de riscos','Evacuem!','Ensenyem a prevenir','La nòmina abans de classe','Conflicte al club','Públic o privat?','El meu videocurrículum','El meu IPOP'] };
  var EXB={ 'mp1139':['Com s’ha d’ensenyar a nedar?','Pla B: la sessió no es pot fer'], 'mp1136':['Pla B: la sessió no es pot fer','Rellotge o tècnic?'],
    'mp0179':['Plan B: Session Rescue','Do We Still Need English?'], 'mg-esports':['Pla B: la sessió no es pot fer','Esports alternatius o tradicionals?'],
    'ianimacio':['Pla B: l’activitat no es pot fer','La vetllada d’hotel: per mirar o per participar?'], 'lleure':['Pla B: zero material','Mòbils a l’acampada?'],
    'mp1709':['Pla B: i si la cosa no surt?','Una app ens prendrà la feina?'] };
  Object.keys(EXT).forEach(function(m){
    EXT[m].forEach(function(t,i){ exActs.push({mod:m,actiu:true,pla:'A',num:i+1,titol:t,sub:'',tags:'',url:'',ppt:''}); });
    (EXB[m]||[]).forEach(function(t,i){ exActs.push({mod:m,actiu:true,pla:'B',num:i+1,titol:t,sub:'',tags:'',url:'',ppt:''}); });
  });
  var exMods={}; FIXED_EXEMPLES.forEach(function(m){ exMods[m]=true; });
  db.exemples={ mods:exMods, acts:exActs };
  return db;
}

/* ============================ PERSISTÈNCIA ============================ */
var DB=null;
function load_(){
  if(DB) return DB;
  try{ var raw=localStorage.getItem(STORE_KEY); if(raw){ DB=JSON.parse(raw); return DB; } }catch(e){}
  DB=buildSeed(); save_(); return DB;
}
function save_(){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(DB)); }catch(e){} }
function reset(){ try{ localStorage.removeItem(STORE_KEY); }catch(e){} DB=buildSeed(); save_(); }

/* ============================== HELPERS ============================== */
function normVal_(v){ return String(v==null?'':v).replace(/\.0$/,'').trim(); }
function capOf_(ind){ return String(ind).split('.')[0]; }
function letterOf_(classe){ classe=String(classe); return classe.charAt(classe.length-1).toUpperCase(); }
function bySort_(a,b){ return (a.cognom+a.nom).localeCompare(b.cognom+b.nom); }
function capOrder_(capId){ var i=CAPS.indexOf(capId); return i<0?99:i; }
function indNum_(codi){ var p=String(codi).split('.'); return p.length>1?Number(p[1])||0:0; }
function sortInds_(inds){ return inds.slice().sort(function(a,b){
  var ca=capOrder_(a.capacitatId||capOf_(a.codi)), cb=capOrder_(b.capacitatId||capOf_(b.codi));
  if(ca!==cb) return ca-cb; return indNum_(a.codi)-indNum_(b.codi); }); }
function parseModuls_(raw){ raw=String(raw||'').trim(); if(!raw||raw.toLowerCase()==='tots') return []; return raw.split(',').map(normVal_).filter(Boolean); }
function parseDesdoblaments_(raw){ var map={}; String(raw||'').split(',').forEach(function(pair){ var p=pair.trim().split(':');
  if(p.length===2&&p[0].trim()&&p[1].trim()) map[p[0].trim()]=Number(p[1].trim()); }); return map; }
function serializeDesdoblaments_(map){ return Object.keys(map).filter(function(k){return map[k]>0;}).map(function(k){return k+':'+map[k];}).join(','); }
function moduleRow_(db,codi){ return db.moduls.filter(function(m){return m.codi===normVal_(codi);})[0]||null; }
function requireModule_(db,codi){ var m=moduleRow_(db,codi); if(!m) throw new Error('Mòdul no trobat: '+codi); return m; }
function userById_(db,id){ return db.users.filter(function(u){return u.id===String(id);})[0]||null; }
function alumnes_(db){ return db.users.filter(function(u){return u.rol==='alumne';}); }
function stu_(u){ return {id:u.id,nom:u.nom,cognom:u.cognom,classe:u.classe}; }
function regsOf_(db,codi,letter){ if(!db.regs[codi]) db.regs[codi]={}; if(!db.regs[codi][letter]) db.regs[codi][letter]=[]; return db.regs[codi][letter]; }

function indicatorCatalog_(db){ return db.indicadors; }
function activityIndicators_(db, act, codi){
  var codes=null, kw={};
  if(db.cataleg[act]){ codes=db.cataleg[act]; kw=db.catalegKw[act]||{}; }
  else if(codi && db.modAct[codi] && db.modAct[codi][act]){ codes=db.modAct[codi][act]; kw=(db.modActKw[codi]||{})[act]||{}; }
  codes=codes||[];
  return codes.map(function(c){ var ind=db.indicadors[c]?JSON.parse(JSON.stringify(db.indicadors[c])):
    {codi:c,capacitat:'?',requisit:'',text:'(no trobat)',colorInd:'#cccccc',colorCap:'#999999',capacitatId:capOf_(c)};
    ind.paraules=kw[c]||''; return ind; });
}
function makeBlock_(db, projNum, projNom, activitat, data, inds, notes){
  return { id:db.nextBlockId++, projNum:String(projNum||''), projNom:String(projNom||''), activitat:String(activitat||''), data:String(data||''),
    inds:inds.map(function(ind){ var capId=ind.capacitatId||capOf_(ind.codi);
      return { codi:ind.codi, cap:ind.capacitat||CAP_NOMS[capId]||'', capId:capId, text:ind.text||'', colorInd:ind.colorInd||('#'+CAP_SOFT[capId]) }; }),
    notes:notes||{} };
}
function sortBlocks_(blocks){
  blocks.forEach(function(b,i){ b.__i=i; });
  blocks.sort(function(a,b){ var ka=a.projNum===''?9999:Number(a.projNum), kb=b.projNum===''?9999:Number(b.projNum);
    if(ka!==kb) return ka-kb; return a.__i-b.__i; });
  blocks.forEach(function(b){ delete b.__i; });
}

/* roster d'un mòdul/classe: alumnes de la classe (excepte no matriculats) + pendents + qualsevol amb notes */
function rosterFor_(db, codi, classe){
  var seen={}, out=[];
  alumnes_(db).forEach(function(u){
    if(u.classe===classe){
      var noMat=String(u.noMat||'').split(',').map(normVal_);
      if(noMat.indexOf(codi)>-1) return;
      seen[u.id]=true; out.push(stu_(u));
    } else {
      var pend=String(u.pendents||'').split(',').map(normVal_);
      var m=moduleRow_(db,codi);
      if(pend.indexOf(codi)>-1 && m && letterOf_(u.classe)===letterOf_(classe)){ seen[u.id]=true; out.push(stu_(u)); }
    }
  });
  var letter=letterOf_(classe);
  (db.regs[codi]&&db.regs[codi][letter]||[]).forEach(function(b){ Object.keys(b.notes||{}).forEach(function(sid){
    if(!seen[sid]){ var u=userById_(db,sid); if(u){ seen[sid]=true; out.push(stu_(u)); } } }); });
  return out.sort(bySort_);
}

/* ============================ LOGIN ============================ */
function loginUser_(db,p){
  var username=String(p.username||'').trim(), password=String(p.password||'');
  if(!username) throw new Error('Cal indicar l\'usuari.');
  var u=db.users.filter(function(x){return x.username===username;})[0];
  if(!u || u.password!==password) throw new Error('Usuari o contrasenya incorrectes.');
  return { id:u.id, nom:u.nom, cognom:u.cognom, correu:u.correu, username:u.username, rol:u.rol, classe:u.classe||'',
    moduls:parseModuls_(u.moduls), mustChangePassword: u.password==='1234' };
}

/* ============== CURS / CLASSE / MÒDUL ============== */
function visibleModules_(db,user){ var arr=db.moduls.slice();
  if(user&&user.rol==='professor'&&user.moduls&&user.moduls.length){ var s={}; user.moduls.forEach(function(c){s[c]=true;}); arr=arr.filter(function(m){return s[m.codi];}); }
  return arr; }
function getCourses_(db,p){ var seen={},out=[]; visibleModules_(db,p.user).forEach(function(m){ if(m.curs&&!seen[m.curs]){seen[m.curs]=true;out.push(m.curs);} }); return out.sort(); }
function getModules_(db,p){ var curs=normVal_(p.curs); return visibleModules_(db,p.user).filter(function(m){return m.curs===curs;}).map(function(m){return {codi:m.codi,nom:m.nom};}); }
function getClasses_(db,p){ var curs=normVal_(p.curs),seen={},out=[];
  alumnes_(db).forEach(function(u){ var cl=String(u.classe).trim(); if(cl&&cl.charAt(0)===curs&&!seen[cl]){seen[cl]=true;out.push(cl);} });
  return out.sort(); }

/* ============== PROJECTES ============== */
function getProjects_(db,p){ requireModule_(db,p.moduleCodi);
  var all=(db.org[p.moduleCodi]||[]); var user=p.user||{};
  if(user.rol==='professor'){ all=all.filter(function(pr){ return pr.profs.indexOf(user.username)>-1; }); }
  return all.map(function(pr){ return { num:pr.num, nom:pr.nom, activitats:[] }; }); }
function listProjects_(db,p){ requireModule_(db,p.moduleCodi);
  return (db.org[p.moduleCodi]||[]).map(function(pr){ return {num:pr.num,nom:pr.nom,activitats:[],profs:pr.profs.slice()}; }); }
function saveProject_(db,p){ requireModule_(db,p.moduleCodi); var num=normVal_(p.num);
  var list=db.org[p.moduleCodi]=(db.org[p.moduleCodi]||[]).filter(function(r){return r.num!==num;});
  list.push({num:num,nom:String(p.nom||''),profs:(p.professors||[]).slice()});
  list.sort(function(a,b){return Number(a.num)-Number(b.num);});
  return {num:num}; }
function deleteProject_(db,p){ var num=normVal_(p.num); db.org[p.moduleCodi]=(db.org[p.moduleCodi]||[]).filter(function(r){return r.num!==num;}); return true; }
function getAllProfs_(db){ return db.users.filter(function(u){return u.rol==='professor';}).map(function(u){return {username:u.username,nom:u.nom+' '+u.cognom};}); }

/* ============== ACTIVITATS ============== */
function kwStr_(ip){ return Object.keys(ip||{}).map(function(k){return ip[k];}).filter(Boolean).join(' '); }
function getActivityTypes_(db,p){
  var out={};
  Object.keys(db.cataleg).forEach(function(a){ out[a]={activitat:a,nIndicadors:db.cataleg[a].length,font:'catàleg',paraules:kwStr_(db.catalegKw[a])}; });
  if(p&&p.moduleCodi&&db.modAct[p.moduleCodi]){ var mod=db.modAct[p.moduleCodi];
    Object.keys(mod).forEach(function(a){ out[a]={activitat:a,nIndicadors:mod[a].length,font:'mòdul',paraules:kwStr_((db.modActKw[p.moduleCodi]||{})[a])}; }); }
  return Object.keys(out).map(function(a){return out[a];}).sort(function(a,b){return a.activitat.localeCompare(b.activitat);});
}
function getCapabilities_(db){
  var byCap={};
  Object.keys(db.indicadors).forEach(function(code){ var c=db.indicadors[code]; var id=c.capacitatId||capOf_(code);
    if(!byCap[id]) byCap[id]={capacitatId:id,capacitat:c.capacitat||CAP_NOMS[id]||id,color:c.colorCap||('#'+CAP_COLORS[id]),indicators:[]};
    byCap[id].indicators.push({codi:code,text:c.text,requisit:c.requisit,colorInd:c.colorInd}); });
  return CAPS.map(function(id){return byCap[id];}).filter(Boolean);
}
function saveActivity_(db,p){ requireModule_(db,p.moduleCodi);
  var nom=String(p.nom||'').trim(); if(!nom) throw new Error('Cal un nom d\'activitat.');
  var codes=(p.indicators||[]).map(normVal_).filter(Boolean); if(!codes.length) throw new Error('Tria almenys un indicador.');
  if(!db.modAct[p.moduleCodi]) db.modAct[p.moduleCodi]={}; if(!db.modActKw[p.moduleCodi]) db.modActKw[p.moduleCodi]={};
  db.modAct[p.moduleCodi][nom]=codes; var kw={}; codes.forEach(function(c){ var v=String((p.indParaules||{})[c]||'').trim(); if(v) kw[c]=v; });
  db.modActKw[p.moduleCodi][nom]=kw;
  return {nom:nom,n:codes.length}; }
function listModuleActivities_(db,p){ requireModule_(db,p.moduleCodi); var map=db.modAct[p.moduleCodi]||{};
  return Object.keys(map).map(function(nom){ return { nom:nom, indParaules:(db.modActKw[p.moduleCodi]||{})[nom]||{},
    indicators:map[nom].map(function(c){ return db.indicadors[c]||{codi:c,text:'(no trobat)',colorInd:'#cccccc',capacitat:'?',capacitatId:capOf_(c)}; }) }; })
    .sort(function(a,b){return a.nom.localeCompare(b.nom);}); }
function deleteActivity_(db,p){ var nom=String(p.nom||'').trim(); if(db.modAct[p.moduleCodi]) delete db.modAct[p.moduleCodi][nom];
  if(db.modActKw[p.moduleCodi]) delete db.modActKw[p.moduleCodi][nom]; return true; }
function listCatalogActivities_(db){ return Object.keys(db.cataleg).map(function(nom){ return { nom:nom, indParaules:db.catalegKw[nom]||{},
  indicators:db.cataleg[nom].map(function(c){ return db.indicadors[c]||{codi:c,text:'(no trobat)',colorInd:'#cccccc',capacitat:'?',capacitatId:capOf_(c)}; }) }; })
  .sort(function(a,b){return a.nom.localeCompare(b.nom);}); }
function saveCatalogActivity_(db,p){
  var nom=String(p.nom||'').trim(); if(!nom) throw new Error('Cal un nom d\'activitat.');
  var codes=(p.indicators||[]).map(normVal_).filter(Boolean); if(!codes.length) throw new Error('Tria almenys un indicador.');
  if(p.oldNom&&String(p.oldNom).trim()!==nom){ delete db.cataleg[String(p.oldNom).trim()]; delete db.catalegKw[String(p.oldNom).trim()]; }
  db.cataleg[nom]=codes; var kw={}; codes.forEach(function(c){ var v=String((p.indParaules||{})[c]||'').trim(); if(v) kw[c]=v; }); db.catalegKw[nom]=kw;
  return {nom:nom,n:codes.length}; }
function deleteCatalogActivity_(db,p){ var nom=String(p.nom||'').trim(); delete db.cataleg[nom]; delete db.catalegKw[nom]; return true; }
function getActivityIndicators_(db,p){ return { indicators:activityIndicators_(db,String(p.activitat||'').trim(),p.moduleCodi) }; }

/* ============== ALUMNES ============== */
function getStudents_(db,p){
  var classe=String(p.classe||'').trim(), moduleCodi=normVal_(p.moduleCodi);
  var grup=(p.grup!==undefined&&p.grup!==null)?Number(p.grup):null;
  var regular=[], pendents=[], noMatriculats=[], altreGrup=[];
  alumnes_(db).forEach(function(u){
    var base=stu_(u);
    if(u.classe===classe){
      var noMatList=String(u.noMat||'').split(',').map(normVal_);
      if(moduleCodi && noMatList.indexOf(moduleCodi)>-1){ base.noMat=true; noMatriculats.push(base); }
      else if(grup && grup>0 && moduleCodi){
        var desd=parseDesdoblaments_(u.desdoblaments);
        if(desd[moduleCodi] && desd[moduleCodi]!==grup){ base.altreGrup=true; altreGrup.push(base); }
        else regular.push(base);
      } else regular.push(base);
    } else {
      var pend=String(u.pendents||'').split(',').map(normVal_);
      if(moduleCodi && pend.indexOf(moduleCodi)>-1){ base.pendent=true; pendents.push(base); }
    }
  });
  regular.sort(bySort_); pendents.sort(bySort_); noMatriculats.sort(bySort_); altreGrup.sort(bySort_);
  return { regular:regular, pendents:pendents, noMatriculats:noMatriculats, altreGrup:altreGrup };
}

/* ============== REGISTRES ============== */
function saveRegistre_(db,p){
  requireModule_(db,p.moduleCodi); var letter=letterOf_(p.classe);
  var inds=sortInds_(activityIndicators_(db,p.activitat,p.moduleCodi));
  if(!inds.length) throw new Error('L\'activitat no té indicadors al catàleg.');
  var st=getStudents_(db,{classe:p.classe,moduleCodi:p.moduleCodi});
  var all=(st.regular||[]).concat(st.pendents||[]);
  var blocks=regsOf_(db,p.moduleCodi,letter);
  var oldNotes={};
  if(p.blockCol){ var old=blocks.filter(function(b){return b.id==Number(p.blockCol);})[0];
    if(old) oldNotes=old.notes||{};
    db.regs[p.moduleCodi][letter]=blocks=blocks.filter(function(b){return b.id!=Number(p.blockCol);}); }
  var grades=p.grades||{}, notes={};
  // conserva les notes d'alumnes d'altres grups (desdoblaments) en editar
  Object.keys(oldNotes).forEach(function(sid){ notes[sid]=oldNotes[sid]; });
  all.forEach(function(s){ var arr=inds.map(function(ind){ var g=grades[ind.codi]||{}; var v=g[s.id]; return (v===null||v===undefined||v==='')?'':String(v); });
    if(arr.some(function(x){return x!=='';})) notes[s.id]=arr; });
  blocks.push(makeBlock_(db,p.projecteNum,p.projecteNom,p.activitat,p.data,inds,notes));
  sortBlocks_(blocks);
  return { width:inds.length, missatge:'Registre desat al mòdul '+p.moduleCodi+' (grup '+letter+').' };
}
function getEvidencies_(db,p){ requireModule_(db,p.moduleCodi); var out=[];
  ['A','B','C'].forEach(function(letter){ ((db.regs[p.moduleCodi]||{})[letter]||[]).forEach(function(b){
    out.push({moduleCodi:normVal_(p.moduleCodi),classeLetter:letter,startCol:b.id,projNum:b.projNum,projNom:b.projNom,activitat:b.activitat,data:b.data,nIndicadors:b.inds.length}); }); });
  out.sort(function(a,b){return String(b.data).localeCompare(String(a.data));});
  return out; }
function findBlock_(db,codi,letter,id){ var b=((db.regs[codi]||{})[letter]||[]).filter(function(x){return x.id==Number(id);})[0]; if(!b) throw new Error('Bloc no trobat.'); return b; }
function getBlockDetail_(db,p){
  var blk=findBlock_(db,p.moduleCodi,p.classeLetter,p.startCol);
  var grades={};
  blk.inds.forEach(function(ind,i){ grades[ind.codi]={};
    Object.keys(blk.notes||{}).forEach(function(sid){ var s=String(blk.notes[sid][i]||'').trim(); if(s==='') return;
      grades[ind.codi][sid]=(s.toUpperCase()==='NA')?'NA':Number(s); }); });
  var m=moduleRow_(db,p.moduleCodi); var curs=m?m.curs:'';
  return { startCol:blk.id, classeLetter:p.classeLetter, classe:curs+String(p.classeLetter), curs:curs, moduleNom:m?m.nom:p.moduleCodi,
    projNum:blk.projNum, projNom:blk.projNom, activitat:blk.activitat, data:blk.data, grades:grades };
}
function deleteRegistre_(db,p){ findBlock_(db,p.moduleCodi,p.classeLetter,p.startCol);
  db.regs[p.moduleCodi][p.classeLetter]=db.regs[p.moduleCodi][p.classeLetter].filter(function(b){return b.id!=Number(p.startCol);}); return true; }

/* ============== RESUMS ============== */
function weightedNota_(cells,pesos){ var num=0,den=0;
  CAPS.forEach(function(cap){ var v=cells[cap]; if(v==null||isNaN(v)) return; var w=pesos?(pesos[cap]||0):1/CAPS.length; num+=v*w; den+=w; });
  return den>0?Math.round(num/den*10)/10:null; }
function getModuleResum_(db,p){
  var letter=letterOf_(p.classe); var blocks=(db.regs[p.moduleCodi]||{})[letter]||[];
  var roster=rosterFor_(db,p.moduleCodi,p.classe);
  var glob={}, classSum={}, classCnt={}; CAPS.forEach(function(c){classSum[c]=0;classCnt[c]=0;});
  roster.forEach(function(s){ glob[s.id]={}; });
  blocks.forEach(function(b){ b.inds.forEach(function(ind,ci){ var cap=ind.capId; if(!cap) return;
    roster.forEach(function(s){ var arr=(b.notes||{})[s.id]; if(!arr) return; var v=arr[ci];
      if(v===''||v==null||String(v).toUpperCase()==='NA') return; var n=Number(v); if(isNaN(n)) return;
      if(!glob[s.id][cap]) glob[s.id][cap]={s:0,c:0}; glob[s.id][cap].s+=n; glob[s.id][cap].c++; }); }); });
  var students=roster.map(function(s){ var cells={};
    CAPS.forEach(function(cap){ var d=glob[s.id][cap]; if(d&&d.c){ var m=d.s/d.c; cells[cap]=Math.round(m); classSum[cap]+=m; classCnt[cap]++; } else cells[cap]=null; });
    return { id:s.id, nom:s.nom, cognom:s.cognom, cells:cells }; });
  var classMean={}; CAPS.forEach(function(c){ classMean[c]=classCnt[c]?(classSum[c]/classCnt[c]):0; });
  return { students:students, classMean:classMean, capNoms:RESUM_NOMS };
}
function globalFor_(db, student){
  var lletra=student.classe.slice(1), classe1r='1'+lletra, classe2n='2'+lletra;
  var acc1r={}, acc2n={}; CAPS.forEach(function(cap){acc1r[cap]={s:0,c:0};acc2n[cap]={s:0,c:0};});
  var modulData=[];
  db.moduls.forEach(function(modul){ if(modul.curs!=='1'&&modul.curs!=='2') return;
    var cl=(modul.curs==='1')?classe1r:classe2n;
    var resum=getModuleResum_(db,{moduleCodi:modul.codi,classe:cl});
    var found=resum.students.filter(function(s){return s.id===student.id;})[0]; if(!found) return;
    var acc=(modul.curs==='1')?acc1r:acc2n, hasData=false;
    CAPS.forEach(function(cap){ var v=found.cells[cap]; if(v!=null){acc[cap].s+=v;acc[cap].c++;hasData=true;} });
    if(hasData) modulData.push({codi:modul.codi,nom:modul.nom,cells:found.cells,curs:modul.curs}); });
  var cells1r={}, cells2n={}, cellsCicle={};
  CAPS.forEach(function(cap){
    cells1r[cap]=acc1r[cap].c>0?Math.round(acc1r[cap].s/acc1r[cap].c):null;
    cells2n[cap]=acc2n[cap].c>0?Math.round(acc2n[cap].s/acc2n[cap].c):null;
    var vals=[cells1r[cap],cells2n[cap]].filter(function(v){return v!=null;});
    cellsCicle[cap]=vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length):null; });
  var nota1r=weightedNota_(cells1r,db.pesos.p1r), nota2n=weightedNota_(cells2n,db.pesos.p2n);
  var notaCicle=(nota1r!=null&&nota2n!=null)?Math.round((nota1r+nota2n)*5)/10:(nota1r!=null?nota1r:nota2n);
  return { modules:modulData, global1r:{cells:cells1r,nota:nota1r}, global2n:{cells:cells2n,nota:nota2n}, globalCicle:{cells:cellsCicle,nota:notaCicle} };
}
function getAlumneGlobalResum_(db,p){
  var u=userById_(db,p.userId); if(!u||u.rol!=='alumne') throw new Error('Alumne no trobat.');
  var g=globalFor_(db,u);
  return { nom:u.nom, cognom:u.cognom, classe:u.classe, modules:g.modules, global1r:g.global1r, global2n:g.global2n, globalCicle:g.globalCicle,
    pesos:{p1r:db.pesos.p1r,p2n:db.pesos.p2n}, capNoms:RESUM_NOMS };
}
function getClassGlobalResum_(db,p){
  var classe=String(p.classe||'').trim(); if(!classe) return {classe:'',students:[],capNoms:RESUM_NOMS};
  var students=alumnes_(db).filter(function(u){return u.classe===classe;}).sort(bySort_);
  return { classe:classe, capNoms:RESUM_NOMS, students:students.map(function(u){ var g=globalFor_(db,u);
    return {nom:u.nom,cognom:u.cognom,cells:g.globalCicle.cells,nota:g.globalCicle.nota}; }) };
}
function getInici_(db,p){
  var letter=letterOf_(p.classe); var blocks=(db.regs[p.moduleCodi]||{})[letter]||[];
  var stI=getStudents_(db,{classe:p.classe,moduleCodi:p.moduleCodi}); var nAl=(stI.regular||[]).length+(stI.pendents||[]).length;
  var roster=rosterFor_(db,p.moduleCodi,p.classe);
  var dist={r:0,a:0,b:0,v:0,na:0}, vals=0, avalSet={};
  blocks.forEach(function(b){ b.inds.forEach(function(ind,ci){ roster.forEach(function(s){
    var arr=(b.notes||{})[s.id]; if(!arr) return; var v=String(arr[ci]||'').trim(); if(v==='') return; vals++; avalSet[s.id]=true;
    if(v.toUpperCase()==='NA'){dist.na++;return;} var n=Math.round(Number(v)); if(n<=2)dist.r++; else if(n<=5)dist.a++; else if(n<=8)dist.b++; else dist.v++; }); }); });
  var resum=getModuleResum_(db,p);
  return { nAlumnes:nAl, nEvidencies:blocks.length, nValoracions:vals, nAlumnesAval:Object.keys(avalSet).length, dist:dist, classMean:resum.classMean, capNoms:RESUM_NOMS };
}
function getAlumneHistorial_(db,p){
  var u=userById_(db,p.userId); if(!u) throw new Error('Alumne no trobat.');
  var lletra=letterOf_(u.classe); var registres=[];
  db.moduls.forEach(function(m){
    ((db.regs[m.codi]||{})[lletra]||[]).forEach(function(b){
      var arr=(b.notes||{})[u.id]; if(!arr||!arr.some(function(v){return v!==''&&v!=null;})) return;
      var kw=(db.cataleg[b.activitat]?db.catalegKw[b.activitat]:((db.modActKw[m.codi]||{})[b.activitat]))||{};
      var ccAcc={};
      b.inds.forEach(function(ind,i){ var v=arr[i]; if(v===''||v==null||String(v).toUpperCase()==='NA') return; var n=Number(v); if(isNaN(n)) return;
        if(!ccAcc[ind.capId]) ccAcc[ind.capId]={s:0,c:0}; ccAcc[ind.capId].s+=n; ccAcc[ind.capId].c++; });
      var ccMeans={}; CAPS.forEach(function(cap){ var d=ccAcc[cap]; ccMeans[cap]=d?Math.round(d.s/d.c):null; });
      var inds=b.inds.map(function(ind,i){ var v=arr[i], grade=null;
        if(v!==''&&v!=null){ if(String(v).toUpperCase()==='NA') grade='NA'; else { var n=Number(v); if(!isNaN(n)) grade=n; } }
        return {codi:ind.codi,text:ind.text,cap:ind.capId,grade:grade,paraules:kw[ind.codi]||''}; }).filter(function(x){return x.grade!==null;});
      var seen={}, hashtags=[];
      b.inds.forEach(function(ind){ String(kw[ind.codi]||'').trim().split(/[\s,]+/).forEach(function(w){ var t=w.replace(/^#+/,'').trim(); if(!t) return;
        var k=t.toLowerCase(); if(!seen[k]){ seen[k]=true; hashtags.push('#'+t); } }); });
      registres.push({moduleCodi:m.codi,moduleNom:m.nom,activitat:b.activitat,data:b.data,projNum:b.projNum,ccMeans:ccMeans,inds:inds,hashtags:hashtags.slice(0,3)});
    });
  });
  registres.sort(function(a,b){return String(b.data).localeCompare(String(a.data));});
  return {registres:registres};
}

/* ============== ADMIN: USUARIS ============== */
function getAdminUsers_(db){ var admins=[],professors=[],alumnes=[];
  db.users.forEach(function(u){ if(!u.rol) return;
    var moduls=parseModuls_(u.moduls).map(function(c){ var m=moduleRow_(db,c); return m?{codi:m.codi,nom:m.nom,curs:m.curs}:{codi:c,nom:c}; });
    var obj={id:u.id,nom:u.nom,cognom:u.cognom,username:u.username,rol:u.rol,classe:u.classe||'',correu:u.correu||'',modulsCodes:u.moduls||'',moduls:moduls,resetRequest:u.resetRequest||''};
    if(u.rol==='admin') admins.push(obj); else if(u.rol==='professor') professors.push(obj); else if(u.rol==='alumne') alumnes.push(obj); });
  admins.sort(bySort_); professors.sort(bySort_); alumnes.sort(bySort_);
  return {admins:admins,professors:professors,alumnes:alumnes}; }
function editUser_(db,p){ var u=userById_(db,p.userId); if(!u) throw new Error('Usuari no trobat.');
  [['nom','nom'],['cognom','cognom'],['correu','correu'],['username','username'],['classe','classe'],['modulsCodes','moduls'],['rol','rol']].forEach(function(f){
    if(p[f[0]]!==undefined&&p[f[0]]!==null) u[f[1]]=String(p[f[0]]).trim(); });
  return true; }
function deleteUser_(db,p){ var u=userById_(db,p.userId); if(!u) throw new Error('Usuari no trobat.');
  if(['admin.demo','professor.demo','alumne.demo'].indexOf(u.username)>-1) throw new Error('A la demo no es poden esborrar els tres usuaris d\'accés ràpid. Prova-ho amb qualsevol altre usuari.');
  Object.keys(db.regs).forEach(function(codi){ Object.keys(db.regs[codi]).forEach(function(l){ db.regs[codi][l].forEach(function(b){ delete (b.notes||{})[u.id]; }); }); });
  db.users=db.users.filter(function(x){return x.id!==u.id;});
  return true; }
function resetPassword_(db,p){ var u=userById_(db,p.userId); if(!u) return {mailSent:false,mailError:'Usuari no trobat',mailTo:null};
  u.password=String(p.password||''); u.resetRequest='';
  return { demo:true, mailSent:false, mailTo:u.correu||null }; }
function changePassword_(db,p){ var u=userById_(db,p.userId); if(!u) throw new Error('Usuari no trobat.');
  if(u.password!==String(p.oldPassword)) throw new Error('La contrasenya actual no és correcta. (A la demo, la contrasenya és «demo».)');
  u.password=String(p.newPassword||''); return true; }
function requestPasswordReset_(db,p){ var u=db.users.filter(function(x){return x.username===String(p.username||'').trim();})[0];
  if(!u) throw new Error('No s\'ha trobat cap usuari amb aquest nom d\'usuari.');
  var d=new Date(); function z(n){return (n<10?'0':'')+n;}
  u.resetRequest=z(d.getDate())+'/'+z(d.getMonth()+1)+'/'+d.getFullYear()+' '+z(d.getHours())+':'+z(d.getMinutes()); return true; }

/* ============== ADMIN: DESDOBLAMENTS / CLASSES / EXEMPLES ============== */
function checkModulGrups_(db,p){ var classe=String(p.classe||'').trim(), codi=normVal_(p.moduleCodi), has=false;
  alumnes_(db).forEach(function(u){ if(u.classe!==classe) return; if(parseDesdoblaments_(u.desdoblaments)[codi]) has=true; });
  return {hasGroups:has}; }
function getDesdoblaments_(db,p){ var classe=String(p.classe||'').trim(), codi=normVal_(p.moduleCodi);
  return alumnes_(db).filter(function(u){return u.classe===classe;}).map(function(u){ return {id:u.id,nom:u.nom,cognom:u.cognom,grup:parseDesdoblaments_(u.desdoblaments)[codi]||null}; }).sort(bySort_); }
function saveDesdoblaments_(db,p){ var codi=normVal_(p.moduleCodi), map={};
  (p.assignments||[]).forEach(function(a){ map[String(a.studentId)]=a.grup; });
  db.users.forEach(function(u){ if(!(u.id in map)) return; var d=parseDesdoblaments_(u.desdoblaments), g=map[u.id];
    if(g&&Number(g)>0) d[codi]=Number(g); else delete d[codi]; u.desdoblaments=serializeDesdoblaments_(d); });
  return true; }
function getModulesAll_(db){ return db.moduls.map(function(m){return {codi:m.codi,nom:m.nom,curs:m.curs};}).sort(function(a,b){return a.codi.localeCompare(b.codi);}); }
function readClassesConfig_(db){ var map={}; FIXED_CLASSES.forEach(function(c){ map[c]=!!db.classes[c]; }); return map; }
function saveClassesConfig_(db,p){ var cfg=p.config||{}; FIXED_CLASSES.forEach(function(c){ db.classes[c]=(cfg[c]===true); }); return true; }
function readExemplesConfig_(db){ return {newFormat:true, mods:JSON.parse(JSON.stringify(db.exemples.mods)), acts:JSON.parse(JSON.stringify(db.exemples.acts))}; }
function saveExemplesConfig_(db,p){ if(p.acts!==undefined){ db.exemples={mods:p.mods||{},acts:p.acts||[]}; }
  else { var cfg=p.config||{}; FIXED_EXEMPLES.forEach(function(id){ db.exemples.mods[id]=(cfg[id]!==false); }); } return true; }

/* ============== BATCH ============== */
function getAllClasses_(db,p){ var seen={},out=[]; getCourses_(db,p).forEach(function(curs){ getClasses_(db,{curs:curs}).forEach(function(c){ if(!seen[c]){seen[c]=true;out.push(c);} }); }); return out.sort(); }
function getInitialData_(db,p){ var courses=getCourses_(db,p), modsByCurs={}, allMods=[], seen={};
  courses.forEach(function(curs){ var mods=getModules_(db,{user:p.user,curs:curs}); modsByCurs[curs]=mods;
    mods.forEach(function(m){ if(!seen[m.codi]){seen[m.codi]=true;allMods.push(m);} }); });
  return { courses:courses, modsByCurs:modsByCurs, allModules:allMods, allClasses:getAllClasses_(db,p), capabilities:getCapabilities_(db) }; }
function loginAndInit_(db,p){ var user=loginUser_(db,p);
  if(user.rol==='alumne') user.historialEnabled=!!db.classes[user.classe];
  return { user:user, initialData:getInitialData_(db,{user:user}) }; }

/* ============================ ROUTER ============================ */
var MUTATING = { saveActivity:1, saveRegistre:1, deleteRegistre:1, saveProject:1, deleteProject:1, deleteActivity:1, deleteUser:1, editUser:1,
  saveClassesConfig:1, saveExemplesConfig:1, resetPassword:1, changePassword:1, requestPasswordReset:1, saveDesdoblaments:1,
  saveCatalogActivity:1, deleteCatalogActivity:1 };

function handleRequest(action, payload){
  payload=payload||{}; var db=load_();
  try{
    var res;
    switch(action){
      case 'ping':                  res={ ok:true, msg:'pong (demo)' }; break;
      case 'loginAndInit':          var li=loginAndInit_(db,payload); res={ ok:true, user:li.user, initialData:li.initialData }; break;
      case 'getInitialData':        res={ ok:true, initialData:getInitialData_(db,payload) }; break;
      case 'login':                 res={ ok:true, user:loginUser_(db,payload) }; break;
      case 'getCourses':            res={ ok:true, courses:getCourses_(db,payload) }; break;
      case 'getModules':            res={ ok:true, modules:getModules_(db,payload) }; break;
      case 'getClasses':            res={ ok:true, classes:getClasses_(db,payload) }; break;
      case 'getProjects':           res={ ok:true, projects:getProjects_(db,payload) }; break;
      case 'getActivityTypes':      res={ ok:true, types:getActivityTypes_(db,payload) }; break;
      case 'getActivityIndicators': res={ ok:true, indicators:getActivityIndicators_(db,payload).indicators }; break;
      case 'getCapabilities':       res={ ok:true, caps:getCapabilities_(db) }; break;
      case 'saveActivity':          res={ ok:true, result:saveActivity_(db,payload) }; break;
      case 'getStudents':           res={ ok:true, data:getStudents_(db,payload) }; break;
      case 'saveRegistre':          res={ ok:true, result:saveRegistre_(db,payload) }; break;
      case 'getEvidencies':         res={ ok:true, registres:getEvidencies_(db,payload) }; break;
      case 'getBlockDetail':        res={ ok:true, data:getBlockDetail_(db,payload) }; break;
      case 'deleteRegistre':        res={ ok:true, deleted:deleteRegistre_(db,payload) }; break;
      case 'getModuleResum':        res={ ok:true, data:getModuleResum_(db,payload) }; break;
      case 'getAlumneGlobalResum':  res={ ok:true, data:getAlumneGlobalResum_(db,payload) }; break;
      case 'getClassGlobalResum':   res={ ok:true, data:getClassGlobalResum_(db,payload) }; break;
      case 'getInici':              res={ ok:true, data:getInici_(db,payload) }; break;
      case 'listProjects':          res={ ok:true, projects:listProjects_(db,payload) }; break;
      case 'saveProject':           res={ ok:true, result:saveProject_(db,payload) }; break;
      case 'deleteProject':         res={ ok:true, deleted:deleteProject_(db,payload) }; break;
      case 'getAllProfs':           res={ ok:true, profs:getAllProfs_(db) }; break;
      case 'listModuleActivities':  res={ ok:true, activities:listModuleActivities_(db,payload) }; break;
      case 'deleteActivity':        res={ ok:true, deleted:deleteActivity_(db,payload) }; break;
      case 'getAdminUsers':         res={ ok:true, data:getAdminUsers_(db) }; break;
      case 'deleteUser':            res={ ok:true, done:deleteUser_(db,payload) }; break;
      case 'editUser':              res={ ok:true, done:editUser_(db,payload) }; break;
      case 'getClassesConfig':      res={ ok:true, config:readClassesConfig_(db) }; break;
      case 'saveClassesConfig':     res={ ok:true, done:saveClassesConfig_(db,payload) }; break;
      case 'getExemplesConfig':     res=Object.assign({ok:true}, readExemplesConfig_(db)); break;
      case 'saveExemplesConfig':    res={ ok:true, done:saveExemplesConfig_(db,payload) }; break;
      case 'getAlumneHistorial':    res={ ok:true, data:getAlumneHistorial_(db,payload) }; break;
      case 'resetPassword':         res={ ok:true, done:resetPassword_(db,payload) }; break;
      case 'changePassword':        res={ ok:true, done:changePassword_(db,payload) }; break;
      case 'requestPasswordReset':  res={ ok:true, done:requestPasswordReset_(db,payload) }; break;
      case 'checkModulGrups':       res={ ok:true, data:checkModulGrups_(db,payload) }; break;
      case 'getDesdoblaments':      res={ ok:true, data:getDesdoblaments_(db,payload) }; break;
      case 'saveDesdoblaments':     res={ ok:true, done:saveDesdoblaments_(db,payload) }; break;
      case 'getModulesAll':         res={ ok:true, modules:getModulesAll_(db) }; break;
      case 'listCatalogActivities': res={ ok:true, activities:listCatalogActivities_(db) }; break;
      case 'saveCatalogActivity':   res={ ok:true, result:saveCatalogActivity_(db,payload) }; break;
      case 'deleteCatalogActivity': res={ ok:true, deleted:deleteCatalogActivity_(db,payload) }; break;
      default: return { ok:false, error:'Acció desconeguda: '+action };
    }
    if(MUTATING[action]) save_();
    // còpia profunda: el frontend no ha de poder modificar la "base de dades" per referència
    return JSON.parse(JSON.stringify(res));
  }catch(err){ return { ok:false, error:String(err&&err.message?err.message:err) }; }
}

global.DemoBackend = {
  handle: handleRequest,
  reset: reset,
  /* usuaris d'accés ràpid de la demo */
  roles: {
    admin:     { username:'admin.demo',     password:'demo' },
    professor: { username:'professor.demo', password:'demo' },
    alumne:    { username:'alumne.demo',    password:'demo' }
  }
};
})(window);
