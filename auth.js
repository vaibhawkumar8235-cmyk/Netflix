// ============================================================
// ROLE HELPERS
// ============================================================
// ============================================================
// RBAC — 4 clean roles
// ============================================================
function isSuperAdmin(){ return curAdmin && curAdmin.role==='Super Admin'; }
function isAdmin(){       return curAdmin && curAdmin.role==='Admin'; }       // Accounts
function isHOD(){         return curAdmin && curAdmin.role==='HOD'; }
function isFaculty(){     return curAdmin && curAdmin.role==='Faculty'; }
function isAccounts(){    return isAdmin(); }   // alias kept for backward compat
function isFacultyRole(){ return isFaculty(); } // alias

function myDept(){ return curAdmin ? curAdmin.dept : ''; }

// ── Permission matrix (single source of truth) ───────────
function canSeeFee(){         return isSuperAdmin() || isAdmin(); }
function canEditFee(){        return isAdmin(); }
function canSeeStudents(){    return true; }  // all roles, dept filtered below
function canAddStudent(){     return isSuperAdmin() || isHOD(); }
function canEditStudent(){    return isSuperAdmin() || isHOD(); }
function canSeeFaculty(){    return isSuperAdmin() || isHOD(); }
function canAddFaculty(){    return isSuperAdmin() || isHOD(); }
function canSeeMarks(){       return isSuperAdmin() || isHOD() || isFaculty(); }
function canEditMarks(){      return isSuperAdmin() || isHOD() || isFaculty(); }
function canSeeAttendance(){  return isSuperAdmin() || isHOD() || isFaculty(); }
function canEditAttend(){     return isSuperAdmin() || isHOD() || isFaculty(); }
function canSeeApps(){        return isSuperAdmin(); }
function canManageStaff(){    return isSuperAdmin() || isHOD(); }
function canCreateAdmin(){    return isSuperAdmin(); }
function canCreateHOD(){      return isSuperAdmin(); }
function canCreateFaculty(){  return isSuperAdmin() || isHOD(); }

// Dept-scope: does the logged-in user have access to this dept?
function canAccessDept(dept){
  if(isSuperAdmin() || isAdmin()) return true;
  return myDept() === dept;
}

// Centralised access guard — call at start of sensitive functions
function requireRole(check, msg){
  if(!check){ alert(msg||'Access denied.'); return false; }
  return true;
}

// What tabs each role can see
var ROLE_TABS={
  'Super Admin': ['home','apps','students','subjects','marks','attend','fee','staff','addstaff','settings'],
  'Admin':       ['home','fee','settings'],
  'HOD':         ['home','apps','students','subjects','marks','attend','staff','addstaff','settings'],
  'Faculty':     ['home','marks','attend','settings']
};

var HOME_TILES={
  'Super Admin':[
    {ico:'&#128221;',t:'Applications',p:'Approve admissions',tab:'apps'},
    {ico:'&#127891;',t:'All Students',p:'Every department',tab:'students'},
    {ico:'&#128218;',t:'Subjects',p:'Manage all subjects',tab:'subjects'},
    {ico:'&#128101;',t:'Staff',p:'Manage all accounts',tab:'staff'},
    {ico:'&#128203;',t:'Fee Register',p:'View all transactions',tab:'fee'},
    {ico:'&#128202;',t:'Marks',p:'View / edit all marks',tab:'marks'}
  ],
  'Admin':[
    {ico:'&#128203;',t:'Fee Register',p:'All dept students',tab:'fee'},
    {ico:'&#9881;&#65039;',t:'Settings',p:'Change password',tab:'settings'}
  ],
  'HOD':[
    {ico:'&#128221;',t:'Applications',p:'Your dept applications',tab:'apps'},
    {ico:'&#127891;',t:'My Students',p:'Your dept students',tab:'students'},
    {ico:'&#128218;',t:'Subjects',p:'Add & assign subjects',tab:'subjects'},
    {ico:'&#128101;',t:'My Faculty',p:'View & add faculty',tab:'staff'},
    {ico:'&#10133;',t:'Add Faculty',p:'Add to your dept',tab:'addstaff'},
    {ico:'&#128202;',t:'Marks',p:'Dept marks',tab:'marks'},
    {ico:'&#128197;',t:'Attendance',p:'Dept attendance',tab:'attend'}
  ],
  'Faculty':[
    {ico:'&#128202;',t:'Upload Marks',p:'Your subjects only',tab:'marks'},
    {ico:'&#128197;',t:'Attendance',p:'Mark attendance',tab:'attend'},
    {ico:'&#9881;&#65039;',t:'Settings',p:'Change password',tab:'settings'}
  ]
};

// ============================================================
// ADMIN LOGIN
// ============================================================
function doAdmLogin(){
  var u=document.getElementById('a_user').value.trim();
  var p=document.getElementById('a_pass').value.trim();
  var err=document.getElementById('a_err');
  var found=null;
  for(var i=0;i<STAFF.length;i++){if(STAFF[i].uname===u&&STAFF[i].pass===p&&STAFF[i].active){found=STAFF[i];break;}}
  if(!found){err.style.display='block';document.getElementById('a_pass').value='';return;}
  err.style.display='none';
  // ── Role whitelist check FIRST (prevents null DOM errors) ──
  var validRoles=['Super Admin','Admin','HOD','Faculty'];
  if(validRoles.indexOf(found.role)<0){
    err.textContent='Unrecognised role "'+found.role+'". Contact Super Admin.';
    err.style.display='block';
    document.getElementById('a_pass').value='';
    return;
  }
  curAdmin=found;
  // ── UI: switch to dashboard ──
  document.getElementById('lm_admForm').style.display='none';
  document.getElementById('lm_admDash').style.display='block';
  var lmTitle=document.getElementById('lmTitle');
  if(lmTitle) lmTitle.textContent='Staff Panel';
  var wnEl=document.getElementById('adm_wname');
  if(wnEl) wnEl.textContent='Welcome, '+found.name;
  var roleLabels={'Super Admin':'Super Admin','Admin':'Admin — Accounts','HOD':'HOD — '+found.dept,'Faculty':'Faculty — '+found.dept};
  var wrEl=document.getElementById('adm_wrole');
  if(wrEl) wrEl.textContent=roleLabels[found.role]||found.role;
  var rbEl=document.getElementById('adm_rolebadge');
  if(rbEl) rbEl.textContent=({'Super Admin':'SUPER ADMIN','Admin':'ADMIN','HOD':'HOD','Faculty':'FACULTY'}[found.role]||found.role).toUpperCase();
  // ── Apply RBAC ──
  setupRoleTabs(found.role);
  buildHomeTiles(found.role);
  updatePendingBadge();
}

function setupRoleTabs(role){
  var allowed=ROLE_TABS[role]||['home','settings'];
  // Section-id map mirrors tab-id map
  var tabMap={home:'aTab_home',apps:'aTab_apps',students:'aTab_students',subjects:'aTab_subjects',
              marks:'aTab_marks',attend:'aTab_attend',fee:'aTab_fee',
              staff:'aTab_staff',addstaff:'aTab_addstaff',settings:'aTab_settings'};
  var secMap={home:'at_home',apps:'at_apps',students:'at_students',subjects:'at_subjects',
              marks:'at_marks',attend:'at_attend',fee:'at_fee',
              staff:'at_staff',addstaff:'at_create',settings:'at_settings'};
  Object.keys(tabMap).forEach(function(k){
    var tabEl=document.getElementById(tabMap[k]);
    var secEl=document.getElementById(secMap[k]);
    var show=(allowed.indexOf(k)>=0);
    if(tabEl) tabEl.style.display=show?'':'none';
    // Also hide the section pane so direct-ID access is blocked
    if(!show && secEl){ secEl.style.display='none'; secEl.classList.remove('on'); }
  });
  // Reset to home tab
  document.querySelectorAll('.atab').forEach(function(t){t.classList.remove('on');});
  document.querySelectorAll('.asec').forEach(function(s){s.classList.remove('on');s.style.display='none';});
  var fhome=document.getElementById('aTab_home');if(fhome)fhome.classList.add('on');
  var shome=document.getElementById('at_home');if(shome){shome.classList.add('on');shome.style.display='block';}
}

function buildHomeTiles(role){
  var tiles=HOME_TILES[role]||[];
  var tabKeys={home:'aTab_home',apps:'aTab_apps',students:'aTab_students',subjects:'aTab_subjects',marks:'aTab_marks',attend:'aTab_attend',fee:'aTab_fee',staff:'aTab_staff',addstaff:'aTab_addstaff',settings:'aTab_settings'};
  var html2=tiles.map(function(t){
    return '<div class="atile" onclick="aTAB(document.getElementById(\''+tabKeys[t.tab]+'\'),\'at_'+t.tab+'\')"><div class="ai">'+t.ico+'</div><h5>'+t.t+'</h5><p>'+t.p+'</p></div>';
  }).join('');
  document.getElementById('home_tiles').innerHTML=html2;
}

function doAdmLogout(){
  curAdmin=null;
  document.getElementById('lm_admDash').style.display='none';
  document.getElementById('lm_roles').style.display='block';
  document.getElementById('lmTitle').textContent='SRCEM Login Portal';
  document.getElementById('a_user').value='';document.getElementById('a_pass').value='';
  document.getElementById('a_err').style.display='none';
}

// Map section IDs back to tab keys for the role guard
var SEC_TO_KEY={at_home:'home',at_apps:'apps',at_students:'students',at_subjects:'subjects',
  at_marks:'marks',at_attend:'attend',at_fee:'fee',at_staff:'staff',at_create:'addstaff',at_settings:'settings'};

function aTAB(btn,tid){
  // ── ROLE GATE: silently refuse if user's role cannot access this tab ──
  if(curAdmin){
    var tabKey=SEC_TO_KEY[tid];
    var allowed=ROLE_TABS[curAdmin.role]||['home','settings'];
    if(tabKey && allowed.indexOf(tabKey)<0){
      // Redirect to home instead of showing forbidden section
      var hBtn=document.getElementById('aTab_home');
      var hSec=document.getElementById('at_home');
      document.querySelectorAll('.atab').forEach(function(t){t.classList.remove('on');});
      if(hBtn) hBtn.classList.add('on');
      document.querySelectorAll('.asec').forEach(function(s){s.classList.remove('on');s.style.display='none';});
      if(hSec){hSec.classList.add('on');hSec.style.display='block';}
      return;
    }
  }
  document.querySelectorAll('.atab').forEach(function(t){t.classList.remove('on');});
  if(btn) btn.classList.add('on');
  document.querySelectorAll('.asec').forEach(function(s){s.classList.remove('on');s.style.display='none';});
  var el=document.getElementById(tid);if(el){el.classList.add('on');el.style.display='block';}
  if(tid==='at_apps')     renderApps('all');
  if(tid==='at_students') renderStudents();
  if(tid==='at_subjects') renderSubjects();
  if(tid==='at_marks')    loadMarkSubjects();
  if(tid==='at_attend')   loadAttendSubjects();
  if(tid==='at_fee')      {setupFeePanel();renderFeeRegister();}
  if(tid==='at_staff')    renderStaff();
  if(tid==='at_create')   setupAddStaffForm();
  if(tid==='at_settings')  loadProfile();
}

// Called every time "Add Staff" tab opens — locks/unlocks dept for HOD
function setupAddStaffForm(){
  var deptSel=document.getElementById('cf_dept');
  var roleSel=document.getElementById('cf_role');
  if(!deptSel||!roleSel) return;
  // Remove old note if present
  var oldNote=document.getElementById('hod_staff_note');
  if(oldNote) oldNote.remove();
  if(!isSuperAdmin()&&isHOD()){
    // Lock dept select to HOD's dept
    deptSel.value=myDept();
    deptSel.disabled=true;
    handleDeptChange(deptSel);
    // Hide roles HOD cannot assign
    // HOD can only create Faculty in their own dept
    Array.from(roleSel.options).forEach(function(o){
      o.style.display=(o.value===''||o.value==='Faculty')?'':'none';
    });
    roleSel.value='Faculty';
    if(deptSel) deptSel.value=myDept();
    // Insert notice
    var note=document.createElement('div');
    note.id='hod_staff_note';
    note.className='emsg';
    note.style.cssText='background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.4);color:#7a5d1a;margin-bottom:14px;';
    note.innerHTML='&#9432; You are HOD of <strong>'+myDept()+'</strong>. You can only add or edit faculty in your own department.';
    var wrap=document.getElementById('at_create');
    if(wrap){var h4=wrap.querySelector('h4');if(h4) h4.after(note);}
  } else {
    // Super Admin — unlock everything
    deptSel.disabled=false;
    Array.from(roleSel.options).forEach(function(o){o.style.display='';});
  }
}

