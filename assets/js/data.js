/* Content and settings for the Sri Lalitha website. Edit this file to change contact numbers, exercises, articles or Telugu text. */
window.SL = window.SL || {};

SL.CONFIG = {
  phonePrimary: "+91 63052 01435",
  phonePrimaryTel: "+916305201435",
  phoneSecondary: "+91 97008 84467",
  phoneSecondaryTel: "+919700884467",
  /* WhatsApp number that receives booking requests (country code, no plus sign). Confirm with the front desk. */
  whatsapp: "916305201435",
  siteUrl: "https://sai-code-glitch.github.io/Srilalitha-ortho-chest-care-/"
};

/* ---------- Exercise library ---------- */
SL.EXERCISES = {
  knee:{label:"Knee",te:"మోకాలు",doc:"ortho",items:[
    {n:"Static quadriceps",how:["Sit or lie with your leg straight.","Tighten the thigh muscle and press the back of the knee down.","Hold, then relax."],hold:10,reps:10,why:"Strengthens the main muscle that protects the knee."},
    {n:"Straight leg raise",how:["Lie on your back with the other knee bent.","Keep the leg straight and lift it about one foot off the bed.","Hold, then lower slowly."],hold:5,reps:10,why:"Builds thigh strength without bending a painful knee."},
    {n:"Heel slides",how:["Lie on your back with legs straight.","Slowly slide your heel towards your buttock.","Slide it back down."],hold:3,reps:10,why:"Improves knee bending after stiffness or surgery."},
    {n:"Supported mini squats",how:["Hold the back of a sturdy chair.","Bend your knees slightly, keeping your back straight.","Stand back up. Stop if it hurts."],hold:3,reps:10,why:"Trains the knee for daily tasks like standing up."}]},
  back:{label:"Lower back",te:"నడుము",doc:"ortho",items:[
    {n:"Pelvic tilt",how:["Lie on your back, knees bent, feet flat.","Flatten your lower back into the floor by tightening your tummy.","Hold, then relax."],hold:5,reps:10,why:"Activates the deep muscles that support the spine."},
    {n:"Knee to chest",how:["Lie on your back, knees bent.","Bring one knee towards your chest and hold it gently.","Change sides."],hold:20,reps:3,why:"Gently stretches a stiff lower back."},
    {n:"Bridge",how:["Lie on your back, knees bent.","Lift your hips until your body forms a straight line from shoulders to knees.","Hold, then lower slowly."],hold:5,reps:10,why:"Strengthens the buttock and back muscles."},
    {n:"Cat and camel",how:["Kneel on hands and knees.","Slowly round your back up, then let it dip down.","Move within a comfortable range."],hold:3,reps:10,why:"Keeps the spine moving and eases stiffness."}]},
  neck:{label:"Neck",te:"మెడ",doc:"ortho",items:[
    {n:"Chin tucks",how:["Sit tall and look straight ahead.","Slide your chin straight back, making a double chin.","Hold, then relax."],hold:5,reps:10,why:"Corrects the forward-head posture from phone and desk use."},
    {n:"Side bend stretch",how:["Sit tall.","Tilt your ear towards your shoulder until you feel a gentle stretch.","Hold, then change sides."],hold:15,reps:3,why:"Relaxes tight neck muscles."},
    {n:"Shoulder blade squeeze",how:["Sit or stand tall with arms relaxed.","Squeeze your shoulder blades together and down.","Hold, then relax."],hold:5,reps:10,why:"Supports the neck by strengthening upper back muscles."}]},
  shoulder:{label:"Shoulder",te:"భుజం",doc:"ortho",items:[
    {n:"Pendulum swings",how:["Lean forward, resting your good hand on a table.","Let the painful arm hang loose.","Swing it gently in small circles."],hold:30,reps:2,why:"Loosens a stiff or frozen shoulder without strain."},
    {n:"Wall finger walk",how:["Face a wall at arm's length.","Walk your fingers up the wall as high as is comfortable.","Walk them back down."],hold:5,reps:10,why:"Slowly increases how high you can lift the arm."},
    {n:"Towel stretch",how:["Hold a towel behind your back, one hand high and one low.","Use the top hand to gently pull the lower arm up.","Hold, then relax."],hold:15,reps:5,why:"Helps you reach behind your back again."}]},
  lungs:{label:"Lungs",te:"ఊపిరితిత్తులు",doc:"chest",items:[
    {n:"Pursed-lip breathing",how:["Breathe in through your nose for 2 counts.","Purse your lips like blowing out a candle.","Breathe out slowly for 4 counts."],hold:6,reps:8,why:"Eases breathlessness in asthma and COPD.",link:"breathe"},
    {n:"Huff cough",how:["Take a medium breath in.","Huff the air out through an open mouth, as if fogging a mirror.","Do 2 or 3 huffs, then cough once."],hold:8,reps:3,why:"Clears phlegm with less effort than hard coughing."},
    {n:"Seated marching",how:["Sit upright on a chair.","Lift your knees one after the other, as if marching.","Breathe steadily throughout."],hold:60,reps:1,why:"Builds stamina safely when walking is hard."},
    {n:"Shoulder rolls",how:["Sit tall.","Roll your shoulders up, back and down slowly.","Breathe out as they come down."],hold:3,reps:10,why:"Relaxes the chest and neck muscles used in breathing."}]}
};

/* ---------- Health library ---------- */
SL.ARTICLES = [
  {id:"knee-oa",cat:"ortho",t:"Knee osteoarthritis: what really helps",mins:3,lead:"Knee wear and tear is very common after 45. Most people improve a lot without surgery.",body:[
    ["What it is","The smooth cartilage cushion inside the knee slowly thins, so bones rub and the joint becomes painful and stiff."],
    ["Signs","Pain on stairs and squatting, stiffness after rest, crackling, and swelling after a busy day."],
    ["What helps most","Daily strengthening exercises for the thigh, keeping a healthy weight, walking on flat ground, and using a support or stick when the pain is bad."],
    ["Medicines and injections","Pain relief tablets and gels, and in some cases injections into the joint, ease pain while exercises do the long-term work."],
    ["When is surgery needed","Knee replacement is for advanced arthritis when pain limits walking and sleep despite other treatment."]]},
  {id:"back-pain",cat:"ortho",t:"Low back pain: when to worry",mins:3,lead:"Most back pain settles in a few weeks. A few warning signs need urgent care.",body:[
    ["Common causes","Muscle strain, poor posture, long sitting, and age-related wear of the spine."],
    ["What to do","Stay gently active, avoid long bed rest, use heat, and return to normal activity step by step."],
    ["See a doctor soon if","Pain goes down the leg below the knee, you feel numbness or tingling, or the pain lasts more than six weeks."],
    ["Go to hospital immediately if","You have weakness in the legs, numbness around the private parts, or trouble controlling urine or stools."]]},
  {id:"plaster",cat:"ortho",t:"After a fracture: caring for your plaster",mins:2,lead:"Good care of your plaster helps the bone heal in the right position.",body:[
    ["Keep it dry","Cover the plaster with a plastic bag while bathing."],
    ["Keep the limb raised","For the first few days, raise the limb on pillows above heart level to reduce swelling."],
    ["Move what you can","Wiggle your fingers or toes often to keep blood flowing."],
    ["Come back urgently if","Fingers or toes turn blue or cold, pain becomes severe, the plaster feels too tight, or it cracks."]]},
  {id:"inhaler",cat:"chest",t:"How to use an inhaler correctly",mins:2,lead:"Many people get little benefit from inhalers because of small mistakes in technique.",body:[
    ["Before you start","Shake the inhaler and remove the cap. Breathe out fully, away from the inhaler."],
    ["Breathe in","Seal your lips around the mouthpiece, press once and breathe in slowly and deeply."],
    ["Hold","Hold your breath for about 10 seconds, then breathe out slowly."],
    ["Spacers help","A spacer makes the medicine reach the lungs better, especially for children and older adults."],
    ["After steroid inhalers","Rinse your mouth and spit to prevent mouth infections. Our pharmacy can check your technique."]]},
  {id:"tb",cat:"chest",t:"TB is curable: facts every family should know",mins:3,lead:"Tuberculosis is common in India, and it is fully curable when the full course is completed.",body:[
    ["Signs","A cough for more than two weeks, evening fever, weight loss, night sweats, or coughing up blood."],
    ["Testing","A chest X-ray and sputum tests confirm TB. Family members living with a TB patient should also be checked."],
    ["Treatment","A course of medicines for at least six months. Stopping early can make TB resistant to medicines."],
    ["Protect others","Cover your mouth when coughing, keep rooms well ventilated, and take every dose."]]},
  {id:"copd",cat:"chest",t:"Living well with COPD",mins:3,lead:"COPD can't be reversed, but the right care keeps you active and out of hospital.",body:[
    ["What causes it","Long-term smoking, and smoke from cooking with firewood or dung cakes, damage the airways."],
    ["Most important step","Stop smoking and avoid smoke from stoves. It slows the damage at any age."],
    ["Daily care","Use inhalers every day as prescribed, stay active, and practise breathing exercises."],
    ["Prevent flare-ups","Get vaccinated as advised by your doctor and seek help early when phlegm or breathlessness increases."]]}
];

/* ---------- Telugu text for the page chrome ---------- */
SL.TE = {
  "nav.home":"హోమ్","nav.talk":"డాక్టర్‌తో చాట్","nav.body":"శరీర పటం","nav.doctors":"వైద్యులు","nav.services":"సేవలు","nav.wellness":"ఆరోగ్యం","nav.visit":"సందర్శన","cta.book":"బుక్ చేయండి",
  "tab.home":"హోమ్","tab.talk":"మాట్లాడండి","tab.body":"శరీర పటం","tab.well":"ఆరోగ్యం","tab.book":"బుకింగ్",
  "hero.h1":"రాకముందే <span class=\"hl\">నిపుణులతో మాట్లాడండి.</span>",
  "hero.lede":"ఎముకలు, కీళ్ళ సమస్యల గురించి డా. రాకేష్‌కు, శ్వాస సమస్యల గురించి డా. కావ్యకు చెప్పండి. నిమిషంలో స్పష్టమైన సలహా పొందండి, తర్వాత తెనాలిలో మమ్మల్ని కలవండి లేదా వారాంతంలో ఆన్‌లైన్‌లో సంప్రదించండి.",
  "hero.ph":"మీ సమస్య ఏమిటో చెప్పండి…",
  "talk.r":"డా. రాకేష్‌తో మాట్లాడండి","talk.k":"డా. కావ్యతో మాట్లాడండి",
  "ex.eyebrow":"అన్వేషించండి","ex.home":"మీకు కావలసినవన్నీ ఒకే చోట",
  "tile.body":"నొప్పి ఉన్న చోట తాకండి. అది ఏమై ఉండవచ్చో చూడండి.","tile.breathe":"రెండు నిమిషాల్లో సులభంగా శ్వాస తీసుకోండి","tile.serv":"రేడియాలజీ & ఫార్మసీ","tile.online":"వారాంతాల్లో ఇంటి నుండే డాక్టర్‌ను సంప్రదించండి","tile.time":"ఇప్పుడు ఎవరు అందుబాటులో ఉన్నారు","tile.well":"మీ ఆరోగ్యాన్ని మీరే తెలుసుకోండి",
  "spec.h2":"ఇద్దరు నిపుణులు. ఒకే చోట.","spec.p":"ఏదైనా సమస్యను తాకి, దానికి చికిత్స చేసే డాక్టర్‌తో మాట్లాడండి.",
  "talk.choose":"మీ డాక్టర్‌ను ఎంచుకోండి","talk.notes":"మీ సందర్శన కోసం నోట్స్",
  "body.tap":"ఒక చోట తాకండి",
  "docs.h2":"మీ వైద్యులను కలవండి",
  "serv.h2":"సంప్రదింపు, ఎక్స్-రే, మందులు అన్నీ ఒకే చోట","serv.radio":"రేడియాలజీ","serv.pharm":"ఫార్మసీ","serv.online":"ఆన్‌లైన్ సంప్రదింపు",
  "visit.h2":"మీ సందర్శన, దశలవారీగా","visit.time":"మేము అందుబాటులో ఉండే సమయాలు","faq.h2":"తరచుగా అడిగే ప్రశ్నలు",
  "breathe.h1":"నాతో కలిసి శ్వాస తీసుకోండి",
  "w.tools":"ఆరోగ్య పరీక్షలు","w.ex":"వ్యాయామాలు","w.learn":"ఆరోగ్య సమాచారం","w.breathe":"శ్వాస వ్యాయామం",
  "tools.h2":"ఒక నిమిషంలో మీ ఆరోగ్యాన్ని తెలుసుకోండి","tools.p":"ఇంట్లోనే చేసుకోగల సులభమైన పరీక్షలు. మీరు నమోదు చేసే వివరాలు మీ ఫోన్‌లోనే ఉంటాయి.",
  "ex.h2":"మీ డాక్టర్ సూచించే వ్యాయామాలు","ex.p":"మా వైద్యులు తరచుగా సూచించే సులభమైన ఇంటి వ్యాయామాలు. స్టార్ట్ నొక్కి టైమర్‌ను అనుసరించండి.",
  "learn.h2":"మీ వ్యాధి గురించి తెలుసుకోండి","learn.p":"మా రోగులు, వారి కుటుంబాల కోసం సులభమైన భాషలో రాసిన సమాచారం.",
  "fab.sos":"అత్యవసరం 108","fab.call":"కాల్ చేయండి","menu":"మెనూ"
};
