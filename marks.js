// ============================================================
// MARKS
// ============================================================
function loadMarkSubjects(){
  var sel=document.getElementById('mk_subj');if(!sel)return;
  sel.innerHTML='<option value="">-- Select Subject --</option>';
  var semF=(document.getElementById('mk_sem_filter')||{value:''}).value;
  var list=SUBJECTS.filter(function(s){
    // Role-based dept filter
    if(!isSuperAdmin()){
      if(isHOD()    && s.dept!==myDept()) return false;
      if(isFaculty()&&(s.faculty!==curAdmin.uname||s.dept!==myDept())) return false;
      if(!isHOD()&&!isFaculty()) return false;
    }
    // Semester filter
    if(semF && s.sem!==semF) return false;
    return true;
  });
  list.forEach(function(s){
    var opt=document.createElement('option');opt.value=SUBJECTS.indexOf(s);
    opt.textContent=s.code+' — '+s.name+' (Sem '+s.sem+')';
    sel.appendChild(opt);
  });
  var tbl=document.getElementById('mk_tbl');if(tbl)tbl.innerHTML='';
}
function loadMarkStudents(){
  var sIdx=document.getElementById('mk_subj').value;
  if(!sIdx){var tbl=document.getElementById('mk_tbl');if(tbl)tbl.innerHTML='';return;}
  var subj=SUBJECTS[parseInt(sIdx)];
  var stuList=STUDENTS.filter(function(s){return s.dept===subj.dept&&s.sem===subj.sem;});
  if(stuList.length===0){document.getElementById('mk_tbl').innerHTML='<div class="emsg err">No students found for this subject.</div>';return;}
  var rows=stuList.map(function(s){
    var key=sIdx+'_'+s.roll;
    var existing=null;for(var i=0;i<MARKS.length;i++){if(MARKS[i].key===key){existing=MARKS[i];break;}}
    return '<tr><td style="font-size:12px;font-family:monospace;color:var(--cr);">'+s.roll+'</td>'+
      '<td><strong style="color:var(--nv);">'+s.name+'</strong></td>'+
      '<td><input type="number" min="0" max="30" id="mk_'+s.roll.replace(/\//g,'_')+'" value="'+(existing?existing.marks:'')+'" style="width:70px;padding:5px 8px;border:1.5px solid var(--bd);border-radius:7px;font-size:14px;" placeholder="0-30"></td>'+
      '<td style="font-size:12px;">'+(existing?'<span style="color:#16a34a;font-weight:600;">Saved</span>':'<span style="color:var(--tm);">Not entered</span>')+'</td></tr>';
  }).join('');
  document.getElementById('mk_tbl').innerHTML=
    '<div class="rtable-wrap"><div class="rthdr"><h4>'+subj.name+'</h4><p>Enter marks out of 30 for each student</p></div>'+
    '<table class="rt"><thead><tr><th>Roll No.</th><th>Student Name</th><th>Marks /30</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<button class="sbtn" style="max-width:220px;margin-top:12px;" onclick="saveMarks()">Save Marks &rarr;</button>';
}
function saveMarks(){
  var sIdx=document.getElementById('mk_subj').value;if(!sIdx)return;
  var subj=SUBJECTS[parseInt(sIdx)];
  var stuList=STUDENTS.filter(function(s){return s.dept===subj.dept&&s.sem===subj.sem;});
  var saved=0;
  stuList.forEach(function(s){
    var fid='mk_'+s.roll.replace(/\//g,'_');
    var el=document.getElementById(fid);if(!el)return;
    var v=el.value.trim();if(v==='')return;
    var key=sIdx+'_'+s.roll;
    var found=false;
    for(var i=0;i<MARKS.length;i++){if(MARKS[i].key===key){MARKS[i].marks=v;found=true;break;}}
    if(!found) MARKS.push({key:key,subjIdx:sIdx,roll:s.roll,name:s.name,marks:v,by:curAdmin.uname,date:new Date().toLocaleDateString()});
    saved++;
  });
  loadMarkStudents();
  if(saved>0){
    var msg=document.getElementById('mk_msg');
    if(msg){msg.className='emsg ok';msg.textContent='✅ Marks saved for '+saved+' student(s).';msg.style.display='block';
      setTimeout(function(){msg.style.display='none';},3000);}
  }
}
function showMsg(msg,type){
  var d=document.createElement('div');d.className='emsg '+(type==='ok'?'ok':'err');d.textContent=msg;d.style.marginTop='10px';
  var tbl=document.getElementById('mk_tbl');if(tbl){tbl.appendChild(d);setTimeout(function(){d.remove();},3000);}
}

