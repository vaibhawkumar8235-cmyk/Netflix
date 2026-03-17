// ============================================================
// REGISTRATION
// ============================================================
function submitApp(){
  var fn=document.getElementById('rg_fname').value.trim();
  var ln=document.getElementById('rg_lname').value.trim();
  var em=document.getElementById('rg_email').value.trim();
  var mob=document.getElementById('rg_mobile').value.trim();
  var dob=document.getElementById('rg_dob').value;
  var prog=document.getElementById('rg_prog').value;
  var branch=document.getElementById('rg_branch').value;
  var pct=document.getElementById('rg_pct').value.trim();
  var err=document.getElementById('rg_err');err.style.display='none';
  if(!fn||!ln||!em||!mob||!dob||!prog||!branch||!pct){err.textContent='Please fill all required fields.';err.style.display='block';return;}
  var ref='APP-2025-'+rnd();
  var now=new Date();var mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  // dept maps branch → department name for HOD routing
  var branchDeptMap={
    'Computer Science':'Computer Science','Mechanical Engineering':'Mechanical Engineering',
    'Civil Engineering':'Civil Engineering','Electronics & Comm':'Electronics & Comm',
    'Electrical Engineering':'Electrical Engineering','Computer Applications':'Computer Applications',
    'Management':'Management','Finance':'Finance','Pharmacy':'Pharmacy',
    'DMLT':'DMLT','BMLT':'BMLT'
  };
  var appDept=branchDeptMap[branch]||branch;
  APPS.push({ref:ref,name:fn+' '+ln,email:em,mobile:mob,dob:dob,program:prog,branch:branch,dept:appDept,pct:pct,status:'pending',submitted:now.getDate()+' '+mn[now.getMonth()]+' '+now.getFullYear(),note:''});
  ['rg_fname','rg_lname','rg_email','rg_mobile','rg_pct'].forEach(function(id){document.getElementById(id).value='';});
  document.getElementById('rg_dob').value='';document.getElementById('rg_prog').value='';document.getElementById('rg_branch').value='';
  CM('regModal');
  document.getElementById('pend_ref').textContent=ref;
  document.getElementById('pend_name').textContent=fn+' '+ln;
  document.getElementById('pend_prog').textContent=prog+' - '+branch;
  OM('pendModal');
}
function trackApp(){
  var ref=document.getElementById('rg_trackref').value.trim();
  var out=document.getElementById('rg_trackout');
  if(!ref){out.innerHTML='<div class="emsg err">Enter your reference number.</div>';out.style.display='block';return;}
  var app=null;for(var i=0;i<APPS.length;i++){if(APPS[i].ref===ref){app=APPS[i];break;}}
  if(!app){out.innerHTML='<div class="emsg err">No application found: '+ref+'</div>';out.style.display='block';return;}
  var scol={pending:'#f59e0b',approved:'#16a34a',rejected:'#dc2626'};
  var sbg={pending:'rgba(245,158,11,.1)',approved:'rgba(34,197,94,.1)',rejected:'rgba(220,38,38,.1)'};
  var sico={pending:'&#9203;',approved:'&#9989;',rejected:'&#10060;'};
  var slbl={pending:'Pending Approval',approved:'Approved',rejected:'Rejected'};
  var sc=app.status;
  out.innerHTML='<div style="background:'+sbg[sc]+';border:1.5px solid '+scol[sc]+';border-radius:13px;padding:16px;">'+
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">'+
    '<div style="font-size:26px;">'+sico[sc]+'</div>'+
    '<div><div style="font-weight:700;color:'+scol[sc]+';font-size:15px;">'+slbl[sc]+'</div>'+
    '<div style="font-size:12px;color:var(--tm);">Submitted: '+app.submitted+'</div></div></div>'+
    '<div style="font-size:13px;margin-bottom:8px;"><strong>'+app.name+'</strong> &nbsp;|&nbsp; '+app.program+' - '+app.branch+'</div>'+
    '<div style="font-size:12px;font-family:monospace;color:var(--cr);">'+app.ref+'</div>'+
    (app.note?'<div style="margin-top:10px;padding:9px 12px;background:#fff;border-radius:8px;font-size:13px;"><strong>Admin Note:</strong> '+app.note+'</div>':'')+
    (sc==='pending'?'<div style="margin-top:10px;font-size:12px;color:var(--tm);">Review expected within 2-3 working days.</div>':'')+
    '</div>';
  out.style.display='block';
}

// ============================================================
// STUDENT LOGIN
// ============================================================
function lmShow(role){
  document.getElementById('lm_roles').style.display='none';
  if(role==='student'){document.getElementById('lm_stuForm').style.display='block';document.getElementById('lmTitle').textContent='Student Login';}
  else{document.getElementById('lm_admForm').style.display='block';document.getElementById('lmTitle').textContent='Staff Login';}
}
function lmBack(){
  ['lm_roles','lm_stuForm','lm_admForm','lm_stuDash','lm_admDash'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
  document.getElementById('lm_roles').style.display='block';
  document.getElementById('lmTitle').textContent='SRCEM Login Portal';
}
function doStuLogin(){
  document.getElementById('lm_stuForm').style.display='none';
  document.getElementById('lm_stuDash').style.display='block';
  document.getElementById('lmTitle').textContent='Student Dashboard';
  loadSem('4');
}
function doStuLogout(){
  document.getElementById('lm_stuDash').style.display='none';
  document.getElementById('lm_roles').style.display='block';
  document.getElementById('lmTitle').textContent='SRCEM Login Portal';
  document.querySelectorAll('.stab').forEach(function(t){t.classList.remove('on');});
  document.querySelectorAll('.ssec').forEach(function(s){s.classList.remove('on');s.style.display='none';});
  var ft=document.querySelector('.stab');if(ft)ft.classList.add('on');
  var fs=document.getElementById('st_ov');if(fs){fs.classList.add('on');fs.style.display='block';}
}
function sTAB(btn,tid){
  document.querySelectorAll('.stab').forEach(function(t){t.classList.remove('on');});btn.classList.add('on');
  document.querySelectorAll('.ssec').forEach(function(s){s.classList.remove('on');s.style.display='none';});
  var el=document.getElementById(tid);if(el){el.classList.add('on');el.style.display='block';}
  if(tid==='st_res') loadSem(document.getElementById('sem_sel').value);
}
function loadSem(v){
  var d=SEM[v];if(!d)return;
  var rows=d.subjects.map(function(s){return '<tr><td>'+s[0]+'</td><td>'+s[1]+'</td><td>'+s[2]+'</td><td class="'+s[4]+'">'+s[3]+'</td></tr>';}).join('');
  document.getElementById('sem_box').innerHTML=
    '<div class="rtable-wrap"><div class="rthdr"><h4>'+d.label+'</h4><p>Ravi Kumar - B.Tech CSE - SRCEM/2022/BT/0147</p></div>'+
    '<table class="rt"><thead><tr><th>Subject</th><th>Max</th><th>Obtained</th><th>Grade</th></tr></thead><tbody>'+rows+
    '<tr class="gsgpa"><td colspan="3">SGPA</td><td>'+d.sgpa+' / 10.0</td></tr></tbody></table></div>'+
    '<div style="margin-top:11px;display:flex;gap:9px;flex-wrap:wrap;"><button class="pbtn2">Download Marksheet</button><button class="pbtn2" style="background:linear-gradient(135deg,var(--nv),var(--nvm));">Email Marksheet</button></div>';
}

// ============================================================
// CHECK DUE AMOUNT (Public modal)
// ============================================================
function checkDue(){
  var roll=document.getElementById('due_enroll').value.trim();
  var err=document.getElementById('due_err');
  err.style.display='none';
  document.getElementById('due_res').style.display='none';
  if(!roll){err.textContent='Please enter your enrollment number.';err.style.display='block';return;}
  var stu=null;
  for(var i=0;i<STUDENTS.length;i++){if(STUDENTS[i].roll===roll){stu=STUDENTS[i];break;}}
  if(!stu){err.textContent='Enrollment not found. Demo: SRCEM/2022/BT/0147';err.style.display='block';return;}
  var paid=0;
  for(var j=0;j<FEE_ENTRIES.length;j++){if(FEE_ENTRIES[j].roll===roll) paid+=FEE_ENTRIES[j].amt;}
  var total=48000; var due=Math.max(0,total-paid);
  document.getElementById('due_stuname').textContent=stu.name+' | '+stu.program+' '+stu.dept+' | Sem '+stu.sem;
  document.getElementById('due_headline').innerHTML=due>0?'Outstanding Due: <strong style="font-size:18px;color:var(--cr);">&#8377;'+due.toLocaleString()+'</strong>':'<strong style="color:#16a34a;">&#10003; All Fees Cleared</strong>';
  document.getElementById('due_sub').textContent=due>0?'Semester '+stu.sem+' fee pending. Please pay at earliest.':'No dues pending for this semester.';
  var rows='';
  if(paid>0) rows+='<tr><td>Total Paid</td><td>&#8377;'+paid.toLocaleString()+'</td><td class="gp">Paid</td></tr>';
  rows+='<tr><td>Tuition Fee</td><td>&#8377;42,500</td><td class="'+(paid>=42500?'gp':'gf')+'">'+(paid>=42500?'Paid':'Due')+'</td></tr>';
  rows+='<tr><td>Exam Fee</td><td>&#8377;2,200</td><td class="'+(due<=0?'gp':'gf')+'">'+(due<=0?'Paid':'Due')+'</td></tr>';
  rows+='<tr><td>Library Fee</td><td>&#8377;1,000</td><td class="gp">Paid</td></tr>';
  rows+='<tr><td>Sports Fee</td><td>&#8377;800</td><td class="gp">Paid</td></tr>';
  rows+='<tr class="gsgpa"><td><strong>Total Due</strong></td><td><strong>&#8377;'+due.toLocaleString()+'</strong></td><td>'+(due<=0?'Clear':'&#9888; Pending')+'</td></tr>';
  document.getElementById('due_table').innerHTML='<table class="rt"><thead><tr><th>Fee Head</th><th>Amount</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table>';
  document.getElementById('due_res').style.display='block';
}


// ============================================================
// FETCH PUBLIC RESULT (Sessional Result modal)
// ============================================================
function fetchPublicResult(){
  var roll=document.getElementById('res_enroll').value.trim();
  var sess=document.getElementById('res_session').value;
  var err=document.getElementById('res_err');
  err.style.display='none';
  var out=document.getElementById('res_out');
  out.style.display='none';out.innerHTML='';
  if(!roll){err.textContent='Please enter your enrollment number.';err.style.display='block';return;}
  if(roll!=='SRCEM/2022/BT/0147'){err.textContent='Enrollment not found. Demo: SRCEM/2022/BT/0147';err.style.display='block';return;}
  var semKey='4';
  var d=SEM[semKey];
  if(!d){err.textContent='No result data found.';err.style.display='block';return;}
  var sessLabels={'1':'Sessional-1 (2024-25)','2':'Sessional-2 (2024-25)','3':'Sessional-3 (2024-25)','end':'End Semester (2023-24)'};
  var rows=d.subjects.map(function(s){
    var obtained=sess==='end'?s[2]:Math.round(parseInt(s[2])*0.3);
    var max=sess==='end'?100:30;
    return '<tr><td>'+s[0]+'</td><td>'+max+'</td><td>'+obtained+'</td><td class="'+s[4]+'">'+s[3]+'</td></tr>';
  }).join('');
  out.innerHTML='<div class="rtable-wrap">'+
    '<div class="rthdr"><h4>Ravi Kumar &mdash; SRCEM/2022/BT/0147</h4><p>B.Tech CSE &middot; Semester 4 &middot; '+sessLabels[sess]+'</p></div>'+
    '<table class="rt"><thead><tr><th>Subject</th><th>Max</th><th>Obtained</th><th>Grade</th></tr></thead>'+
    '<tbody>'+rows+'<tr class="gsgpa"><td colspan="2">SGPA</td><td colspan="2">'+d.sgpa+' / 10.0</td></tr></tbody></table></div>'+
    '<div style="margin-top:11px;display:flex;gap:9px;flex-wrap:wrap;">'+
    '<button class="pbtn2">&#128196; Download Marksheet</button>'+
    '<button class="pbtn2" style="background:linear-gradient(135deg,var(--nv),var(--nvm));">&#128231; Email Marksheet</button></div>';
  out.style.display='block';
}
