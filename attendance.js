// ============================================================
// ATTENDANCE
// ============================================================
function loadAttendSubjects(){
  var sel=document.getElementById('att_subj');if(!sel)return;
  sel.innerHTML='<option value="">-- Select Subject --</option>';
  var semF=(document.getElementById('att_sem_filter')||{value:''}).value;
  SUBJECTS.forEach(function(s,i){
    // Role-based dept filter
    if(!isSuperAdmin()){
      if(isHOD()    && s.dept!==myDept()) return;
      if(isFaculty()&&(s.faculty!==curAdmin.uname||s.dept!==myDept())) return;
      if(!isHOD()&&!isFaculty()) return;
    }
    // Semester filter
    if(semF && s.sem!==semF) return;
    var opt=document.createElement('option');opt.value=i;
    opt.textContent=s.code+' — '+s.name+' (Sem '+s.sem+')';
    sel.appendChild(opt);
  });
  var tbl=document.getElementById('att_tbl');if(tbl)tbl.innerHTML='';
  var sb=document.getElementById('att_save_btn');if(sb)sb.style.display='none';
}
function loadAttendStudents(){
  var sIdx=document.getElementById('att_subj').value;
  if(sIdx===''){document.getElementById('att_tbl').innerHTML='';document.getElementById('att_save_btn').style.display='none';return;}
  var subj=SUBJECTS[parseInt(sIdx)];
  var stuList=STUDENTS.filter(function(s){return s.dept===subj.dept&&s.sem===subj.sem;});
  if(stuList.length===0){document.getElementById('att_tbl').innerHTML='<div class="emsg err">No students for this subject.</div>';return;}
  var rows=stuList.map(function(s){
    return '<tr><td style="font-size:12px;font-family:monospace;color:var(--cr);">'+s.roll+'</td>'+
      '<td><strong style="color:var(--nv);">'+s.name+'</strong></td>'+
      '<td><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="att_'+s.roll.replace(/\//g,'_')+'" value="P" checked> <span style="color:#16a34a;font-weight:600;">Present</span></label></td>'+
      '<td><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="att_'+s.roll.replace(/\//g,'_')+'" value="A"> <span style="color:#dc2626;font-weight:600;">Absent</span></label></td>'+
      '<td><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="att_'+s.roll.replace(/\//g,'_')+'" value="L"> <span style="color:#f59e0b;font-weight:600;">Late</span></label></td>'+
    '</tr>';
  }).join('');
  document.getElementById('att_tbl').innerHTML=
    '<div class="rtable-wrap"><div class="rthdr"><h4>'+subj.name+'</h4><p>Mark attendance for '+new Date().toLocaleDateString()+'</p></div>'+
    '<table class="rt"><thead><tr><th>Roll No.</th><th>Name</th><th colspan="3">Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  document.getElementById('att_save_btn').style.display='block';
}
function saveAttendance(){
  var sIdx=document.getElementById('att_subj').value;if(!sIdx)return;
  var subj=SUBJECTS[parseInt(sIdx)];
  var stuList=STUDENTS.filter(function(s){return s.dept===subj.dept&&s.sem===subj.sem;});
  var date=document.getElementById('att_date').value;
  stuList.forEach(function(s){
    var nm='att_'+s.roll.replace(/\//g,'_');
    var checked=document.querySelector('input[name="'+nm+'"]:checked');
    var status=checked?checked.value:'P';
    ATTENDANCE.push({subjIdx:sIdx,roll:s.roll,date:date,status:status,by:curAdmin.uname});
  });
  var sb=document.getElementById('att_save_btn');
  sb.textContent='Saved!';sb.style.background='linear-gradient(135deg,#16a34a,#14532d)';
  setTimeout(function(){sb.textContent='Save Attendance';sb.style.background='';},2000);
}

