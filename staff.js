// ============================================================
// STAFF
// ============================================================
function renderStaff(){
  // Faculty cannot see staff — they have no staff tab; belt-and-suspenders check
  if(isFaculty()){ document.getElementById('staff_tbl').innerHTML='<div style="text-align:center;padding:24px;color:var(--cr);">Access restricted.</div>'; return; }
  var rows=STAFF.reduce(function(acc,s,i){
    var locked=(s.uname==='superadmin');
    // Dept filter: HOD only sees own dept staff; Super Admin sees all
    if(isHOD()&&s.dept!==myDept()) return acc;
    var canEdit=isSuperAdmin()||(isHOD()&&s.dept===myDept());
    var acts='';
    if(locked){
      acts='<span style="font-size:11px;color:var(--tl);">Protected</span>';
    } else if(!canEdit){
      acts='<span style="font-size:11px;color:var(--tl);">Other Dept</span>';
    } else {
      acts='<button class="abt abt-edit" data-idx="'+i+'" onclick="editStaff(parseInt(this.dataset.idx))">Edit</button>';
      if(s.active) acts+='<button class="abt abt-tog" data-idx="'+i+'" onclick="togStaff(parseInt(this.dataset.idx))">Deactivate</button>';
      else acts+='<button class="abt abt-tog act" data-idx="'+i+'" onclick="togStaff(parseInt(this.dataset.idx))">Activate</button>';
      if(isSuperAdmin()) acts+='<button class="abt abt-rst" data-idx="'+i+'" onclick="rstPass(parseInt(this.dataset.idx))">Reset Pass</button>';
    }
    acc.push('<tr><td><strong style="color:var(--nv);">'+s.name+'</strong><br><span style="font-size:11px;color:var(--tm);">'+s.email+'</span></td>'+
      '<td><code style="font-size:12px;color:var(--cr);background:rgba(181,23,43,.08);padding:2px 7px;border-radius:4px;">'+s.uname+'</code></td>'+
      '<td style="font-size:12px;">'+s.role+'</td><td style="font-size:12px;">'+s.dept+'</td>'+
      '<td><span class="'+(s.active?'badge-on':'badge-off')+'">'+(s.active?'Active':'Inactive')+'</span></td>'+
      '<td style="white-space:nowrap;">'+acts+'</td></tr>');
    return acc;
  },[]);
  var filtRows=rows.join('');
  document.getElementById('staff_tbl').innerHTML='<div style="overflow-x:auto;"><table class="stbl"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Dept</th><th>Status</th><th>Actions</th></tr></thead><tbody>'+filtRows+'</tbody></table></div>';
}
function togStaff(i){
  if(!isSuperAdmin() && !(isHOD() && STAFF[i].dept===myDept())){
    alert('You do not have permission to change this staff status.'); return;
  }
  if(STAFF[i].uname==='superadmin') return;
  if(!isSuperAdmin()&&isHOD()&&STAFF[i].dept!==myDept()){alert('Access denied: you can only manage staff in your own department.');return;}
  STAFF[i].active=!STAFF[i].active;renderStaff();
}
function rstPass(i){
  if(!isSuperAdmin()){alert('Only Super Admin can reset passwords.');return;}
  var np='SRCEM@'+Math.floor(1000+Math.random()*9000);
  STAFF[i].pass=np;
  var d=document.createElement('div');d.className='emsg ok';d.style.margin='10px 0';
  d.textContent='Password for '+STAFF[i].name+' reset to: '+np;
  document.getElementById('staff_tbl').prepend(d);setTimeout(function(){d.remove();},5000);
  renderStaff();
}
function editStaff(i){
  if(!isSuperAdmin() && !(isHOD() && STAFF[i].dept===myDept())){
    alert('You can only edit staff in your own department.'); return;
  }
  var s=STAFF[i];
  // Authority check: HOD can only edit their own dept
  if(!isSuperAdmin()&&isHOD()&&s.dept!==myDept()){
    alert('Access denied. You can only edit staff in your own department: '+myDept());
    return;
  }
  aTAB(document.getElementById('aTab_addstaff'),'at_create');
  document.getElementById('cf_title').textContent='Edit Staff Account';
  document.getElementById('cf_savebtn').textContent='Save Changes';
  document.getElementById('cf_editIdx').value=i;
  document.getElementById('cf_name').value=s.name;document.getElementById('cf_sid').value=s.id;
  document.getElementById('cf_uname').value=s.uname;document.getElementById('cf_role').value=s.role;
  document.getElementById('cf_dept').value=s.dept;document.getElementById('cf_mob').value=s.mob;
  document.getElementById('cf_email').value=s.email;document.getElementById('cf_pass').value=s.pass;
  document.getElementById('cf_pass2').value=s.pass;
}
function saveStaff(){
  var name=document.getElementById('cf_name').value.trim();var sid=document.getElementById('cf_sid').value.trim();
  var uname=document.getElementById('cf_uname').value.trim();var role=document.getElementById('cf_role').value;
  var deptRaw=document.getElementById('cf_dept').value;
  var diplomaBranch=document.getElementById('cf_diploma_branch')?document.getElementById('cf_diploma_branch').value:'';
  var dept=(deptRaw==='Diploma'&&diplomaBranch)?'Diploma - '+diplomaBranch:deptRaw;
  var mob=document.getElementById('cf_mob').value.trim();
  var email=document.getElementById('cf_email').value.trim();var pass=document.getElementById('cf_pass').value;
  var pass2=document.getElementById('cf_pass2').value;
  var err=document.getElementById('cf_err');err.style.display='none';
  if(!name||!sid||!uname||!role||!deptRaw){err.textContent='Fill all required fields.';err.style.display='block';return;}
  if(deptRaw==='Diploma'&&!diplomaBranch){err.textContent='Please select the Diploma branch.';err.style.display='block';return;}
  // HOD can only add/edit staff in their own department
  if(!isSuperAdmin()&&isHOD()&&deptRaw!==myDept()&&dept!==myDept()){
    err.textContent='You can only add or edit staff in your own department: '+myDept()+'.';
    err.style.display='block';return;
  }
  // Role assignment restrictions
  if(!isSuperAdmin()){
    if(isHOD()){
      if(role!=='Faculty'){
        err.textContent='HOD can only create Faculty accounts in their department.';
        err.style.display='block'; return;
      }
    } else {
      err.textContent='Access denied: you cannot create staff accounts.';
      err.style.display='block'; return;
    }
  }
  // Super Admin creating HOD or Admin: no dept restriction
  // HOD creating Faculty: must be own dept (already checked above)
  if(pass.length<8){err.textContent='Password must be at least 8 characters.';err.style.display='block';return;}
  if(pass!==pass2){err.textContent='Passwords do not match.';err.style.display='block';return;}
  var idx=document.getElementById('cf_editIdx').value;
  if(idx!==''){
    var ii=parseInt(idx);
    STAFF[ii]={id:sid,name:name,uname:uname,pass:pass,role:role,dept:dept,mob:mob,email:email,created:STAFF[ii].created,active:STAFF[ii].active};
    clearCF();aTAB(document.getElementById('aTab_staff'),'at_staff');
  } else {
    var dup=false;for(var j=0;j<STAFF.length;j++){if(STAFF[j].uname===uname){dup=true;break;}}
    if(dup){err.textContent='Username "'+uname+'" already exists.';err.style.display='block';return;}
    var now=new Date();var mn=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    STAFF.push({id:sid,name:name,uname:uname,pass:pass,role:role,dept:dept,mob:mob,email:email,created:now.getDate()+' '+mn[now.getMonth()]+' '+now.getFullYear(),active:true});
    var newSC=isSuperAdmin()?STAFF.length:STAFF.filter(function(s){return s.dept===myDept();}).length;
    document.getElementById('adm_sc').textContent=newSC;
    clearCF();aTAB(document.getElementById('aTab_staff'),'at_staff');
    var eb=document.createElement('div');eb.className='emsg ok';eb.style.padding='12px';eb.textContent='Staff created! Username: '+uname+'  Pass: '+pass;
    document.getElementById('at_staff').prepend(eb);setTimeout(function(){eb.remove();},6000);
  }
}
function clearCF(){
  ['cf_name','cf_sid','cf_uname','cf_mob','cf_email','cf_pass','cf_pass2'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('cf_role').value='';
  var deptSel=document.getElementById('cf_dept');
  if(deptSel){deptSel.disabled=false;deptSel.value='';}
  var dipWrap=document.getElementById('diploma_sub_wrap');
  if(dipWrap) dipWrap.style.display='none';
  document.getElementById('cf_editIdx').value='';document.getElementById('cf_err').style.display='none';
  document.getElementById('gen_box').style.display='none';
  document.getElementById('cf_title').textContent='Add New Staff Account';
  document.getElementById('cf_savebtn').textContent='\u2713 Create Staff Account';
  var note=document.getElementById('hod_staff_note');if(note)note.remove();
  // Re-apply role/dept constraints for current user
  setupAddStaffForm();
}
function genPass(){
  var c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  var p='';for(var i=0;i<10;i++)p+=c[Math.floor(Math.random()*c.length)];
  p='S'+p+'2!';
  document.getElementById('cf_pass').value=p;document.getElementById('cf_pass2').value=p;
  var b=document.getElementById('gen_box');b.style.display='flex';b.textContent='Generated: '+p;
}
function tPass(fid,btn){
  var f=document.getElementById(fid);
  if(f.type==='password'){f.type='text';btn.textContent='Hide';}else{f.type='password';btn.textContent='Show';}
}
function handleDeptChange(sel){
  var val=sel.value;
  var wrap=document.getElementById('diploma_sub_wrap');
  if(wrap) wrap.style.display=(val==='Diploma')?'block':'none';
}

