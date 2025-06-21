// المتغيرات العامة
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || {};
let benefits = [];
let filteredBenefits = [];
let summaries = [];
let filteredSummaries = [];
let groups = ['الفوائد المفضلة', 'فوائد للدراسة', 'فوائد للتحقيق', 'فوائد لمراجعة', 'ملخصات كتب', 'دروس علمية'];
let currentContentTab = 'benefits';
let currentSidebarTab = 'benefits';
let recoveryType = ''; // 'username' أو 'password'
let viewMode = 'list'; // 'list', 'grid'
let viewModeSummary = 'list'; // 'list', 'card'
let recoveryEmail = '';
let recoveryUsername = '';

// بيانات تجريبية
const sampleBenefits = [
    {
        id: 1,
        text: "قال الإمام النووي رحمه الله: 'من أراد أن يكلم الله فليقرأ القرآن، ومن أراد أن يكلمه الله فليصل'",
        author: "الإمام النووي",
        category: "الأدب والبلاغة",
        source: "الأذكار للنووي",
        group: "الفوائد المفضلة",
        date: new Date(),
        userId: 'admin'
    },
    {
        id: 2,
        text: "الحديث الضعيف يُعمل به في فضائل الأعمال بشروط: أن لا يكون شديد الضعف، وأن يكون له أصل من الشرع، وأن لا يعتقد ثبوته",
        author: "",
        category: "علوم الحديث",
        source: "قواعد في علوم الحديث",
        group: "فوائد للدراسة",
        date: new Date(),
        userId: 'admin'
    },
    {
        id: 3,
        text: "العلم ثلاثة أشبار: من دخل في الشبر الأول تكبر، ومن دخل في الشبر الثاني تواضع، ومن دخل في الشبر الثالث علم أنه لا يعلم",
        author: "ابن مسعود",
        category: "الأدب والبلاغة",
        source: "جامع بيان العلم وفضله",
        group: "الفوائد المفضلة",
        date: new Date(),
        userId: 'admin'
    },
    {
        id: 4,
        text: "إن الله لا يقبض العلم انتزاعًا ينتزعه من العباد، ولكن يقبض العلم بقبض العلماء",
        author: "ابن عباس",
        category: "علوم الحديث",
        source: "صحيح البخاري",
        group: "فوائد للتحقيق",
        date: new Date(),
        userId: 'admin'
    }
];

const sampleSummaries = [
    {
        id: 1,
        title: "ملخص كتاب الأربعين النووية",
        content: "الأربعون النووية هي متن مشهور، اشتمل على اثنين وأربعين حديثاً محذوفة الإسناد في فنون مختلفة من العلم، كل حديث منها قاعدة عظيمة من قواعد الدين، وقد وصفه العلماء بأنه مشتمل على النصف الثاني من الإسلام، أي على الأحكام، لأن النصف الأول هو العقائد.",
        category: "علوم الحديث",
        type: "book",
        author: "الإمام النووي",
        group: "ملخصات كتب",
        date: new Date(),
        userId: 'admin'
    },
    {
        id: 2,
        title: "ملخص درس في العقيدة",
        content: "من أصول العقيدة الصحيحة: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر وبالقدر خيره وشره، وأن الله واحد لا شريك له في ربوبيته وألوهيته وأسمائه وصفاته.",
        category: "العقيدة",
        type: "lesson",
        sheikh: "ابن باز",
        group: "دروس علمية",
        date: new Date(),
        lessonDate: "2023-05-15",
        userId: 'admin'
    },
    {
        id: 3,
        title: "ملخص كتاب إحياء علوم الدين",
        content: "كتاب إحياء علوم الدين للإمام الغزالي هو أحد أشهر كتب الثقافة الإسلامية، ويعد موسوعة في الأخلاق والآداب والتربية، وقد قسمه المؤلف إلى أربعة أقسام: العبادات، والعادات، والمهلكات، والمنجيات.",
        category: "الأدب والبلاغة",
        type: "book",
        author: "الإمام الغزالي",
        group: "ملخصات كتب",
        date: new Date(),
        userId: 'admin'
    }
];

// وظائف التسجيل والدخول
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabs[1].classList.add('active');
    }
}

function switchContentTab(tab) {
    const benefitsTab = document.getElementById('benefitsTab');
    const summariesTab = document.getElementById('summariesTab');
    const tabs = document.querySelectorAll('.content-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'benefits') {
        benefitsTab.classList.remove('hidden');
        summariesTab.classList.add('hidden');
        tabs[0].classList.add('active');
        currentContentTab = 'benefits';
    } else {
        benefitsTab.classList.add('hidden');
        summariesTab.classList.remove('hidden');
        tabs[1].classList.add('active');
        currentContentTab = 'summaries';
    }
}

function switchSidebarTab(tab) {
    const benefitsForm = document.getElementById('benefitsForm');
    const summariesForm = document.getElementById('summariesForm');
    const groupsForm = document.getElementById('groupsForm');
    const tabs = document.querySelectorAll('.sidebar-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    benefitsForm.classList.add('hidden');
    summariesForm.classList.add('hidden');
    groupsForm.classList.add('hidden');
    
    if (tab === 'benefits') {
        benefitsForm.classList.remove('hidden');
        tabs[0].classList.add('active');
        currentSidebarTab = 'benefits';
    } else if (tab === 'summaries') {
        summariesForm.classList.remove('hidden');
        tabs[1].classList.add('active');
        currentSidebarTab = 'summaries';
    } else if (tab === 'groups') {
        groupsForm.classList.remove('hidden');
        tabs[2].classList.add('active');
        currentSidebarTab = 'groups';
    }
}

function toggleSummaryFields() {
    const summaryType = document.getElementById('summaryType').value;
    const bookFields = document.getElementById('bookFields');
    const lessonFields = document.getElementById('lessonFields');
    
    if (summaryType === 'book') {
        bookFields.classList.remove('hidden');
        lessonFields.classList.add('hidden');
    } else {
        bookFields.classList.add('hidden');
        lessonFields.classList.remove('hidden');
    }
}

// دالة جديدة لإظهار/إخفاء حقول البحث حسب نوع الملخص
function toggleSummaryFilterFields() {
    const summaryType = document.getElementById('filterSummaryType').value;
    const bookAuthorField = document.getElementById('filterBookAuthorField');
    const sheikhField = document.getElementById('filterLessonSheikhField');
    const dateField = document.getElementById('dateFilterField');
    
    if (summaryType === 'book') {
        bookAuthorField.style.display = 'block';
        sheikhField.style.display = 'none';
        dateField.style.display = 'none';
    } else if (summaryType === 'lesson') {
        bookAuthorField.style.display = 'none';
        sheikhField.style.display = 'block';
        dateField.style.display = 'block';
    } else {
        bookAuthorField.style.display = 'none';
        sheikhField.style.display = 'none';
        dateField.style.display = 'none';
    }
    
    applySummaryFilters();
}

function register(username, password, email) {
    if (users[username]) {
        alert('اسم المستخدم موجود بالفعل');
        return false;
    }
    
    // التأكد من عدم استخدام البريد الإلكتروني من قبل
    for (const user in users) {
        if (users[user].email === email) {
            alert('البريد الإلكتروني مستخدم بالفعل');
            return false;
        }
    }
    
    // التصنيفات الافتراضية لكل مستخدم
    const defaultCategories = ['السيرة النبوية', 'علوم الحديث', 'الفقه', 'التفسير', 'العقيدة', 'التاريخ الإسلامي', 'الأدب والبلاغة'];
    
    users[username] = {
        password: password,
        email: email,
        benefits: [...sampleBenefits],
        summaries: [...sampleSummaries],
        categories: [...defaultCategories],
        groups: [...groups]
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('تم إنشاء الحساب بنجاح!');
    switchAuthTab('login');
    return true;
}

function login(username, password) {
    if (!users[username] || users[username].password !== password) {
        alert('اسم المستخدم أو كلمة المرور غير صحيحة');
        return false;
    }
    
    currentUser = username;
    localStorage.setItem('currentUser', username);
    loadUserData();
    showMainApp();
    return true;
}

function logout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showLoginScreen();
    }
}

function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('currentUser').textContent = currentUser;
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function loadUserData() {
    if (currentUser && users[currentUser]) {
        benefits = users[currentUser].benefits || [];
        summaries = users[currentUser].summaries || [];
        // التصنيفات الخاصة بالمستخدم الحالي
        const categories = users[currentUser].categories || [];
        groups = users[currentUser].groups || [...groups];
        filteredBenefits = [...benefits];
        filteredSummaries = [...summaries];
        
        // تحديث خيارات التصنيفات بناءً على المستخدم الحالي
        updateCategoryOptions(categories);
        updateGroupOptions();
        updateGroupsList();
        updateDisplay();
        updateSummariesDisplay();
    }
}

function saveUserData() {
    if (currentUser && users[currentUser]) {
        users[currentUser].benefits = benefits;
        users[currentUser].summaries = summaries;
        // لا نحتاج لحفظ التصنيفات هنا لأنها يتم تحديثها عند الإضافة
        users[currentUser].groups = groups;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// وظائف الفوائد
function updateCategoryOptions(categories) {
    const categorySelect = document.getElementById('category');
    const filterCategorySelect = document.getElementById('filterCategory');
    const summaryCategorySelect = document.getElementById('summaryCategory');
    const filterSummaryCategorySelect = document.getElementById('filterSummaryCategory');
    
    categorySelect.innerHTML = '<option value="">اختر التصنيف أو أضف جديد</option>';
    categories.forEach(cat => {
        categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    
    filterCategorySelect.innerHTML = '<option value="">جميع التصنيفات</option>';
    categories.forEach(cat => {
        filterCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    
    summaryCategorySelect.innerHTML = '<option value="">اختر التصنيف</option>';
    categories.forEach(cat => {
        summaryCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
    
    filterSummaryCategorySelect.innerHTML = '<option value="">جميع التصنيفات</option>';
    categories.forEach(cat => {
        filterSummaryCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function updateGroupOptions() {
    const groupSelect = document.getElementById('group');
    const filterGroupSelect = document.getElementById('filterGroup');
    const summaryGroupSelect = document.getElementById('summaryGroup');
    const filterSummaryGroupSelect = document.getElementById('filterSummaryGroup');
    
    groupSelect.innerHTML = '<option value="">بدون مجموعة</option>';
    groups.forEach(group => {
        groupSelect.innerHTML += `<option value="${group}">${group}</option>`;
    });
    
    filterGroupSelect.innerHTML = '<option value="">جميع المجموعات</option>';
    groups.forEach(group => {
        filterGroupSelect.innerHTML += `<option value="${group}">${group}</option>`;
    });
    
    summaryGroupSelect.innerHTML = '<option value="">بدون مجموعة</option>';
    groups.forEach(group => {
        summaryGroupSelect.innerHTML += `<option value="${group}">${group}</option>`;
    });
    
    filterSummaryGroupSelect.innerHTML = '<option value="">جميع المجموعات</option>';
    groups.forEach(group => {
        filterSummaryGroupSelect.innerHTML += `<option value="${group}">${group}</option>`;
    });
}

function updateGroupsList() {
    const groupsList = document.getElementById('groupsList');
    groupsList.innerHTML = '';
    
    groups.forEach(group => {
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item';
        groupItem.innerHTML = `
            <span class="group-name">${group}</span>
            <div class="group-actions">
                <button class="delete-btn" onclick="deleteGroup('${group}')"><i class="fas fa-trash"></i> حذف</button>
            </div>
        `;
        groupsList.appendChild(groupItem);
    });
}

function addNewCategory() {
    const newCategoryInput = document.getElementById('newCategory');
    const addBtn = document.getElementById('addCategoryBtn');
    
    if (newCategoryInput.style.display === 'none' || newCategoryInput.style.display === '') {
        newCategoryInput.style.display = 'block';
        newCategoryInput.focus();
        addBtn.textContent = 'تأكيد';
    } else {
        const newCat = newCategoryInput.value.trim();
        if (newCat) {
            // التأكد من وجود المستخدم الحالي
            if (currentUser && users[currentUser]) {
                // تجنب التكرار
                if (!users[currentUser].categories.includes(newCat)) {
                    // إضافة التصنيف للمستخدم الحالي
                    users[currentUser].categories.push(newCat);
                    
                    // تحديث واجهة المستخدم بالتصنيفات الجديدة
                    updateCategoryOptions(users[currentUser].categories);
                    
                    // تحديد التصنيف المضاف حديثاً
                    document.getElementById('category').value = newCat;
                    
                    // حفظ بيانات المستخدم
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // إعادة تعيين الحقل وإخفائه
                    newCategoryInput.value = '';
                    newCategoryInput.style.display = 'none';
                    addBtn.textContent = 'إضافة';
                } else {
                    alert('هذا التصنيف موجود بالفعل');
                }
            } else {
                alert('يجب تسجيل الدخول أولاً');
            }
        } else {
            alert('الرجاء كتابة اسم التصنيف');
        }
    }
}

function addNewGroup() {
    const newGroupName = document.getElementById('newGroupName').value.trim();
    if (!newGroupName) {
        alert('الرجاء كتابة اسم المجموعة');
        return;
    }
    
    if (groups.includes(newGroupName)) {
        alert('هذه المجموعة موجودة بالفعل');
        return;
    }
    
    groups.push(newGroupName);
    updateGroupOptions();
    updateGroupsList();
    saveUserData();
    document.getElementById('newGroupName').value = '';
}

function deleteGroup(groupName) {
    if (confirm(`هل أنت متأكد من حذف مجموعة "${groupName}"؟ سيتم إزالتها من جميع الفوائد والملخصات.`)) {
        groups = groups.filter(g => g !== groupName);
        
        benefits.forEach(benefit => {
            if (benefit.group === groupName) {
                benefit.group = '';
            }
        });
        
        summaries.forEach(summary => {
            if (summary.group === groupName) {
                summary.group = '';
            }
        });
        
        updateGroupOptions();
        updateGroupsList();
        saveUserData();
        applyFilters();
        applySummaryFilters();
    }
}

function deleteBenefit(id) {
    if (confirm('هل أنت متأكد من حذف هذه الفائدة؟')) {
        benefits = benefits.filter(benefit => benefit.id !== id);
        applyFilters();
        saveUserData();
    }
}

function deleteSummary(id) {
    if (confirm('هل أنت متأكد من حذف هذا الملخص؟')) {
        summaries = summaries.filter(summary => summary.id !== id);
        applySummaryFilters();
        saveUserData();
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const authorFilter = document.getElementById('filterAuthor').value.toLowerCase();
    const groupFilter = document.getElementById('filterGroup').value;
    const sourceFilter = document.getElementById('filterSource').value.toLowerCase();
    
    filteredBenefits = benefits.filter(benefit => {
        const matchesSearch = benefit.text.toLowerCase().includes(searchTerm) ||
                            benefit.source.toLowerCase().includes(searchTerm) ||
                            (benefit.author && benefit.author.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || benefit.category === categoryFilter;
        const matchesAuthor = !authorFilter || (benefit.author && benefit.author.toLowerCase().includes(authorFilter));
        const matchesGroup = !groupFilter || benefit.group === groupFilter;
        const matchesSource = !sourceFilter || benefit.source.toLowerCase().includes(sourceFilter);
        
        return matchesSearch && matchesCategory && matchesAuthor && matchesGroup && matchesSource;
    });
    
    updateDisplay();
}

function applySummaryFilters() {
    const searchTerm = document.getElementById('searchSummaryInput').value.toLowerCase();
    const categoryFilter = document.getElementById('filterSummaryCategory').value;
    const typeFilter = document.getElementById('filterSummaryType').value;
    const groupFilter = document.getElementById('filterSummaryGroup').value;
    const authorFilter = document.getElementById('filterBookAuthor').value.toLowerCase();
    const sheikhFilter = document.getElementById('filterLessonSheikh').value.toLowerCase();
    const dateFilter = document.getElementById('filterLessonDate').value;
    
    filteredSummaries = summaries.filter(summary => {
        const matchesSearch = summary.title.toLowerCase().includes(searchTerm) ||
                            summary.content.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || summary.category === categoryFilter;
        const matchesType = !typeFilter || summary.type === typeFilter;
        const matchesGroup = !groupFilter || summary.group === groupFilter;
        
        let matchesAuthor = true;
        if (authorFilter && summary.author) {
            matchesAuthor = summary.author.toLowerCase().includes(authorFilter);
        }
        
        let matchesSheikh = true;
        if (sheikhFilter && summary.sheikh) {
            matchesSheikh = summary.sheikh.toLowerCase().includes(sheikhFilter);
        }
        
        let matchesDate = true;
        if (dateFilter && summary.lessonDate) {
            matchesDate = summary.lessonDate === dateFilter;
        }
        
        return matchesSearch && matchesCategory && matchesType && matchesGroup && matchesAuthor && matchesSheikh && matchesDate;
    });
    
    updateSummariesDisplay();
}

// وظائف منظورات العرض
function setViewMode(mode) {
    viewMode = mode;
    localStorage.setItem('benefitsViewMode', mode);
    
    const listBtn = document.getElementById('listViewBtn');
    const gridBtn = document.getElementById('gridViewBtn');
    
    listBtn.classList.remove('active');
    gridBtn.classList.remove('active');
    
    if (mode === 'list') {
        listBtn.classList.add('active');
    } else {
        gridBtn.classList.add('active');
    }
    
    updateDisplay();
}

function setViewModeSummary(mode) {
    viewModeSummary = mode;
    localStorage.setItem('summariesViewMode', mode);
    
    const listBtn = document.getElementById('listViewBtnSummary');
    const cardBtn = document.getElementById('cardViewBtnSummary');
    
    listBtn.classList.remove('active');
    cardBtn.classList.remove('active');
    
    if (mode === 'list') {
        listBtn.classList.add('active');
    } else {
        cardBtn.classList.add('active');
    }
    
    updateSummariesDisplay();
}

function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
}

function updateSummariesDisplay() {
    const summariesList = document.getElementById('summariesList');
    const searchTerm = document.getElementById('searchSummaryInput').value.toLowerCase();
    
    if (filteredSummaries.length === 0) {
        summariesList.innerHTML = '<div class="no-benefits"><i class="fas fa-file-alt" style="font-size: 3rem; margin-bottom: 15px;"></i><p>لا توجد ملخصات تطابق معايير البحث.</p></div>';
    } else {
        if (viewModeSummary === 'list') {
            summariesList.innerHTML = filteredSummaries.map(summary => {
                let authorField = '';
                if (summary.type === 'book' && summary.author) {
                    authorField = `<div class="summary-author"><i class="fas fa-user-tie old-icon"></i> الكاتب: ${summary.author}</div>`;
                } else if (summary.type === 'lesson' && summary.sheikh) {
                    authorField = `<div class="summary-author"><i class="fas fa-user old-icon"></i> الشيخ: ${summary.sheikh}</div>`;
                }
                
                return `
                    <div class="summary-item list-view fade-in" onclick="showDetail(${summary.id}, 'summary')">
                        <div class="benefit-header">
                            <span class="summary-type">${summary.type === 'book' ? '<i class="fas fa-book old-icon"></i> ملخص كتاب' : '<i class="fas fa-chalkboard-teacher old-icon"></i> ملخص درس'}</span>
                            ${summary.group ? `<span class="summary-group"><i class="fas fa-folder"></i> ${summary.group}</span>` : ''}
                            <button class="delete-btn" onclick="event.stopPropagation(); deleteSummary(${summary.id})"><i class="fas fa-trash"></i> حذف</button>
                        </div>
                        <div class="summary-title">${highlightText(summary.title, searchTerm)}</div>
                        ${authorField}
                        <div class="summary-content">${highlightText(summary.content, searchTerm)}</div>
                        <div class="benefit-source"><i class="fas fa-tag old-icon"></i> ${summary.category}</div>
                        ${summary.lessonDate ? `<div class="summary-date"><i class="fas fa-calendar-day old-icon"></i> تاريخ الدرس: ${summary.lessonDate}</div>` : ''}
                        <button class="view-details-btn" onclick="event.stopPropagation(); showDetail(${summary.id}, 'summary')"><i class="fas fa-expand"></i> عرض التفاصيل</button>
                    </div>
                `;
            }).join('');
        } else {
            summariesList.className = 'summaries-cards';
            summariesList.innerHTML = filteredSummaries.map(summary => {
                let authorField = '';
                if (summary.type === 'book' && summary.author) {
                    authorField = `<div class="summary-author"><i class="fas fa-user-tie old-icon"></i> الكاتب: ${summary.author}</div>`;
                } else if (summary.type === 'lesson' && summary.sheikh) {
                    authorField = `<div class="summary-author"><i class="fas fa-user old-icon"></i> الشيخ: ${summary.sheikh}</div>`;
                }
                
                return `
                    <div class="summary-item card-view fade-in" onclick="showDetail(${summary.id}, 'summary')">
                        <div class="benefit-header">
                            <span class="summary-type">${summary.type === 'book' ? '<i class="fas fa-book old-icon"></i> كتاب' : '<i class="fas fa-chalkboard-teacher old-icon"></i> درس'}</span>
                            ${summary.group ? `<span class="summary-group"><i class="fas fa-folder"></i> ${summary.group}</span>` : ''}
                            <button class="delete-btn" onclick="event.stopPropagation(); deleteSummary(${summary.id})"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="summary-title">${highlightText(summary.title, searchTerm)}</div>
                        ${authorField}
                        <div class="summary-content">${highlightText(summary.content.substring(0, 150) + (summary.content.length > 150 ? '...' : ''), searchTerm)}</div>
                        <div class="benefit-source"><i class="fas fa-tag old-icon"></i> ${summary.category}</div>
                        <button class="view-details-btn" onclick="event.stopPropagation(); showDetail(${summary.id}, 'summary')"><i class="fas fa-expand"></i> عرض التفاصيل</button>
                    </div>
                `;
            }).join('');
        }
    }
}

function updateDisplay() {
    const benefitsList = document.getElementById('benefitsList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (filteredBenefits.length === 0) {
        benefitsList.innerHTML = '<div class="no-benefits"><i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 15px;"></i><p>لا توجد فوائد تطابق معايير البحث.</p></div>';
    } else {
        if (viewMode === 'list') {
            benefitsList.className = '';
            benefitsList.innerHTML = filteredBenefits.map(benefit => `
                <div class="benefit-item list-view fade-in" onclick="showDetail(${benefit.id}, 'benefit')">
                    <div class="benefit-header">
                        <div>
                            <span class="benefit-category"><i class="fas fa-tag"></i> ${benefit.category}</span>
                            ${benefit.group ? `<span class="benefit-category" style="background: #3E2723; margin-right: 5px;"><i class="fas fa-folder"></i> ${benefit.group}</span>` : ''}
                        </div>
                        <button class="delete-btn" onclick="event.stopPropagation(); deleteBenefit(${benefit.id})"><i class="fas fa-trash"></i> حذف</button>
                    </div>
                    <div class="benefit-content">${highlightText(benefit.text, searchTerm)}</div>
                    ${benefit.author ? `<div class="benefit-author"><i class="fas fa-user-tie"></i> ${benefit.author}</div>` : ''}
                    <div class="benefit-source"><i class="fas fa-book"></i> ${benefit.source}</div>
                    <button class="view-details-btn" onclick="event.stopPropagation(); showDetail(${benefit.id}, 'benefit')"><i class="fas fa-expand"></i> عرض التفاصيل</button>
                </div>
            `).join('');
        } else {
            benefitsList.className = 'benefits-grid';
            benefitsList.innerHTML = filteredBenefits.map(benefit => `
                <div class="benefit-item grid-view fade-in" onclick="showDetail(${benefit.id}, 'benefit')">
                    <div class="benefit-header">
                        <div>
                            <span class="benefit-category"><i class="fas fa-tag"></i> ${benefit.category}</span>
                        </div>
                        <button class="delete-btn" onclick="event.stopPropagation(); deleteBenefit(${benefit.id})"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="benefit-content">${highlightText(benefit.text.substring(0, 120) + (benefit.text.length > 120 ? '...' : ''), searchTerm)}</div>
                    ${benefit.author ? `<div class="benefit-author"><i class="fas fa-user-tie"></i> ${benefit.author}</div>` : ''}
                    <div class="benefit-source"><i class="fas fa-book"></i> ${benefit.source}</div>
                    <button class="view-details-btn" onclick="event.stopPropagation(); showDetail(${benefit.id}, 'benefit')"><i class="fas fa-expand"></i> عرض التفاصيل</button>
                </div>
            `).join('');
        }
    }
    
    updateStats();
}

function updateStats() {
    document.getElementById('totalCount').textContent = benefits.length;
    const uniqueCategories = [...new Set(benefits.map(b => b.category))];
    document.getElementById('categoryCount').textContent = uniqueCategories.length;
    document.getElementById('summariesCount').textContent = summaries.length;
}

// وظائف استعادة الحساب
function showForgotUsername() {
    recoveryType = 'username';
    document.getElementById('modalTitle').textContent = 'استعادة اسم المستخدم';
    document.getElementById('modalDescription').textContent = 'الرجاء إدخال البريد الإلكتروني المرتبط بحسابك';
    document.getElementById('recoveryStep1').classList.remove('hidden');
    document.getElementById('recoveryStep2').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('emailModal').classList.remove('hidden');
}

function showForgotPassword() {
    recoveryType = 'password';
    document.getElementById('modalTitle').textContent = 'استعادة كلمة المرور';
    document.getElementById('modalDescription').textContent = 'الرجاء إدخال البريد الإلكتروني المرتبط بحسابك';
    document.getElementById('recoveryStep1').classList.remove('hidden');
    document.getElementById('recoveryStep2').classList.add('hidden');
    document.getElementById('successMessage').classList.add('hidden');
    document.getElementById('emailModal').classList.remove('hidden');
}

function closeEmailModal() {
    document.getElementById('emailModal').classList.add('hidden');
}

function verifyEmail() {
    const email = document.getElementById('emailInput').value.trim();
    if (!email) {
        alert('الرجاء إدخال البريد الإلكتروني');
        return;
    }
    
    let foundUser = null;
    for (const username in users) {
        if (users[username].email === email) {
            foundUser = username;
            break;
        }
    }
    
    if (!foundUser) {
        alert('لا يوجد حساب مرتبط بهذا البريد الإلكتروني');
        return;
    }
    
    recoveryEmail = email;
    recoveryUsername = foundUser;
    
    // إظهار الخطوة الثانية
    document.getElementById('recoveryStep1').classList.add('hidden');
    document.getElementById('recoveryStep2').classList.remove('hidden');
    document.getElementById('step2').classList.add('active');
    
    if (recoveryType === 'username') {
        document.getElementById('usernameRecovery').classList.remove('hidden');
        document.getElementById('passwordRecovery').classList.add('hidden');
    } else {
        document.getElementById('usernameRecovery').classList.add('hidden');
        document.getElementById('passwordRecovery').classList.remove('hidden');
    }
}

function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!newPassword || !confirmNewPassword) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('كلمات المرور غير متطابقة');
        return;
    }
    
    if (newPassword.length < 4) {
        alert('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
        return;
    }
    
    // تحديث كلمة المرور
    users[recoveryUsername].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // إظهار رسالة النجاح
    document.getElementById('successMessage').classList.remove('hidden');
    document.getElementById('successText').textContent = 'تم تحديث كلمة المرور بنجاح!';
    
    // إغلاق النافذة بعد 3 ثوان
    setTimeout(() => {
        closeEmailModal();
    }, 3000);
}

// نافذة التفاصيل الكاملة
function showDetail(id, type) {
    let item;
    if (type === 'benefit') {
        item = benefits.find(b => b.id === id);
    } else {
        item = summaries.find(s => s.id === id);
    }
    
    if (!item) return;
    
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('detailTitle');
    const body = document.getElementById('detailBody');
    const meta = document.getElementById('detailMeta');
    const footer = document.getElementById('detailFooter');
    
    modal.classList.remove('hidden');
    
    if (type === 'benefit') {
        title.textContent = "فائدة علمية";
        body.innerHTML = `<p>${item.text}</p>`;
        
        meta.innerHTML = `
            <div class="detail-meta"><i class="fas fa-tag"></i> ${item.category}</div>
            ${item.group ? `<div class="detail-meta"><i class="fas fa-folder"></i> ${item.group}</div>` : ''}
            ${item.author ? `<div class="detail-meta"><i class="fas fa-user-tie"></i> ${item.author}</div>` : ''}
            <div class="detail-meta"><i class="fas fa-book"></i> ${item.source}</div>
        `;
        
        footer.innerHTML = '';
    } else {
        title.textContent = item.title;
        body.innerHTML = `<p>${item.content}</p>`;
        
        meta.innerHTML = `
            <div class="detail-meta"><i class="fas fa-tag"></i> ${item.category}</div>
            ${item.group ? `<div class="detail-meta"><i class="fas fa-folder"></i> ${item.group}</div>` : ''}
            ${item.author ? `<div class="detail-meta"><i class="fas fa-user-tie"></i> الكاتب: ${item.author}</div>` : ''}
            ${item.sheikh ? `<div class="detail-meta"><i class="fas fa-user"></i> الشيخ: ${item.sheikh}</div>` : ''}
            ${item.lessonDate ? `<div class="detail-meta"><i class="fas fa-calendar-day"></i> تاريخ الدرس: ${item.lessonDate}</div>` : ''}
        `;
        
        footer.innerHTML = `
            <div class="detail-meta"><i class="fas fa-bookmark"></i> ${item.type === 'book' ? 'ملخص كتاب' : 'ملخص درس'}</div>
        `;
    }
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

// إضافة مستمعي الأحداث
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (username && password) {
        login(username, password);
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!username || !password || !email) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('كلمات المرور غير متطابقة');
        return;
    }
    
    if (password.length < 4) {
        alert('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
        return;
    }
    
    register(username, password, email);
});

document.getElementById('benefitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const text = document.getElementById('benefitText').value.trim();
    const author = document.getElementById('author').value.trim();
    let category = document.getElementById('category').value;
    const source = document.getElementById('source').value.trim();
    const group = document.getElementById('group').value;
    const newCategory = document.getElementById('newCategory').value.trim();
    
    if (!text || !source) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }
    
    // إذا كان المستخدم يضيف تصنيف جديد
    if (!category && newCategory) {
        category = newCategory;
        if (currentUser && users[currentUser]) {
            if (!users[currentUser].categories.includes(category)) {
                users[currentUser].categories.push(category);
                localStorage.setItem('users', JSON.stringify(users));
                updateCategoryOptions(users[currentUser].categories);
            }
        }
    }
    
    if (!category) {
        alert('الرجاء اختيار أو إضافة تصنيف');
        return;
    }
    
    const newBenefit = {
        id: Date.now(),
        text: text,
        author: author,
        category: category,
        source: source,
        group: group,
        date: new Date(),
        userId: currentUser
    };
    
    benefits.push(newBenefit);
    document.getElementById('benefitText').value = '';
    document.getElementById('author').value = '';
    document.getElementById('source').value = '';
    document.getElementById('category').value = '';
    document.getElementById('newCategory').value = '';
    document.getElementById('newCategory').style.display = 'none';
    document.getElementById('addCategoryBtn').textContent = 'إضافة';
    
    applyFilters();
    saveUserData();
    
    document.getElementById('benefitsList').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('summaryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('summaryTitle').value.trim();
    const content = document.getElementById('summaryContent').value.trim();
    const category = document.getElementById('summaryCategory').value;
    const group = document.getElementById('summaryGroup').value;
    const type = document.getElementById('summaryType').value;
    const bookAuthor = document.getElementById('bookAuthor').value.trim();
    const lessonSheikh = document.getElementById('lessonSheikh').value.trim();
    const lessonDate = document.getElementById('lessonDate').value;
    
    if (!title || !content || !category) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }
    
    const newSummary = {
        id: Date.now(),
        title: title,
        content: content,
        category: category,
        group: group,
        type: type,
        date: new Date(),
        userId: currentUser
    };
    
    if (type === 'book') {
        newSummary.author = bookAuthor;
        document.getElementById('bookAuthor').value = '';
    } else {
        newSummary.sheikh = lessonSheikh;
        newSummary.lessonDate = lessonDate;
        document.getElementById('lessonSheikh').value = '';
        document.getElementById('lessonDate').value = '';
    }
    
    summaries.push(newSummary);
    document.getElementById('summaryTitle').value = '';
    document.getElementById('summaryContent').value = '';
    document.getElementById('summaryCategory').value = '';
    document.getElementById('summaryGroup').value = '';
    
    applySummaryFilters();
    saveUserData();
    switchContentTab('summaries');
});

document.getElementById('addCategoryBtn').addEventListener('click', addNewCategory);

// إضافة مستمعي الأحداث للتبويبات الجانبية
document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        switchSidebarTab(this.dataset.tab);
    });
});

// إغلاق نافذة التفاصيل عند النقر خارجها
document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeDetailModal();
    }
});

// تهيئة التطبيق عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('users')) {
        // التصنيفات الافتراضية لكل مستخدم
        const defaultCategories = ['السيرة النبوية', 'علوم الحديث', 'الفقه', 'التفسير', 'العقيدة', 'التاريخ الإسلامي', 'الأدب والبلاغة'];
        
        users = {
            admin: {
                password: 'admin123',
                email: 'admin@example.com',
                benefits: [...sampleBenefits],
                summaries: [...sampleSummaries],
                categories: [...defaultCategories],
                groups: [...groups]
            },
            user1: {
                password: 'pass123',
                email: 'user1@example.com',
                benefits: [],
                summaries: [],
                categories: [...defaultCategories],
                groups: [...groups]
            }
        };
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        users = JSON.parse(localStorage.getItem('users')) || {};
    }
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && users[savedUser]) {
        currentUser = savedUser;
        loadUserData();
        showMainApp();
    } else {
        showLoginScreen();
    }
    
    // استعادة أنماط العرض
    const savedBenefitsViewMode = localStorage.getItem('benefitsViewMode');
    if (savedBenefitsViewMode) {
        viewMode = savedBenefitsViewMode;
        setViewMode(viewMode);
    }
    
    const savedSummariesViewMode = localStorage.getItem('summariesViewMode');
    if (savedSummariesViewMode) {
        viewModeSummary = savedSummariesViewMode;
        setViewModeSummary(viewModeSummary);
    }
    
    toggleSummaryFields();
    toggleSummaryFilterFields();
});
// دالة التبديل بين النسقين
function toggleTheme() {
    const themeLink = document.getElementById('theme-style');
    const currentTheme = themeLink.getAttribute('href');
    const newTheme = currentTheme === 'style.css' ? 'style1.css' : 'style.css';
    
    themeLink.setAttribute('href', newTheme);
    localStorage.setItem('theme', newTheme);
}

// تهيئة النسق عند التحميل
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'style.css';
    document.getElementById('theme-style').setAttribute('href', savedTheme);
}

// في نهاية DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود الحالي
    
    // إضافة مستمع للزر الجديد
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // تهيئة النسق
    initTheme();
});