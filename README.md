<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pro Coach - إدارة فرق كرة القدم</title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-database-compat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <style>
        body {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            box-sizing: border-box;
            font-family: 'Cairo', 'Times New Roman', serif;
            background: #f8f9fa;
            direction: rtl;
            text-align: right;
        }

        .app-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            min-height: 600px;
        }

        .header {
            background: linear-gradient(135deg, #1e40af, #059669);
            color: white;
            padding: 20px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }

        .navigation {
            background: #1f2937;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }

        .nav-btn {
            background: none;
            border: none;
            color: white;
            padding: 15px 20px;
            cursor: pointer;
            transition: background 0.3s;
            font-family: 'Cairo', sans-serif;
            font-weight: 500;
        }

        .nav-btn:hover, .nav-btn.active {
            background: #374151;
        }

        .content {
            padding: 30px;
            min-height: 500px;
        }

        .page {
            display: none;
        }

        .page.active {
            display: block;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        .form-group input, .form-group select, .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-family: 'Cairo', sans-serif;
            font-size: 14px;
            direction: rtl;
            text-align: right;
        }

        .btn {
            background: #059669;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            transition: background 0.3s;
            margin: 5px;
        }

        .btn:hover {
            background: #047857;
        }

        .btn-secondary {
            background: #6b7280;
        }

        .btn-secondary:hover {
            background: #4b5563;
        }

        .btn-danger {
            background: #dc2626;
        }

        .btn-danger:hover {
            background: #b91c1c;
        }

        .card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            display: block;
        }

        .players-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .player-card {
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            background: #f9fafb;
        }

        .player-card.starter {
            border-color: #059669;
            background: #ecfdf5;
        }

        .player-card.substitute {
            border-color: #d97706;
            background: #fffbeb;
        }

        .tactical-canvas {
            border: 2px solid #374151;
            border-radius: 8px;
            background: #16a34a;
            cursor: crosshair;
            max-width: 100%;
        }

        .canvas-tools {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
        }

        .formation-selector {
            margin-bottom: 20px;
        }

        .message {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .message.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #059669;
        }

        .message.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #dc2626;
        }

        .login-container {
            max-width: 400px;
            margin: 50px auto;
            padding: 30px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .hidden {
            display: none;
        }

        .league-code {
            font-size: 1.5rem;
            font-weight: 700;
            color: #059669;
            background: #ecfdf5;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            border: 2px solid #059669;
        }

        .positions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }

        .position-btn {
            padding: 8px 12px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            text-align: center;
            font-size: 12px;
        }

        .position-btn.active {
            background: #059669;
            color: white;
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .navigation {
                flex-direction: column;
            }
            
            .nav-btn {
                padding: 12px;
                text-align: center;
            }
            
            .content {
                padding: 20px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .players-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div id="loginPage" class="login-container">
        <h1 style="text-align: left; color: rgb(5, 150, 105); margin-bottom: 30px;">🏆 Pro Coach</h1>
        
        <div id="loginForm">
            <h2 style="text-align: center; margin-bottom: 20px;">تسجيل الدخول</h2>
            <div class="form-group">
                <label>البريد الإلكتروني:</label>
                <input type="email" id="loginEmail" placeholder="أدخل بريدك الإلكتروني">
            </div>
            <div class="form-group">
                <label>كلمة المرور:</label>
                <input type="password" id="loginPassword" placeholder="أدخل كلمة المرور">
            </div>
            <button class="btn" onclick="login()" style="width: 100%; margin-bottom: 15px;">دخول</button>
            <button class="btn-secondary btn" onclick="showRegister()" style="width: 100%;">إنشاء حساب جديد</button>
        </div>

        <div id="registerForm" class="hidden">
            <h2 style="text-align: center; margin-bottom: 20px;">إنشاء حساب جديد</h2>
            <div class="form-group">
                <label>الاسم الكامل:</label>
                <input type="text" id="registerName" placeholder="أدخل اسمك الكامل">
            </div>
            <div class="form-group">
                <label>البريد الإلكتروني:</label>
                <input type="email" id="registerEmail" placeholder="أدخل بريدك الإلكتروني">
            </div>
            <div class="form-group">
                <label>كلمة المرور:</label>
                <input type="password" id="registerPassword" placeholder="أدخل كلمة المرور">
            </div>
            <button class="btn" onclick="register()" style="width: 100%; margin-bottom: 15px;">إنشاء حساب</button>
            <button class="btn-secondary btn" onclick="showLogin()" style="width: 100%;">العودة لتسجيل الدخول</button>
        </div>
    </div>

    <div id="mainApp" class="app-container hidden">
        <div class="header">
            <h1>🏆 Pro Coach</h1>
            <p>إدارة احترافية لفرق كرة القدم</p>
        </div>

        <div class="navigation">
            <button class="nav-btn active" onclick="showPage('dashboard')">🏠 الرئيسية</button>
            <button class="nav-btn" onclick="showPage('team')">👥 إدارة الفريق</button>
            <button class="nav-btn" onclick="showPage('leagues')">🏆 الدوريات</button>
            <button class="nav-btn" onclick="showPage('loans')">🔄 سوق الإعارات</button>
            <button class="nav-btn" onclick="showPage('tactical')">📐 الملعب التكتيكي</button>
            <button class="nav-btn" onclick="showPage('settings')">⚙️ الإعدادات</button>
            <button class="nav-btn" onclick="logout()">🚪 خروج</button>
        </div>

        <div class="content">
            <div id="dashboard" class="page active">
                <h2>📊 لوحة التحكم</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-number" id="playersCount">0</span>
                        <span>إجمالي اللاعبين</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" id="startersCount">0</span>
                        <span>اللاعبون الأساسيون</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" id="substitutesCount">0</span>
                        <span>اللاعبون الاحتياط</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number" id="loansCount">0</span>
                        <span>طلبات الإعارة</span>
                    </div>
                </div>
                
                <div class="card">
                    <h3>معلومات الفريق</h3>
                    <p><strong>اسم الفريق:</strong> <span id="teamNameDisplay">غير محدد</span></p>
                    <p><strong>الدوري:</strong> <span id="leagueNameDisplay">غير منضم لدوري</span></p>
                    <p><strong>كود الدوري:</strong> <span id="leagueCodeDisplay">-</span></p>
                </div>
            </div>

            <div id="team" class="page">
                <h2>👥 إدارة الفريق</h2>
                
                <div id="teamSetup" class="card">
                    <h3>إعداد الفريق</h3>
                    <div class="form-group">
                        <label>اسم الفريق:</label>
                        <input type="text" id="teamName" placeholder="أدخل اسم فريقك">
                    </div>
                    <button class="btn" onclick="createTeam()">إنشاء فريق</button>
                </div>

                <div id="playerForm" class="card hidden">
                    <h3>إضافة لاعب جديد</h3>
                    <div class="form-group">
                        <label>رقم الهوية:</label>
                        <input type="text" id="playerId" placeholder="رقم الهوية">
                    </div>
                    <div class="form-group">
                        <label>الاسم الثنائي:</label>
                        <input type="text" id="playerName" placeholder="الاسم الأول والثاني">
                    </div>
                    <div class="form-group">
                        <label>المركز:</label>
                        <select id="playerPosition">
                            <option value="">اختر المركز</option>
                            <option value="حارس مرمى">حارس مرمى</option>
                            <option value="ظهير أيمن">ظهير أيمن</option>
                            <option value="ظهير أيسر">ظهير أيسر</option>
                            <option value="قلب دفاع">قلب دفاع</option>
                            <option value="وسط دفاعي">وسط دفاعي</option>
                            <option value="وسط">وسط</option>
                            <option value="وسط هجومي">وسط هجومي</option>
                            <option value="جناح أيمن">جناح أيمن</option>
                            <option value="جناح أيسر">جناح أيسر</option>
                            <option value="مهاجم">مهاجم</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>رقم التيشيرت:</label>
                        <input type="number" id="shirtNumber" placeholder="رقم التيشيرت" min="1" max="99">
                    </div>
                    <div class="form-group">
                        <label>نوع اللاعب:</label>
                        <select id="playerType">
                            <option value="starter">أساسي</option>
                            <option value="substitute">احتياط</option>
                        </select>
                    </div>
                    <button class="btn" onclick="addPlayer()">إضافة لاعب</button>
                    <button class="btn-secondary btn" onclick="cancelPlayerEdit()">إلغاء</button>
                </div>

                <div id="playersSection" class="hidden">
                    <h3>قائمة اللاعبين</h3>
                    <div class="form-group">
                        <input type="text" id="searchPlayers" placeholder="🔍 البحث عن لاعب..." onkeyup="searchPlayers()">
                    </div>
                    <div class="form-group">
                        <select id="positionFilter" onchange="filterPlayers()">
                            <option value="">جميع المراكز</option>
                            <option value="حارس مرمى">حارس مرمى</option>
                            <option value="ظهير أيمن">ظهير أيمن</option>
                            <option value="ظهير أيسر">ظهير أيسر</option>
                            <option value="قلب دفاع">قلب دفاع</option>
                            <option value="وسط دفاعي">وسط دفاعي</option>
                            <option value="وسط">وسط</option>
                            <option value="وسط هجومي">وسط هجومي</option>
                            <option value="جناح أيمن">جناح أيمن</option>
                            <option value="جناح أيسر">جناح أيسر</option>
                            <option value="مهاجم">مهاجم</option>
                        </select>
                    </div>
                    <div id="playersList" class="players-grid"></div>
                </div>
            </div>

            <div id="leagues" class="page">
                <h2>🏆 إدارة الدوريات</h2>
                
                <div class="card">
                    <h3>إنشاء دوري جديد</h3>
                    <div class="form-group">
                        <label>اسم الدوري:</label>
                        <input type="text" id="leagueName" placeholder="أدخل اسم الدوري">
                    </div>
                    <button class="btn" onclick="createLeague()">إنشاء دوري</button>
                </div>

                <div class="card">
                    <h3>الانضمام لدوري موجود</h3>
                    <div class="form-group">
                        <label>كود الدوري:</label>
                        <input type="text" id="joinLeagueCode" placeholder="أدخل كود الدوري (6 أحرف)">
                    </div>
                    <button class="btn" onclick="joinLeague()">انضمام للدوري</button>
                </div>

                <div id="currentLeague" class="card hidden">
                    <h3>الدوري الحالي</h3>
                    <p><strong>اسم الدوري:</strong> <span id="currentLeagueName"></span></p>
                    <div class="league-code" id="currentLeagueCode"></div>
                    <h4>الفرق المشاركة:</h4>
                    <div id="leagueTeams"></div>
                    <button class="btn-danger btn" onclick="leaveLeague()">مغادرة الدوري</button>
                </div>
            </div>

            <div id="loans" class="page">
                <h2>🔄 سوق الإعارات</h2>
                
                <div class="card">
                    <h3>لاعبوك المتاحون للإعارة</h3>
                    <div id="availableForLoan"></div>
                </div>

                <div class="card">
                    <h3>لاعبون متاحون من فرق أخرى</h3>
                    <div id="othersAvailableForLoan"></div>
                </div>

                <div class="card">
                    <h3>طلبات الإعارة الواردة</h3>
                    <div id="incomingLoanRequests"></div>
                </div>

                <div class="card">
                    <h3>طلبات الإعارة المرسلة</h3>
                    <div id="outgoingLoanRequests"></div>
                </div>
            </div>

            <div id="tactical" class="page">
                <h2>📐 الملعب التكتيكي</h2>
                
                <div class="formation-selector">
                    <label>اختر التشكيلة:</label>
                    <select id="formationSelect" onchange="loadFormation()">
                        <option value="">تشكيلة مخصصة</option>
                        <option value="4-3-3">4-3-3</option>
                        <option value="4-4-2">4-4-2</option>
                        <option value="3-5-2">3-5-2</option>
                        <option value="4-2-3-1">4-2-3-1</option>
                        <option value="3-4-3">3-4-3</option>
                    </select>
                </div>

                <div class="canvas-tools">
                    <button class="btn" onclick="setDrawingMode('select')">👆 تحديد</button>
                    <button class="btn" onclick="setDrawingMode('line')">📏 خط</button>
                    <button class="btn" onclick="setDrawingMode('arrow')">➡️ سهم</button>
                    <button class="btn" onclick="setDrawingMode('circle')">⭕ دائرة</button>
                    <button class="btn" onclick="setDrawingMode('rectangle')">⬜ مستطيل</button>
                    <button class="btn-secondary btn" onclick="clearCanvas()">🗑️ مسح</button>
                    <button class="btn" onclick="saveFormation()">💾 حفظ</button>
                    <button class="btn" onclick="exportCanvas()">📤 تصدير</button>
                </div>

                <div style="text-align: center;">
                    <canvas id="tacticalCanvas" class="tactical-canvas" width="800" height="600"></canvas>
                </div>

                <div class="positions-grid" id="playerPositions"></div>
            </div>

            <div id="settings" class="page">
                <h2>⚙️ الإعدادات</h2>
                
                <div class="card">
                    <h3>معلومات الحساب</h3>
                    <p><strong>الاسم:</strong> <span id="userNameDisplay"></span></p>
                    <p><strong>البريد الإلكتروني:</strong> <span id="userEmailDisplay"></span></p>
                    <p><strong>الصلاحية:</strong> <span id="userRoleDisplay"></span></p>
                </div>

                <div class="card">
                    <h3>تغيير كلمة المرور</h3>
                    <div class="form-group">
                        <label>كلمة المرور الجديدة:</label>
                        <input type="password" id="newPassword" placeholder="أدخل كلمة المرور الجديدة">
                    </div>
                    <button class="btn" onclick="changePassword()">تغيير كلمة المرور</button>
                </div>

                <div class="card">
                    <h3>إعدادات الإشعارات</h3>
                    <label>
                        <input type="checkbox" id="emailNotifications" checked>
                        إشعارات البريد الإلكتروني
                    </label>
                </div>
            </div>
        </div>
    </div>

    <div id="messageContainer"></div>

    <script>
        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyD5RA1lebNnSUB9vw1iYir5PYEPRxqKqtM",
            authDomain: "procoach-8029d.firebaseapp.com",
            databaseURL: "https://procoach-8029d-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "procoach-8029d",
            storageBucket: "procoach-8029d.firebasestorage.app",
            messagingSenderId: "225403732660",
            appId: "1:225403732660:web:df0638d89d3c86dc0b0de1"
        };

        // EmailJS Configuration
        const emailJSConfig = {
            publicKey: 'RRyD0MlzLbVcTaPv',
            serviceId: 'service_fmdf5kl',
            templateId: 'template_f83ay3c'
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database();

        // Initialize EmailJS
        emailjs.init(emailJSConfig.publicKey);

        // Global variables
        let currentUser = null;
        let currentTeam = null;
        let currentLeague = null;
        let players = [];
        let editingPlayerId = null;
        let canvas = null;
        let ctx = null;
        let drawingMode = 'select';
        let isDrawing = false;
        let startX, startY;

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            auth.onAuthStateChanged(function(user) {
                if (user) {
                    currentUser = user;
                    showMainApp();
                    loadUserData();
                } else {
                    showLoginPage();
                }
            });

            initializeCanvas();
        });

        // Authentication functions
        function showLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
        }

        function showRegister() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }

        function login() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showMessage('يرجى ملء جميع الحقول', 'error');
                return;
            }

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    showMessage('تم تسجيل الدخول بنجاح', 'success');
                })
                .catch((error) => {
                    showMessage('خطأ في تسجيل الدخول: ' + error.message, 'error');
                });
        }

        function register() {
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            if (!name || !email || !password) {
                showMessage('يرجى ملء جميع الحقول', 'error');
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    return database.ref('users/' + userCredential.user.uid).set({
                        name: name,
                        email: email,
                        role: 'admin',
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    });
                })
                .then(() => {
                    showMessage('تم إنشاء الحساب بنجاح', 'success');
                })
                .catch((error) => {
                    showMessage('خطأ في إنشاء الحساب: ' + error.message, 'error');
                });
        }

        function logout() {
            auth.signOut().then(() => {
                showMessage('تم تسجيل الخروج بنجاح', 'success');
            });
        }

        // UI functions
        function showLoginPage() {
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('mainApp').classList.add('hidden');
        }

        function showMainApp() {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
        }

        function showPage(pageId) {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));

            // Remove active class from all nav buttons
            const navBtns = document.querySelectorAll('.nav-btn');
            navBtns.forEach(btn => btn.classList.remove('active'));

            // Show selected page
            document.getElementById(pageId).classList.add('active');

            // Add active class to clicked nav button
            event.target.classList.add('active');

            // Load page-specific data
            switch(pageId) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'team':
                    loadTeamPage();
                    break;
                case 'leagues':
                    loadLeaguesPage();
                    break;
                case 'loans':
                    loadLoansPage();
                    break;
                case 'tactical':
                    loadTacticalPage();
                    break;
                case 'settings':
                    loadSettingsPage();
                    break;
            }
        }

        function showMessage(message, type = 'success') {
            const messageContainer = document.getElementById('messageContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = message;
            messageDiv.style.position = 'fixed';
            messageDiv.style.top = '20px';
            messageDiv.style.right = '20px';
            messageDiv.style.zIndex = '9999';
            messageDiv.style.maxWidth = '300px';

            messageContainer.appendChild(messageDiv);

            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }

        // Data loading functions
        function loadUserData() {
            database.ref('users/' + currentUser.uid).once('value', (snapshot) => {
                const userData = snapshot.val();
                if (userData) {
                    document.getElementById('userNameDisplay').textContent = userData.name;
                    document.getElementById('userEmailDisplay').textContent = userData.email;
                    document.getElementById('userRoleDisplay').textContent = userData.role === 'admin' ? 'مدير' : 'مدرب';

                    if (userData.teamId) {
                        loadTeamData(userData.teamId);
                    }
                }
            });
        }

        function loadTeamData(teamId) {
            database.ref('teams/' + teamId).once('value', (snapshot) => {
                const teamData = snapshot.val();
                if (teamData) {
                    currentTeam = { id: teamId, ...teamData };
                    document.getElementById('teamNameDisplay').textContent = teamData.name;
                    
                    if (teamData.leagueId) {
                        loadLeagueData(teamData.leagueId);
                    }

                    loadPlayers(teamId);
                    updateTeamSetupVisibility();
                }
            });
        }

        function loadLeagueData(leagueId) {
            database.ref('leagues/' + leagueId).once('value', (snapshot) => {
                const leagueData = snapshot.val();
                if (leagueData) {
                    currentLeague = { id: leagueId, ...leagueData };
                    document.getElementById('leagueNameDisplay').textContent = leagueData.name;
                    document.getElementById('leagueCodeDisplay').textContent = leagueData.code;
                }
            });
        }

        function loadPlayers(teamId) {
            database.ref('teams/' + teamId + '/players').on('value', (snapshot) => {
                players = [];
                const playersData = snapshot.val();
                if (playersData) {
                    Object.keys(playersData).forEach(playerId => {
                        players.push({ id: playerId, ...playersData[playerId] });
                    });
                }
                updatePlayersDisplay();
                updateDashboardStats();
            });
        }

        // Team management functions
        function createTeam() {
            const teamName = document.getElementById('teamName').value.trim();
            if (!teamName) {
                showMessage('يرجى إدخال اسم الفريق', 'error');
                return;
            }

            const teamId = database.ref('teams').push().key;
            const teamData = {
                name: teamName,
                ownerId: currentUser.uid,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            const updates = {};
            updates['teams/' + teamId] = teamData;
            updates['users/' + currentUser.uid + '/teamId'] = teamId;

            database.ref().update(updates)
                .then(() => {
                    showMessage('تم إنشاء الفريق بنجاح', 'success');
                    loadTeamData(teamId);
                })
                .catch((error) => {
                    showMessage('خطأ في إنشاء الفريق: ' + error.message, 'error');
                });
        }

        function addPlayer() {
            if (!currentTeam) {
                showMessage('يرجى إنشاء فريق أولاً', 'error');
                return;
            }

            const idNumber = document.getElementById('playerId').value.trim();
            const name = document.getElementById('playerName').value.trim();
            const position = document.getElementById('playerPosition').value;
            const shirtNumber = parseInt(document.getElementById('shirtNumber').value);
            const type = document.getElementById('playerType').value;

            if (!idNumber || !name || !position || !shirtNumber) {
                showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            // Check if shirt number is already taken
            const existingPlayer = players.find(p => p.shirtNumber === shirtNumber && p.id !== editingPlayerId);
            if (existingPlayer) {
                showMessage('رقم التيشيرت مُستخدم بالفعل', 'error');
                return;
            }

            const playerData = {
                idNumber: idNumber,
                name: name,
                position: position,
                shirtNumber: shirtNumber,
                type: type,
                availableForLoan: false,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            let playerId;
            if (editingPlayerId) {
                playerId = editingPlayerId;
            } else {
                playerId = database.ref('teams/' + currentTeam.id + '/players').push().key;
            }

            database.ref('teams/' + currentTeam.id + '/players/' + playerId).set(playerData)
                .then(() => {
                    showMessage(editingPlayerId ? 'تم تحديث اللاعب بنجاح' : 'تم إضافة اللاعب بنجاح', 'success');
                    clearPlayerForm();
                })
                .catch((error) => {
                    showMessage('خطأ في حفظ اللاعب: ' + error.message, 'error');
                });
        }

        function editPlayer(playerId) {
            const player = players.find(p => p.id === playerId);
            if (!player) return;

            editingPlayerId = playerId;
            document.getElementById('playerId').value = player.idNumber;
            document.getElementById('playerName').value = player.name;
            document.getElementById('playerPosition').value = player.position;
            document.getElementById('shirtNumber').value = player.shirtNumber;
            document.getElementById('playerType').value = player.type;

            document.getElementById('playerForm').scrollIntoView({ behavior: 'smooth' });
        }

        function deletePlayer(playerId) {
            if (!confirm('هل أنت متأكد من حذف هذا اللاعب؟')) return;

            database.ref('teams/' + currentTeam.id + '/players/' + playerId).remove()
                .then(() => {
                    showMessage('تم حذف اللاعب بنجاح', 'success');
                })
                .catch((error) => {
                    showMessage('خطأ في حذف اللاعب: ' + error.message, 'error');
                });
        }

        function togglePlayerLoan(playerId) {
            const player = players.find(p => p.id === playerId);
            if (!player) return;

            const newStatus = !player.availableForLoan;
            database.ref('teams/' + currentTeam.id + '/players/' + playerId + '/availableForLoan').set(newStatus)
                .then(() => {
                    showMessage(newStatus ? 'تم عرض اللاعب للإعارة' : 'تم إلغاء عرض اللاعب للإعارة', 'success');
                })
                .catch((error) => {
                    showMessage('خطأ في تحديث حالة الإعارة: ' + error.message, 'error');
                });
        }

        function clearPlayerForm() {
            document.getElementById('playerId').value = '';
            document.getElementById('playerName').value = '';
            document.getElementById('playerPosition').value = '';
            document.getElementById('shirtNumber').value = '';
            document.getElementById('playerType').value = 'starter';
            editingPlayerId = null;
        }

        function cancelPlayerEdit() {
            clearPlayerForm();
        }

        // League management functions
        function createLeague() {
            const leagueName = document.getElementById('leagueName').value.trim();
            if (!leagueName) {
                showMessage('يرجى إدخال اسم الدوري', 'error');
                return;
            }

            if (!currentTeam) {
                showMessage('يرجى إنشاء فريق أولاً', 'error');
                return;
            }

            const leagueCode = generateLeagueCode();
            const leagueId = database.ref('leagues').push().key;
            const leagueData = {
                name: leagueName,
                code: leagueCode,
                creatorId: currentUser.uid,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                teams: {
                    [currentTeam.id]: true
                }
            };

            const updates = {};
            updates['leagues/' + leagueId] = leagueData;
            updates['teams/' + currentTeam.id + '/leagueId'] = leagueId;

            database.ref().update(updates)
                .then(() => {
                    showMessage('تم إنشاء الدوري بنجاح', 'success');
                    document.getElementById('leagueName').value = '';
                    loadLeagueData(leagueId);
                    loadLeaguesPage();
                })
                .catch((error) => {
                    showMessage('خطأ في إنشاء الدوري: ' + error.message, 'error');
                });
        }

        function joinLeague() {
            const leagueCode = document.getElementById('joinLeagueCode').value.trim().toUpperCase();
            if (!leagueCode || leagueCode.length !== 6) {
                showMessage('يرجى إدخال كود دوري صحيح (6 أحرف)', 'error');
                return;
            }

            if (!currentTeam) {
                showMessage('يرجى إنشاء فريق أولاً', 'error');
                return;
            }

            // Find league by code
            database.ref('leagues').orderByChild('code').equalTo(leagueCode).once('value', (snapshot) => {
                const leagues = snapshot.val();
                if (!leagues) {
                    showMessage('لم يتم العثور على دوري بهذا الكود', 'error');
                    return;
                }

                const leagueId = Object.keys(leagues)[0];
                const leagueData = leagues[leagueId];

                if (leagueData.teams && leagueData.teams[currentTeam.id]) {
                    showMessage('أنت منضم بالفعل لهذا الدوري', 'error');
                    return;
                }

                const updates = {};
                updates['leagues/' + leagueId + '/teams/' + currentTeam.id] = true;
                updates['teams/' + currentTeam.id + '/leagueId'] = leagueId;

                database.ref().update(updates)
                    .then(() => {
                        showMessage('تم الانضمام للدوري بنجاح', 'success');
                        document.getElementById('joinLeagueCode').value = '';
                        loadLeagueData(leagueId);
                        loadLeaguesPage();
                    })
                    .catch((error) => {
                        showMessage('خطأ في الانضمام للدوري: ' + error.message, 'error');
                    });
            });
        }

        function leaveLeague() {
            if (!currentLeague || !currentTeam) return;

            if (!confirm('هل أنت متأكد من مغادرة الدوري؟')) return;

            const updates = {};
            updates['leagues/' + currentLeague.id + '/teams/' + currentTeam.id] = null;
            updates['teams/' + currentTeam.id + '/leagueId'] = null;

            database.ref().update(updates)
                .then(() => {
                    showMessage('تم مغادرة الدوري بنجاح', 'success');
                    currentLeague = null;
                    document.getElementById('leagueNameDisplay').textContent = 'غير منضم لدوري';
                    document.getElementById('leagueCodeDisplay').textContent = '-';
                    loadLeaguesPage();
                })
                .catch((error) => {
                    showMessage('خطأ في مغادرة الدوري: ' + error.message, 'error');
                });
        }

        function generateLeagueCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        // Loan management functions
        function requestLoan(playerId, fromTeamId) {
            if (!currentTeam || !currentLeague) {
                showMessage('يجب أن تكون في دوري لطلب الإعارة', 'error');
                return;
            }

            const requestId = database.ref('loanRequests').push().key;
            const requestData = {
                playerId: playerId,
                fromTeamId: fromTeamId,
                toTeamId: currentTeam.id,
                leagueId: currentLeague.id,
                status: 'pending',
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };

            database.ref('loanRequests/' + requestId).set(requestData)
                .then(() => {
                    showMessage('تم إرسال طلب الإعارة بنجاح', 'success');
                    // Send email notification
                    sendLoanNotification(requestId, requestData);
                })
                .catch((error) => {
                    showMessage('خطأ في إرسال طلب الإعارة: ' + error.message, 'error');
                });
        }

        function respondToLoanRequest(requestId, response) {
            database.ref('loanRequests/' + requestId + '/status').set(response)
                .then(() => {
                    showMessage(response === 'accepted' ? 'تم قبول طلب الإعارة' : 'تم رفض طلب الإعارة', 'success');
                    loadLoansPage();
                })
                .catch((error) => {
                    showMessage('خطأ في الاستجابة لطلب الإعارة: ' + error.message, 'error');
                });
        }

        function sendLoanNotification(requestId, requestData) {
            // Get player and team names for the email
            Promise.all([
                database.ref('teams/' + requestData.fromTeamId + '/players/' + requestData.playerId).once('value'),
                database.ref('teams/' + requestData.toTeamId).once('value'),
                database.ref('teams/' + requestData.fromTeamId).once('value')
            ]).then(([playerSnapshot, toTeamSnapshot, fromTeamSnapshot]) => {
                const player = playerSnapshot.val();
                const toTeam = toTeamSnapshot.val();
                const fromTeam = fromTeamSnapshot.val();

                const emailParams = {
                    to_email: currentUser.email,
                    player_name: player ? player.name : 'Unknown',
                    requesting_team: toTeam ? toTeam.name : 'Unknown',
                    your_team: fromTeam ? fromTeam.name : 'Unknown',
                    request_id: requestId
                };

                emailjs.send(emailJSConfig.serviceId, emailJSConfig.templateId, emailParams)
                    .then(() => {
                        console.log('Loan notification email sent successfully');
                    })
                    .catch((error) => {
                        console.error('Failed to send loan notification email:', error);
                    });
            });
        }

        // Tactical canvas functions
        function initializeCanvas() {
            canvas = document.getElementById('tacticalCanvas');
            if (canvas) {
                ctx = canvas.getContext('2d');
                drawField();
                setupCanvasEvents();
            }
        }

        function drawField() {
            if (!ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw field
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Field lines
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;

            // Outer boundary
            ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

            // Center line
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 50);
            ctx.lineTo(canvas.width / 2, canvas.height - 50);
            ctx.stroke();

            // Center circle
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, 2 * Math.PI);
            ctx.stroke();

            // Goal areas
            ctx.strokeRect(50, canvas.height / 2 - 80, 100, 160);
            ctx.strokeRect(canvas.width - 150, canvas.height / 2 - 80, 100, 160);

            // Penalty areas
            ctx.strokeRect(50, canvas.height / 2 - 120, 150, 240);
            ctx.strokeRect(canvas.width - 200, canvas.height / 2 - 120, 150, 240);
        }

        function setupCanvasEvents() {
            if (!canvas) return;

            // Support both mouse and touch events
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing);
            canvas.addEventListener('click', handleCanvasClick);

            // Touch events for mobile
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true
                });
                canvas.dispatchEvent(mouseEvent);
            });

            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = canvas.getBoundingClientRect();
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true
                });
                canvas.dispatchEvent(mouseEvent);
            });

            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                const rect = canvas.getBoundingClientRect();
                const touch = e.changedTouches[0];
                const mouseEvent = new MouseEvent('mouseup', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true
                });
                canvas.dispatchEvent(mouseEvent);
            });
        }

        function startDrawing(e) {
            if (drawingMode === 'select') return;

            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            startX = (e.clientX - rect.left) * scaleX;
            startY = (e.clientY - rect.top) * scaleY;
        }

        let savedDrawings = [];

        function draw(e) {
            if (!isDrawing || drawingMode === 'select') return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const currentX = (e.clientX - rect.left) * scaleX;
            const currentY = (e.clientY - rect.top) * scaleY;

            // Redraw everything
            drawField();
            
            // Redraw saved drawings
            savedDrawings.forEach(drawing => {
                ctx.strokeStyle = drawing.color || 'yellow';
                ctx.lineWidth = drawing.lineWidth || 3;
                
                switch (drawing.type) {
                    case 'line':
                        ctx.beginPath();
                        ctx.moveTo(drawing.startX, drawing.startY);
                        ctx.lineTo(drawing.endX, drawing.endY);
                        ctx.stroke();
                        break;
                    case 'arrow':
                        drawArrow(drawing.startX, drawing.startY, drawing.endX, drawing.endY);
                        break;
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(drawing.startX, drawing.startY, drawing.radius, 0, 2 * Math.PI);
                        ctx.stroke();
                        break;
                    case 'rectangle':
                        ctx.strokeRect(drawing.startX, drawing.startY, drawing.width, drawing.height);
                        break;
                }
            });

            // Draw current shape
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 3;

            switch (drawingMode) {
                case 'line':
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(currentX, currentY);
                    ctx.stroke();
                    break;
                case 'arrow':
                    drawArrow(startX, startY, currentX, currentY);
                    break;
                case 'circle':
                    const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
                    ctx.beginPath();
                    ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                    break;
                case 'rectangle':
                    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
                    break;
            }
        }

        function stopDrawing(e) {
            if (!isDrawing || drawingMode === 'select') {
                isDrawing = false;
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const endX = (e.clientX - rect.left) * scaleX;
            const endY = (e.clientY - rect.top) * scaleY;

            // Save the drawing
            const drawing = {
                type: drawingMode,
                startX: startX,
                startY: startY,
                endX: endX,
                endY: endY,
                color: 'yellow',
                lineWidth: 3
            };

            if (drawingMode === 'circle') {
                drawing.radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            } else if (drawingMode === 'rectangle') {
                drawing.width = endX - startX;
                drawing.height = endY - startY;
            }

            savedDrawings.push(drawing);
            isDrawing = false;
        }

        function handleCanvasClick(e) {
            if (drawingMode !== 'select') return;

            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // Add player position logic here
        }

        function drawArrow(fromX, fromY, toX, toY) {
            const headLength = 15;
            const angle = Math.atan2(toY - fromY, toX - fromX);

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(toX, toY);
            ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }

        function setDrawingMode(mode) {
            drawingMode = mode;
            
            // Update button styles
            const buttons = document.querySelectorAll('.canvas-tools .btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function clearCanvas() {
            savedDrawings = [];
            drawField();
            showMessage('تم مسح الرسومات', 'success');
        }

        function loadFormation() {
            const formation = document.getElementById('formationSelect').value;
            clearCanvas();
            
            // Formation positions (simplified)
            const formations = {
                '4-3-3': [
                    { x: 150, y: 300, pos: 'GK' },
                    { x: 250, y: 200, pos: 'RB' },
                    { x: 250, y: 250, pos: 'CB' },
                    { x: 250, y: 350, pos: 'CB' },
                    { x: 250, y: 400, pos: 'LB' },
                    { x: 400, y: 200, pos: 'CM' },
                    { x: 400, y: 300, pos: 'CM' },
                    { x: 400, y: 400, pos: 'CM' },
                    { x: 600, y: 200, pos: 'RW' },
                    { x: 600, y: 300, pos: 'ST' },
                    { x: 600, y: 400, pos: 'LW' }
                ]
            };

            if (formations[formation]) {
                formations[formation].forEach(player => {
                    drawPlayer(player.x, player.y, player.pos);
                });
            }
        }

        function drawPlayer(x, y, position) {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = '12px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText(position, x, y + 4);
        }

        function saveFormation() {
            if (!currentTeam) {
                showMessage('يرجى إنشاء فريق أولاً', 'error');
                return;
            }

            const imageData = canvas.toDataURL();
            // Save to localStorage or database
            localStorage.setItem('savedFormation_' + currentTeam.id, imageData);
            showMessage('تم حفظ التشكيلة بنجاح', 'success');
        }

        function exportCanvas() {
            const link = document.createElement('a');
            link.download = 'tactical_formation.png';
            link.href = canvas.toDataURL();
            link.click();
        }

        // Search and filter functions
        function searchPlayers() {
            const searchTerm = document.getElementById('searchPlayers').value.toLowerCase();
            updatePlayersDisplay(searchTerm);
        }

        function filterPlayers() {
            const position = document.getElementById('positionFilter').value;
            const searchTerm = document.getElementById('searchPlayers').value.toLowerCase();
            updatePlayersDisplay(searchTerm, position);
        }

        // Page loading functions
        function loadDashboard() {
            updateDashboardStats();
        }

        function loadTeamPage() {
            updateTeamSetupVisibility();
            updatePlayersDisplay();
        }

        function loadLeaguesPage() {
            if (currentLeague) {
                document.getElementById('currentLeague').classList.remove('hidden');
                document.getElementById('currentLeagueName').textContent = currentLeague.name;
                document.getElementById('currentLeagueCode').textContent = currentLeague.code;
                loadLeagueTeams();
            } else {
                document.getElementById('currentLeague').classList.add('hidden');
            }
        }

        function loadLoansPage() {
            loadAvailableForLoan();
            loadOthersAvailableForLoan();
            loadLoanRequests();
        }

        function loadTacticalPage() {
            if (!canvas) {
                setTimeout(() => {
                    initializeCanvas();
                    loadPlayerPositions();
                }, 100);
            } else {
                loadPlayerPositions();
            }
        }

        function loadSettingsPage() {
            // Settings page is already loaded with user data
        }

        // Update display functions
        function updateDashboardStats() {
            const totalPlayers = players.length;
            const starters = players.filter(p => p.type === 'starter').length;
            const substitutes = players.filter(p => p.type === 'substitute').length;

            document.getElementById('playersCount').textContent = totalPlayers;
            document.getElementById('startersCount').textContent = starters;
            document.getElementById('substitutesCount').textContent = substitutes;

            // Load loan requests count
            if (currentTeam) {
                database.ref('loanRequests').orderByChild('fromTeamId').equalTo(currentTeam.id).once('value', (snapshot) => {
                    const requests = snapshot.val();
                    const pendingRequests = requests ? Object.values(requests).filter(r => r.status === 'pending').length : 0;
                    document.getElementById('loansCount').textContent = pendingRequests;
                });
            }
        }

        function updateTeamSetupVisibility() {
            if (currentTeam) {
                document.getElementById('teamSetup').classList.add('hidden');
                document.getElementById('playerForm').classList.remove('hidden');
                document.getElementById('playersSection').classList.remove('hidden');
            } else {
                document.getElementById('teamSetup').classList.remove('hidden');
                document.getElementById('playerForm').classList.add('hidden');
                document.getElementById('playersSection').classList.add('hidden');
            }
        }

        function updatePlayersDisplay(searchTerm = '', positionFilter = '') {
            const playersListDiv = document.getElementById('playersList');
            playersListDiv.innerHTML = '';

            let filteredPlayers = players;

            if (searchTerm) {
                filteredPlayers = filteredPlayers.filter(player => 
                    player.name.toLowerCase().includes(searchTerm) ||
                    player.idNumber.includes(searchTerm) ||
                    player.position.toLowerCase().includes(searchTerm)
                );
            }

            if (positionFilter) {
                filteredPlayers = filteredPlayers.filter(player => player.position === positionFilter);
            }

            filteredPlayers.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.className = `player-card ${player.type}`;
                playerCard.innerHTML = `
                    <h4>${player.name} (#${player.shirtNumber})</h4>
                    <p><strong>رقم الهوية:</strong> ${player.idNumber}</p>
                    <p><strong>المركز:</strong> ${player.position}</p>
                    <p><strong>النوع:</strong> ${player.type === 'starter' ? 'أساسي' : 'احتياط'}</p>
                    <p><strong>متاح للإعارة:</strong> ${player.availableForLoan ? 'نعم' : 'لا'}</p>
                    <div>
                        <button class="btn" onclick="editPlayer('${player.id}')">تعديل</button>
                        <button class="btn-danger btn" onclick="deletePlayer('${player.id}')">حذف</button>
                        <button class="btn-secondary btn" onclick="togglePlayerLoan('${player.id}')">
                            ${player.availableForLoan ? 'إلغاء الإعارة' : 'عرض للإعارة'}
                        </button>
                    </div>
                `;
                playersListDiv.appendChild(playerCard);
            });

            if (filteredPlayers.length === 0) {
                playersListDiv.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد نتائج</p>';
            }
        }

        function loadLeagueTeams() {
            if (!currentLeague) return;

            database.ref('leagues/' + currentLeague.id + '/teams').once('value', (snapshot) => {
                const teamsData = snapshot.val();
                if (!teamsData) return;

                const teamIds = Object.keys(teamsData);
                const teamsDiv = document.getElementById('leagueTeams');
                teamsDiv.innerHTML = '';

                teamIds.forEach(teamId => {
                    database.ref('teams/' + teamId).once('value', (teamSnapshot) => {
                        const team = teamSnapshot.val();
                        if (team) {
                            const teamDiv = document.createElement('div');
                            teamDiv.className = 'card';
                            teamDiv.innerHTML = `
                                <h4>${team.name}</h4>
                                <p>${teamId === currentTeam?.id ? '(فريقك)' : ''}</p>
                            `;
                            teamsDiv.appendChild(teamDiv);
                        }
                    });
                });
            });
        }

        function loadAvailableForLoan() {
            if (!currentTeam) return;

            const availableDiv = document.getElementById('availableForLoan');
            availableDiv.innerHTML = '';

            const availablePlayers = players.filter(p => p.availableForLoan);
            
            if (availablePlayers.length === 0) {
                availableDiv.innerHTML = '<p>لا توجد لاعبين متاحين للإعارة</p>';
                return;
            }

            availablePlayers.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'card';
                playerDiv.innerHTML = `
                    <h4>${player.name} (#${player.shirtNumber})</h4>
                    <p><strong>المركز:</strong> ${player.position}</p>
                    <button class="btn-secondary btn" onclick="togglePlayerLoan('${player.id}')">إلغاء الإعارة</button>
                `;
                availableDiv.appendChild(playerDiv);
            });
        }

        function loadOthersAvailableForLoan() {
            if (!currentLeague || !currentTeam) {
                document.getElementById('othersAvailableForLoan').innerHTML = '<p>يجب الانضمام لدوري أولاً</p>';
                return;
            }

            const othersDiv = document.getElementById('othersAvailableForLoan');
            othersDiv.innerHTML = '';

            database.ref('leagues/' + currentLeague.id + '/teams').once('value', (snapshot) => {
                const teamsData = snapshot.val();
                if (!teamsData) return;

                Object.keys(teamsData).forEach(teamId => {
                    if (teamId === currentTeam.id) return;

                    database.ref('teams/' + teamId).once('value', (teamSnapshot) => {
                        const team = teamSnapshot.val();
                        if (!team) return;

                        database.ref('teams/' + teamId + '/players').once('value', (playersSnapshot) => {
                            const teamPlayers = playersSnapshot.val();
                            if (!teamPlayers) return;

                            Object.keys(teamPlayers).forEach(playerId => {
                                const player = teamPlayers[playerId];
                                if (player.availableForLoan) {
                                    const playerDiv = document.createElement('div');
                                    playerDiv.className = 'card';
                                    playerDiv.innerHTML = `
                                        <h4>${player.name} (#${player.shirtNumber})</h4>
                                        <p><strong>الفريق:</strong> ${team.name}</p>
                                        <p><strong>المركز:</strong> ${player.position}</p>
                                        <button class="btn" onclick="requestLoan('${playerId}', '${teamId}')">طلب إعارة</button>
                                    `;
                                    othersDiv.appendChild(playerDiv);
                                }
                            });
                        });
                    });
                });
            });
        }

        function loadLoanRequests() {
            if (!currentTeam) return;

            // Incoming requests
            const incomingDiv = document.getElementById('incomingLoanRequests');
            incomingDiv.innerHTML = '';

            database.ref('loanRequests').orderByChild('fromTeamId').equalTo(currentTeam.id).once('value', (snapshot) => {
                const requests = snapshot.val();
                if (!requests) {
                    incomingDiv.innerHTML = '<p>لا توجد طلبات واردة</p>';
                    return;
                }

                Object.keys(requests).forEach(requestId => {
                    const request = requests[requestId];
                    if (request.status === 'pending') {
                        Promise.all([
                            database.ref('teams/' + request.fromTeamId + '/players/' + request.playerId).once('value'),
                            database.ref('teams/' + request.toTeamId).once('value')
                        ]).then(([playerSnapshot, teamSnapshot]) => {
                            const player = playerSnapshot.val();
                            const team = teamSnapshot.val();

                            const requestDiv = document.createElement('div');
                            requestDiv.className = 'card';
                            requestDiv.innerHTML = `
                                <h4>${player ? player.name : 'Unknown'} (#${player ? player.shirtNumber : '?'})</h4>
                                <p><strong>الفريق الطالب:</strong> ${team ? team.name : 'Unknown'}</p>
                                <p><strong>المركز:</strong> ${player ? player.position : 'Unknown'}</p>
                                <button class="btn" onclick="respondToLoanRequest('${requestId}', 'accepted')">قبول</button>
                                <button class="btn-danger btn" onclick="respondToLoanRequest('${requestId}', 'rejected')">رفض</button>
                            `;
                            incomingDiv.appendChild(requestDiv);
                        });
                    }
                });
            });

            // Outgoing requests
            const outgoingDiv = document.getElementById('outgoingLoanRequests');
            outgoingDiv.innerHTML = '';

            database.ref('loanRequests').orderByChild('toTeamId').equalTo(currentTeam.id).once('value', (snapshot) => {
                const requests = snapshot.val();
                if (!requests) {
                    outgoingDiv.innerHTML = '<p>لا توجد طلبات مرسلة</p>';
                    return;
                }

                Object.keys(requests).forEach(requestId => {
                    const request = requests[requestId];
                    
                    Promise.all([
                        database.ref('teams/' + request.fromTeamId + '/players/' + request.playerId).once('value'),
                        database.ref('teams/' + request.fromTeamId).once('value')
                    ]).then(([playerSnapshot, teamSnapshot]) => {
                        const player = playerSnapshot.val();
                        const team = teamSnapshot.val();

                        const requestDiv = document.createElement('div');
                        requestDiv.className = 'card';
                        requestDiv.innerHTML = `
                            <h4>${player ? player.name : 'Unknown'} (#${player ? player.shirtNumber : '?'})</h4>
                            <p><strong>من فريق:</strong> ${team ? team.name : 'Unknown'}</p>
                            <p><strong>المركز:</strong> ${player ? player.position : 'Unknown'}</p>
                            <p><strong>الحالة:</strong> ${request.status === 'pending' ? 'قيد الانتظار' : request.status === 'accepted' ? 'مقبول' : 'مرفوض'}</p>
                        `;
                        outgoingDiv.appendChild(requestDiv);
                    });
                });
            });
        }

        function loadPlayerPositions() {
            if (!currentTeam) return;

            const positionsDiv = document.getElementById('playerPositions');
            positionsDiv.innerHTML = '';

            players.forEach(player => {
                const positionBtn = document.createElement('button');
                positionBtn.className = 'position-btn';
                positionBtn.textContent = `${player.name} (#${player.shirtNumber})`;
                positionBtn.onclick = () => {
                    // Add player to canvas logic
                    showMessage('اسحب اللاعب على الملعب', 'success');
                };
                positionsDiv.appendChild(positionBtn);
            });
        }

        function changePassword() {
            const newPassword = document.getElementById('newPassword').value;
            
            if (!newPassword || newPassword.length < 6) {
                showMessage('يرجى إدخال كلمة مرور صحيحة (6 أحرف على الأقل)', 'error');
                return;
            }

            currentUser.updatePassword(newPassword)
                .then(() => {
                    showMessage('تم تغيير كلمة المرور بنجاح', 'success');
                    document.getElementById('newPassword').value = '';
                })
                .catch((error) => {
                    showMessage('خطأ في تغيير كلمة المرور: ' + error.message, 'error');
                });
        }
    </script>
</body>
</html>
