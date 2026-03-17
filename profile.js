// ============================================================
// PROFILE MANAGEMENT
// ============================================================

function loadProfile(){
  if(!curAdmin) return;
  var s=curAdmin;
  // Initials
  var initials=s.name.split(' ').map(function(w){return w[0]||'';}).slice(0,2).join('').toUpperCase();
  var setInitials=function(spanId,imgId){
    var sp=document.getElementById(spanId),im=document.getElementById(imgId);
    if(!sp||!im) return;
    if(s.photo){sp.style.display='none';im.src=s.photo;im.style.display='block';}
    else{sp.textContent=initials;sp.style.display='';im.style.display='none';}
  };
  setInitials('prof_initials','prof_photo_img');
  setInitials('prof_edit_initials','prof_edit_img');
  // View mode
  var set=function(id,v){var el=document.getElementById(id);if(el)el.textContent=v||'—';};
  set('prof_view_name',   s.name);
  set('prof_view_email',  s.email);
  set('prof_view_mob',    s.mob);
  set('prof_view_dept',   s.dept);
  var rlEl=document.getElementById('prof_view_role');
  if(rlEl){var rl={'Super Admin':'Super Admin','Admin':'Admin — Accounts','HOD':'HOD','Faculty':'Faculty'};rlEl.textContent=rl[s.role]||s.role;}
  var crEl=document.getElementById('prof_view_created');if(crEl)crEl.textContent=s.created||'—';
  // Specialization row (HOD only in view)
  var specRow=document.getElementById('prof_spec_row');
  if(specRow){specRow.style.display=(s.role==='HOD'||s.role==='Super Admin'||s.specialization)?'block':'none';}
  set('prof_view_spec', s.specialization);
  // Edit form pre-fill
  var v=function(id,val){var el=document.getElementById(id);if(el)el.value=val||'';};
  v('prof_name',  s.name);
  v('prof_email', s.email);
  v('prof_mob',   s.mob);
  v('prof_spec',  s.specialization||'');
  var rdEl=document.getElementById('prof_role_display');if(rdEl)rdEl.value=s.role;
  // Spec wrap: show for HOD + SA; hide for Admin + Faculty
  var sw=document.getElementById('prof_spec_wrap');
  if(sw) sw.style.display=(s.role==='HOD'||s.role==='Super Admin')?'':'none';
}

function toggleProfileEdit(){
  var editDiv=document.getElementById('prof_edit');
  var viewDiv=document.getElementById('prof_view');
  var btnEl=document.getElementById('prof_edit_btn');
  if(!editDiv||!viewDiv) return;
  var editing=(editDiv.style.display!=='none'&&editDiv.style.display!=='');
  if(editing){
    editDiv.style.display='none';viewDiv.style.display='block';
    if(btnEl)btnEl.textContent='\u270f\ufe0f Edit Profile';
  } else {
    editDiv.style.display='block';viewDiv.style.display='none';
    if(btnEl)btnEl.textContent='\u2715 Cancel Edit';
    loadProfile(); // refresh edit form
  }
  var errEl=document.getElementById('prof_err');if(errEl)errEl.style.display='none';
}

function saveProfile(){
  var name=(document.getElementById('prof_name')||{value:''}).value.trim();
  var email=(document.getElementById('prof_email')||{value:''}).value.trim();
  var mob=(document.getElementById('prof_mob')||{value:''}).value.trim();
  var spec=(document.getElementById('prof_spec')||{value:''}).value.trim();
  var errEl=document.getElementById('prof_err');if(errEl)errEl.style.display='none';
  if(!name||!email){
    if(errEl){errEl.textContent='Name and Email are required.';errEl.style.display='block';}
    return;
  }
  // Update curAdmin and STAFF array
  curAdmin.name=name;curAdmin.email=email;curAdmin.mob=mob;curAdmin.specialization=spec;
  for(var i=0;i<STAFF.length;i++){
    if(STAFF[i].uname===curAdmin.uname){
      STAFF[i].name=name;STAFF[i].email=email;STAFF[i].mob=mob;STAFF[i].specialization=spec;
      break;
    }
  }
  // Update welcome header
  var wnEl=document.getElementById('adm_wname');if(wnEl)wnEl.textContent='Welcome, '+name;
  // Switch back to view mode
  toggleProfileEdit();
  loadProfile();
  // Flash success
  var flash=document.createElement('div');flash.className='emsg ok';
  flash.style.cssText='margin:0 0 12px;font-weight:600;font-size:13px;padding:10px 14px;border-radius:8px;';
  flash.textContent='\u2705 Profile updated successfully!';
  var settingsEl=document.getElementById('at_settings');
  if(settingsEl){settingsEl.prepend(flash);setTimeout(function(){flash.remove();},3500);}
}

function handleProfilePhoto(inp){
  if(!inp.files||!inp.files[0]) return;
  var file=inp.files[0];
  if(file.size>2*1024*1024){alert('Image must be under 2MB.');inp.value='';return;}
  var reader=new FileReader();
  reader.onload=function(e){
    var src=e.target.result;
    curAdmin.photo=src;
    // Update preview in edit form
    var sp=document.getElementById('prof_edit_initials');var im=document.getElementById('prof_edit_img');
    if(sp)sp.style.display='none';if(im){im.src=src;im.style.display='block';}
    // Update view avatar
    var sp2=document.getElementById('prof_initials');var im2=document.getElementById('prof_photo_img');
    if(sp2)sp2.style.display='none';if(im2){im2.src=src;im2.style.display='block';}
  };
  reader.readAsDataURL(file);
}


function chgPass(){
  if(!curAdmin)return;
  var cur=document.getElementById('cp_cur').value;var np=document.getElementById('cp_new').value;var cp=document.getElementById('cp_conf').value;
  var msg=document.getElementById('cp_msg');
  if(cur!==curAdmin.pass){msg.className='emsg err';msg.textContent='Current password incorrect.';msg.style.display='block';return;}
  if(np.length<8){msg.className='emsg err';msg.textContent='Min 8 characters required.';msg.style.display='block';return;}
  if(np!==cp){msg.className='emsg err';msg.textContent='Passwords do not match.';msg.style.display='block';return;}
  curAdmin.pass=np;for(var i=0;i<STAFF.length;i++){if(STAFF[i].uname===curAdmin.uname){STAFF[i].pass=np;break;}}
  msg.className='emsg ok';msg.textContent='Password updated!';msg.style.display='block';
  document.getElementById('cp_cur').value='';document.getElementById('cp_new').value='';document.getElementById('cp_conf').value='';
}

