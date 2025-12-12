// Balatro组合指南交互功能
document.addEventListener('DOMContentLoaded', function() {
    initializeCombosPage();
});

function initializeCombosPage() {
    initCategoryFilter();
    initComboBuilder();
    initAnimations();
    initTooltips();
}

// 分类筛选功能
function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const comboCards = document.querySelectorAll('.combo-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 筛选组合卡片
            filterComboCards(category, comboCards);
        });
    });
}

function filterComboCards(category, comboCards) {
    comboCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            // 添加动画效果
            setTimeout(() => {
                card.classList.add('animate');
            }, 100);
        } else {
            card.classList.add('hidden');
            card.classList.remove('animate');
        }
    });
}

// 组合构建器
let currentCombo = [];

function initComboBuilder() {
    // 添加卡牌功能
    window.addCardToBuilder = addCardToBuilder;
    window.removeCardFromBuilder = removeCardFromBuilder;
}

function addCardToBuilder() {
    const cardSelector = document.getElementById('card-selector');
    const selectedValue = cardSelector.value;
    
    if (!selectedValue) {
        showNotification('请先选择一张卡牌', 'warning');
        return;
    }
    
    // 检查是否已经添加
    if (currentCombo.includes(selectedValue)) {
        showNotification('这张卡牌已经在组合中了', 'info');
        return;
    }
    
    // 添加到当前组合
    currentCombo.push(selectedValue);
    
    // 更新显示
    updateBuilderDisplay();
    
    // 分析组合
    analyzeCurrentCombo();
    
    // 清空选择器
    cardSelector.value = '';
    
    showNotification('卡牌已添加到组合', 'success');
}

function removeCardFromBuilder(cardValue) {
    currentCombo = currentCombo.filter(card => card !== cardValue);
    updateBuilderDisplay();
    analyzeCurrentCombo();
}

function updateBuilderDisplay() {
    const container = document.getElementById('cards-container');
    
    if (currentCombo.length === 0) {
        container.innerHTML = '<p class="empty-state">还未添加任何卡牌</p>';
        container.classList.remove('has-cards');
        return;
    }
    
    container.classList.add('has-cards');
    
    const cardsHTML = currentCombo.map(cardValue => {
        const cardName = getCardName(cardValue);
        return `
            <div class="builder-card">
                ${cardName}
                <button onclick="removeCardFromBuilder('${cardValue}')" title="移除">×</button>
            </div>
        `;
    }).join('');
    
    container.innerHTML = cardsHTML;
}

function getCardName(cardValue) {
    const cardNames = {
        'joker-red': '红色小丑',
        'joker-blue': '蓝色小丑',
        'joker-green': '绿色小丑',
        'planet-ace': '王牌星球',
        'planet-king': 'K王星球',
        'tarot-strength': '力量塔罗',
        'spectral-ectoplasm': '幽灵胶质'
    };
    return cardNames[cardValue] || cardValue;
}

function analyzeCurrentCombo() {
    const analysisContainer = document.getElementById('combo-analysis');
    const resultContainer = analysisContainer.querySelector('.analysis-result');
    
    if (currentCombo.length < 2) {
        resultContainer.innerHTML = '<p>请先添加至少2张卡牌进行分析</p>';
        resultContainer.classList.remove('has-analysis');
        updateScores(0, 0, 0, 0);
        return;
    }
    
    // 执行组合分析
    const analysis = performComboAnalysis();
    
    // 更新分析结果
    resultContainer.innerHTML = generateAnalysisHTML(analysis);
    resultContainer.classList.add('has-analysis');
    
    // 更新评分
    updateScores(analysis.synergy, analysis.burst, analysis.stability, analysis.growth);
}

function performComboAnalysis() {
    // 模拟组合分析逻辑
    const cardCount = currentCombo.length;
    
    // 协调性分析：基于卡牌数量和类型匹配
    let synergy = Math.min(cardCount * 15, 25);
    
    // 爆发力分析：检查是否有高倍数卡牌
    let burst = cardCount >= 3 ? Math.random() * 15 + 10 : Math.random() * 10 + 5;
    
    // 稳定性分析：检查平衡性
    let stability = Math.max(25 - Math.abs(cardCount - 4) * 5, 10);
    
    // 成长性分析：检查升级潜力
    let growth = Math.random() * 10 + 15;
    
    return {
        synergy: Math.round(synergy),
        burst: Math.round(burst),
        stability: Math.round(stability),
        growth: Math.round(growth),
        recommendations: generateRecommendations()
    };
}

function generateAnalysisHTML(analysis) {
    return `
        <div class="analysis-content">
            <h5>组合评分</h5>
            <div class="analysis-scores">
                <div class="score-item">
                    <span>协调性:</span>
                    <span class="score">${analysis.synergy}/25</span>
                </div>
                <div class="score-item">
                    <span>爆发力:</span>
                    <span class="score">${analysis.burst}/25</span>
                </div>
                <div class="score-item">
                    <span>稳定性:</span>
                    <span class="score">${analysis.stability}/25</span>
                </div>
                <div class="score-item">
                    <span>成长性:</span>
                    <span class="score">${analysis.growth}/25</span>
                </div>
            </div>
            
            <h5>改进建议</h5>
            <div class="recommendations">
                ${analysis.recommendations.map(rec => `<div class="recommendation">• ${rec}</div>`).join('')}
            </div>
        </div>
    `;
}

function generateRecommendations() {
    const recommendations = [];
    
    if (currentCombo.length < 3) {
        recommendations.push('考虑添加更多卡牌来增强组合效果');
    }
    
    if (currentCombo.length > 6) {
        recommendations.push('卡牌数量较多，建议精简组合以提高效率');
    }
    
    // 检查卡牌类型平衡
    const jokers = currentCombo.filter(card => card.includes('joker')).length;
    const planets = currentCombo.filter(card => card.includes('planet')).length;
    
    if (jokers > planets * 2) {
        recommendations.push('小丑牌过多，建议添加一些辅助卡牌');
    } else if (planets > jokers) {
        recommendations.push('辅助卡牌过多，考虑添加核心小丑牌');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('组合看起来很不错，继续优化细节吧！');
    }
    
    return recommendations;
}

function updateScores(synergy, burst, stability, growth) {
    // 更新评分显示
    const elements = {
        'synergy-score': synergy,
        'burst-score': burst,
        'stability-score': stability,
        'growth-score': growth
    };
    
    Object.entries(elements).forEach(([id, score]) => {
        const element = document.getElementById(id);
        const scoreFill = element.parentElement.querySelector('.score-fill');
        
        if (element && scoreFill) {
            element.textContent = score;
            const percentage = (score / 25) * 100;
            scoreFill.style.width = percentage + '%';
            
            // 添加动画效果
            scoreFill.classList.add('animate');
            setTimeout(() => {
                scoreFill.classList.remove('animate');
            }, 500);
        }
    });
    
    // 更新总分
    const totalScore = synergy + burst + stability + growth;
    const totalElement = document.getElementById('total-score');
    if (totalElement) {
        totalElement.textContent = `${totalScore}/100`;
        totalElement.classList.add('updated');
        setTimeout(() => {
            totalElement.classList.remove('updated');
        }, 500);
    }
}

// 动画功能
function initAnimations() {
    // 观察器 - 卡片进入视口时动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // 观察所有组合卡片
    const comboCards = document.querySelectorAll('.combo-card');
    comboCards.forEach(card => {
        observer.observe(card);
    });
    
    // 特色组合动画
    animateFeaturedCombo();
}

function animateFeaturedCombo() {
    const cardSlots = document.querySelectorAll('.card-slot');
    cardSlots.forEach((slot, index) => {
        setTimeout(() => {
            slot.style.transform = 'translateY(0)';
            slot.style.opacity = '1';
        }, index * 200);
    });
}

// 工具提示功能
function initTooltips() {
    // 为小丑牌、星球卡等添加工具提示
    const tooltipElements = {
        '.combo-difficulty': '表示该组合的难度等级',
        '.stat-value': '点击查看详细数据',
        '.performance-bar': '显示性能指标的数值'
    };
    
    Object.entries(tooltipElements).forEach(([selector, text]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.setAttribute('title', text);
        });
    });
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// 预设组合加载
function loadPresetCombo(comboType) {
    const presets = {
        'beginner-stable': ['joker-blue', 'joker-green', 'planet-ace'],
        'intermediate-burst': ['joker-red', 'joker-blue', 'planet-king', 'tarot-strength'],
        'expert-perfect': ['joker-red', 'joker-blue', 'joker-green', 'planet-ace', 'planet-king', 'tarot-strength', 'spectral-ectoplasm']
    };
    
    const preset = presets[comboType];
    if (preset) {
        currentCombo = [...preset];
        updateBuilderDisplay();
        analyzeCurrentCombo();
        showNotification(`已加载${getComboTypeName(comboType)}预设组合`, 'success');
    }
}

function getComboTypeName(comboType) {
    const names = {
        'beginner-stable': '新手稳定',
        'intermediate-burst': '进阶爆发',
        'expert-perfect': '专家完美'
    };
    return names[comboType] || '未知';
}

// 组合分享功能
function shareCurrentCombo() {
    if (currentCombo.length === 0) {
        showNotification('请先构建一个组合', 'warning');
        return;
    }
    
    const comboData = {
        cards: currentCombo,
        timestamp: new Date().toISOString(),
        scores: getCurrentScores()
    };
    
    const shareText = `我的Balatro组合: ${currentCombo.map(getCardName).join(' + ')}`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
        showNotification('组合已复制到剪贴板', 'success');
    }).catch(() => {
        // 降级方案：显示文本让用户手动复制
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('组合已复制到剪贴板', 'success');
    });
}

function getCurrentScores() {
    return {
        synergy: parseInt(document.getElementById('synergy-score').textContent) || 0,
        burst: parseInt(document.getElementById('burst-score').textContent) || 0,
        stability: parseInt(document.getElementById('stability-score').textContent) || 0,
        growth: parseInt(document.getElementById('growth-score').textContent) || 0
    };
}

// 组合导出功能
function exportCombo() {
    if (currentCombo.length === 0) {
        showNotification('请先构建一个组合', 'warning');
        return;
    }
    
    const comboData = {
        name: '自定义组合',
        cards: currentCombo,
        cardNames: currentCombo.map(getCardName),
        scores: getCurrentScores(),
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(comboData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balatro-combo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('组合已导出', 'success');
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl+S 保存组合
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportCombo();
    }
    
    // Ctrl+Shift+C 清空组合
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearCurrentCombo();
    }
    
    // 数字键快速筛选
    if (e.key >= '1' && e.key <= '5') {
        const filterMap = {
            '1': 'all',
            '2': 'beginner',
            '3': 'intermediate',
            '4': 'expert',
            '5': 'specific'
        };
        
        const category = filterMap[e.key];
        if (category) {
            const btn = document.querySelector(`[data-category="${category}"]`);
            if (btn) {
                btn.click();
            }
        }
    }
});

function clearCurrentCombo() {
    currentCombo = [];
    updateBuilderDisplay();
    analyzeCurrentCombo();
    showNotification('组合已清空', 'info');
}

// 错误处理
window.addEventListener('error', (e) => {
    console.error('组合页面错误:', e.error);
    showNotification('页面发生错误，请刷新重试', 'danger');
});

// 导出主要函数
window.BalatroCombos = {
    loadPresetCombo,
    shareCurrentCombo,
    exportCombo,
    showNotification
};

// 添加通知样式
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-hover);
    padding: 1rem 1.5rem;
    max-width: 300px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 10000;
    border-left: 4px solid var(--accent-color);
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left-color: #28a745;
}

.notification.warning {
    border-left-color: #ffc107;
}

.notification.danger {
    border-left-color: #dc3545;
}

.notification-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.notification-message {
    color: var(--text-dark);
    font-size: 0.9rem;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-gray);
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    color: var(--text-dark);
}

.analysis-scores {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.score-item {
    display: contents;
}

.score-item span:first-child {
    color: var(--text-gray);
}

.score-item .score {
    color: var(--accent-color);
    font-weight: 600;
}

.recommendations {
    margin-top: 1rem;
}

.recommendation {
    padding: 0.25rem 0;
    color: var(--text-dark);
    font-size: 0.9rem;
}

.analysis-content h5 {
    color: var(--primary-color);
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
}

.total-score-value.updated {
    animation: pulse 0.5s ease;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.score-fill.animate {
    animation: fillBar 0.8s ease;
}

@keyframes fillBar {
    0% { width: 0%; }
    100% { width: var(--target-width); }
}
</style>
`;

// 动态添加样式
document.head.insertAdjacentHTML('beforeend', notificationStyles);