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
