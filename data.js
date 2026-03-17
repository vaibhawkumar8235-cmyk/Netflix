// ============================================================
// DATA
// ============================================================
var STAFF=[
  {id:'SA001',name:'Super Administrator',uname:'superadmin',pass:'Admin@1234',role:'Super Admin',dept:'Administration',mob:'+91-99999-00001',email:'admin@srcem.ac.in',created:'01 Jan 2025',active:true,specialization:'',photo:''},
  {id:'SA002',name:'Dr. R.K. Sharma',uname:'principal',pass:'Principal@123',role:'HOD',dept:'Computer Science',mob:'+91-98765-11111',email:'principal@srcem.ac.in',created:'01 Jan 2025',active:true,specialization:'Artificial Intelligence',photo:''},
  {id:'HOD01',name:'Dr. Priya Mehta',uname:'hod.mech',pass:'Hod@1234',role:'HOD',dept:'Mechanical Engineering',mob:'+91-98765-44444',email:'priya.mehta@srcem.ac.in',created:'01 Jan 2025',active:true,specialization:'Thermal Engineering',photo:''},
  {id:'FAC001',name:'Prof. Anil Kumar',uname:'anil.kumar',pass:'Faculty@123',role:'Faculty',dept:'Computer Science',mob:'+91-98765-22222',email:'anil.kumar@srcem.ac.in',created:'10 Mar 2025',active:true,specialization:'',photo:''},
  {id:'FAC002',name:'Prof. Sunita Rao',uname:'sunita.rao',pass:'Faculty@123',role:'Faculty',dept:'Mechanical Engineering',mob:'+91-98765-55555',email:'sunita.rao@srcem.ac.in',created:'10 Mar 2025',active:true,specialization:'',photo:''},
  {id:'ACC001',name:'Mr. Suresh Gupta',uname:'accounts',pass:'Accounts@123',role:'Admin',dept:'Finance',mob:'+91-98765-33333',email:'accounts@srcem.ac.in',created:'15 Feb 2025',active:true,specialization:'',photo:''}
];

var STUDENTS=[
  {roll:'SRCEM/2022/BT/0147',name:'Ravi Kumar',dept:'Computer Science',sem:'4',program:'B.Tech',mobile:'9876543210',email:'ravi@srcem.ac.in',status:'enrolled'},
  {roll:'SRCEM/2022/BT/0148',name:'Anjali Singh',dept:'Computer Science',sem:'4',program:'B.Tech',mobile:'9876543211',email:'anjali@srcem.ac.in',status:'enrolled'},
  {roll:'SRCEM/2022/ME/0101',name:'Rohit Yadav',dept:'Mechanical Engineering',sem:'4',program:'B.Tech',mobile:'9876543212',email:'rohit@srcem.ac.in',status:'enrolled'}
];

var SUBJECTS=[
  {code:'CS401',name:'Data Structures & Algorithms',dept:'Computer Science',sem:'4',faculty:'anil.kumar'},
  {code:'CS402',name:'Operating Systems',dept:'Computer Science',sem:'4',faculty:'anil.kumar'},
  {code:'CS403',name:'Database Management',dept:'Computer Science',sem:'4',faculty:'principal'},
  {code:'ME401',name:'Thermodynamics',dept:'Mechanical Engineering',sem:'4',faculty:'sunita.rao'},
  {code:'ME402',name:'Fluid Mechanics',dept:'Mechanical Engineering',sem:'4',faculty:'sunita.rao'}
];

var MARKS=[];
var ATTENDANCE=[];
var FEE_ENTRIES=[
  {roll:'SRCEM/2022/BT/0147',name:'Ravi Kumar',type:'Tuition Fee',sem:'Semester 3',amt:42500,mode:'Net Banking',date:'10 Oct 2024',by:'accounts'},
  {roll:'SRCEM/2022/BT/0148',name:'Anjali Singh',type:'Tuition Fee',sem:'Semester 3',amt:42500,mode:'UPI / QR',date:'11 Oct 2024',by:'accounts'}
];

var APPS=[
  {ref:'APP-2025-11201',name:'Priya Sharma',email:'priya.s@gmail.com',mobile:'9876500001',dob:'2006-03-12',program:'B.Tech',branch:'Computer Science',dept:'Computer Science',pct:'88.5',status:'pending',submitted:'08 Mar 2025',note:''},
  {ref:'APP-2025-11202',name:'Rahul Verma',email:'rahul.v@gmail.com',mobile:'9876500002',dob:'2005-11-20',program:'MBA',branch:'Finance',dept:'Finance',pct:'72.0',status:'pending',submitted:'07 Mar 2025',note:''},
  {ref:'APP-2025-11203',name:'Anita Gupta',email:'anita.g@gmail.com',mobile:'9876500003',dob:'2006-01-05',program:'B.Tech',branch:'Mechanical Engineering',dept:'Mechanical Engineering',pct:'81.2',status:'approved',submitted:'05 Mar 2025',note:'Welcome! Enrollment: SRCEM/2025/BT/0201'},
  {ref:'APP-2025-11204',name:'Suresh Yadav',email:'suresh.y@gmail.com',mobile:'9876500004',dob:'2005-07-18',program:'Diploma',branch:'Civil',dept:'Civil Engineering',pct:'61.0',status:'rejected',submitted:'04 Mar 2025',note:'Minimum 65% required for this program.'}
];

var SEM={
  "4":{label:"Semester 4 - 2024-25",sgpa:"7.82",subjects:[["Data Structures & Algorithms","100","85","A+","gp"],["Operating Systems","100","78","A","gp"],["Database Management","100","88","A+","gp"],["Computer Networks","100","72","B+","gp"],["Software Engineering","100","65","B","gp"],["Mathematics-IV","100","52","D","gf"]]},
  "3":{label:"Semester 3 - 2024-25",sgpa:"8.10",subjects:[["Data Communication","100","80","A","gp"],["Discrete Mathematics","100","75","B+","gp"],["OOP","100","90","A+","gp"],["Digital Electronics","100","70","B+","gp"],["Theory of Computation","100","68","B","gp"],["Engg Economics","100","74","B+","gp"]]},
  "2":{label:"Semester 2 - 2023-24",sgpa:"7.54",subjects:[["Mathematics-II","100","70","B+","gp"],["Physics","100","65","B","gp"],["Programming in C++","100","82","A","gp"],["Engg Drawing","100","74","B+","gp"],["Environmental Science","100","80","A","gp"],["Communication Skills","100","88","A+","gp"]]},
  "1":{label:"Semester 1 - 2023-24",sgpa:"7.20",subjects:[["Mathematics-I","100","68","B","gp"],["Engg Physics","100","62","B","gp"],["Engg Chemistry","100","72","B+","gp"],["Intro to CS","100","85","A+","gp"],["Workshop Practice","100","78","A","gp"],["English","100","80","A","gp"]]}
};

var curAdmin=null;
var currentAppFilter='all';
var editingStuIdx=-1;
var editingSubjIdx=-1;

