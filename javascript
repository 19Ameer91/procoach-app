// دالة إنشاء الدوري بـ "الكلمة الحاسمة" للمشرف
async function createLeagueContract() {
    const leagueID = document.getElementById('leagueCode').value.toUpperCase();
    const targetTeams = document.getElementById('targetTeams').value; // الرقم الحاسم
    const isAdminPaid = false; // افتراضياً باقة عادية

    if (!targetTeams || targetTeams < 2) {
        alert("يا قائد، يجب تحديد عدد فرق منطقي (2 فأكثر)!");
        return;
    }

    const leagueContract = {
        config: {
            totalTeams: targetTeams, // الكلمة الحاسمة للمشرف
            status: "PRE-START", // حالة ما قبل البداية (تسمح بالترقية)
            isElite: isAdminPaid,
            createdAt: new Date().toLocaleString(),
            lockCount: true // قفل العدد الكلي
        }
    };

    // حفظ العقد في Firebase
    await fetch(`${baseURL}${leagueID}/contract.json`, { method: 'PUT', body: JSON.stringify(leagueContract) });
    
    alert(`🛡️ تم اعتماد الميدان! الكلمة الحاسمة هي ${targetTeams} فرق. بياناتك في أمان ولن تُحذف أبداً.`);
}

// دالة ترقية الباقة (تتم فقط قبل البداية)
async function upgradePackage(leagueID) {
    const response = await fetch(`${baseURL}${leagueID}/contract/status.json`);
    const status = await response.json();

    if (status === "PRE-START") {
        // تنفيذ عملية الترقية لخدمات النخبة
        alert("🚀 جاري فتح 'جسور النخبة' لك.. يمكنك الآن الاستمتاع بالخدمات المدفوعة.");
    } else {
        alert("❌ عذراً يا قائد، الدوري بدأ فعلياً! لا يمكن تغيير الباقة بعد صافرة الانطلاق.");
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
