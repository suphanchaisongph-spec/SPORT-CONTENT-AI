const topic=document.querySelector('#topic');
const duration=document.querySelector('#duration');
const format=document.querySelector('#format');
const resultPanel=document.querySelector('#resultPanel');
const result=document.querySelector('#result');
let currentPlan='';
function makePlan(){
  const text=topic.value.trim();
  if(!text){alert('กรุณาใส่ข่าวหรือหัวข้อกีฬาก่อน');topic.focus();return;}
  const mins=duration.value, ratio=format.value;
  currentPlan=`SPORT CONTENT AI — แผนผลิตข่าว\nหัวข้อ: ${text}\nความยาว: ${mins} นาที\nอัตราส่วน: ${ratio}\n\nขั้นตอนที่ 1: ตรวจสอบชื่อทีม นักกีฬา วันที่ และผลการแข่งขันจากแหล่งข่าว\nขั้นตอนที่ 2: เขียนสคริปต์ตามความยาวที่เลือก พร้อมจังหวะเปิดเรื่องและปิดท้าย\nขั้นตอนที่ 3: วางแผนภาพประกอบแยกไฟล์ให้ตรงกับแต่ละช่วงของสคริปต์\nขั้นตอนที่ 4: เตรียมเสียงบรรยายและจับคู่ภาพตามเวลา\nขั้นตอนที่ 5: ตัดต่อ ตรวจสอบ แล้วส่งออกวิดีโอ ${ratio}\nขั้นตอนที่ 6: เตรียมพาดหัว คำอธิบาย และแฮชแท็ก`;
  result.innerHTML=`<div class="result-title">${escapeHtml(text.slice(0,100))}</div><div class="result-meta">ความยาว ${mins} นาที · ${ratio}<br>สร้างแผนงานแล้ว 6 ขั้นตอน<br><br>หมายเหตุ: นี่คือโครงร่างการผลิต ยังไม่ได้ตรวจสอบข้อเท็จจริงหรือเรียก AI ภายนอก</div>`;
  resultPanel.hidden=false;
  resultPanel.scrollIntoView({behavior:'smooth',block:'start'});
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
document.querySelector('#createBtn').addEventListener('click',makePlan);
document.querySelector('#copyBtn').addEventListener('click',async()=>{if(!currentPlan)return;try{await navigator.clipboard.writeText(currentPlan);alert('คัดลอกแผนงานแล้ว');}catch(e){alert('คัดลอกไม่สำเร็จ กรุณาใช้เมนูเลือกข้อความ');}});
document.querySelector('#saveBtn').addEventListener('click',()=>{if(!currentPlan)return;const arr=JSON.parse(localStorage.getItem('scai-projects')||'[]');arr.unshift({plan:currentPlan,at:new Date().toLocaleString('th-TH')});localStorage.setItem('scai-projects',JSON.stringify(arr.slice(0,20)));renderSaved();alert('บันทึกโปรเจกต์ในอุปกรณ์นี้แล้ว');});
function renderSaved(){const arr=JSON.parse(localStorage.getItem('scai-projects')||'[]');const el=document.querySelector('#saved');el.innerHTML=arr.length?arr.map((x,i)=>`<div class="saved-item"><strong>โปรเจกต์ ${i+1}</strong><br>${escapeHtml(x.plan.split('\n')[1]||'')}<br><small>${escapeHtml(x.at)}</small></div>`).join(''):'<div class="saved-empty">ยังไม่มีโปรเจกต์ที่บันทึก</div>';}
renderSaved();
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
