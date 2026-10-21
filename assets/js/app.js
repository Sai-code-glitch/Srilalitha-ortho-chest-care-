(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- hours ---------- */
const DOC={
  ortho:{name:"Dr. Talasila Rakesh",short:"Dr. Rakesh",ini:"TR",cls:"o",role:"Trauma & Joint Replacement Surgeon",dept:"Orthopaedics",hours:"2:30 PM – 9:00 PM",start:"o_start"},
  chest:{name:"Dr. Kavya Yalamanchili",short:"Dr. Kavya",ini:"KY",cls:"c",role:"Consultant Pulmonologist",dept:"Chest & Pulmonology",hours:"10 AM – 2 PM, 6 PM – 9 PM",start:"p_start"}
};
const HRS={
  ortho:{label:"Orthopaedics",blocks:[[14.5,21]]},
  chest:{label:"Chest & lung",blocks:[[10,14],[18,21]]},
  radio:{label:"Radiology & pharmacy",blocks:[[8,17]]},
  pharm:{label:"Pharmacy",blocks:[[8,17]]},
  online:{label:"Online consult",blocks:[[14,18]],days:[0,6]}
};
const DAYN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const fmt=h=>{const H=Math.floor(h),M=Math.round((h-H)*60),ap=H>=12?"PM":"AM";return (((H+11)%12)+1)+":"+String(M).padStart(2,"0")+" "+ap};
const fmtS=h=>fmt(h).replace(":00","");
const ist=()=>new Date(Date.now()+(330+new Date().getTimezoneOffset())*60000);
function state(k){const S=HRS[k],t=ist(),h=t.getHours()+t.getMinutes()/60,dow=t.getDay(),okDay=d=>!S.days||S.days.includes(d);
  if(okDay(dow))for(const [s,e] of S.blocks)if(h>=s&&h<e)return{open:true,until:e};
  for(let i=0;i<8;i++){const d=(dow+i)%7;if(!okDay(d))continue;for(const [s] of S.blocks)if(i>0||s>h)return{open:false,next:s,inDays:i,dow:d}}
  return{open:false,next:S.blocks[0][0],inDays:1,dow:(dow+1)%7}}
const whenTxt=s=>(s.inDays===0?"today ":s.inDays===1?"tomorrow ":DAYN[s.dow]+" ")+fmtS(s.next);
function live(){
  Object.keys(HRS).forEach(k=>{const s=state(k);
    $$('[data-live="'+k+'"]').forEach(d=>d.classList.toggle("on",s.open));
    $$('[data-livetxt="'+k+'"]').forEach(e=>e.textContent=HRS[k].label+(s.open?" · open now":" · opens "+whenTxt(s)));
    $$('[data-livelong="'+k+'"]').forEach(e=>e.textContent=s.open?"In OPD now, until "+fmtS(s.until):"Next OPD "+whenTxt(s));
    $$('[data-pill="'+k+'"]').forEach(e=>{e.className="st-pill"+(s.open?" on":"");e.innerHTML='<i class="dot'+(s.open?" on":"")+'"></i>'+(s.open?"Open until "+fmtS(s.until):"Opens "+whenTxt(s))});
    $$('[data-bar="'+k+'"]').forEach(bar=>{if(!bar.dataset.done){HRS[k].blocks.forEach(([a,b])=>{const i=document.createElement("i");i.className=k==="ortho"?"o":k==="chest"?"c":"s";i.style.left=((a-8)/14*100)+"%";i.style.width=((b-a)/14*100)+"%";bar.appendChild(i)});const n=document.createElement("span");n.className="nowm";bar.appendChild(n);bar.dataset.done=1}
      const t=ist(),p=((t.getHours()+t.getMinutes()/60)-8)/14*100,n=bar.querySelector(".nowm");n.hidden=p<0||p>100;n.style.left=p+"%"})});
  if(chat.doc)$("#chatSub").textContent=chatSub(chat.doc)}
const chatSub=k=>DOC[k].role+(state(k).open?" · in OPD now":"");

/* ---------- conversation scripts ---------- */
const N={
 o_start:{say:["Namaskaram, I'm Dr. Talasila Rakesh.","I treat injuries, fractures and joint problems. Where is the problem?"],q:"Area",opts:[["Knee","మోకాలు","o_knee"],["Back or neck","నడుము / మెడ","o_back"],["Shoulder, elbow or wrist","భుజం / మణికట్టు","o_arm"],["Hip","తుంటి","o_hip"],["Ankle or foot","చీలమండ / పాదం","o_foot"],["A fall or accident","ప్రమాదం","o_inj"]]},
 o_knee:{note:["Area","Knee"],say:["Knee problems are among the most common things I see, and most improve with the right care."],go:"o_how"},
 o_back:{note:["Area","Back or neck"],say:["Back and neck pain can come from muscles, discs or nerves. A few questions will help."],go:"o_how"},
 o_arm:{note:["Area","Shoulder, elbow or wrist"],say:["Let's look at your arm."],go:"o_how"},
 o_hip:{note:["Area","Hip"],say:["Hip pain can affect walking and sleep. Let me understand it better."],go:"o_how"},
 o_foot:{note:["Area","Ankle or foot"],say:["Ankle and foot problems often follow a twist or long hours of standing."],go:"o_how"},
 o_how:{say:["How did it start?"],q:"How it started",opts:[["After a fall or injury","గాయం తర్వాత","o_inj"],["Slowly, over time","నెమ్మదిగా","o_dur"],["I'm not sure","తెలియదు","o_dur"]]},
 o_inj:{note:["Cause","Injury or accident"],say:["I'm sorry that happened.","Which of these is true right now?"],q:"Right now",opts:[["Bone looks bent, or I can't move it at all","కదపలేను","e_o_fracture"],["Severe swelling, can't put weight on it","చాలా వాపు","e_o_xray"],["Pain and mild swelling, but I can move it","కొంచెం వాపు","e_o_sprain"]]},
 o_dur:{say:["How long have you had this problem?"],q:"Duration",opts:[["Less than 2 weeks","2 వారాల లోపు","o_sym"],["2 weeks to 3 months","2 వారాలు – 3 నెలలు","o_sym"],["More than 3 months","3 నెలలకు పైగా","o_sym"]]},
 o_sym:{say:["Do you notice any of these?"],q:"Other symptoms",opts:[["Numbness or tingling going down the arm or leg","తిమ్మిర్లు","e_o_nerve"],["Leg weakness, or trouble controlling urine or stools","కాళ్ళ బలహీనత","e_o_spine"],["Stiffness and swelling, worse in the mornings","ఉదయం బిగుసుకుపోవడం","e_o_arth"],["Pain on stairs, squatting or sitting cross-legged","మెట్లు ఎక్కేటప్పుడు నొప్పి","e_o_oa"],["None of these","ఏదీ కాదు","e_o_routine"]]},
 e_o_fracture:{end:"emergency",say:["This needs urgent care. Keep the limb still and support it with a folded cloth or cardboard as a splint. Don't try to straighten it.","Call 108 for an ambulance, or come straight to the hospital."]},
 e_o_xray:{end:"soon",say:["Please get an X-ray today. A hidden fracture can heal in the wrong position. Our radiology unit is open 8 AM – 5 PM.","Until then, rest it, apply ice wrapped in a cloth for 15 minutes at a time, and keep it raised. Please avoid massage or bone-setting before it is checked."]},
 e_o_sprain:{end:"soon",say:["This is often a sprain, but an X-ray rules out a small crack.","Rest it, use ice and keep it raised. If pain or swelling increases over the next day, come in sooner."]},
 e_o_nerve:{end:"soon",say:["Pain that travels down the arm or leg often comes from a pressed nerve in the neck or back. It usually gets better with the right treatment.","Let me examine you properly. Until then, avoid lifting heavy weights."]},
 e_o_spine:{end:"emergency",say:["Leg weakness or loss of bladder or bowel control with back pain can mean a nerve is badly pressed.","Please come to the hospital today, or call 108."]},
 e_o_arth:{end:"routine",say:["Morning stiffness and swelling can be a sign of arthritis. Treating it early protects the joint.","When we meet, I may suggest a blood test and an X-ray."]},
 e_o_oa:{end:"routine",say:["Pain on stairs or squatting is common with knee wear and tear (osteoarthritis).","Most people improve with exercises, weight care and medicine. Joint replacement is only for advanced cases. Let's check how your joint is doing."]},
 e_o_routine:{end:"routine",say:["Thank you. I'd like to examine you to find the cause.","Please bring any old X-rays or reports."]},
 p_start:{say:["Hello, I'm Dr. Kavya Yalamanchili.","I look after the lungs and breathing. First, do you have any of these right now?"],q:"Warning signs",opts:[["Severe breathlessness, even at rest","విశ్రాంతిలో కూడా ఆయాసం","e_p_sos"],["Blue lips or chest pain","నీలం పెదవులు / ఛాతీ నొప్పి","e_p_sos"],["Coughing up blood","దగ్గులో రక్తం","e_p_sos"],["No, none of these","ఏదీ లేదు","p_what"]]},
 p_cough_q:{say:["Hello, I'm Dr. Kavya Yalamanchili. Let's talk about your cough."],note:["Main problem","Cough"],go:"p_cough"},
 p_what:{note:["Warning signs","None"],say:["Good. What is troubling you most?"],q:"Main problem",opts:[["Cough","దగ్గు","p_cough"],["Breathlessness","ఆయాసం","p_breath"],["Wheezing or asthma","ఆస్తమా","p_asthma"],["Allergy or sneezing","అలర్జీ","p_allergy"],["Snoring or poor sleep","గురక","p_snore"],["Worried about TB","టీబీ","p_tb"]]},
 p_cough:{say:["How long have you had the cough?"],q:"Cough duration",opts:[["Less than 3 weeks","3 వారాల లోపు","p_cough_s"],["3 weeks or more","3 వారాలు లేదా ఎక్కువ","p_tbcheck"]]},
 p_cough_s:{say:["Do you have fever, or yellow or green phlegm?"],q:"Fever or phlegm",opts:[["Yes","అవును","e_p_infect"],["No","లేదు","e_p_short"]]},
 p_tbcheck:{say:["Have you noticed fever in the evenings, weight loss, or night sweats?"],q:"Fever, weight loss, sweats",opts:[["Yes","అవును","e_p_tb"],["No","లేదు","p_smoke"]]},
 p_smoke:{say:["Do you smoke now or did you earlier, cook over a firewood stove, or work around dust or fumes?"],q:"Smoke or dust exposure",opts:[["Yes","అవును","e_p_copd"],["No","లేదు","e_p_long"]]},
 p_breath:{say:["When do you feel breathless?"],q:"Breathless when",opts:[["Only when climbing stairs or walking fast","మెట్లు ఎక్కేటప్పుడు","p_smoke"],["Even with light work","చిన్న పనికే","e_p_breath"],["At night, it wakes me up","రాత్రి వేళ","e_p_breath"]]},
 p_asthma:{say:["How often do you need your reliever inhaler, or get attacks?"],q:"Asthma control",opts:[["Rarely","అరుదుగా","e_p_asthma_ok"],["Every week","ప్రతి వారం","e_p_asthma_poor"],["Most days or nights","దాదాపు రోజూ","e_p_asthma_poor"],["I don't have an inhaler","ఇన్హేలర్ లేదు","e_p_asthma_new"]]},
 p_allergy:{say:["Does it come with wheezing or tightness in the chest?"],q:"Wheeze with allergy",opts:[["Yes","అవును","e_p_asthma_new"],["No","లేదు","e_p_allergy"]]},
 p_snore:{say:["Do you stop breathing or gasp in your sleep, or feel very sleepy during the day?"],q:"Gasping or daytime sleepiness",opts:[["Yes","అవును","e_p_osa"],["No","లేదు","e_p_snore"]]},
 p_tb:{say:["Which of these describes you?"],q:"TB concern",opts:[["Cough for 2+ weeks with fever or weight loss","జ్వరంతో దగ్గు","e_p_tb"],["Someone at home has TB","ఇంట్లో ఎవరికైనా టీబీ","e_p_tbc"],["I had TB before and still have symptoms","గతంలో టీబీ","e_p_tbo"]]},
 e_p_sos:{end:"emergency",say:["Please don't wait. Sit upright, loosen tight clothing, and use your reliever inhaler if you have one.","Call 108 now, or come straight to the hospital."]},
 e_p_infect:{end:"soon",say:["This sounds like a chest infection. Drink warm fluids and rest.","Please see me in the next day or two, sooner if breathing gets harder. Don't take leftover antibiotics on your own."]},
 e_p_short:{end:"routine",say:["Most short coughs settle on their own. Warm fluids and steam can help.","If it lasts beyond three weeks, or you get fever or breathlessness, come and see me."]},
 e_p_tb:{end:"soon",say:["A long cough with fever, weight loss or night sweats needs a TB test and a chest X-ray. TB is fully curable with the right treatment.","Please book soon, and cover your mouth when you cough until then."]},
 e_p_copd:{end:"routine",say:["Years of smoke or dust can lead to COPD. A simple lung function test, called spirometry, shows how well your lungs are working.","If you smoke, stopping is the single best step for your lungs."]},
 e_p_long:{end:"routine",say:["A cough lasting more than three weeks should be checked. Common causes include allergy, asthma, acid reflux and post-nasal drip.","We'll find what's behind yours."]},
 e_p_breath:{end:"soon",say:["Breathlessness with light activity, or at night, needs a check soon. Please book in the next few days.","If it suddenly gets worse, call 108."]},
 e_p_asthma_ok:{end:"routine",say:["That sounds well controlled. A yearly review helps check your inhaler technique and dose."]},
 e_p_asthma_poor:{end:"soon",say:["Needing your inhaler this often means your asthma isn't controlled yet. A preventer inhaler and the right technique can change that.","Please book soon, and bring all your inhalers."]},
 e_p_asthma_new:{end:"routine",say:["Wheezing and chest tightness can be asthma. A breathing test can confirm it, and the right inhaler makes a big difference."]},
 e_p_allergy:{end:"routine",say:["Nose allergies are common and treatable. Notice what sets it off, like dust, pollen or smoke, and tell me when we meet."]},
 e_p_osa:{end:"soon",say:["Gasping in sleep and daytime sleepiness can be sleep apnoea. It affects your heart and energy, and it is treatable.","I may suggest a sleep study."]},
 e_p_snore:{end:"routine",say:["Snoring alone is common. Weight, sleep position and a blocked nose all play a part. Let's check if anything else is going on."]},
 e_p_tbc:{end:"soon",say:["Everyone living with a person who has TB should be checked, even without symptoms, and especially children.","Please book a screening visit."]},
 e_p_tbo:{end:"soon",say:["Symptoms after TB treatment need a careful review.","Please bring all your old reports and X-rays."]}
};
const LVL={emergency:["Urgent: act now","అత్యవసరం"],soon:["See a doctor soon","త్వరగా చూపించుకోండి"],routine:["Book a routine visit","సాధారణ సందర్శన"]};

/* ---------- chat engine ---------- */
const chat={doc:null,notes:[],token:0,speak:false};
const log=$("#log");
const scrollLog=()=>{log.scrollTop=log.scrollHeight};
const avHtml=()=>{const d=chat.doc?DOC[chat.doc]:null;return '<span class="av sm '+(d?d.cls:"")+'" aria-hidden="true">'+(d?d.ini:"SL")+'</span>'};
function setDoc(k){chat.doc=k;
  $$("[data-pickdoc]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.pickdoc===k)));
  const av=$("#chatAv");
  if(k){const d=DOC[k];av.className="av sm "+d.cls;av.textContent=d.ini;$("#chatName").textContent=d.name;$("#chatSub").textContent=chatSub(k)}
  else{av.className="av sm";av.textContent="SL";$("#chatName").textContent="Sri Lalitha care desk";$("#chatSub").textContent="Pick a doctor or describe your problem"}}
function bubble(text,me){
  const last=log.lastElementChild,m=document.createElement("div");m.className="msg"+(me?" me":"");
  if(!me&&last&&last.classList.contains("msg")&&!last.classList.contains("me"))m.classList.add("cont");
  m.innerHTML=(me?"":avHtml())+'<div class="b">'+esc(text)+'</div>';log.appendChild(m);scrollLog();return m}
function typing(){const t=document.createElement("div");t.className="msg typing";
  const last=log.lastElementChild;if(last&&last.classList.contains("msg")&&!last.classList.contains("me"))t.classList.add("cont");
  t.innerHTML=avHtml()+'<div class="b" aria-label="typing"><i></i><i></i><i></i></div>';log.appendChild(t);scrollLog();return t}
const wait=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
function speak(text){try{if(!chat.speak||!window.speechSynthesis)return;const u=new SpeechSynthesisUtterance(text);u.lang="en-IN";u.rate=.98;speechSynthesis.speak(u)}catch(e){}}
async function doctorSays(lines,tok){
  for(const l of lines){const t=typing();await wait(Math.min(1500,450+l.length*14));if(tok!==chat.token){t.remove();return false}t.remove();bubble(l);speak(l)}
  return true}
const clearOpts=()=>$$(".log .opts").forEach(o=>o.remove());
function addNote(q,a){chat.notes.push([q,a]);renderNotes()}
function renderNotes(){$("#notes").innerHTML=chat.notes.map(([q,a])=>"<li><span>"+esc(q)+"</span><b>"+esc(a)+"</b></li>").join("");$("#notesEmpty").hidden=chat.notes.length>0}
function options(list,onPick){const w=document.createElement("div");w.className="opts";
  list.forEach(([l,te,v])=>{const b=document.createElement("button");b.type="button";b.innerHTML=esc(l)+(te?"<small>"+esc(te)+"</small>":"");b.addEventListener("click",()=>onPick(l,v));w.appendChild(b)});
  log.appendChild(w);scrollLog()}
async function run(id){
  const tok=chat.token,n=N[id];if(!n)return;
  if(n.note)addNote(n.note[0],n.note[1]);
  if(!(await doctorSays(n.say,tok)))return;
  if(n.go)return run(n.go);
  if(n.opts){options(n.opts,(label,next)=>{clearOpts();bubble(label,true);addNote(n.q,label);run(next)});return}
  if(n.end)result(n.end,tok)}
async function result(level,tok){
  await wait(300);if(tok!==chat.token)return;
  const d=DOC[chat.doc],r=document.createElement("div"),em=level==="emergency";r.className="result";
  r.innerHTML='<span class="lvl '+level+'">'+LVL[level][0]+' · <span class="te">'+LVL[level][1]+'</span></span>'+
    (em?'<p>Ambulance: <span class="num">108</span>. Hospital: <span class="num">+91 63052 01435</span></p>':'<p>Book a visit with '+d.name+'. OPD every day, '+d.hours+'. Online consultations on weekends, 2 – 6 PM. Your notes go with your booking.</p>')+
    '<div class="acts">'+(em?'<a class="btn btn-primary btn-sm" href="tel:108">Call 108</a><a class="btn btn-ghost btn-sm" href="tel:+916305201435">Call hospital</a>':'<a class="btn btn-primary btn-sm" href="#book" data-bookdoc="'+chat.doc+'">Book a visit</a><a class="btn btn-ghost btn-sm" href="#book" data-bookdoc="'+chat.doc+'" data-bookmode="online">Online consult</a>')+
    '<button class="btn btn-ghost btn-sm" type="button" data-other>Ask about something else</button></div>';
  log.appendChild(r);scrollLog();addNote("Guidance",LVL[level][0]);
  r.querySelector("[data-other]").addEventListener("click",e=>{e.currentTarget.remove();startWelcome(true)})}
function reset(){chat.token++;chat.notes=[];renderNotes();log.innerHTML="";try{speechSynthesis.cancel()}catch(e){}}
function startWith(doc,node){reset();setDoc(doc);run(node||DOC[doc].start)}
async function startWelcome(keep){
  if(!keep)reset();else chat.token++;setDoc(null);const tok=chat.token;
  if(!(await doctorSays(["Welcome to Sri Lalitha Orthopaedic & Chest Care.","Who would you like to talk to? You can also type your problem in your own words."],tok)))return;
  options([["Dr. Rakesh: bones, joints, injuries","ఎముకలు, కీళ్ళు","ortho"],["Dr. Kavya: cough, breathing, lungs","దగ్గు, ఆయాసం","chest"]],(l,v)=>{clearOpts();bubble(l,true);setDoc(v);run(DOC[v].start)})}
const KW={
  sos:/chest pain|blood|can'?t breathe|cannot breathe|unconscious|blue lips|ఛాతీ నొప్పి|రక్తం/i,
  o_inj:/fall|fell|accident|fracture|broke|broken|injur|sprain|twist|ప్రమాద|పడిపో|విరిగ/i,
  o_knee:/knee|మోకాలి|మోకాలు/i, o_back:/back|neck|spine|disc|sciatica|నడుము|మెడ|వెన్ను/i,
  o_hip:/hip|తుంటి/i, o_arm:/shoulder|elbow|wrist|hand|arm|భుజ|మణికట్టు/i, o_foot:/ankle|foot|heel|పాదం|మడమ/i,
  o_start:/bone|joint|pain|arthritis|ఎముక|కీళ్ళ|నొప్పి/i,
  p_cough_q:/cough|phlegm|sputum|దగ్గు|కఫం/i, p_asthma:/asthma|wheez|inhaler|ఆస్తమా/i, p_tb:/\btb\b|tubercul|టీబీ/i,
  p_snore:/snor|sleep|గురక|నిద్ర/i, p_allergy:/allerg|sneez|అలర్జీ|తుమ్ము/i, p_start:/breath|lung|chest|copd|ఆయాసం|ఊపిరి|శ్వాస/i
};
function route(text){if(KW.sos.test(text))return["sos"];for(const k in KW){if(k!=="sos"&&KW[k].test(text))return[k.startsWith("o_")?"ortho":"chest",k]}return null}
async function freeText(text){
  bubble(text,true);const r=route(text);
  if(r&&r[0]==="sos"){clearOpts();chat.token++;if(!chat.doc)setDoc("chest");const tok=chat.token;addNote("You said",text);if(await doctorSays(["What you describe can be serious. Please don't wait for a booking."],tok))result("emergency",tok);return}
  const pending=log.querySelector(".opts");
  if(!chat.doc||!pending||log.querySelector(".result")){
    if(r){clearOpts();chat.token++;setDoc(r[0]);addNote("You said",text);run(r[1]);return}
    clearOpts();chat.token++;const tok=chat.token;
    if(!(await doctorSays(["Thank you for telling me. Is this about bones, joints or an injury, or about cough, breathing or the lungs?"],tok)))return;
    options([["Bones, joints or injury","ఎముకలు, కీళ్ళు","ortho"],["Cough, breathing or lungs","దగ్గు, ఆయాసం","chest"]],(l,v)=>{clearOpts();bubble(l,true);addNote("You said",text);setDoc(v);run(DOC[v].start)});return}
  addNote("You added",text);pending.remove();const tok=chat.token;
  if(await doctorSays(["Thank you, I've added that to your notes. Please choose the closest answer below."],tok)){log.appendChild(pending);scrollLog()}}
$("#compose").addEventListener("submit",e=>{e.preventDefault();const v=$("#composeIn").value.trim();if(!v)return;$("#composeIn").value="";freeText(v)});
$("#resetBtn").addEventListener("click",()=>chat.doc?startWith(chat.doc):startWelcome());
$("#speakBtn").addEventListener("click",e=>{chat.speak=!chat.speak;e.currentTarget.setAttribute("aria-pressed",String(chat.speak));if(!chat.speak){try{speechSynthesis.cancel()}catch(x){}}toast(chat.speak?"Replies will be read aloud":"Read aloud is off")});
$$("[data-pickdoc]").forEach(b=>b.addEventListener("click",()=>startWith(b.dataset.pickdoc)));
let pendingStart=null;
function applyPending(){if(pendingStart){const [d,n]=pendingStart;pendingStart=null;startWith(d,n)}else if(!log.children.length)startWelcome()}
$("#askForm").addEventListener("submit",e=>{e.preventDefault();const v=$("#askIn").value.trim();if(!v){$("#askIn").focus();return}$("#askIn").value="";pendingStart=null;
  const go=()=>{reset();freeText(v)};if(location.hash==="#talk")go();else{pendingAsk=go;location.hash="talk"}});
let pendingAsk=null;

/* ---------- typewriter previews ---------- */
const PREV={ortho:["Namaskaram! Where does it hurt?","Had a fall? Let's check if you need an X-ray.","Knee pain on the stairs? Tell me more."],chest:["Hello! How long have you had the cough?","Do you feel breathless on the stairs?","Let's get your asthma under control."]};
$$("[data-typer]").forEach(el=>{const list=PREV[el.dataset.typer];let i=0;
  if(reduce){el.textContent=list[0];return}
  (async()=>{for(;;){const s=list[i++%list.length];for(let c=1;c<=s.length;c++){el.innerHTML=esc(s.slice(0,c))+'<span class="cur"></span>';await new Promise(r=>setTimeout(r,38))}await new Promise(r=>setTimeout(r,2600))}})()});

/* ---------- body map: symptom explorer ---------- */
const AREAS=[
 {id:"knee",x:84,y:300,label:"Knee",te:"మోకాలు",doc:"ortho",node:"o_knee",
  sym:{a:"Pain on stairs, squatting or sitting cross-legged",b:"Stiffness in the morning that eases within 30 minutes",c:"Crackling or grinding when the knee moves",d:"Knee locks or catches",e:"Knee gives way or feels unstable",f:"Heard a pop at the time of injury",g:"Swelling soon after a twist or sports injury",h:"Pain at the front of the knee after sitting long",i:"Swelling in both knees and in finger joints",j:"Age above 45"},
  cond:[
   {n:"Knee osteoarthritis",s:"abcj",l:"routine",about:"Wear of the cartilage cushion inside the knee. The most common cause of knee pain after 45.",care:"X-ray in our radiology unit, then exercises, weight care, medicines and injections. Knee replacement is for advanced cases."},
   {n:"Meniscus tear",s:"dga",l:"soon",about:"A tear in the C-shaped cartilage pad of the knee, usually from twisting while the foot is planted.",care:"Examination, X-ray and MRI if needed. Physiotherapy for most; surgery if the knee keeps locking."},
   {n:"ACL ligament injury",s:"feg",l:"soon",about:"A tear of the main ligament that keeps the knee stable. Common in sports and two-wheeler falls.",care:"Bracing and physiotherapy. Ligament reconstruction for active people whose knee keeps giving way."},
   {n:"Patellofemoral pain",s:"ha",l:"routine",about:"Pain behind the kneecap, common in young and active people.",care:"Strengthening exercises, activity changes and footwear advice."},
   {n:"Rheumatoid arthritis",s:"ib",l:"soon",about:"An inflammatory arthritis that affects many joints on both sides of the body.",care:"Blood tests and early medicines to protect the joints from damage."}]},
 {id:"back",x:100,y:178,label:"Lower back",te:"నడుము",doc:"ortho",node:"o_back",
  sym:{a:"Pain started after lifting or bending",b:"Pain shoots down the leg below the knee",c:"Numbness or tingling in the leg or foot",d:"Worse on sitting, bending or coughing",e:"Stiffness, worse in the morning or after standing",f:"Legs feel heavy on walking, better on sitting",g:"Weakness in the legs",h:"Trouble controlling urine or stools",i:"Age above 40"},
  cond:[
   {n:"Back muscle strain",s:"a",l:"routine",about:"Overstretched back muscles. Usually settles in 2 to 6 weeks.",care:"Short rest and pain relief, then gentle movement and exercises."},
   {n:"Slip disc with sciatica",s:"bcd",l:"soon",about:"A bulging disc presses on a nerve and sends pain down the leg.",care:"X-ray and MRI. Most people improve with medicines and physiotherapy; a few need surgery."},
   {n:"Lumbar spondylosis",s:"ei",l:"routine",about:"Age-related wear of the discs and small joints of the spine.",care:"X-ray, posture correction, core strengthening and medicines."},
   {n:"Lumbar canal stenosis",s:"fic",l:"soon",about:"Narrowing of the spinal canal that squeezes the nerves when you walk.",care:"MRI, medicines and physiotherapy. Surgery if your walking distance keeps falling."},
   {n:"Cauda equina syndrome",s:"gh",l:"emergency",about:"Severe pressure on the bundle of nerves at the base of the spine.",care:"This is an emergency. Come to the hospital immediately or call 108."}]},
 {id:"neck",x:100,y:70,label:"Neck",te:"మెడ",doc:"ortho",node:"o_back",
  sym:{a:"Stiffness, worse after phone or desk work",b:"Pain or tingling going into the arm or fingers",c:"Started suddenly after sleeping awkwardly",d:"Headache starting at the back of the neck",e:"Weak grip or clumsy hands",f:"Age above 40"},
  cond:[
   {n:"Cervical spondylosis",s:"adf",l:"routine",about:"Wear of the discs and joints of the neck.",care:"X-ray, posture correction, neck exercises and medicines."},
   {n:"Pinched nerve in the neck",s:"b",l:"soon",about:"A nerve in the neck is pressed, sending pain or tingling into the arm.",care:"Examination, X-ray or MRI, medicines and physiotherapy."},
   {n:"Neck muscle spasm",s:"ca",l:"routine",about:"A sudden painful tightening of the neck muscles.",care:"Warm compresses, gentle movement and short-term pain relief."},
   {n:"Pressure on the spinal cord",s:"eb",l:"soon",about:"Narrowing in the neck that presses on the spinal cord, affecting the hands and walking.",care:"An MRI soon. Surgery may be needed to protect the cord."}]},
 {id:"shoulder",x:62,y:92,label:"Shoulder",te:"భుజం",doc:"ortho",node:"o_arm",
  sym:{a:"Shoulder slowly became stiff over weeks",b:"Can't reach behind the back or comb hair",c:"Pain when lifting the arm overhead",d:"Pain at night when lying on that side",e:"Shoulder looks out of shape after a fall",f:"I have diabetes",g:"Weakness lifting the arm"},
  cond:[
   {n:"Frozen shoulder",s:"abfd",l:"routine",about:"The shoulder capsule tightens, so movement becomes painful and limited. Common between 40 and 60, and in people with diabetes.",care:"Physiotherapy, medicines and injections. Most recover fully over months."},
   {n:"Rotator cuff problem",s:"cdg",l:"routine",about:"Inflammation or a tear of the tendons that lift and turn the arm.",care:"X-ray and ultrasound or MRI, exercises and injections. Repair surgery for large tears."},
   {n:"Shoulder dislocation",s:"e",l:"emergency",about:"The ball of the shoulder has come out of its socket.",care:"Don't try to push it back. Support the arm and come to the hospital or call 108."}]},
 {id:"arm",x:44,y:150,label:"Elbow, wrist & hand",te:"మోచేయి, మణికట్టు",doc:"ortho",node:"o_arm",
  sym:{a:"Pain on the outer elbow when gripping or lifting",b:"Tingling in thumb, index and middle fingers",c:"Hand numbness that wakes you at night",d:"Fell on an outstretched hand",e:"Wrist swollen or looks bent",f:"Pain at the thumb side of the wrist",g:"Recently had a baby, or lift a child often"},
  cond:[
   {n:"Tennis elbow",s:"a",l:"routine",about:"Overuse of the forearm tendons where they attach to the outer elbow.",care:"Rest, a forearm strap, exercises and sometimes an injection."},
   {n:"Carpal tunnel syndrome",s:"bc",l:"routine",about:"A pressed nerve at the wrist causing tingling in the fingers.",care:"Night splints and medicines. A small release operation if it persists."},
   {n:"Wrist fracture",s:"de",l:"soon",about:"A break in the wrist bones, usually from a fall on the hand.",care:"X-ray the same day. Plaster for most; fixation surgery if the bone has shifted."},
   {n:"De Quervain's tenosynovitis",s:"fg",l:"routine",about:"Inflamed tendons on the thumb side of the wrist, common in new mothers.",care:"A thumb splint, rest and sometimes an injection."}]},
 {id:"hip",x:76,y:214,label:"Hip",te:"తుంటి",doc:"ortho",node:"o_hip",
  sym:{a:"Pain in the groin or front of the hip",b:"Hard to wear footwear or sit cross-legged",c:"Hip stiffness and limping",d:"An older person fell and can't stand",e:"Leg looks shorter or turned outward after a fall",f:"Long-term steroid use or regular alcohol",g:"Pain on the outer hip when lying on that side"},
  cond:[
   {n:"Hip osteoarthritis",s:"abc",l:"routine",about:"Wear of the hip joint cartilage.",care:"X-ray, exercises and medicines. Hip replacement for advanced cases."},
   {n:"Hip fracture",s:"de",l:"emergency",about:"A break at the top of the thigh bone, common in older people after a fall.",care:"This needs urgent care and usually surgery. Call 108 or come straight in."},
   {n:"Avascular necrosis of the hip",s:"afc",l:"soon",about:"Loss of blood supply to the ball of the hip joint, often in adults aged 30 to 50.",care:"X-ray and MRI. Early treatment can save the joint."},
   {n:"Trochanteric bursitis",s:"g",l:"routine",about:"Inflammation of a fluid sac over the outer hip.",care:"Stretching, medicines and sometimes an injection."}]},
 {id:"ankle",x:116,y:384,label:"Ankle & foot",te:"చీలమండ, పాదం",doc:"ortho",node:"o_foot",
  sym:{a:"I twisted my ankle",b:"Swelling and bruising on the outer ankle",c:"Can't put weight on the foot after injury",d:"Heel pain with the first steps in the morning",e:"Numbness in the feet",f:"A wound on the foot that isn't healing",g:"I have diabetes"},
  cond:[
   {n:"Ankle sprain",s:"ab",l:"routine",about:"Stretched or torn ligaments on the outside of the ankle.",care:"Rest, ice, compression and raising the foot, then balance exercises."},
   {n:"Ankle or foot fracture",s:"ac",l:"soon",about:"A break in the ankle or foot bones.",care:"X-ray the same day. Plaster or fixation depending on the break."},
   {n:"Plantar fasciitis",s:"d",l:"routine",about:"Inflammation of the thick band under the foot, causing heel pain.",care:"Stretching, soft footwear, heel cups and sometimes an injection."},
   {n:"Diabetic foot",s:"efg",l:"soon",about:"Nerve damage and poor healing in the feet from diabetes.",care:"Please get the foot checked soon. Early wound care prevents serious infection."}]},
 {id:"chest",x:118,y:118,label:"Chest & lungs",te:"ఛాతీ, ఊపిరితిత్తులు",doc:"chest",node:"p_start",
  sym:{a:"Wheezing or whistling breath",b:"Attacks triggered by dust, smoke or cold",c:"Cough at night or early morning",d:"Smoker, or cooked over firewood for years",e:"Cough with phlegm most days for months",f:"Breathless on walking or climbing stairs",g:"Cough for more than 2 weeks",h:"Evening fever, weight loss or night sweats",i:"Fever with yellow or green phlegm",j:"Chest pain when taking a deep breath",k:"Heaviness on one side of the chest",l:"Loud snoring, gasping or daytime sleepiness"},
  cond:[
   {n:"Asthma",s:"abc",l:"routine",about:"The airways narrow and swell in response to triggers, causing wheeze and cough.",care:"A breathing test, the right preventer and reliever inhalers, and technique training at our pharmacy."},
   {n:"COPD",s:"def",l:"routine",about:"Long-term lung damage from smoke or dust that makes breathing harder over time.",care:"Spirometry, inhalers, help to stop smoking and breathing exercises."},
   {n:"Tuberculosis (TB)",s:"gh",l:"soon",about:"A bacterial infection of the lungs. Fully curable with a complete course of treatment.",care:"Chest X-ray in our radiology unit and sputum tests, then a supervised course of medicines."},
   {n:"Chest infection or pneumonia",s:"ij",l:"soon",about:"An infection in the airways or lungs.",care:"Examination, chest X-ray if needed, and the right antibiotics."},
   {n:"Fluid around the lung",s:"kfj",l:"soon",about:"Fluid collects between the lung and chest wall (pleural effusion), so the lung can't expand fully.",care:"Chest X-ray and ultrasound, then draining the fluid and treating the cause."},
   {n:"Obstructive sleep apnoea",s:"l",l:"soon",about:"The airway closes repeatedly during sleep, cutting oxygen and disturbing rest.",care:"A sleep study, weight and sleep advice, and CPAP therapy where needed."}]},
 {id:"sinus",x:100,y:44,label:"Nose & sinuses",te:"ముక్కు",doc:"chest",node:"p_allergy",
  sym:{a:"Bouts of sneezing",b:"Runny or blocked nose",c:"Itchy eyes or nose",d:"Worse with dust, pollen or seasons",e:"Pressure over the cheeks or forehead",f:"Thick yellow or green discharge",g:"Constant throat clearing or night cough"},
  cond:[
   {n:"Allergic rhinitis",s:"abcd",l:"routine",about:"The nose reacts to dust, pollen or smoke. Often goes with asthma.",care:"Finding your triggers, nasal sprays and antihistamines."},
   {n:"Sinusitis",s:"efb",l:"routine",about:"Inflamed or infected sinuses around the nose.",care:"Steam, saline rinses and medicines; antibiotics only when needed."},
   {n:"Post-nasal drip",s:"gb",l:"routine",about:"Mucus runs down the back of the throat, a common cause of long cough.",care:"Treating the nose allergy or infection behind it."}]}
];
const ORDER=["knee","back","neck","shoulder","arm","hip","ankle","chest","sinus"];
let cur=AREAS[0],ticked=new Set();
const hsG=$("#hotspots"),NS="http://www.w3.org/2000/svg";
AREAS.forEach(a=>{const g=document.createElementNS(NS,"g");g.setAttribute("class","hs "+(a.doc==="ortho"?"o":"c"));g.setAttribute("tabindex","0");g.setAttribute("role","button");g.setAttribute("aria-label",a.label);g.dataset.area=a.id;
  const right=a.x>100,tx=right?a.x+16:a.x-16;
  g.innerHTML='<circle class="ring" cx="'+a.x+'" cy="'+a.y+'" r="8"/><circle class="core" cx="'+a.x+'" cy="'+a.y+'" r="8"/><text x="'+tx+'" y="'+(a.y+3)+'" text-anchor="'+(right?"start":"end")+'">'+esc(a.label)+'</text>';
  g.addEventListener("click",()=>pickArea(a.id,true));g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pickArea(a.id,true)}});hsG.appendChild(g)});
$("#areaList").innerHTML=ORDER.map(id=>{const a=AREAS.find(x=>x.id===id);return '<button type="button" data-areabtn="'+id+'">'+esc(a.label)+'</button>'}).join("");
$("#areaList").addEventListener("click",e=>{const b=e.target.closest("[data-areabtn]");if(b)pickArea(b.dataset.areabtn,true)});
function pickArea(id,jump){cur=AREAS.find(x=>x.id===id)||AREAS[0];ticked=new Set();
  $$(".hs").forEach(h=>h.setAttribute("aria-pressed",String(h.dataset.area===cur.id)));
  $$("[data-areabtn]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.areabtn===cur.id)));
  const d=DOC[cur.doc];
  $("#explorer").innerHTML='<div class="ex-head"><div><p class="eyebrow">'+(cur.doc==="ortho"?"Bones &amp; joints":"Chest &amp; lungs")+'</p><h3>'+esc(cur.label)+'</h3><p class="te">'+esc(cur.te)+'</p></div>'+
    '<span class="who"><span class="av '+d.cls+' sm" aria-hidden="true">'+d.ini+'</span><span><b>'+d.name+'</b><span>'+d.role+'</span></span></span></div>'+
    '<fieldset class="sym"><legend>What do you feel?<span>Tick everything that applies. The best matches move to the top.</span></legend><div class="grid">'+
    Object.entries(cur.sym).map(([k,v])=>'<label><input type="checkbox" value="'+k+'" id="sym-'+cur.id+'-'+k+'"><span>'+esc(v)+'</span></label>').join("")+'</div></fieldset>'+
    '<div id="sosBox"></div><div class="conds" id="conds"></div>'+
    '<p class="fine">These are conditions that commonly match these symptoms. Only an examination can confirm the cause.</p>'+
    '<div class="acts"><a class="btn btn-primary" href="#talk" data-start="'+cur.doc+':'+cur.node+'">Talk to '+d.short+' about this</a><a class="btn btn-ghost" href="#book" data-bookdoc="'+cur.doc+'">Book a visit</a></div>';
  $$("#explorer .sym input").forEach(i=>i.addEventListener("change",()=>{i.checked?ticked.add(i.value):ticked.delete(i.value);renderConds()}));
  renderConds();
  if(jump&&matchMedia("(max-width:900px)").matches)$("#explorer").scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})}
function renderConds(){
  const list=cur.cond.map((c,i)=>{const sg=c.s.split(""),hit=sg.filter(x=>ticked.has(x)).length;return{...c,sg,hit,score:hit/sg.length,i}});
  const any=ticked.size>0;
  if(any)list.sort((a,b)=>b.score-a.score||b.hit-a.hit||a.i-b.i);
  const sos=list.find(c=>c.l==="emergency"&&c.hit>0);
  $("#sosBox").innerHTML=sos?'<div class="alert" role="alert"><span><b>Possible emergency: '+esc(sos.n)+'.</b> '+esc(sos.care)+'</span></div>':"";
  const topHit=any&&list[0].hit>0?list[0].n:null;
  $("#conds").innerHTML=list.map(c=>{const top=c.n===topHit,dim=any&&c.hit===0;
    return '<details class="cnd'+(top?" lead":"")+(dim?" dim":"")+'"'+(top?" open":"")+'><summary><span>'+(top?'<span class="best">Best match</span><br>':'')+'<span class="nm">'+esc(c.n)+'</span></span><span class="lvl '+c.l+'">'+LVL[c.l][0]+'</span>'+
      '<span class="meter"><span class="track"><i style="width:'+Math.round(c.score*100)+'%"></i></span>'+(any?c.hit+" of "+c.sg.length+" signs match":c.sg.length+" key signs")+'</span></summary>'+
      '<div class="bd"><p>'+esc(c.about)+'</p><div class="sg">'+c.sg.map(k=>'<span class="'+(ticked.has(k)?"hit":"")+'">'+esc(cur.sym[k])+'</span>').join("")+'</div><p><b>What we do:</b> '+esc(c.care)+'</p></div></details>'}).join("")}
pickArea("knee",false);

/* ---------- breathing ---------- */
const TECH={
  pursed:{desc:"Pursed-lip breathing slows your breathing and keeps the airways open longer. It helps with breathlessness from asthma and COPD.",steps:["Relax your neck and shoulders.","Breathe in through your nose for 2 counts.","Purse your lips as if to blow out a candle.","Breathe out slowly through your lips for 4 counts."],phases:[["Breathe in","through your nose",2,1],["Breathe out","through pursed lips",4,.55]]},
  belly:{desc:"Belly breathing trains your diaphragm, the main breathing muscle, so each breath takes less effort.",steps:["Sit or lie down comfortably.","Place one hand on your chest and one on your belly.","Breathe in through your nose for 4 counts, letting your belly rise.","Breathe out gently for 6 counts, letting your belly fall."],phases:[["Breathe in","belly rises",4,1],["Breathe out","belly falls",6,.55]]}
};
let tech="pursed",orbRun=false,orbTok=0;
function setTech(t){tech=t;$$("[data-tech]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tech===t)));$("#techDesc").textContent=TECH[t].desc;$("#techSteps").innerHTML=TECH[t].steps.map(s=>"<li>"+esc(s)+"</li>").join("");stopOrb()}
$$("[data-tech]").forEach(b=>b.addEventListener("click",()=>setTech(b.dataset.tech)));
function stopOrb(){orbRun=false;orbTok++;$("#orbBtn").textContent="Start";const o=$("#orb");o.style.transitionDuration="1s";o.style.transform="scale(.55)";$("#orbWord").textContent="Ready";$("#orbCount").textContent="Press start";$("#orbCycles").textContent="0 of 8 breaths"}
async function startOrb(){orbRun=true;const tok=++orbTok;$("#orbBtn").textContent="Stop";const o=$("#orb");
  for(let c=1;c<=8;c++){$("#orbCycles").textContent=c+" of 8 breaths";
    for(const [w,sub,secs,scale] of TECH[tech].phases){if(tok!==orbTok)return;
      o.style.transitionDuration=secs+"s";o.style.transform="scale("+scale+")";$("#orbWord").textContent=w;
      for(let s=secs;s>0;s--){if(tok!==orbTok)return;$("#orbCount").textContent=sub+" · "+s;await new Promise(r=>setTimeout(r,1000))}}}
  if(tok===orbTok){orbRun=false;$("#orbBtn").textContent="Start again";$("#orbWord").textContent="Well done";$("#orbCount").textContent="Notice how you feel";o.style.transform="scale(.7)"}}
$("#orbBtn").addEventListener("click",()=>orbRun?stopOrb():startOrb());
setTech("pursed");

/* ---------- booking ---------- */
const book={step:0,doc:null,mode:"visit",day:null,slot:null,note:"",name:"",phone:""};
const dkey=d=>d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
function bookDays(){const out=[],t=ist();for(let i=0;out.length<7&&i<21;i++){const d=new Date(t.getFullYear(),t.getMonth(),t.getDate()+i);if(book.mode==="online"&&d.getDay()!==0&&d.getDay()!==6)continue;out.push(d)}return out}
function blocksFor(){return book.mode==="online"?HRS.online.blocks:HRS[book.doc].blocks}
function renderBook(){
  const el=$("#bookSteps"),s=book.step;
  $$(".stepper i").forEach((i,n)=>i.classList.toggle("on",n<=s));
  if(s===0){el.innerHTML='<div class="bstep"><p class="eyebrow">Step 1 of 4</p><h3>Who would you like to see?</h3><div class="bchoices">'+
    ["ortho","chest"].map(k=>{const d=DOC[k];return '<button type="button" class="bchoice" data-bdoc="'+k+'" aria-pressed="'+(book.doc===k)+'"><span class="av '+d.cls+' sm" aria-hidden="true">'+d.ini+'<i class="dot'+(state(k).open?" on":"")+'"></i></span><span><b>'+d.name+'</b><span>'+d.dept+'</span></span></button>'}).join("")+
    '</div><h4>How would you like to consult?</h4><div class="bchoices">'+
    '<button type="button" class="bchoice" data-bmode="visit" aria-pressed="'+(book.mode==="visit")+'"><span class="mi" aria-hidden="true"><svg><use href="#i-pin"/></svg></span><span><b>Visit the hospital</b><span>OPD every day</span></span></button>'+
    '<button type="button" class="bchoice" data-bmode="online" aria-pressed="'+(book.mode==="online")+'"><span class="mi" aria-hidden="true"><svg><use href="#i-video"/></svg></span><span><b>Online video consultation</b><span>Sat &amp; Sun, 2 PM – 6 PM</span></span></button>'+
    '</div><div class="bnav"><span></span><button class="btn btn-primary" type="button" data-bnext '+(book.doc?"":"disabled")+'>Continue</button></div></div>'}
  if(s===1){const d=DOC[book.doc],ds=bookDays();if(!ds.some(x=>dkey(x)===book.day))book.day=dkey(ds[0]);
    const sel=ds.find(x=>dkey(x)===book.day),t=ist(),isToday=dkey(sel)===dkey(t),now=t.getHours()+t.getMinutes()/60;
    let slots="";blocksFor().forEach(([a,b])=>{slots+='<span class="grp">'+(book.mode==="online"?"Online":a<12?"Morning":a<17?"Afternoon":"Evening")+'</span>';for(let h=a;h<b;h+=.5){const v=fmt(h),dis=isToday&&h<=now;slots+='<button type="button" class="slot" data-slot="'+v+'" aria-pressed="'+(book.slot===v)+'" '+(dis?"disabled":"")+'>'+v.replace(" ","\u00a0")+'</button>'}});
    el.innerHTML='<div class="bstep"><p class="eyebrow">Step 2 of 4 · '+d.name+' · '+(book.mode==="online"?"Online":"Hospital visit")+'</p><h3>Pick a day and time</h3><div class="days">'+
      ds.map(x=>'<button type="button" class="day" data-day="'+dkey(x)+'" aria-pressed="'+(dkey(x)===book.day)+'"><small>'+(dkey(x)===dkey(t)?"Today":x.toLocaleDateString("en-IN",{weekday:"short"}))+'</small><b>'+x.getDate()+'</b><small>'+x.toLocaleDateString("en-IN",{month:"short"})+'</small></button>').join("")+
      '</div><div class="slots">'+slots+'</div><div class="bnav"><button class="btn btn-ghost" type="button" data-bback>Back</button><button class="btn btn-primary" type="button" data-bnext '+(book.slot?"":"disabled")+'>Continue</button></div></div>'}
  if(s===2){el.innerHTML='<div class="bstep"><p class="eyebrow">Step 3 of 4</p><h3>Your details</h3><form id="bform" novalidate><div class="fgrid">'+
    '<div class="f"><label for="bn">Patient name</label><input id="bn" autocomplete="name" value="'+esc(book.name)+'"><span class="err" id="bn-e" hidden>Enter the patient\'s name.</span></div>'+
    '<div class="f"><label for="bp">Mobile number</label><input id="bp" inputmode="numeric" autocomplete="tel" placeholder="10-digit number" value="'+esc(book.phone)+'"><span class="err" id="bp-e" hidden>Enter a 10-digit mobile number starting with 6, 7, 8 or 9.</span></div>'+
    '<div class="f full"><label for="br">Reason for visit</label><textarea id="br" placeholder="For example: knee pain for 3 months">'+esc(book.note)+'</textarea></div></div>'+
    '<div class="bnav"><button class="btn btn-ghost" type="button" data-bback>Back</button><button class="btn btn-primary" type="submit">Review request</button></div></form></div>';
    $("#bform").addEventListener("submit",e=>{e.preventDefault();const n=$("#bn").value.trim(),p=$("#bp").value.replace(/\D/g,"").slice(-10),okN=n.length>1,okP=/^[6-9]\d{9}$/.test(p);
      $("#bn-e").hidden=okN;$("#bp-e").hidden=okP;if(!okN){$("#bn").focus();return}if(!okP){$("#bp").focus();return}
      book.name=n;book.phone=p;book.note=$("#br").value.trim();book.step=3;renderBook()})}
  if(s===3){const d=DOC[book.doc],day=bookDays().find(x=>dkey(x)===book.day);
    el.innerHTML='<div class="bstep summary"><div class="ok-card"><h3>Request ready</h3><p>Our front desk will call <b>'+esc(book.phone)+'</b> to confirm'+(book.mode==="online"?" and share the video call details":"")+'.</p></div>'+
    '<div class="row"><span class="av '+d.cls+'" aria-hidden="true">'+d.ini+'</span><div><b>'+d.name+'</b><br><span class="fine">'+d.role+'</span></div></div>'+
    '<dl><dt>Type</dt><dd>'+(book.mode==="online"?"Online video consultation":"Hospital visit")+'</dd><dt>When</dt><dd>'+day.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})+', '+book.slot+'</dd><dt>Patient</dt><dd>'+esc(book.name)+'</dd>'+(book.note?'<dt>Reason</dt><dd>'+esc(book.note)+'</dd>':'')+'</dl>'+
    '<div class="acts"><a class="btn btn-wa" href="'+SL.bookingWa()+'" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"/></svg>Send on WhatsApp</a><button class="btn btn-ghost" type="button" data-ics>Add to calendar</button><a class="btn btn-ghost" href="tel:+916305201435">Call to confirm</a></div>'+
    '<p class="fine">Sending on WhatsApp shares these details with our front desk. Your booking is confirmed when our staff reply or call.</p>'+
    '<div class="bnav"><button class="btn btn-ghost" type="button" data-bback>Edit</button><button class="btn btn-primary" type="button" data-bnew>Book another visit</button></div></div>'}}
$("#bookSteps").addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;
  if(t.dataset.bdoc){book.doc=t.dataset.bdoc;book.slot=null;renderBook();return}
  if(t.dataset.bmode){book.mode=t.dataset.bmode;book.slot=null;book.day=null;renderBook();return}
  if(t.dataset.day){book.day=t.dataset.day;book.slot=null;renderBook();return}
  if(t.dataset.slot){book.slot=t.dataset.slot;renderBook();return}
  if(t.hasAttribute("data-bnext")){book.step++;renderBook();return}
  if(t.hasAttribute("data-bback")){if(book.step===2){book.name=$("#bn").value;book.phone=$("#bp").value;book.note=$("#br").value}book.step--;renderBook();return}
  if(t.hasAttribute("data-ics")){SL.bookingIcs();return}
  if(t.hasAttribute("data-bnew")){Object.assign(book,{step:0,doc:null,mode:"visit",day:null,slot:null,note:"",name:"",phone:""});renderBook()}});
renderBook();

/* ---------- global clicks ---------- */
document.addEventListener("click",e=>{
  const s=e.target.closest("[data-start]");
  if(s){e.preventDefault();const [d,n]=s.dataset.start.split(":");pendingStart=[d,n];if(location.hash==="#talk")applyPending();else location.hash="talk";return}
  const b=e.target.closest("[data-bookdoc],[data-bookmode]");
  if(b){const doc=b.dataset.bookdoc,mode=b.dataset.bookmode;
    if(doc){book.doc=doc}
    book.mode=mode||"visit";book.day=null;book.slot=null;
    const notes=chat.notes.filter(n=>n[0]!=="Guidance").map(n=>n[0]+": "+n[1]).join("; ");if(notes)book.note=notes;
    book.step=book.doc&&doc?1:0;renderBook()}
  const ot=e.target.closest("[data-opentool]");if(ot)setTimeout(()=>{const tb=document.querySelector('[data-tool="'+ot.dataset.opentool+'"]');tb&&tb.click()},50);
  const c=e.target.closest(".copy");
  if(c){const v=c.dataset.copy;navigator.clipboard.writeText(v).then(()=>toast("Number copied")).catch(()=>{const r=document.createRange();r.selectNodeContents(c.previousElementSibling);const sl=getSelection();sl.removeAllRanges();sl.addRange(r);toast("Number selected")})}});

/* ---------- router ---------- */
const VIEWS=["home","talk","body","doctors","rakesh","kavya","services","breathe","book","visit","tools","exercises","learn"];
const TITLES={home:"",talk:"Talk to a doctor · ",body:"Body map · ",doctors:"Doctors · ",rakesh:"Dr. Talasila Rakesh · ",kavya:"Dr. Kavya Yalamanchili · ",services:"Services · ",breathe:"Breathe · ",book:"Book · ",visit:"Visit · ",tools:"Health checks · ",exercises:"Exercises · ",learn:"Health library · "};
function router(){let v=(location.hash||"#home").slice(1);if(!VIEWS.includes(v))v="home";
  $$(".view").forEach(el=>el.hidden=el.dataset.view!==v);
  const navKey=(v==="rakesh"||v==="kavya")?"doctors":v;
  const tabKey=["exercises","learn","breathe"].includes(v)?"tools":navKey;
  $$(".subnav a").forEach(a=>{if(a.getAttribute("href")==="#"+v)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  $$(".nav a,.tabbar a,.sheet-in a").forEach(a=>{if(a.getAttribute("href")==="#"+tabKey||a.getAttribute("href")==="#"+v)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
  if(v!=="breathe"&&orbRun)stopOrb();
  if(v==="talk"){if(pendingAsk){const f=pendingAsk;pendingAsk=null;f()}else applyPending()}
  window.scrollTo(0,0);
  document.title=TITLES[v]+"Sri Lalitha Orthopaedic & Chest Care"}
addEventListener("hashchange",router);

function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,2200)}
const sb=$("#sizeBtn");function size(on){document.documentElement.classList.toggle("t1",on);sb.setAttribute("aria-pressed",String(on));store.set("sl-big",on?"1":"0")}
sb.addEventListener("click",()=>size(sb.getAttribute("aria-pressed")!=="true"));size(store.get("sl-big")==="1");


/* ---------- language ---------- */
const TE=SL.TE,EN={};
$$("[data-i18n]").forEach(e=>{if(!(e.dataset.i18n in EN))EN[e.dataset.i18n]=e.textContent});
$$("[data-i18n-html]").forEach(e=>{EN[e.dataset.i18nHtml]=e.innerHTML});
$$("[data-i18n-ph]").forEach(e=>{EN[e.dataset.i18nPh]=e.placeholder});
let lang="en";
function setLang(l){lang=l;const d=l==="te"?TE:EN;document.documentElement.lang=l==="te"?"te":"en";
  $$("[data-i18n]").forEach(e=>{const v=d[e.dataset.i18n];if(v!=null)e.textContent=v});
  $$("[data-i18n-html]").forEach(e=>{const v=d[e.dataset.i18nHtml];if(v!=null)e.innerHTML=v});
  $$("[data-i18n-ph]").forEach(e=>{const v=d[e.dataset.i18nPh];if(v!=null)e.placeholder=v});
  $$("[data-langbtn]").forEach(b=>{b.textContent=l==="te"?"English":"తెలుగు";b.classList.toggle("te",l!=="te");b.setAttribute("aria-label",l==="te"?"Switch to English":"తెలుగులో చూడండి")});
  store.set("sl-lang",l)}
$$("[data-langbtn]").forEach(b=>b.addEventListener("click",()=>setLang(lang==="te"?"en":"te")));

/* ---------- menu sheet ---------- */
const sheet=$("#sheet"),menuBtn=$("#menuBtn");
function openSheet(o){sheet.hidden=!o;menuBtn.setAttribute("aria-expanded",String(o));if(o)sheet.querySelector("a").focus()}
menuBtn.addEventListener("click",()=>openSheet(sheet.hidden));
sheet.addEventListener("click",e=>{if(e.target===sheet||e.target.closest("a")||e.target.closest("[data-close]"))openSheet(false)});
addEventListener("keydown",e=>{if(e.key==="Escape"&&!sheet.hidden)openSheet(false)});

/* ---------- WhatsApp & calendar helpers ---------- */
const wa=text=>"https://wa.me/"+SL.CONFIG.whatsapp+"?text="+encodeURIComponent(text);
function icsDate(d,h){const H=Math.floor(h),M=Math.round((h-H)*60),p=n=>String(n).padStart(2,"0");return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"T"+p(H)+p(M)+"00"}
function icsFile(events){const esc2=s=>String(s).replace(/[,;\\]/g,m=>"\\"+m).replace(/\n/g,"\\n");
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Sri Lalitha Orthopaedic & Chest Care//EN","CALSCALE:GREGORIAN"];
  events.forEach((ev,i)=>{lines.push("BEGIN:VEVENT","UID:"+Date.now()+"-"+i+"@srilalitha","DTSTAMP:"+new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z","DTSTART;TZID=Asia/Kolkata:"+ev.start,"DTEND;TZID=Asia/Kolkata:"+ev.end,"SUMMARY:"+esc2(ev.title),"DESCRIPTION:"+esc2(ev.desc||""));
    if(ev.rrule)lines.push("RRULE:"+ev.rrule);
    lines.push("BEGIN:VALARM","TRIGGER:-PT"+(ev.alarm||30)+"M","ACTION:DISPLAY","DESCRIPTION:"+esc2(ev.title),"END:VALARM","END:VEVENT")});
  lines.push("END:VCALENDAR");return lines.join("\r\n")}
function download(name,text){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/calendar"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast("Calendar file ready")}catch(e){toast("Downloads are blocked here. Try on the live site.")}}
SL.bookingIcs=()=>{const d=DOC[book.doc],day=bookDays().find(x=>dkey(x)===book.day);const m=book.slot.match(/(\d+):(\d+) (AM|PM)/);let h=(+m[1]%12)+(m[3]==="PM"?12:0)+(+m[2])/60;
  download("sri-lalitha-appointment.ics",icsFile([{start:icsDate(day,h),end:icsDate(day,h+.5),title:(book.mode==="online"?"Online consultation":"Appointment")+" with "+d.name,desc:"Sri Lalitha Orthopaedic & Chest Care, Tenali. Phone "+SL.CONFIG.phonePrimary+". Bring old reports and current medicines.",alarm:60}]))};
SL.bookingWa=()=>{const d=DOC[book.doc],day=bookDays().find(x=>dkey(x)===book.day);
  return wa("Namaskaram, I would like to book "+(book.mode==="online"?"an online video consultation":"a hospital visit")+".\nDoctor: "+d.name+"\nDate: "+day.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})+"\nTime: "+book.slot+"\nPatient: "+book.name+"\nMobile: "+book.phone+(book.note?"\nReason: "+book.note:""))};

/* ---------- health checks ---------- */
const TOOLS={};
TOOLS.asthma=()=>{const qs=["Daytime asthma symptoms more than twice a week","Waking up at night because of asthma","Needing your reliever inhaler more than twice a week","Any activity limited because of asthma"];
  return {html:'<div class="tool-card"><div><p class="eyebrow">In the last 4 weeks, have you had…</p><h3>Asthma control check</h3><p class="fine">Based on the symptom-control questions doctors use in asthma reviews.</p></div><div class="yn" id="tq">'+qs.map((q,i)=>'<fieldset><legend>'+esc(q)+'</legend><label><input type="radio" name="aq'+i+'" value="1" id="aq'+i+'y"> Yes</label><label><input type="radio" name="aq'+i+'" value="0" id="aq'+i+'n"> No</label></fieldset>').join("")+'</div><div class="tres" id="tres"><p class="fine">Answer all four questions to see your result.</p></div></div>',
  on(){$$("#tq input").forEach(i=>i.addEventListener("change",()=>{const v=qs.map((_,i)=>{const c=$('input[name="aq'+i+'"]:checked');return c?+c.value:null});if(v.includes(null))return;const s=v.reduce((a,b)=>a+b,0);
    const r=s===0?["routine","Well controlled","Keep using your preventer as prescribed and review once a year."]:s<=2?["soon","Partly controlled","Your treatment may need adjusting. Please book a review with Dr. Kavya."]:["emergency","Not controlled","Your asthma needs attention soon. Please book with Dr. Kavya this week. If you are breathless at rest, call 108."];
    toolResult(r,s+" of 4 signs","chest")}))}}};
TOOLS.copd=()=>{const qs=[["Are you 40 years or older?",1],["Have you smoked, or cooked over firewood or dung cakes, for 10 years or more?",2],["Do you cough up phlegm on most days?",1],["Do you get breathless walking on level ground with people your age?",1],["Have you had two or more chest infections in the last year?",1]];
  return {html:'<div class="tool-card"><div><p class="eyebrow">Five questions</p><h3>COPD risk check</h3><p class="fine">A quick screen to decide whether a lung function test (spirometry) is worth doing.</p></div><div class="yn" id="tq">'+qs.map(([q],i)=>'<fieldset><legend>'+esc(q)+'</legend><label><input type="radio" name="cq'+i+'" value="1" id="cq'+i+'y"> Yes</label><label><input type="radio" name="cq'+i+'" value="0" id="cq'+i+'n"> No</label></fieldset>').join("")+'</div><div class="tres" id="tres"><p class="fine">Answer all five questions to see your result.</p></div></div>',
  on(){$$("#tq input").forEach(i=>i.addEventListener("change",()=>{const v=qs.map((_,i)=>{const c=$('input[name="cq'+i+'"]:checked');return c?+c.value:null});if(v.includes(null))return;const s=v.reduce((a,b,i)=>a+b*qs[i][1],0);
    const r=s>=4?["soon","Higher risk","Your answers suggest COPD is possible. A spirometry test with Dr. Kavya is recommended."]:s>=2?["routine","Some risk","Consider a check-up, especially if you smoke or have a long cough."]:["routine","Low risk","Your answers don't point to COPD. See us if new symptoms appear."];
    toolResult(r,"Score "+s+" of 6","chest")}))}}};
TOOLS.knee=()=>{const qs=["Pain while walking","Pain climbing stairs","Pain getting up from a chair","Pain squatting or sitting cross-legged","Pain at night"];
  return {html:'<div class="tool-card"><div><p class="eyebrow">Rate each from 0 (none) to 10 (worst)</p><h3>Knee pain score</h3><p class="fine">Track your knee over time and share the number with Dr. Rakesh.</p></div><div class="sliders" id="tq">'+qs.map((q,i)=>'<div class="sl"><label for="kq'+i+'">'+esc(q)+'</label><input type="range" id="kq'+i+'" min="0" max="10" value="0"><output id="kq'+i+'o">0</output></div>').join("")+'</div><div class="tres" id="tres"></div></div>',
  on(){const up=()=>{let s=0;qs.forEach((_,i)=>{const v=+$("#kq"+i).value;$("#kq"+i+"o").textContent=v;s+=v});
    const r=s<=10?["routine","Mild","Keep active and try the knee exercises in our library."]:s<=30?["routine","Moderate","A check-up and X-ray can find the cause. Exercises help most people."]:["soon","Severe","Please book with Dr. Rakesh. Severe pain deserves a proper examination."];
    toolResult(r,s+" of 50","ortho")};$$("#tq input").forEach(i=>i.addEventListener("input",up));up()}}};
TOOLS.bmi=()=>({html:'<div class="tool-card"><div><p class="eyebrow">Weight and your joints</p><h3>BMI &amp; joint load</h3><p class="fine">Uses the BMI ranges recommended for Indian adults.</p></div><div class="fgrid"><div class="f"><label for="bh">Height (cm)</label><input id="bh" type="number" inputmode="decimal" min="100" max="230" value="160"></div><div class="f"><label for="bw">Weight (kg)</label><input id="bw" type="number" inputmode="decimal" min="25" max="250" value="70"></div></div><div class="tres" id="tres"></div></div>',
  on(){const up=()=>{const h=+$("#bh").value/100,w=+$("#bw").value;if(!(h>1&&w>20)){$("#tres").innerHTML='<p class="fine">Enter your height and weight.</p>';return}
    const b=w/(h*h),bmi=b.toFixed(1),target=(22.9*h*h),extra=Math.max(0,w-target);
    const r=b<18.5?["soon","Underweight","Low weight can weaken bones. Ask your doctor about diet and bone health."]:b<23?["routine","Healthy range","Your weight is in the healthy range for Indian adults."]:b<25?["routine","Overweight","Losing a few kilos takes real pressure off your knees and back."]:["soon","Obese range","Weight loss is one of the most effective treatments for knee and back pain."];
    toolResult(r,"BMI "+bmi,"ortho",extra>1?"Every 1 kg you lose takes about 4 kg of load off each knee with every step. Reaching "+Math.round(target)+" kg would remove roughly "+Math.round(extra*4)+" kg of knee load per step.":"")};
    ["#bh","#bw"].forEach(s=>$(s).addEventListener("input",up));up()}});
TOOLS.meds=()=>({html:'<div class="tool-card"><div><p class="eyebrow">Never miss a dose</p><h3>Medicine reminder</h3><p class="fine">Creates reminders in your phone calendar. Works for tablets, inhalers and exercises.</p></div><div class="fgrid"><div class="f full"><label for="mn">Medicine or task</label><input id="mn" placeholder="For example: Preventer inhaler, 2 puffs"></div><div class="f"><label for="mt">Times per day</label><select id="mt" class="sel"><option value="1">Once (8 AM)</option><option value="2" selected>Twice (8 AM, 8 PM)</option><option value="3">Three times (8 AM, 2 PM, 8 PM)</option></select></div><div class="f"><label for="md">For how many days</label><input id="md" type="number" min="1" max="365" value="30"></div></div><div class="acts"><button class="btn btn-primary" type="button" id="mgo">Add to my calendar</button></div><p class="fine">Your phone will ask to open the calendar file. Reminders stay on your phone only.</p></div>',
  on(){$("#mgo").addEventListener("click",()=>{const n=$("#mn").value.trim()||"Medicine",t=+$("#mt").value,days=Math.max(1,Math.min(365,+$("#md").value||30)),times=t===1?[8]:t===2?[8,20]:[8,14,20],d=ist();
    download("medicine-reminder.ics",icsFile(times.map(h=>({start:icsDate(d,h),end:icsDate(d,h+.25),title:n,desc:"Reminder from Sri Lalitha Orthopaedic & Chest Care",rrule:"FREQ=DAILY;COUNT="+days,alarm:0}))))})}});
TOOLS.aid=()=>({html:'<div class="tool-card"><div><p class="eyebrow">Until you reach the hospital</p><h3>Fracture first aid</h3></div><div class="two" style="margin-top:0"><div class="card" style="background:var(--ok-soft);border-color:transparent"><h3>Do</h3><ul><li>Keep the injured part still</li><li>Support it with a folded cloth, cardboard or a pillow as a splint</li><li>Apply ice wrapped in cloth to reduce swelling</li><li>Raise the limb if it is not too painful</li><li>Remove rings and bangles before swelling starts</li></ul></div><div class="card warnc"><h3>Don\'t</h3><ul><li>Don\'t try to straighten a bent bone</li><li>Don\'t massage or apply oil</li><li>Don\'t go for traditional bone-setting before an X-ray</li><li>Don\'t give food or drink if surgery may be needed</li><li>Don\'t move someone with a neck or back injury unless they are in danger</li></ul></div></div><div class="acts"><a class="btn btn-primary" href="tel:108">Call 108</a><a class="btn btn-ghost" href="tel:'+SL.CONFIG.phonePrimaryTel+'">Call the hospital</a></div></div>',on(){}});
function toolResult([lvl,title,text],score,doc,extra){const d=DOC[doc];
  $("#tres").innerHTML='<div class="tres-in"><span class="lvl '+lvl+'">'+esc(title)+'</span><b class="score">'+esc(score)+'</b><p>'+esc(text)+'</p>'+(extra?'<p class="fine">'+esc(extra)+'</p>':'')+'<div class="acts"><a class="btn btn-primary btn-sm" href="#book" data-bookdoc="'+doc+'">Book with '+d.short+'</a><a class="btn btn-ghost btn-sm" href="#talk" data-start="'+doc+':'+d.start+'">Talk to '+d.short+'</a></div></div>'}
function showTool(k){$$("[data-tool]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tool===k)));const t=TOOLS[k]();$("#toolPanel").innerHTML=t.html;t.on()}
$$("[data-tool]").forEach(b=>b.addEventListener("click",()=>showTool(b.dataset.tool)));
showTool("asthma");

/* ---------- exercise library ---------- */
let exCat="knee",exTok=0;
$("#exCats").innerHTML=Object.entries(SL.EXERCISES).map(([k,c])=>'<button type="button" role="tab" data-excat="'+k+'" aria-selected="'+(k===exCat)+'">'+esc(c.label)+'<small>'+esc(c.te)+'</small></button>').join("");
$("#exCats").addEventListener("click",e=>{const b=e.target.closest("[data-excat]");if(b){exCat=b.dataset.excat;exTok++;renderEx()}});
function renderEx(){const c=SL.EXERCISES[exCat],d=DOC[c.doc];
  $$("[data-excat]").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.excat===exCat)));
  $("#exGrid").innerHTML=c.items.map((x,i)=>'<article class="ex"><div class="ex-top"><span class="ex-n">'+(i+1)+'</span><div><h3>'+esc(x.n)+'</h3><p class="fine">'+esc(x.why)+'</p></div></div><ol>'+x.how.map(s=>"<li>"+esc(s)+"</li>").join("")+'</ol>'+
    '<div class="ex-meta"><span><b>'+x.hold+' s</b> '+(x.reps>1?"hold":"")+'</span><span><b>'+x.reps+'</b> '+(x.reps>1?"times":"round")+'</span></div>'+
    '<div class="ex-run"><div class="ring-t" aria-hidden="true"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="bg"/><circle cx="22" cy="22" r="19" class="fg" id="exr'+i+'"/></svg><span id="exs'+i+'">'+x.hold+'</span></div><div class="ex-state" id="ext'+i+'" aria-live="polite">Ready</div>'+(x.link?'<a class="btn btn-ghost btn-sm" href="#'+x.link+'">Guided</a>':'')+'<button class="btn btn-primary btn-sm" type="button" data-exgo="'+i+'">Start</button></div></article>').join("")+
    '<article class="ex ex-doc"><span class="av '+d.cls+'" aria-hidden="true">'+d.ini+'</span><div><b>Prescribed by '+d.name+'</b><p class="fine">Not sure which exercises suit you? Ask at your next visit.</p></div><a class="btn btn-primary btn-sm" href="#talk" data-start="'+c.doc+':'+d.start+'">Ask '+d.short+'</a></article>'}
$("#exGrid").addEventListener("click",async e=>{const b=e.target.closest("[data-exgo]");if(!b)return;const i=+b.dataset.exgo,x=SL.EXERCISES[exCat].items[i];
  if(b.dataset.run){exTok++;return}
  const tok=++exTok;$$("[data-exgo]").forEach(z=>{z.textContent="Start";delete z.dataset.run});b.textContent="Stop";b.dataset.run=1;
  const ring=$("#exr"+i),sec=$("#exs"+i),st=$("#ext"+i),C=2*Math.PI*19;ring.style.strokeDasharray=C;
  const tick=()=>new Promise(r=>setTimeout(r,1000));
  try{for(let r=1;r<=x.reps;r++){st.textContent=(x.reps>1?"Rep "+r+" of "+x.reps+" · ":"")+"Hold";
      for(let s=x.hold;s>0;s--){if(tok!==exTok)throw 0;sec.textContent=s;ring.style.strokeDashoffset=C*(1-(x.hold-s+1)/x.hold);await tick()}
      if(r<x.reps){st.textContent="Relax";for(let s=3;s>0;s--){if(tok!==exTok)throw 0;sec.textContent=s;ring.style.strokeDashoffset=C;await tick()}}}
    st.textContent="Done. Well done!";sec.textContent="✓"}catch(_){st.textContent="Stopped";sec.textContent=x.hold;ring.style.strokeDashoffset=C}
  b.textContent="Start";delete b.dataset.run});
renderEx();

/* ---------- health library ---------- */
let lf="all";
function renderLearn(){$$("[data-lf]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lf===lf)));
  $("#learnGrid").innerHTML=SL.ARTICLES.filter(a=>lf==="all"||a.cat===lf).map(a=>{const d=DOC[a.cat];return '<details class="art"><summary><span class="tagc '+d.cls+'">'+(a.cat==="ortho"?"Bones &amp; joints":"Chest &amp; lungs")+' · '+a.mins+' min read</span><h3>'+esc(a.t)+'</h3><p>'+esc(a.lead)+'</p><span class="more">Read guide</span></summary><div class="art-bd">'+
    a.body.map(([h,p])=>'<h4>'+esc(h)+'</h4><p>'+esc(p)+'</p>').join("")+'<div class="who" style="margin-top:8px"><span class="av '+d.cls+' sm" aria-hidden="true">'+d.ini+'</span><span><b>Reviewed for patients of '+d.name+'</b><span>'+d.role+'</span></span></div><div class="acts"><a class="btn btn-primary btn-sm" href="#talk" data-start="'+a.cat+':'+d.start+'">Ask '+d.short+'</a><a class="btn btn-ghost btn-sm" href="'+wa("Hello, I read the guide \""+a.t+"\" on the Sri Lalitha website and have a question.")+'" target="_blank" rel="noopener">Ask on WhatsApp</a></div></div></details>'}).join("")}
$("#learnFilter").addEventListener("click",e=>{const b=e.target.closest("[data-lf]");if(b){lf=b.dataset.lf;renderLearn()}});
renderLearn();

/* ---------- service shortcuts on WhatsApp ---------- */
$$("[data-wa]").forEach(a=>{a.href=wa(a.dataset.wa);a.target="_blank";a.rel="noopener"});

/* ---------- installable app ---------- */
if("serviceWorker" in navigator&&location.protocol==="https:"&&!/claude|anthropic/.test(location.hostname)){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
let installEvt=null;addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvt=e;$$("[data-install]").forEach(b=>b.hidden=false)});
$$("[data-install]").forEach(b=>b.addEventListener("click",async()=>{if(!installEvt)return;installEvt.prompt();await installEvt.userChoice;installEvt=null;b.hidden=true}));

setLang(store.get("sl-lang")==="te"?"te":"en");

live();setInterval(live,30000);router();
})();
