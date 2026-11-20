/* Shared engine for all invitation designs: dummy data, Marathi/English, countdown, RSVP, calendar, sound, particles */
const DATA={
  date:"2027-02-21T11:36", end:"2027-02-21T15:36", map:"Kasba Peth, Pune",
  mr:{
    shloka:"॥ श्री गणेशाय नमः ॥",
    shloka2:"वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    groom:"आदित्य", bride:"मृणाल", groomFull:"चि. आदित्य", brideFull:"चि.सौ.कां. मृणाल",
    groomLine:"श्री. विजय व सौ. सुनीता देशपांडे (पुणे) यांचे चिरंजीव",
    brideLine:"श्री. प्रकाश व सौ. मंदाकिनी कुलकर्णी (सातारा) यांची कन्या",
    wedsWord:"शुभविवाह",
    inviteLead:"सप्रेम नमस्कार,",
    inviteBody:"आमच्या कुटुंबातील मंगल कार्य निश्चित झाले असून, या आनंदाच्या सोहळ्यास आपण सहकुटुंब, सहपरिवार उपस्थित राहून वधू-वरांना शुभाशीर्वाद द्यावेत, ही आग्रहाची विनंती.",
    dateText:"रविवार, २१ फेब्रुवारी २०२७", muhurat:"सकाळी ११:३६ वाजता (शुभ मुहूर्त)",
    venue:"सरदार कुलकर्णी वाडा", addr:"कसबा पेठ, पुणे – ४११ ०११",
    tap:"उघडण्यासाठी स्पर्श करा", days:"दिवस", hours:"तास", mins:"मिनिटे", secs:"सेकंद",
    coupleTitle:"वधू-वर", eventsTitle:"सोहळ्याचे कार्यक्रम", venueTitle:"स्थळ", rsvpTitle:"आपली उपस्थिती कळवा",
    rsvpSub:"आपल्या येण्याने आमचा आनंद द्विगुणित होईल.",
    nameL:"आपले नाव", attY:"नक्की येणार", attN:"येता येणार नाही", cnt:"एकूण व्यक्ती", msgL:"शुभेच्छा संदेश", send:"पाठवा",
    thanks:"धन्यवाद! आपली उपस्थिती नोंदवली गेली आहे.", directions:"मार्ग पाहा", cal:"कॅलेंडरमध्ये जोडा", share:"WhatsApp वर पाठवा",
    blessing:"आपले आशीर्वाद हाच आमचा आहेर", family:"देशपांडे व कुलकर्णी परिवार", snehankit:"स्नेहांकित",
    guestPre:"प्रति,", guestDefault:"आदरणीय पाहुणे", langBtn:"EN", credit:"निमंत्रण रचना", galleryTitle:"आठवणीतला वाडा", descend:"वाड्याकडे उतरा", tapDoor:"दरवाजावर स्पर्श करा", creditsTitle:"छायाचित्र श्रेय", mapTitle:"नकाशा",
    events:[
      ["साखरपुडा","शनिवार, २० फेब्रुवारी · सायं. ५:००","वाडा – दिवाणखाना","दोन्ही कुटुंबांचा स्नेहमिलन व साखरपुडा समारंभ."],
      ["हळदी समारंभ","रविवार, २१ फेब्रुवारी · सकाळी ८:००","वाडा – अंगण (चौक)","हळद, गाणी आणि पिवळ्या रंगांची उधळण."],
      ["सीमांत पूजन","रविवार · सकाळी १०:००","वाडा – प्रवेशद्वार","वरपक्षाचे स्वागत व पूजन."],
      ["शुभविवाह","रविवार · सकाळी ११:३६","वाडा – मुख्य सभामंडप","मंगलाष्टके, अंतरपाट, सप्तपदी व अक्षता."],
      ["स्वागत समारंभ","रविवार · सायं. ७:३०","वाडा – सभागृह","स्नेहभोजन व आशीर्वाद."]
    ]
  },
  en:{
    shloka:"॥ Shri Ganeshaya Namah ॥",
    shloka2:"Vakratunda Mahakaya Suryakoti Samaprabha\nNirvighnam Kurume Deva Sarvakaryeshu Sarvada",
    groom:"Aditya", bride:"Mrunal", groomFull:"Aditya", brideFull:"Mrunal",
    groomLine:"Son of Mr. Vijay & Mrs. Sunita Deshpande (Pune)",
    brideLine:"Daughter of Mr. Prakash & Mrs. Mandakini Kulkarni (Satara)",
    wedsWord:"Shubh Vivah",
    inviteLead:"With warm greetings,",
    inviteBody:"With the blessings of the Almighty, our families joyfully invite you and your family to grace the wedding ceremony and bless the couple.",
    dateText:"Sunday, 21 February 2027", muhurat:"11:36 AM (auspicious muhurat)",
    venue:"Sardar Kulkarni Wada", addr:"Kasba Peth, Pune – 411 011",
    tap:"Tap to open", days:"Days", hours:"Hours", mins:"Mins", secs:"Secs",
    coupleTitle:"The Couple", eventsTitle:"Celebrations", venueTitle:"The Venue", rsvpTitle:"Kindly reply",
    rsvpSub:"Your presence will double our joy.",
    nameL:"Your name", attY:"Joyfully attending", attN:"Unable to attend", cnt:"Total guests", msgL:"A message for the couple", send:"Send",
    thanks:"Thank you! Your reply has been recorded.", directions:"Get directions", cal:"Add to calendar", share:"Share on WhatsApp",
    blessing:"Your blessings are our greatest gift", family:"The Deshpande & Kulkarni families", snehankit:"With love",
    guestPre:"To,", guestDefault:"Our Dear Guest", langBtn:"मराठी", credit:"Invitation crafted by", galleryTitle:"Glimpses of the wada", descend:"Descend to the wada", tapDoor:"Tap the door to open", creditsTitle:"Photo credits", mapTitle:"Map",
    events:[
      ["Sakharpuda","Saturday, 20 Feb · 5:00 PM","Wada – Diwankhana","Engagement and family gathering."],
      ["Haldi","Sunday, 21 Feb · 8:00 AM","Wada – Courtyard (Chowk)","Turmeric, songs and a burst of yellow."],
      ["Simant Pujan","Sunday · 10:00 AM","Wada – Entrance","Welcome and puja of the groom's family."],
      ["Shubh Vivah","Sunday · 11:36 AM","Wada – Main hall","Mangalashtak, Antarpat, Saptapadi and Akshata."],
      ["Reception","Sunday · 7:30 PM","Wada – Banquet hall","Dinner and blessings."]
    ]
  }
};

const INV=(()=>{
  let lang="mr";try{lang=localStorage.getItem("lang")||"mr"}catch(e){}
  const hooks=[];
  const t=k=>DATA[lang][k]!==undefined?DATA[lang][k]:DATA.en[k];
  const num=n=>lang==="mr"?String(n).replace(/\d/g,d=>"०१२३४५६७८९"[d]):String(n);
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  function countdown(){
    qa("[data-cd]").forEach(el=>{
      const ms=new Date(DATA.date)-Date.now();
      if(ms<=0){el.innerHTML=`<div class="cd-u"><b>${esc(t("wedsWord"))}</b></div>`;return}
      const v=[[Math.floor(ms/864e5),"days"],[Math.floor(ms/36e5)%24,"hours"],[Math.floor(ms/6e4)%60,"mins"],[Math.floor(ms/1e3)%60,"secs"]];
      el.innerHTML=v.map(x=>`<div class="cd-u"><b>${num(String(x[0]).padStart(2,"0"))}</b><span>${t(x[1])}</span></div>`).join("");
    });
  }
  let io;
  function observe(){
    io&&io.disconnect();
    io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
    qa(".rv:not(.in)").forEach(el=>io.observe(el));
  }
  function render(){
    document.documentElement.lang=lang;
    qa("[data-t]").forEach(e=>e.textContent=t(e.dataset.t));
    qa("[data-ph]").forEach(e=>e.placeholder=t(e.dataset.ph));
    const g=new URLSearchParams(location.search).get("guest");
    qa("[data-guest]").forEach(e=>e.textContent=g||t("guestDefault"));
    qa("[data-lang]").forEach(b=>b.textContent=t("langBtn"));
    qa("[data-map]").forEach(a=>a.href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(DATA.map));
    qa("[data-share]").forEach(a=>a.href="https://wa.me/?text="+encodeURIComponent(t("groomFull")+" ❤ "+t("brideFull")+"\n"+t("dateText")+"\n"+t("venue")+"\n"+location.href));
    hooks.forEach(f=>f(t,lang));
    countdown();observe();
  }
  function setLang(l){lang=l;try{localStorage.setItem("lang",l)}catch(e){}render()}
  document.addEventListener("click",e=>{
    if(e.target.closest("[data-lang]"))setLang(lang==="mr"?"en":"mr");
    if(e.target.closest("[data-ics]"))ics();
  });
  setInterval(countdown,1000);

  function ics(){
    const f=s=>s.replace(/[-:]/g,"")+"00";
    const body=["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT","DTSTART:"+f(DATA.date),"DTEND:"+f(DATA.end),
      "SUMMARY:"+t("groomFull")+" & "+t("brideFull")+" - "+t("wedsWord"),"LOCATION:"+t("venue")+", "+t("addr"),"END:VEVENT","END:VCALENDAR"].join("\r\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([body],{type:"text/calendar"}));a.download="wedding.ics";a.click();
  }
  function rsvp(form,done){
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const fd=new FormData(form),r=Object.fromEntries(fd.entries());r.at=Date.now();
      try{const all=JSON.parse(localStorage.getItem("rsvps")||"[]");all.push(r);localStorage.setItem("rsvps",JSON.stringify(all))}catch(x){}
      form.style.display="none";done.textContent=t("thanks");done.classList.add("show");
    });
  }
  /* temple bell: additive sine partials */
  function bell(){
    try{const C=new (window.AudioContext||window.webkitAudioContext)();
      [[1,.22],[2.76,.12],[5.4,.07],[8.93,.04]].forEach(([m,v])=>{
        const o=C.createOscillator(),g=C.createGain();o.type="sine";o.frequency.value=440*m;
        g.gain.setValueAtTime(v,C.currentTime);g.gain.exponentialRampToValueAtTime(.0001,C.currentTime+4);
        o.connect(g);g.connect(C.destination);o.start();o.stop(C.currentTime+4.1)});
    }catch(e){}
  }
  /* particles: loop ambient or burst */
  function fx(cv,c){
    const x=cv.getContext("2d");let P=[];
    const fit=()=>{cv.width=cv.offsetWidth;cv.height=cv.offsetHeight};fit();addEventListener("resize",fit);
    const mk=burst=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:c.size[0]+Math.random()*(c.size[1]-c.size[0]),
      v:c.speed*(.5+Math.random()),w:Math.random()*6,a:Math.random()*6,col:c.colors[Math.random()*c.colors.length|0],burst});
    for(let i=0;i<(c.count||0);i++)P.push(mk(false));
    (function loop(){
      x.clearRect(0,0,cv.width,cv.height);
      P=P.filter(p=>{
        p.y+=p.v*c.dir;p.w+=.02;p.a+=.02;p.x+=Math.sin(p.w)*(c.sway||.4);
        if(p.burst){if(c.dir>0?p.y>cv.height+20:p.y<-20)return false}
        else if(c.dir>0&&p.y>cv.height+10){p.y=-10;p.x=Math.random()*cv.width}
        else if(c.dir<0&&p.y<-10){p.y=cv.height+10;p.x=Math.random()*cv.width}
        x.save();x.globalAlpha=c.alpha||.6;x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.col;
        if(c.glow){x.shadowColor=p.col;x.shadowBlur=c.glow}
        x.beginPath();
        if(c.shape==="circle")x.arc(0,0,p.r,0,7);else x.ellipse(0,0,p.r,p.r*(c.shape==="grain"?.45:.6),0,0,7);
        x.fill();x.restore();return true});
      requestAnimationFrame(loop)})();
    return{burst(n){for(let i=0;i<n;i++){const p=mk(true);p.y=c.dir>0?-Math.random()*cv.height*.7:cv.height+Math.random()*cv.height*.7;P.push(p)}}};
  }
  return{t,num,esc,render,onRender:f=>hooks.push(f),rsvp,bell,fx,q,qa,events:()=>DATA[lang].events};
})();
