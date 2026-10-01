const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use((req, res, next) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); next(); });

const departments = [
  { id:'internal-medicine', name:'الأمراض الباطنة', category:'باطنة', icon:'fa-solid fa-heart-pulse', short:'تشخيص وعلاج الأمراض الباطنية المزمنة والحادة.', description:'قسم الأمراض الباطنة يقدم رعاية شاملة للحالات المزمنة.', tags:['سكري','ضغط','كلى'], services:['عيادة السكري','عيادة الكلى','عيادة الجهاز الهضمي'], doctors:['1','2'], hours:'9:00 ص - 2:00 م', featured:true },
  { id:'general-surgery', name:'الجراحة العامة', category:'جراحة', icon:'fa-solid fa-syringe', short:'جراحات البطن والمناظير.', description:'قسم الجراحة العامة.', tags:['مناظير','بطن'], services:['جراحات المناظير','جراحات البطن'], doctors:['3'], hours:'9:00 ص - 2:00 م', featured:true },
  { id:'pediatrics', name:'طب الأطفال', category:'أطفال', icon:'fa-solid fa-baby', short:'رعاية صحية للأطفال.', description:'قسم الأطفال.', tags:['حديثي الولادة','تطعيمات'], services:['عيادة الأطفال','عيادة حديثي الولادة'], doctors:['4'], hours:'24 ساعة', featured:true },
  { id:'obgyn', name:'النساء والتوليد', category:'نساء وتوليد', icon:'fa-solid fa-person-pregnant', short:'رعاية الحوامل والولادة.', description:'قسم النساء والتوليد.', tags:['حمل','ولادة'], services:['متابعة الحمل','الولادة'], doctors:['5'], hours:'9:00 ص - 2:00 م', featured:true },
  { id:'cardiology', name:'القلب والأوعية الدموية', category:'قلب', icon:'fa-solid fa-heart', short:'تشخيص وعلاج أمراض القلب.', description:'قسم القلب.', tags:['إيكو','قسطرة'], services:['إيكو القلب','رسم القلب','القسطرة'], doctors:['6'], hours:'9:00 ص - 2:00 م', featured:true },
  { id:'neurology', name:'المخ والأعصاب', category:'أعصاب', icon:'fa-solid fa-brain', short:'تشخيص وعلاج أمراض الأعصاب.', description:'قسم المخ والأعصاب.', tags:['صرع','صداع'], services:['رسم المخ','عيادة الصداع'], doctors:['7'], hours:'9:00 ص - 2:00 م', featured:true },
  { id:'orthopedics', name:'العظام والكسور', category:'عظام', icon:'fa-solid fa-bone', short:'علاج الكسور والمفاصل.', description:'قسم العظام.', tags:['كسور','مفاصل'], services:['عيادة الكسور','عيادة المفاصل'], doctors:['8'], hours:'9:00 ص - 2:00 م', featured:true },
  { id:'ent', name:'الأنف والأذن والحنجرة', category:'أنف وأذن', icon:'fa-solid fa-ear-listen', short:'أمراض الأنف والأذن.', description:'قسم الأنف والأذن.', tags:['سمع','جيوب'], services:['عيادة السمع','عيادة الجيوب'], doctors:['9'], hours:'9:00 ص - 2:00 م' },
  { id:'ophthalmology', name:'طب وجراحة العيون', category:'عيون', icon:'fa-solid fa-eye', short:'أمراض العيون.', description:'قسم العيون.', tags:['مياه بيضاء','شبكية'], services:['فحص النظر','جراحة المياه البيضاء'], doctors:['10'], hours:'9:00 ص - 2:00 م' },
  { id:'dermatology', name:'الجلدية', category:'جلدية', icon:'fa-solid fa-hand-dots', short:'الأمراض الجلدية.', description:'قسم الجلدية.', tags:['حساسية','شعر'], services:['عيادة الجلدية','عيادة الحساسية'], doctors:[], hours:'9:00 ص - 2:00 م' },
  { id:'urology', name:'المسالك البولية', category:'مسالك', icon:'fa-solid fa-droplet', short:'أمراض الكلى والمسالك.', description:'قسم المسالك.', tags:['حصوات','كلى'], services:['تفتيت الحصوات','مناظير المسالك'], doctors:[], hours:'9:00 ص - 2:00 م' },
  { id:'oncology', name:'الأورام', category:'أورام', icon:'fa-solid fa-ribbon', short:'علاج الأورام.', description:'قسم الأورام.', tags:['علاج كيميائي'], services:['عيادة الأورام','العلاج الكيميائي'], doctors:[], hours:'بالتنسيق' },
  { id:'chest', name:'الأمراض الصدرية', category:'صدر', icon:'fa-solid fa-lungs', short:'أمراض الصدر.', description:'قسم الصدر.', tags:['ربو','حساسية'], services:['عيادة الربو','وظائف التنفس'], doctors:[], hours:'9:00 ص - 2:00 م' },
  { id:'rheumatology', name:'الروماتيزم والتأهيل', category:'روماتيزم', icon:'fa-solid fa-person-walking', short:'علاج الروماتيزم.', description:'قسم الروماتيزم.', tags:['روماتيزم','تأهيل'], services:['عيادة الروماتيزم','العلاج الطبيعي'], doctors:[], hours:'9:00 ص - 2:00 م' },
  { id:'gastroenterology', name:'الجهاز الهضمي والكبد', category:'باطنة', icon:'fa-solid fa-stomach', short:'أمراض الجهاز الهضمي.', description:'قسم الجهاز الهضمي.', tags:['مناظير','كبد'], services:['مناظير المعدة','عيادة الكبد'], doctors:[], hours:'9:00 ص - 2:00 م' }
];

const doctors = [
  { id:'1', isDemo:true, name:'د. أحمد محمد', departmentId:'internal-medicine', department:'الأمراض الباطنة', specialty:'استشاري باطنة وسكري', degree:'أستاذ مساعد', bio:'متخصص في الأمراض الباطنية.', experience:15, days:['السبت','الاثنين','الأربعاء'], hours:'9:00 ص - 1:00 م', fee:'بيانات تجريبية', gender:'male', tags:['السكري','ضغط الدم'] },
  { id:'2', isDemo:true, name:'د. منى إبراهيم', departmentId:'internal-medicine', department:'الأمراض الباطنة', specialty:'استشارية كلى', degree:'مدرس', bio:'متخصصة في أمراض الكلى.', experience:12, days:['الأحد','الثلاثاء','الخميس'], hours:'10:00 ص - 2:00 م', fee:'بيانات تجريبية', gender:'female', tags:['الكلى','ضغط الدم'] },
  { id:'3', isDemo:true, name:'د. محمود عبد الرحمن', departmentId:'general-surgery', department:'الجراحة العامة', specialty:'استشاري جراحة', degree:'أستاذ', bio:'خبرة في جراحات المناظير.', experience:20, days:['السبت','الاثنين','الأربعاء'], hours:'10:00 ص - 2:00 م', fee:'بيانات تجريبية', gender:'male', tags:['مناظير','بطن'] },
  { id:'4', isDemo:true, name:'د. هالة سيد', departmentId:'pediatrics', department:'طب الأطفال', specialty:'استشارية أطفال', degree:'أستاذ مساعد', bio:'متخصصة في حديثي الولادة.', experience:14, days:['يوميًا'], hours:'9:00 ص - 1:00 م', fee:'بيانات تجريبية', gender:'female', tags:['حديثي الولادة','تغذية'] },
  { id:'5', isDemo:true, name:'د. سارة فؤاد', departmentId:'obgyn', department:'النساء والتوليد', specialty:'استشارية نساء وتوليد', degree:'مدرس', bio:'خبرة في متابعة الحمل.', experience:11, days:['السبت','الأحد','الثلاثاء'], hours:'9:00 ص - 1:00 م', fee:'بيانات تجريبية', gender:'female', tags:['حمل','ولادة'] },
  { id:'6', isDemo:true, name:'د. خالد مصطفى', departmentId:'cardiology', department:'القلب والأوعية الدموية', specialty:'استشاري قلب', degree:'أستاذ', bio:'متخصص في القسطرة.', experience:18, days:['الأحد','الثلاثاء','الخميس'], hours:'10:00 ص - 2:00 م', fee:'بيانات تجريبية', gender:'male', tags:['قسطرة','إيكو'] },
  { id:'7', isDemo:true, name:'د. ياسمين علي', departmentId:'neurology', department:'المخ والأعصاب', specialty:'استشارية مخ وأعصاب', degree:'مدرس', bio:'خبرة في الصرع والصداع.', experience:10, days:['السبت','الاثنين','الأربعاء'], hours:'11:00 ص - 3:00 م', fee:'بيانات تجريبية', gender:'female', tags:['صرع','صداع'] },
  { id:'8', isDemo:true, name:'د. عمر حسن', departmentId:'orthopedics', department:'العظام والكسور', specialty:'استشاري عظام', degree:'أستاذ مساعد', bio:'متخصص في المفاصل.', experience:13, days:['الأحد','الثلاثاء','الخميس'], hours:'9:00 ص - 1:00 م', fee:'بيانات تجريبية', gender:'male', tags:['مفاصل','كسور'] },
  { id:'9', isDemo:true, name:'د. نهى رفعت', departmentId:'ent', department:'الأنف والأذن والحنجرة', specialty:'استشارية أنف وأذن', degree:'مدرس', bio:'خبرة في جراحات الجيوب.', experience:9, days:['السبت','الاثنين'], hours:'10:00 ص - 2:00 م', fee:'بيانات تجريبية', gender:'female', tags:['جيوب','سمع'] },
  { id:'10', isDemo:true, name:'د. طارق منير', departmentId:'ophthalmology', department:'طب وجراحة العيون', specialty:'استشاري عيون', degree:'أستاذ', bio:'متخصص في المياه البيضاء.', experience:17, days:['الأحد','الثلاثاء','الخميس'], hours:'9:00 ص - 2:00 م', fee:'بيانات تجريبية', gender:'male', tags:['مياه بيضاء','شبكية'] }
];

const services = [
  { id:'outpatient', name:'العيادات الخارجية', icon:'fa-solid fa-stethoscope', short:'عيادات تخصصية.', description:'عيادات متعددة التخصصات.', features:['حجز مسبق','تخصصات متعددة'] },
  { id:'emergency', name:'الطوارئ', icon:'fa-solid fa-truck-medical', short:'استقبال الطوارئ.', description:'قسم طوارئ مجهز.', features:['24/7','فريق مقيم'] },
  { id:'radiology', name:'الأشعة', icon:'fa-solid fa-x-ray', short:'تصوير طبي.', description:'وحدة أشعة.', features:['سينية','مقطعية','رنين'] },
  { id:'laboratory', name:'المعامل', icon:'fa-solid fa-flask-vial', short:'تحاليل طبية.', description:'مختبرات طبية.', features:['روتينية','متخصصة'] },
  { id:'icu', name:'الرعاية الحرجة', icon:'fa-solid fa-heart-pulse', short:'عناية مركزة.', description:'وحدات ICU.', features:['عناية مركزة','مراقبة'] },
  { id:'physio', name:'العلاج الطبيعي', icon:'fa-solid fa-person-walking', short:'تأهيل.', description:'علاج طبيعي.', features:['تأهيل حركي','آلام'] },
  { id:'pediatric-care', name:'خدمات الأطفال', icon:'fa-solid fa-baby', short:'رعاية الأطفال.', description:'وحدة أطفال.', features:['حضانات','تطعيمات'] },
  { id:'cardiac-services', name:'خدمات القلب', icon:'fa-solid fa-heart', short:'تشخيص القلب.', description:'وحدة قلب.', features:['قسطرة','إيكو'] }
];

const prices = [
  { category:'الكشف', name:'كشف عام', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'الكشف', name:'كشف تخصصي', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'المتابعة', name:'متابعة', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'التحاليل', name:'صورة دم كاملة', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'التحاليل', name:'سكر صائم', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'الأشعة', name:'أشعة سينية', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'الأشعة', name:'موجات صوتية', price:null, status:'pending', note:'يحدد لاحقًا' },
  { category:'الخدمات الطبية', name:'غيار جراحي', price:null, status:'pending', note:'يحدد لاحقًا' }
];

const news = [
  { id:'n1', category:'أخبار المستشفى', date:'2025-01-15', title:'تطوير وحدة العناية (Demo)', excerpt:'تحديث أجهزة العناية المركزة.', image:null, isDemo:true },
  { id:'n2', category:'مؤتمرات', date:'2025-01-08', title:'مؤتمر طبي أكاديمي (Demo)', excerpt:'مؤتمر علمي بحضور الأساتذة.', image:null, isDemo:true },
  { id:'n3', category:'خدمات جديدة', date:'2024-12-20', title:'افتتاح عيادة جديدة (Demo)', excerpt:'عيادة تخصصية جديدة.', image:null, isDemo:true },
  { id:'n4', category:'توعية صحية', date:'2024-12-05', title:'حملة توعية (Demo)', excerpt:'حملة توعية صحية.', image:null, isDemo:true }
];

const appointments = [];

app.get('/api/health', (req, res) => res.json({ ok:true, service:'qasr-backend' }));
app.get('/api/departments', (req, res) => res.json(departments));
app.get('/api/departments/:id', (req, res) => {
  const d = departments.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ message:'Not found' });
  res.json(d);
});
app.get('/api/doctors', (req, res) => {
  const { departmentId } = req.query;
  res.json(departmentId ? doctors.filter(d => d.departmentId === departmentId) : doctors);
});
app.get('/api/doctors/:id', (req, res) => {
  const d = doctors.find(x => x.id === req.params.id);
  if (!d) return res.status(404).json({ message:'Not found' });
  res.json(d);
});
app.get('/api/services', (req, res) => res.json(services));
app.get('/api/prices', (req, res) => res.json(prices));
app.get('/api/news', async (req, res) => {
  // لو الكاش قديم، جدد
  if (Date.now() - lastFetch > CACHE_TTL) {
    await scrapeNews();
  }
  if (cachedNews.length > 0) {
    return res.json(cachedNews);
  }
  // Fallback للبيانات التجريبية
  res.json(news);
});

app.post('/api/appointments', (req, res) => {
  const bookingId = 'QASR-' + Math.floor(10000 + Math.random() * 90000);
  const record = { bookingId, createdAt:new Date().toISOString(), ...req.body };
  appointments.push(record);
  console.log('[NEW APPOINTMENT]', bookingId);
  res.status(201).json({ ok:true, bookingId });
});

app.get('/api/appointments', (req, res) => res.json(appointments));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Qasr API running on http://localhost:' + PORT);
});