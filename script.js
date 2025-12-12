// Balatro攻略指南 - 交互脚本
document.addEventListener('DOMContentLoaded', function() {
    
    // 导航栏功能
    initNavigation();
    
    // 平滑滚动
    initSmoothScroll();
    
    // 标签页功能
    initTabs();
    
    // 动态效果
    initAnimations();
    
    // 响应式菜单
    initMobileMenu();
    
    // 扑克牌型展示
    initPokerHands();
    
    // 工具提示
    initTooltips();
    
    // 新增：初始化侧边目录
    initTOC();

    // 新增：返回顶部按钮
    initBackToTop();
    
});

// -----------------------------------------------------------
// 新增功能实现
// -----------------------------------------------------------

// 1. 初始化侧边目录 (TOC)
function initTOC() {
    const tocList = document.getElementById('tocList');
    if (!tocList) return;

    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const id = section.id;
        const titleEl = section.querySelector('.section-title') || section.querySelector('h2');
        if (!titleEl) return;
        
        const title = titleEl.textContent;
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.className = 'toc-link';
        a.textContent = title;
        
        // 点击平滑滚动
        a.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(id);
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    // 滚动监听更新 TOC 高亮
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 2. 返回顶部按钮
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 3. 反馈功能 (Global Scope)
window.submitFeedback = function(type) {
    const btns = document.querySelectorAll('.feedback-btn');
    btns.forEach(b => b.classList.remove('active'));
    
    // 简单的视觉反馈
    event.currentTarget.classList.add('active');
    
    const msg = document.getElementById('feedbackMsg');
    if (msg) {
        msg.style.display = 'block';
        msg.style.opacity = '0';
        setTimeout(() => {
            msg.style.transition = 'opacity 0.5s';
            msg.style.opacity = '1';
        }, 10);
    }
    
    console.log(`User feedback: ${type}`);
}

// 导航栏功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 46, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        }
        
        // 高亮当前部分
        highlightCurrentSection();
    });
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 更新活动链接
                updateActiveNavLink(link);
                
                // 移动端关闭菜单
                closeMobileMenu();
            }
        });
    });
}

// 高亮当前部分的导航链接
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// 更新活动导航链接
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// 平滑滚动功能
function initSmoothScroll() {
    // 为所有内部链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 标签页功能
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // 添加活动状态
            btn.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// 动态效果
function initAnimations() {
    // 观察器 - 当元素进入视口时触发动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为卡片和部分添加动画
    const animatedElements = document.querySelectorAll('.card, .build-card, .technique-category, .skill-level');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 浮动卡牌动画增强
    enhanceFloatingCards();
}

// 增强浮动卡牌效果
function enhanceFloatingCards() {
    const floatingCards = document.querySelectorAll('.card-joker, .card-planet, .card-spectral, .card-egg');
    
    floatingCards.forEach((card, index) => {
        // 添加鼠标跟随效果
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const cardRect = card.getBoundingClientRect();
            const cardX = cardRect.left + cardRect.width / 2;
            const cardY = cardRect.top + cardRect.height / 2;
            
            const deltaX = (mouseX - cardX) * 0.02;
            const deltaY = (mouseY - cardY) * 0.02;
            
            card.style.transform = `translate(${deltaX}px, ${deltaY}px) translateY(-20px) rotate(${5 + index * 2}deg)`;
        });
    });
}

// 移动端菜单
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            toggleMobileMenu();
        });
        
        // 点击菜单外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // 防止背景滚动
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// 扑克牌型展示
function initPokerHands() {
    const handCards = document.querySelectorAll('.hand-card');
    
    handCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // 悬停时显示详细信息
            showHandDetails(card);
        });
        
        card.addEventListener('mouseleave', () => {
            hideHandDetails(card);
        });
        
        // 点击切换详细信息
        card.addEventListener('click', () => {
            toggleHandDetails(card);
        });
    });
}

function showHandDetails(card) {
    // 添加悬停效果和详细信息
    card.style.transform = 'translateY(-10px) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
}

function hideHandDetails(card) {
    card.style.transform = '';
    card.style.boxShadow = '';
}

function toggleHandDetails(card) {
    const handType = card.getAttribute('data-hand');
    
    // 可以在这里添加更详细的牌型信息展示
    console.log(`查看 ${handType} 的详细信息`);
}

// 工具提示
function initTooltips() {
    // 为需要提示的元素添加工具提示
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    // 定位工具提示
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        document.body.removeChild(e.target._tooltip);
        delete e.target._tooltip;
    }
}

// 全局滚动到指定部分函数
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 扑克牌型计算器（简化版）
function calculateHandValue(handType) {
    const handValues = {
        'high-card': 5,
        'pair': 10,
        'two-pair': 20,
        'three-kind': 30,
        'straight': 30,
        'flush': 35,
        'full-house': 40,
        'four-kind': 60,
        'straight-flush': 100
    };
    
    return handValues[handType] || 0;
}

// 卡牌效果展示器
function showCardEffect(cardType, effect) {
    const effectDisplay = document.createElement('div');
    effectDisplay.className = 'card-effect-display';
    effectDisplay.innerHTML = `
        <div class="effect-popup">
            <h4>${cardType} 效果</h4>
            <p>${effect}</p>
            <button onclick="this.parentElement.parentElement.remove()">关闭</button>
        </div>
    `;
    
    document.body.appendChild(effectDisplay);
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (effectDisplay.parentElement) {
            effectDisplay.remove();
        }
    }, 3000);
}

// 随机提示系统
const gameTips = [
    "记住：同花顺是最强的基础牌型！",
    "小丑牌的选择要符合你的策略方向",
    "合理利用星球卡升级你的主力牌型",
    "不要忽视防御盲注的特殊效果",
    "连锁反应是获得高分的关键",
    "金币要合理分配，不要全部花光",
    "根据盲注类型调整你的卡组",
    "保持手牌组合的灵活性很重要",
    "了解每种BOSS的弱点是关键",
    "不要害怕尝试新的卡牌组合"
];

function showRandomTip() {
    const randomTip = gameTips[Math.floor(Math.random() * gameTips.length)];
    
    // 可以集成到页面中的提示系统
    console.log('游戏提示:', randomTip);
    
    // 如果页面有提示区域，在这里更新
    const tipArea = document.querySelector('.tip-area');
    if (tipArea) {
        tipArea.textContent = randomTip;
    }
}

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // Alt + 数字键快速导航到对应部分
    if (e.altKey) {
        const shortcuts = {
            '1': '#basics',
            '2': '#cards',
            '3': '#chips',
            '4': '#blinds',
            '5': '#strategy',
            '6': '#advanced',
            '7': '#builds'
        };
        
        if (shortcuts[e.key]) {
            e.preventDefault();
            scrollToSection(shortcuts[e.key].substring(1));
        }
    }
    
    // ESC键关闭弹窗
    if (e.key === 'Escape') {
        closeAllPopups();
    }
});

function closeAllPopups() {
    const popups = document.querySelectorAll('.popup, .tooltip, .card-effect-display');
    popups.forEach(popup => popup.remove());
}

// 页面性能优化
function optimizePage() {
    // 懒加载图片（如果有的话）
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 主题切换功能（预留）
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    
    // 保存用户偏好
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
}

// 加载保存的主题偏好
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(`${savedTheme}-theme`);
    }
}

// 初始化主题
loadThemePreference();

// 初始化性能优化
optimizePage();

// 定期显示随机提示（可选）
// setInterval(showRandomTip, 30000); // 每30秒显示一次提示

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});

// 导出主要函数供全局使用
window.BalatroGuide = {
    scrollToSection,
    showCardEffect,
    calculateHandValue,
    toggleTheme,
    showRandomTip
};