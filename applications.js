// ============================================================
// APPLICATIONS
// ============================================================
function renderApps(filter){
  currentAppFilter=filter||currentAppFilter;
  document.querySelectorAll('.app-filter-btn').forEach(function(b){
    var active=b.getAttribute('data-filter')===currentAppFilter;
    b.style.background=active?'var(--cr)':'var(--cm)';b.style.color=active?'#fff':'var(--tm)';
  });
  var list=[];
  for(var i=0;i<APPS.length;i++){
    var a=APPS[i];
    if(currentAppFilter!=='all'&&a.status!==currentAppFilter) continue;
    // Super Admin sees all; HOD sees only their dept's applications
    if(isHOD() && a.dept !== myDept()) continue;
    list.push({app:a,idx:i});
  }
  if(list.length===0){document.getElementById('apps_tbl').innerHTML='<div style="text-align:center;padding:32px;color:var(--tm);">No applications found.</div>';return;}
  var scol={pending:'#f59e0b',approved:'#16a34a',rejected:'#dc2626'};
  var sbg={pending:'rgba(245,158,11,.12)',approved:'rgba(34,197,94,.12)',rejected:'rgba(220,38,38,.12)'};
  var slbl={pending:'Pending',approved:'Approved',rejected:'Rejected'};
  var rows=list.map(function(item){
    var a=item.app;var i=item.idx;
    var actions='';
    if(a.status==='pending'){
      actions='<button class="abt" style="background:rgba(34,197,94,.15);color:#16a34a;margin-right:4px;" data-idx="'+i+'" data-type="approve" onclick="openAppModal(parseInt(this.dataset.idx),this.dataset.type)">Approve</button>'+
              '<button class="abt" style="background:rgba(220,38,38,.15);color:#dc2626;" data-idx="'+i+'" data-type="reject" onclick="openAppModal(parseInt(this.dataset.idx),this.dataset.type)">Reject</button>';
    } else {
      actions='<button class="abt" style="background:rgba(99,102,241,.15);color:#4f46e5;" data-idx="'+i+'" onclick="doAppAction(parseInt(this.dataset.idx),`pending`,``)">Reset</button>';
    }
    return '<tr><td style="font-size:12px;font-family:monospace;color:var(--cr);">'+a.ref+'</td>'+
      '<td><strong style="color:var(--nv);font-size:13px;">'+a.name+'</strong><br><span style="font-size:11px;color:var(--tm);">'+a.email+'</span></td>'+
      '<td style="font-size:12px;">'+a.program+'<br><span style="color:var(--tm);">'+a.branch+'</span></td>'+
      '<td style="font-weight:700;">'+a.pct+'%</td>'+
      '<td style="font-size:12px;color:var(--tm);">'+a.submitted+'</td>'+
      '<td><span style="background:'+sbg[a.status]+';color:'+scol[a.status]+';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">'+slbl[a.status]+'</span></td>'+
      '<td style="white-space:nowrap;">'+actions+'</td></tr>';
  }).join('');
  document.getElementById('apps_tbl').innerHTML='<div style="overflow-x:auto;"><table class="stbl"><thead><tr><th>Ref</th><th>Applicant</th><th>Program</th><th>%</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
function openAppModal(idx,type){
  var a=APPS[idx];
  var canAct=isSuperAdmin()||(isHOD()&&a.dept===myDept()); // SA: all; HOD: own dept only
  document.getElementById('am_appName').textContent=a.name;
  document.getElementById('am_appRef').textContent=a.ref;
  document.getElementById('am_appProg').textContent=a.program+' - '+a.branch;
  document.getElementById('am_idx').value=idx;document.getElementById('am_type').value=type;
  document.getElementById('am_note').value='';
  var btn=document.getElementById('am_confirmBtn');
  var noteWrap=document.getElementById('am_note_wrap');
  var hdr=document.getElementById('am_header');
  if(!canAct){
    hdr.style.background='linear-gradient(135deg,#374151,#4b5563)';
    hdr.querySelector('h3').textContent='Access Denied';
    if(noteWrap) noteWrap.innerHTML='<div class="emsg err" style="margin:8px 0;">Only <strong>Super Admin</strong> can approve or reject applications.</div>';
    btn.style.display='none';
  } else {
    btn.style.display='';
    var isApp=(type==='approve');
    if(noteWrap) noteWrap.innerHTML='<label id="am_note_label">'+(isApp?'Note for applicant (enrollment no., next steps):':'Reason for rejection:')+'</label><textarea id="am_note" rows="3" style="width:100%;padding:9px;border:1.5px solid var(--bd);border-radius:8px;font-family:inherit;font-size:13px;resize:vertical;" placeholder="'+(isApp?'e.g. Welcome! Enrollment: SRCEM/2025/BT/0XXX':'e.g. Minimum 65% required.')+'"></textarea>';
    if(isApp){hdr.style.background='linear-gradient(135deg,#14532d,#16a34a)';hdr.querySelector('h3').textContent='Approve Application';btn.style.background='linear-gradient(135deg,#16a34a,#14532d)';btn.textContent='Confirm Approval';}
    else{hdr.style.background='linear-gradient(135deg,#7f1d1d,#dc2626)';hdr.querySelector('h3').textContent='Reject Application';btn.style.background='linear-gradient(135deg,#dc2626,#7f1d1d)';btn.textContent='Confirm Rejection';}
  }
  OM('appActionModal');
}
function confirmAppAction(){
  var idx=parseInt(document.getElementById('am_idx').value);
  var type=document.getElementById('am_type').value;
  var noteEl=document.getElementById('am_note');
  var note=noteEl?noteEl.value.trim():'';
  var app=APPS[idx];
  var app2=APPS[idx];
  if(!isSuperAdmin()&&!(isHOD()&&app2.dept===myDept())){
    alert('Access denied. You can only action applications for your own department ('+myDept()+').');
    CM('appActionModal');return;
  }
  doAppAction(idx,type==='approve'?'approved':'rejected',note);
  CM('appActionModal');
}
function doAppAction(idx,newStatus,note){
  APPS[idx].status=newStatus;
  APPS[idx].note=(newStatus==='approved')?(note||'Welcome! Please visit college with original documents.'):(newStatus==='rejected'?(note||'Application rejected.'):'');
  updatePendingBadge();renderApps(currentAppFilter);
}

