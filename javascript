async function startApp() {
    const league = document.getElementById('leagueCode').value.toUpperCase();
    const role = document.getElementById('role').value;
    const name = document.getElementById('userName').value;

    if (!league || !name) return alert("يا قائد، أدخل الكود واسمك!");

    // 🕵️ التحقق من وجود "مشرف" لهذه الغرفة في Firebase
    const checkURL = `https://procoach-40d9f-default-rtdb.firebaseio.com/leagues/${league}/admin.json`;
    const response = await fetch(checkURL);
    const adminData = await response.json();

    if (role === "ADMIN") {
        if (!adminData) {
            // 🆕 إذا لم يكن هناك مشرف، أنت تصبح المشرف الأول!
            const password = prompt("هذا الدوري جديد، ضع كلمة سر لإدارته:");
            await fetch(checkURL, { method: 'PUT', body: JSON.stringify({ name: name, pass: password }) });
            alert("تم تنصيبك مشرفاً عاماً لهذا الدوري 🛡️");
        } else {
            // 🔐 إذا كان هناك مشرف، يجب إدخال كلمة السر الصحيحة
            const password = prompt("أدخل كلمة سر المشرف للوصول للوحة التحكم:");
            if (password !== adminData.pass) {
                alert("❌ كلمة السر خطأ! سيتم دخولك كلاعب فقط.");
                return; // منع الدخول كمشرف
            }
        }
    }

    // 🏟️ الدخول للميدان بعد التحقق
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('tactics-screen').classList.remove('hidden');
    document.getElementById('main-title').innerText = `دوري: ${league}`;
    
    setupPlayers(); // تشغيل لوحة التكتيك
}
async function checkLeagueStatus(leagueID) {
    const url = `https://procoach-40d9f-default-rtdb.firebaseio.com/leagues/${leagueID}.json`;
    const response = await fetch(url);
    const leagueData = await response.json();

    // 1. التحقق من حصانة الـ VIP
    if (leagueData.isVIP) {
        console.log("هذا الدوري تحت حماية VIP 👑");
        return;
    }

    // 2. التحقق من عدد الفرق (المجلدات الفرعية تحت الدوري)
    const teamsCount = Object.keys(leagueData.teams || {}).length;

    if (teamsCount >= 12) {
        alert("مبروك يا قائد! اكتملت الفرق (12/12). تم تثبيت بيانات الدوري رسمياً بواسطة فريق جافا 🛡️");
        // تحديث الحالة في Firebase لتصبح "Fixed"
        await fetch(`${url}/status.json`, { method: 'PUT', body: JSON.stringify("APPROVED") });
    } else {
        const timeRemaining = calculateDeadline(leagueData.createdAt);
        if (timeRemaining <= 0) {
            alert("للأسف، انقضت المهلة ولم يكتمل العدد. جاري تنظيف السيرفر وحذف البيانات المؤقتة 🗑️");
            await fetch(url, { method: 'DELETE' }); // الحذف التلقائي
        }
    }
}
async function upgradeToElite(leagueID) {
    const url = `https://procoach-40d9f-default-rtdb.firebaseio.com/leagues/${leagueID}/config.json`;
    
    const eliteConfig = {
        status: "ELITE_CHAMPIONS", // الحالة الجديدة 🏆
        isVIP: true,
        deadline: "REMOVED", // إزاحة الشروط
        features: "FULL_ACCESS", // جسور الشروط الجديدة
        badge: "GOLDEN_SHIELD"
    };

    await fetch(url, { method: 'PATCH', body: JSON.stringify(eliteConfig) });
    
    alert("🚀 مبروك! هذا الدوري الآن ضمن 'نخبة الأبطال'. تم إزاحة كافة القيود وبناء جسور التميز.");
    location.reload(); 
}
// دالة لجلب "موجز النخبة" والترويج له
async function showEliteBrief() {
    const response = await fetch(`${baseURL}.json`);
    const allLeagues = await response.json();
    
    let briefHTML = `<div class="glass-card" style="border: 2px solid var(--gold);">
                        <h3 style="color:var(--gold); font-size:16px;">💎 موجز أبطال النخبة</h3>`;

    for (let id in allLeagues) {
        if (allLeagues[id].config && allLeagues[id].config.status === "ELITE_CHAMPIONS") {
            const stats = allLeagues[id].stats || { goals: 0, teams: 0 };
            briefHTML += `
                <div class="elite-item" style="padding:10px; border-bottom:1px solid #333;">
                    <span style="color:var(--gold);">🏆 ${id}</span>: 
                    سُجل ${stats.goals} أهداف | المشاركون: ${stats.teams} فرق
                </div>`;
        }
    }
    briefHTML += `</div>`;
    document.getElementById('elite-showcase').innerHTML = briefHTML;
}
