// ============================================================
// HELPERS
// ============================================================
function rnd(){return Math.floor(10000+Math.random()*90000);}
function rnd10(){return Math.floor(1000000000+Math.random()*9000000000);}
function OM(id){var el=document.getElementById(id);if(el){el.classList.add('open');document.body.style.overflow='hidden';}}
function CM(id){var el=document.getElementById(id);if(el){el.classList.remove('open');document.body.style.overflow='';}}
function showSuc(ico,ttl,msg,ref){
  document.getElementById('suc_ico').innerHTML=ico;
  document.getElementById('suc_ttl').textContent=ttl;
  document.getElementById('suc_msg').textContent=msg;
  document.getElementById('suc_ref').textContent='REF: '+ref;
  OM('sucModal');
}
document.addEventListener('DOMContentLoaded',function(){
  // Close popup modals when clicking backdrop — but NOT the main login/portal modal
  var NOCLOSEIDS=['loginModal'];
  document.querySelectorAll('.mb').forEach(function(b){
    b.addEventListener('click',function(e){
      if(e.target===b && NOCLOSEIDS.indexOf(b.id)<0){
        b.classList.remove('open');
        document.body.style.overflow='';
      }
    });
  });
  // set today's date on attendance
  var d=document.getElementById('att_date');
  if(d){var n=new Date();d.value=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0');}
});
function swTab(btn,ids,show){
  btn.closest('.tabs').querySelectorAll('.tab').forEach(function(t){t.classList.remove('on');});
  btn.classList.add('on');
  ids.forEach(function(id){var el=document.getElementById(id);if(el)el.style.display=(id===show)?'block':'none';});
}
function selPM(el){el.closest('.pmeth').querySelectorAll('.pm').forEach(function(m){m.classList.remove('on');});el.classList.add('on');}

// ============================================================
// PENDING BADGE
// ============================================================
function updatePendingBadge(){
  // Only Super Admin sees pending applications
  // SA: all pending; HOD: own dept pending; others: 0
  var count=0;
  if(isSuperAdmin()) count=APPS.filter(function(a){return a.status==='pending';}).length;
  else if(isHOD()) count=APPS.filter(function(a){return a.status==='pending'&&a.dept===myDept();}).length;
  var badge=document.getElementById('pendingBadge');
  if(badge){badge.textContent=count;badge.style.display=(count>0&&(isSuperAdmin()||isHOD()))?'inline-flex':'none';}
  var hc=document.getElementById('adm_pending_count');   if(hc) hc.textContent=(isSuperAdmin()||isHOD())?count:'';
  var hc2=document.getElementById('adm_pending_count2'); if(hc2)hc2.textContent=(isSuperAdmin()||isHOD())?count:'';
  var banner=document.getElementById('home_pending_banner');
  if(banner) banner.style.display=(count>0&&(isSuperAdmin()||isHOD()))?'flex':'none';
  // Staff count: SA = all; HOD = own dept only; Admin/Faculty = hidden tab anyway
  var staffCnt=isSuperAdmin()?STAFF.length:STAFF.filter(function(s){return s.dept===myDept();}).length;
  var sc=document.getElementById('adm_sc');if(sc)sc.textContent=staffCnt;
  // Student count: SA+Admin = all; HOD+Faculty = own dept only
  var stuCnt=(isSuperAdmin()||isAdmin())?STUDENTS.length:STUDENTS.filter(function(s){return s.dept===myDept();}).length;
  var stc=document.getElementById('adm_stucount');if(stc)stc.textContent=stuCnt;
}

