// ============================================================
// FEE  (Accounts: see ALL enrolled students, add/edit fee)
// ============================================================
// ============================================================
// FEE MANAGEMENT
// ============================================================

// Is current user allowed to EDIT fees?
function canEditFee(){return isAccounts();}

// Setup fee panel when tab opens — show/hide controls based on role
function setupFeePanel(){
  // HOD and Faculty cannot reach fee tab (hidden by ROLE_TABS + aTAB gate)
  if(!canSeeFee()){
    document.getElementById('fee_stu_list').innerHTML='<div style="text-align:center;padding:24px;color:var(--cr);">Access restricted.</div>';
    return;
  }
  var isAcc=canEditFee();
  // Tab buttons
  var btnAdd=document.getElementById('fee_tab_btn_add');
  if(btnAdd){
    btnAdd.style.display=isAcc?'':'none';
  }
  // Sub-title
  var sub=document.getElementById('fee_panel_subtitle');
  if(sub) sub.textContent=isAcc?'Accounts Dashboard \u2022 Add, edit & track all fees':'View-only \u2022 Contact Accounts dept to record fees';
  // Access denied block inside add tab
  var denied=document.getElementById('fee_access_denied');
  var form=document.getElementById('fee_add_form');
  if(denied) denied.style.display=isAcc?'none':'block';
  if(form) form.style.display=isAcc?'block':'none';
  // Compute overall stats
  var totalPaid=0; FEE_ENTRIES.forEach(function(f){totalPaid+=f.amt;});
  var totalDue=STUDENTS.filter(function(s){return s.status==='enrolled';}).length*48000 - totalPaid;
  var sp=document.getElementById('fee_stats_paid');
  var sd=document.getElementById('fee_stats_due');
  if(sp) sp.textContent='\u20b9'+totalPaid.toLocaleString()+' Collected';
  if(sd) sd.textContent='\u20b9'+Math.max(0,totalDue).toLocaleString()+' Outstanding';
  renderFeeRegister();
}

// ── TAB 1: STUDENT REGISTER ──────────────────────────────────
function renderFeeRegister(){
  var searchRoll=(document.getElementById('fee_search_roll')||{value:''}).value.trim().toLowerCase();
  var deptF=(document.getElementById('fee_dept_filter')||{value:''}).value;
  var statusF=(document.getElementById('fee_status_filter')||{value:''}).value;
  var list=STUDENTS.filter(function(s){
    if(s.status!=='enrolled') return false;
    if(deptF && s.dept!==deptF) return false;
    if(searchRoll && s.roll.toLowerCase().indexOf(searchRoll)<0 && s.name.toLowerCase().indexOf(searchRoll)<0) return false;
    var paid=0; FEE_ENTRIES.forEach(function(f){if(f.roll===s.roll) paid+=f.amt;});
    var due=Math.max(0,48000-paid);
    if(statusF==='due' && due<=0) return false;
    if(statusF==='clear' && due>0) return false;
    return true;
  });
  var countEl=document.getElementById('fee_register_count');
  if(countEl) countEl.textContent='Showing '+list.length+' student'+(list.length!==1?'s':'')+(deptF?' \u2022 '+deptF:'')+(searchRoll?' \u2022 Search: "'+searchRoll+'"':'');
  if(list.length===0){
    document.getElementById('fee_stu_list').innerHTML='<div style="text-align:center;padding:32px;color:var(--tm);"><div style="font-size:36px;margin-bottom:8px;">\ud83d\udd0d</div><div style="font-weight:700;">No students found</div><div style="font-size:13px;margin-top:4px;">Try adjusting filters or search</div></div>';
    return;
  }
  var isAcc=canEditFee();
  var rows=list.map(function(stu){
    var paid=0; FEE_ENTRIES.forEach(function(f){if(f.roll===stu.roll) paid+=f.amt;});
    var due=Math.max(0,48000-paid);
    var paidBadge='<span style="background:rgba(34,197,94,.12);color:#16a34a;padding:3px 9px;border-radius:12px;font-size:11px;font-weight:700;">\u20b9'+paid.toLocaleString()+' Paid</span>';
    var dueBadge=due>0
      ?'<span style="background:rgba(220,38,38,.12);color:#dc2626;padding:3px 9px;border-radius:12px;font-size:11px;font-weight:700;">\u20b9'+due.toLocaleString()+' Due</span>'
      :'<span style="background:rgba(34,197,94,.12);color:#16a34a;padding:3px 9px;border-radius:12px;font-size:11px;font-weight:700;">\u2713 Clear</span>';
    var acts='<button class="abt" style="background:rgba(99,102,241,.12);color:#4f46e5;" data-roll="'+stu.roll+'" onclick="viewStuFee(this.dataset.roll)">History</button>';
    if(isAcc) acts='<button class="abt abt-edit" data-roll="'+stu.roll+'" onclick="prefillFee(this.dataset.roll)">+ Add Fee</button> '+acts;
    return '<tr>'+
      '<td style="font-size:12px;font-family:monospace;color:var(--cr);white-space:nowrap;">'+stu.roll+'</td>'+
      '<td><strong style="color:var(--nv);">'+stu.name+'</strong><br><span style="font-size:11px;color:var(--tm);">'+stu.dept+'</span></td>'+
      '<td style="font-size:12px;">'+stu.program+' &bull; Sem '+stu.sem+'</td>'+
      '<td>'+paidBadge+'</td>'+
      '<td>'+dueBadge+'</td>'+
      '<td style="white-space:nowrap;">'+acts+'</td>'+
    '</tr>';
  }).join('');
  document.getElementById('fee_stu_list').innerHTML=
    '<div style="overflow-x:auto;"><table class="stbl">'+
    '<thead><tr><th>Roll No.</th><th>Name / Dept</th><th>Program</th><th>Paid (Sem)</th><th>Due (Sem)</th><th>Actions</th></tr></thead>'+
    '<tbody>'+rows+'</tbody></table></div>';
}

// Alias for backward compat
function renderFeeStudentList(){ renderFeeRegister(); }

function prefillFee(roll){
  if(!canEditFee()){
    feeSwitch(document.getElementById('fee_tab_btn_all'),'fee_tab_all','fee_tab_register','fee_tab_add');
    renderFeeTable(roll);
    document.getElementById('fee_filter_roll').value=roll;
    return;
  }
  feeSwitch(document.getElementById('fee_tab_btn_add'),'fee_tab_add','fee_tab_register','fee_tab_all');
  document.getElementById('fee_roll').value=roll;
  lookupStudent();
}

function viewStuFee(roll){
  feeSwitch(document.getElementById('fee_tab_btn_all'),'fee_tab_all','fee_tab_register','fee_tab_add');
  renderFeeTable(roll);
  document.getElementById('fee_filter_roll').value=roll;
}

// ── TAB 2: ADD / EDIT FEE ────────────────────────────────────
function lookupStudent(){
  var roll=document.getElementById('fee_roll').value.trim();
  var nameEl=document.getElementById('fee_stuname');
  var detailEl=document.getElementById('fee_stu_detail');
  var stu=null;
  for(var i=0;i<STUDENTS.length;i++){
    if(STUDENTS[i].roll===roll&&STUDENTS[i].status==='enrolled'){stu=STUDENTS[i];break;}
  }
  if(stu){
    nameEl.value=stu.name;nameEl.style.color='#16a34a';
    if(detailEl){
      detailEl.style.display='flex';
      document.getElementById('fee_stu_dept').textContent='\ud83c\udfeb Dept: '+stu.dept;
      document.getElementById('fee_stu_prog').textContent='\ud83c\udf93 '+stu.program;
      document.getElementById('fee_stu_sem').textContent='\ud83d\udcc5 Sem '+stu.sem;
    }
  } else {
    nameEl.value=roll?'Not found / not enrolled':'';
    nameEl.style.color=roll?'#dc2626':'';
    if(detailEl) detailEl.style.display='none';
  }
}

function addFeeEntry(){
  if(!canEditFee()){
    alert('Only Admin (Accounts) can record fee payments.');
    return;
  }
  var roll=document.getElementById('fee_roll').value.trim();
  var type=document.getElementById('fee_type').value;
  var sem=document.getElementById('fee_sem').value;
  var amt=document.getElementById('fee_amt').value;
  var mode=document.getElementById('fee_mode').value;
  var receipt=(document.getElementById('fee_receipt')||{value:''}).value.trim();
  var remarks=document.getElementById('fee_remarks').value.trim();
  var err=document.getElementById('fee_err');err.style.display='none';
  var stu=null;
  for(var i=0;i<STUDENTS.length;i++){
    if(STUDENTS[i].roll===roll&&STUDENTS[i].status==='enrolled'){stu=STUDENTS[i];break;}
  }
  if(!stu){err.textContent='Student not found or not enrolled. Verify the roll number.';err.style.display='block';return;}
  if(!type||!sem||!amt||!mode){err.textContent='Please fill all required fields (*).';err.style.display='block';return;}
  if(parseInt(amt)<=0){err.textContent='Amount must be greater than zero.';err.style.display='block';return;}
  var now=new Date();
  var mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var dateStr=now.getDate()+' '+mn[now.getMonth()]+' '+now.getFullYear();
  var editIdx=parseInt(document.getElementById('fee_edit_idx').value);
  if(editIdx>=0){
    FEE_ENTRIES[editIdx]={roll:roll,name:stu.name,dept:stu.dept,type:type,sem:sem,amt:parseInt(amt),
      mode:mode,receipt:receipt,remarks:remarks,
      date:FEE_ENTRIES[editIdx].date,by:FEE_ENTRIES[editIdx].by,
      updated:dateStr,updatedBy:curAdmin.uname};
    document.getElementById('fee_edit_idx').value=-1;
    document.getElementById('fee_form_title').textContent='\u2795 Record Fee Payment';
    document.getElementById('fee_savebtn').textContent='\u2713 Record Payment';
  } else {
    FEE_ENTRIES.push({roll:roll,name:stu.name,dept:stu.dept,type:type,sem:sem,amt:parseInt(amt),
      mode:mode,receipt:receipt,remarks:remarks,date:dateStr,by:curAdmin.uname,updated:'',updatedBy:''});
  }
  // Clear form
  ['fee_roll','fee_amt','fee_remarks','fee_receipt'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.value='';
  });
  document.getElementById('fee_stuname').value='';
  var dd=document.getElementById('fee_stu_detail');if(dd)dd.style.display='none';
  document.getElementById('fee_type').value='';
  document.getElementById('fee_sem').value='';
  document.getElementById('fee_mode').value='';
  // Go back to register tab
  feeSwitch(document.getElementById('fee_tab_btn_reg'),'fee_tab_register','fee_tab_add','fee_tab_all');
  // Show success flash
  var flash=document.createElement('div');flash.className='emsg ok';
  flash.style.cssText='margin:10px 0;font-weight:600;font-size:13px;';
  flash.textContent='\u2705 Fee entry '+(editIdx>=0?'updated':'recorded')+' for '+stu.name+' (\u20b9'+parseInt(amt).toLocaleString()+')';
  var ftab=document.getElementById('fee_tab_register');
  if(ftab) ftab.prepend(flash);
  setTimeout(function(){flash.remove();},4000);
  setupFeePanel();
}

function editFeeEntry(idx){
  if(!canEditFee()){alert('Only Admin (Accounts) can edit fee entries.');return;}
  var f=FEE_ENTRIES[idx];
  feeSwitch(document.getElementById('fee_tab_btn_add'),'fee_tab_add','fee_tab_register','fee_tab_all');
  document.getElementById('fee_edit_idx').value=idx;
  document.getElementById('fee_form_title').textContent='\u270f\ufe0f Edit Fee Entry';
  document.getElementById('fee_savebtn').textContent='\u2713 Update Entry';
  document.getElementById('fee_roll').value=f.roll;
  lookupStudent();
  document.getElementById('fee_type').value=f.type;
  document.getElementById('fee_sem').value=f.sem;
  document.getElementById('fee_amt').value=f.amt;
  document.getElementById('fee_mode').value=f.mode;
  if(document.getElementById('fee_receipt')) document.getElementById('fee_receipt').value=f.receipt||'';
  document.getElementById('fee_remarks').value=f.remarks||'';
}

function cancelFeeEdit(){
  document.getElementById('fee_edit_idx').value=-1;
  document.getElementById('fee_form_title').textContent='\u2795 Record Fee Payment';
  document.getElementById('fee_savebtn').textContent='\u2713 Record Payment';
  ['fee_roll','fee_amt','fee_remarks','fee_receipt'].forEach(function(id){
    var el=document.getElementById(id);if(el)el.value='';
  });
  var ns=document.getElementById('fee_stuname');if(ns)ns.value='';
  var dd=document.getElementById('fee_stu_detail');if(dd)dd.style.display='none';
  document.getElementById('fee_type').value='';
  document.getElementById('fee_sem').value='';
  document.getElementById('fee_mode').value='';
  var ferr=document.getElementById('fee_err');if(ferr)ferr.style.display='none';
  feeSwitch(document.getElementById('fee_tab_btn_reg'),'fee_tab_register','fee_tab_add','fee_tab_all');
}

// ── TAB 3: ALL TRANSACTIONS ──────────────────────────────────
function renderFeeTable(filterRoll){
  var fr=filterRoll||((document.getElementById('fee_filter_roll')||{value:''}).value.trim());
  var deptF=(document.getElementById('fee_txn_dept')||{value:''}).value;
  var isAcc=canEditFee();
  var list=FEE_ENTRIES.slice().reverse().filter(function(f){
    if(fr && f.roll.toLowerCase().indexOf(fr.toLowerCase())<0 && (f.name||'').toLowerCase().indexOf(fr.toLowerCase())<0) return false;
    if(deptF && f.dept!==deptF) return false;
    return true;
  });
  // Summary cards
  var totalAmt=0; list.forEach(function(f){totalAmt+=f.amt;});
  var sumEl=document.getElementById('fee_txn_summary');
  if(sumEl) sumEl.innerHTML=
    '<div style="background:rgba(13,27,42,.07);border-radius:10px;padding:10px 16px;font-size:13px;">'+
    '<span style="font-weight:700;color:var(--nv);">'+list.length+'</span> <span style="color:var(--tm);">transactions</span></div>'+
    '<div style="background:rgba(34,197,94,.1);border-radius:10px;padding:10px 16px;font-size:13px;">'+
    '<span style="font-weight:700;color:#16a34a;">\u20b9'+totalAmt.toLocaleString()+'</span> <span style="color:var(--tm);">total collected</span></div>';
  if(list.length===0){
    document.getElementById('fee_tbl').innerHTML='<div style="text-align:center;padding:32px;color:var(--tm);">No transactions found.</div>';
    return;
  }
  var rows=list.map(function(f){
    var realIdx=FEE_ENTRIES.indexOf(f);
    var updBadge=f.updated?'<br><span style="font-size:10px;color:#f59e0b;">Edited: '+f.updated+' by '+f.updatedBy+'</span>':'';
    var rcpt=f.receipt?'<br><span style="font-size:10px;color:var(--tm);">Ref: '+f.receipt+'</span>':'';
    var editBtn=isAcc?'<button class="abt abt-edit" data-idx="'+realIdx+'" onclick="editFeeEntry(parseInt(this.dataset.idx))">Edit</button>':'<span style="font-size:11px;color:var(--tl);">View</span>';
    return '<tr>'+
      '<td style="font-size:11px;font-family:monospace;color:var(--cr);white-space:nowrap;">'+f.roll+'</td>'+
      '<td><strong style="color:var(--nv);font-size:13px;">'+f.name+'</strong><br><span style="font-size:10px;color:var(--tm);">'+f.dept+'</span></td>'+
      '<td style="font-size:12px;">'+f.type+'</td>'+
      '<td style="font-size:12px;">'+f.sem+'</td>'+
      '<td style="font-weight:700;color:var(--nv);">\u20b9'+f.amt.toLocaleString()+rcpt+'</td>'+
      '<td style="font-size:12px;">'+f.mode+'</td>'+
      '<td style="font-size:12px;color:var(--tm);">'+f.date+'<br><span style="font-size:10px;">by '+f.by+'</span>'+updBadge+'</td>'+
      '<td>'+editBtn+'</td>'+
    '</tr>';
  }).join('');
  document.getElementById('fee_tbl').innerHTML=
    '<div style="overflow-x:auto;"><table class="stbl">'+
    '<thead><tr><th>Roll</th><th>Student</th><th>Type</th><th>Sem</th><th>Amount</th><th>Mode</th><th>Date / By</th><th>Action</th></tr></thead>'+
    '<tbody>'+rows+'</tbody></table></div>';
}

function feeSwitch(btn,show,h1,h2){
  // btn can be element or null
  var tabBar=document.querySelector('#at_fee > div:nth-child(2)');
  if(tabBar) tabBar.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on');});
  if(btn) btn.classList.add('on');
  [show,h1,h2].forEach(function(id,i){
    var el=document.getElementById(id);
    if(el) el.style.display=(i===0)?'block':'none';
  });
  if(show==='fee_tab_register') renderFeeRegister();
  if(show==='fee_tab_all') renderFeeTable();
  if(show==='fee_tab_add') setupFeePanel();
}



