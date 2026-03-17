// ============================================================
// STUDENTS
// ============================================================
function renderStudents(){
  var canEdit=canAddStudent()&&!isFaculty();
  var list=STUDENTS.filter(function(s){
    if(isSuperAdmin()) return true;
    if(isAdmin()) return true;       // Admin: all depts (no marks/attend)
    if(isHOD())   return s.dept===myDept();
    if(isFaculty()) return s.dept===myDept();
    return false;
  });
  var label=(isHOD()||isFaculty())?' — '+myDept():'';
  document.getElementById('stu_dept_label').textContent=label;
  document.getElementById('stu_add_btn').style.display=canEdit?'':'none';
  if(list.length===0){document.getElementById('stu_tbl').innerHTML='<div style="text-align:center;padding:32px;color:var(--tm);">No students in your department.</div>';return;}
  var rows=list.map(function(s,i){
    var realIdx=STUDENTS.indexOf(s);
    var acts='';
    if(canEdit&&(isSuperAdmin()||(isHOD()&&s.dept===myDept()))){
      acts='<button class="abt abt-edit" data-idx="'+realIdx+'" onclick="openStuModal(parseInt(this.dataset.idx))">Edit</button>';
    }
    return '<tr><td style="font-family:monospace;font-size:12px;color:var(--cr);">'+s.roll+'</td>'+
      '<td><strong style="color:var(--nv);">'+s.name+'</strong></td>'+
      '<td style="font-size:12px;">'+s.dept+'</td>'+
      '<td style="font-size:12px;">'+s.program+' Sem '+s.sem+'</td>'+
      '<td style="font-size:12px;">'+s.mobile+'</td>'+
      '<td><span class="badge-on">'+s.status+'</span></td>'+
      '<td>'+acts+'</td></tr>';
  }).join('');
  document.getElementById('stu_tbl').innerHTML='<div style="overflow-x:auto;"><table class="stbl"><thead><tr><th>Roll No.</th><th>Name</th><th>Department</th><th>Program</th><th>Mobile</th><th>Status</th><th>Action</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

function openStuModal(idx){
  if(idx>=0 && !canEditStudent()){ alert('Only Super Admin and HOD can edit students.'); return; }
  if(idx<0  && !canAddStudent()){  alert('Only Super Admin and HOD can add students.');  return; }
  editingStuIdx=idx;
  var s=idx>=0?STUDENTS[idx]:null;
  // Update modal header title (h3 inside #stu_modal_hdr)
  var hdr=document.querySelector('#stu_modal_hdr h3');
  if(hdr) hdr.textContent=(s?'✏️ Edit Student':'➕ Add Student');
  document.getElementById('sm_roll').value=s?s.roll:'';
  document.getElementById('sm_name').value=s?s.name:'';
  // HTML uses id="sm_prog" not sm_program
  var progSel=document.getElementById('sm_prog');
  if(progSel) progSel.value=s?s.program:'B.Tech';
  document.getElementById('sm_sem').value=s?s.sem:'1';
  document.getElementById('sm_mobile').value=s?s.mobile:'';
  document.getElementById('sm_email').value=s?s.email:'';
  document.getElementById('sm_status').value=s?s.status:'enrolled';
  // HOD: lock dept to their own
  var deptSel=document.getElementById('sm_dept');
  if(deptSel){
    deptSel.value=s?s.dept:(isHOD()&&!isSuperAdmin()?myDept():'Computer Science');
    deptSel.disabled=(isHOD()&&!isSuperAdmin());
  }
  document.getElementById('sm_err').style.display='none';
  OM('stuModal');
}
function saveStu(){
  var roll=document.getElementById('sm_roll').value.trim();
  var name=document.getElementById('sm_name').value.trim();
  var dept=document.getElementById('sm_dept').value;
  var prog=(document.getElementById('sm_prog')||document.getElementById('sm_program')||{value:''}).value;
  var sem=document.getElementById('sm_sem').value;
  var mob=document.getElementById('sm_mobile').value.trim();
  var email=document.getElementById('sm_email').value.trim();
  var status=document.getElementById('sm_status').value;
  var err=document.getElementById('sm_err');err.style.display='none';
  if(!roll||!name||!dept||!prog||!sem){err.textContent='Fill all required fields.';err.style.display='block';return;}
  // HOD can only add/edit students in their own department
  if(isHOD() && dept !== myDept()){
    err.textContent='You can only add students to your department: '+myDept()+'.';
    err.style.display='block'; return;
  }
  if(!canAddStudent()&&!canEditStudent()){err.textContent='Access denied.';err.style.display='block';return;}
  if(editingStuIdx>=0){
    STUDENTS[editingStuIdx]={roll:roll,name:name,dept:dept,program:prog,sem:sem,mobile:mob,email:email,status:status};
  } else {
    STUDENTS.push({roll:roll,name:name,dept:dept,program:prog,sem:sem,mobile:mob,email:email,status:status});
  }
  CM('stuModal');renderStudents();updatePendingBadge();
}

