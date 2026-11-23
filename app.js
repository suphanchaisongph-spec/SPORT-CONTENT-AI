const topic=document.querySelector('#topic');
const duration=document.querySelector('#duration');
const format=document.querySelector('#format');
const resultPanel=document.querySelector('#resultPanel');
const result=document.querySelector('#result');
const scriptPanel=document.querySelector('#scriptPanel');
const scriptText=document.querySelector('#scriptText');
const scriptStatus=document.querySelector('#scriptStatus');
let currentPlan='';

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function makePlan(){
 const source=topic.value.trim();
 if(!source){alert('กรุณาใส่ข่าวหรือหัวข้อกีฬาก่อน');topic.focus();return;}
 const mins=duration.value,ratio=format.value;
 currentPlan=`SPORT CONTENT AI — แผนผลิตข่าว\nหัวข้อ: ${source}\nความยาว: ${mins} นาที\nอัตราส่วน: ${ratio}\nรูปแบบสคริปต์: ข่าวกีฬาเข้มข้น เร้าใจ\n\n1. ตรวจสอบข้อมูลต้นทาง\n2. เขียนสคริปต์ตามความยาว\n3. วางแผนภาพประกอบแยกไฟล์\n4. เตรียมเสียงบรรยายและจับคู่ภาพ\n5. ตัดต่อและตรวจสอบวิดีโอ ${ratio}\n6. เตรียมพาดหัว คำอธิบาย และแฮชแท็ก`;
 result.innerHTML=`<div class="result-title">${escapeHtml(source.slice(0,100))}</div><div class="result-meta">ความยาว ${mins} นาที · ${ratio}<br>รูปแบบข่าวกีฬาเข้มข้น เร้าใจ<br>สร้างแผนงานแล้ว 6 ขั้นตอน<br><br>หมายเหตุ: ยังไม่ได้ตรวจสอบข้อเท็จจริงจากแหล่งข่าวภายนอก</div>`;
 resultPanel.hidden=false;resultPanel.scrollIntoView({behavior:'smooth',block:'start'});
}

// Local draft helper. It structures the user's supplied facts; it is not an external AI model.
function buildScript(source,mins){
 const clean=source.replace(/\s+/g,' ').trim();
 const hook='แฟนกีฬาอย่าเพิ่งเลื่อนผ่าน! ข่าวนี้มีประเด็นสำคัญที่ต้องจับตา และเราจะพาไปดูรายละเอียดจากข้อมูลที่ได้รับ';
 const middle=clean;
 const context='ประเด็นนี้เป็นสิ่งที่แฟนกีฬาควรติดตามต่อ โดยรายละเอียดเพิ่มเติมควรยึดตามข้อมูลจากแหล่งข่าวต้นทาง';
 const close='เราจะติดตามความเคลื่อนไหวและนำข้อมูลที่ยืนยันได้มาอัปเดตให้ทราบกัน ฝากกดติดตาม กดไลก์ และกดแชร์ เพื่อไม่พลาดข่าวกีฬาที่น่าสนใจ';
 let parts=[hook,middle,context,close];
 if(mins==='2') parts.splice(2,0,'หากมีข้อมูลเพิ่มเติมจากข่าวต้นทาง สามารถใส่รายละเอียดช่วงสำคัญของเกม ผลแต่ละเซต หรือคำให้สัมภาษณ์ตรงนี้ได้ โดยไม่เพิ่มข้อมูลที่ยังไม่ยืนยัน');
 if(mins==='3') parts.splice(2,0,'ขยายเรื่องด้วยรายละเอียดที่มีหลักฐานจากต้นทาง เช่น ลำดับเหตุการณ์ ผลแต่ละช่วง หรือคำให้สัมภาษณ์ที่ตรวจสอบแล้ว','จากข้อมูลที่มี ควรแยกข้อเท็จจริงออกจากความเห็น เพื่อให้ผู้ชมเข้าใจสถานการณ์อย่างชัดเจน');
 return parts.join('\n\n');
}
function wordCount(s){return (s.match(/[ก-๙A-Za-z0-9]+/g)||[]).length;}
document.querySelector('#createBtn').addEventListener('click',makePlan);
document.querySelector('#scriptBtn').addEventListener('click',()=>{
 const source=topic.value.trim();if(!source){alert('กรุณาใส่เนื้อข่าวก่อนเขียนสคริปต์');topic.focus();return;}
 const draft=buildScript(source,duration.value);
 scriptText.value=draft;
 document.querySelector('#scriptWordCount').textContent=wordCount(draft)+' คำโดยประมาณ';
 scriptPanel.hidden=false;
 scriptStatus.textContent='สร้างร่างในเครื่องแล้ว · ยังไม่ได้เรียก AI API · กรุณาตรวจสอบข้อเท็จจริง';
 scriptPanel.scrollIntoView({behavior:'smooth',block:'start'});
});
document.querySelector('#copyScriptBtn').addEventListener('click',async()=>{
 const value=scriptText.value.trim();if(!value)return;
 try{await navigator.clipboard.writeText(value);alert('คัดลอกสคริปต์แล้ว');}
 catch(e){scriptText.focus();scriptText.select();alert('เลือกข้อความไว้แล้ว กรุณาคัดลอกด้วยเมนูโทรศัพท์');}
});
function saveProject(withScript){
 const arr=JSON.parse(localStorage.getItem('scai-projects')||'[]');
 arr.unshift({topic:topic.value.trim(),plan:currentPlan,script:withScript?scriptText.value.trim():'',at:new Date().toLocaleString('th-TH')});
 localStorage.setItem('scai-projects',JSON.stringify(arr.slice(0,20)));renderSaved();alert(withScript?'บันทึกสคริปต์ในอุปกรณ์นี้แล้ว':'บันทึกโปรเจกต์ในอุปกรณ์นี้แล้ว');
}
document.querySelector('#saveScriptBtn').addEventListener('click',()=>{if(!scriptText.value.trim())return;saveProject(true);});
document.querySelector('#copyBtn').addEventListener('click',async()=>{if(!currentPlan)return;try{await navigator.clipboard.writeText(currentPlan);alert('คัดลอกแผนงานแล้ว');}catch(e){alert('คัดลอกไม่สำเร็จ กรุณาใช้เมนูเลือกข้อความ');}});
document.querySelector('#saveBtn').addEventListener('click',()=>{if(!currentPlan)return;saveProject(false);});
function renderSaved(){
 const arr=JSON.parse(localStorage.getItem('scai-projects')||'[]'),el=document.querySelector('#saved');
 el.innerHTML=arr.length?arr.map((x,i)=>`<div class="saved-item"><strong>โปรเจกต์ ${i+1}</strong><br>${escapeHtml(x.topic||'ไม่มีชื่อหัวข้อ')}<br><small>${escapeHtml(x.at||'')}</small>${x.script?'<p class="saved-script">มีสคริปต์บันทึกแล้ว</p>':''}</div>`).join(''):'<div class="saved-empty">ยังไม่มีโปรเจกต์ที่บันทึก</div>';
}
renderSaved();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
