<script>
    // 1. الإعدادات والروابط الأساسية (البوصلة الرقمية) 📡
    const baseURL = "https://procoach-40d9f-default-rtdb.firebaseio.com/leagues/";
    
    // إعدادات Firebase (تأكد من مطابقتها لإعدادات مشروعك الأصلي)
    const firebaseConfig = {
        apiKey: "AIzaSyD5RA1lebNnSUB9vw1iYir5PYEPRxqKqtM",
        authDomain: "procoach-8029d.firebaseapp.com",
        databaseURL: "https://procoach-8029d-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "procoach-8029d",
        storageBucket: "procoach-8029d.firebasestorage.app",
        messagingSenderId: "225403732660",
        appId: "1:225403732660:web:df0638d89d3c86dc0b0de1"
    };

    // تشغيل محركات Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    const database = firebase.database();

    // متغيرات الحالة العامة
    let currentUser = null;
    let currentLeagueID = null;

    // 2. نظام إنشاء الدوري (الكلمة الحاسمة للمشرف) 🛡️
    async function createLeagueContract() {
        const leagueID = document.getElementById('leagueCode').value.toUpperCase();
        const targetTeams = document.getElementById('targetTeams').value; 

        if (!leagueID || !targetTeams || targetTeams < 2) {
            alert("يا قائد، المعلومات ناقصة! يرجى تحديد الكود وعدد الفرق.");
            return;
        }

        const leagueContract = {
            config: {
                totalTeams: targetTeams, // الكلمة الحاسمة التي لا تتغير
                status: "PRE-START", // حالة تسمح بالترقية قبل صافرة البداية
                isVIP: false,
                createdAt: new Date().toLocaleString(),
                lockCount: true 
            }
        };

        try {
            await fetch(`${baseURL}${leagueID}/contract.json`, { method: 'PUT', body: JSON.stringify(leagueContract) });
            alert(`✅ تم اعتماد الميدان! الكلمة الحاسمة هي ${targetTeams} فرق. بياناتك محمية للأبد.`);
        } catch (error) {
            console.error("خطأ في إنشاء العقد:", error);
        }
    }

    // 3. نظام "نخبة الأبطال" والترويج (التوليد) 💎
    async function upgradeToElite(leagueID) {
        const url = `${baseURL}${leagueID}/config.json`;
        const eliteConfig = {
            status: "ELITE_CHAMPIONS",
            isVIP: true,
            deadline: "REMOVED", // إزاحة القيود
            features: "FULL_ACCESS", // بناء جسور الشروط
            badge: "GOLDEN_SHIELD"
        };

        try {
            await fetch(url, { method: 'PATCH', body: JSON.stringify(eliteConfig) });
            alert("🚀 مبروك! انضممت لنخبة الأبطال. تم إزاحة كافة القيود وبناء جسور التميز.");
            location.reload();
        } catch (error) {
            alert("خطأ في الترقية، حاول مرة أخرى.");
        }
    }

    // 4. دالة عرض "موجز النخبة" (الترويج التلقائي) 📺
    async function showEliteBrief() {
        try {
            const response = await fetch(`${baseURL}.json`);
            const allLeagues = await response.json();
            const showcase = document.getElementById('elite-showcase');
            
            if (!showcase) return;

            let briefHTML = `<div class="card" style="border: 2px solid #d4af37; background: rgba(255, 215, 0, 0.05); border-radius:15px; padding:15px;">
                                <h3 style="color:#d4af37; text-align:center; font-size:18px;">💎 موجز أبطال النخبة</h3>`;

            let hasElite = false;
            if (allLeagues) {
                for (let id in allLeagues) {
                    if (allLeagues[id].config && allLeagues[id].config.status === "ELITE_CHAMPIONS") {
                        hasElite = true;
                        const stats = allLeagues[id].stats || { goals: 0, teams: 0 };
                        briefHTML += `
                            <div style="padding:12px; border-bottom:1px solid rgba(212,175,55,0.
