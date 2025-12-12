// Balatro计算器功能
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
});

function initializeCalculator() {
    // 基础筹码值
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

    // 获取DOM元素
    const handTypeSelect = document.getElementById('hand-type');
    const handCountInput = document.getElementById('hand-count');
    const cardMultInput = document.getElementById('card-mult');
    const jokerMultInput = document.getElementById('joker-mult');
    const otherMultInput = document.getElementById('other-mult');
    const blindRequirementInput = document.getElementById('blind-requirement');

    // 绑定事件监听器
    [handTypeSelect, handCountInput, cardMultInput, jokerMultInput, otherMultInput, blindRequirementInput]
        .forEach(element => {
            if (element) {
                element.addEventListener('input', updateCalculations);
            }
        });

    // 初始化计算
    updateCalculations();
}

function updateCalculations() {
    updateBaseChips();
    updateMultiplier();
    updateFinalScore();
    updateBlindComparison();
}

function updateBaseChips() {
    const handType = document.getElementById('hand-type').value;
    const handCount = parseInt(document.getElementById('hand-count').value) || 1;
    
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

    const baseValue = handValues[handType] || 0;
    const totalChips = baseValue * handCount;
    
    const resultElement = document.getElementById('base-chips');
    if (resultElement) {
        resultElement.textContent = totalChips.toLocaleString();
        addUpdateAnimation(resultElement);
    }
}

function updateMultiplier() {
    const cardMult = parseFloat(document.getElementById('card-mult').value) || 1;
    const jokerMult = parseFloat(document.getElementById('joker-mult').value) || 1;
    const otherMult = parseFloat(document.getElementById('other-mult').value) || 1;
    
    const totalMult = cardMult * jokerMult * otherMult;
    
    const resultElement = document.getElementById('total-mult');
    if (resultElement) {
        resultElement.textContent = totalMult.toFixed(1) + 'x';
        addUpdateAnimation(resultElement);
    }
    
    return totalMult;
}

function updateFinalScore() {
    const baseChips = parseInt(document.getElementById('base-chips').textContent.replace(/,/g, '')) || 0;
    const totalMult = updateMultiplier(); // 获取最新的倍数
    
    const finalScore = Math.floor(baseChips * totalMult);
    
    const resultElement = document.getElementById('final-score');
    if (resultElement) {
        resultElement.textContent = finalScore.toLocaleString();
        addUpdateAnimation(resultElement);
    }
    
    // 更新中间显示
    const chipsElement = document.getElementById('final-chips');
    const multElement = document.getElementById('final-mult');
    
    if (chipsElement) {
        chipsElement.textContent = baseChips.toLocaleString();
        addUpdateAnimation(chipsElement);
    }
    
    if (multElement) {
        multElement.textContent = totalMult.toFixed(1) + 'x';
        addUpdateAnimation(multElement);
    }
}

function updateBlindComparison() {
    const finalScore = parseInt(document.getElementById('final-score').textContent.replace(/,/g, '')) || 0;
    const blindRequirement = parseInt(document.getElementById('blind-requirement').value) || 0;
    
    const comparisonElement = document.getElementById('blind-comparison');
    
    if (comparisonElement && blindRequirement > 0) {
        const ratio = finalScore / blindRequirement;
        const comparisonValue = comparisonElement.querySelector('.comparison-value');
        
        if (ratio >= 1.5) {
            comparisonElement.className = 'result-comparison success';
            comparisonValue.textContent = `✓ 轻松获胜 (${(ratio * 100).toFixed(0)}%)`;
        } else if (ratio >= 1.0) {
            comparisonElement.className = 'result-comparison warning';
            comparisonValue.textContent = `✓ 险胜 (${(ratio * 100).toFixed(0)}%)`;
        } else {
            comparisonElement.className = 'result-comparison danger';
            comparisonValue.textContent = `✗ 失败 (${(ratio * 100).toFixed(0)}%)`;
        }
    }
}

function addUpdateAnimation(element) {
    element.classList.add('updated');
    setTimeout(() => {
        element.classList.remove('updated');
    }, 500);
}

// 预设组合功能
function loadPresetCombination(presetType) {
    const combinations = {
        'royal-flush': {
            handType: 'straight-flush',
            handCount: 1,
            cardMult: 2.0,
            jokerMult: 2.0,
            otherMult: 1.5,
            blindRequirement: 2000
        },
        'four-kind': {
            handType: 'four-kind',
            handCount: 1,
            cardMult: 1.5,
            jokerMult: 2.0,
            otherMult: 1.2,
            blindRequirement: 1500
        },
        'full-house': {
            handType: 'full-house',
            handCount: 1,
            cardMult: 1.3,
            jokerMult: 1.8,
            otherMult: 1.1,
            blindRequirement: 1000
        },
        'flush': {
            handType: 'flush',
            handCount: 1,
            cardMult: 1.2,
            jokerMult: 1.5,
            otherMult: 1.0,
            blindRequirement: 800
        }
    };
    
    const preset = combinations[presetType];
    if (preset) {
        document.getElementById('hand-type').value = preset.handType;
        document.getElementById('hand-count').value = preset.handCount;
        document.getElementById('card-mult').value = preset.cardMult;
        document.getElementById('joker-mult').value = preset.jokerMult;
        document.getElementById('other-mult').value = preset.otherMult;
        document.getElementById('blind-requirement').value = preset.blindRequirement;
        
        updateCalculations();
        
        // 显示加载成功提示
        showNotification(`已加载 ${getPresetName(presetType)} 组合`, 'success');
    }
}

function getPresetName(presetType) {
    const names = {
        'royal-flush': '皇家同花顺',
        'four-kind': '四条',
        'full-house': '满堂彩',
        'flush': '同花'
    };
    return names[presetType] || '未知组合';
}

// 高级计算功能
function calculateOptimalHand() {
    const blindRequirement = parseInt(document.getElementById('blind-requirement').value) || 0;
    if (blindRequirement <= 0) {
        showNotification('请先输入盲注要求', 'warning');
        return;
    }
    
    // 模拟不同牌型的效果
    const handTypes = ['straight-flush', 'four-kind', 'full-house', 'flush', 'straight'];
    const multipliers = [1.0, 1.2, 1.5, 1.8, 2.0, 2.5, 3.0];
    
    const results = [];
    
    handTypes.forEach(handType => {
        multipliers.forEach(mult => {
            const chips = getHandValue(handType);
            const score = Math.floor(chips * mult);
            const successRate = Math.min(score / blindRequirement, 2.0); // 限制最高200%
            
            results.push({
                handType,
                chips,
                multiplier: mult,
                score,
                successRate,
                efficiency: score / (chips * mult) // 效率评估
            });
        });
    });
    
    // 排序并推荐最佳方案
    results.sort((a, b) => b.successRate - a.successRate);
    
    displayOptimalResults(results.slice(0, 5)); // 显示前5个最佳方案
}

function getHandValue(handType) {
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

function displayOptimalResults(results) {
    const modal = createModal('推荐方案', generateResultsHTML(results));
    document.body.appendChild(modal);
}

function generateResultsHTML(results) {
    let html = '<div class="optimal-results">';
    html += '<h4>基于你的盲注要求的最佳方案:</h4>';
    
    results.forEach((result, index) => {
        const handName = getHandTypeName(result.handType);
        const successClass = result.successRate >= 1.5 ? 'success' : result.successRate >= 1.0 ? 'warning' : 'danger';
        
        html += `
            <div class="optimal-result ${successClass}">
                <div class="result-rank">#${index + 1}</div>
                <div class="result-details">
                    <h5>${handName}</h5>
                    <div class="result-stats">
                        <span>筹码: ${result.chips}</span>
                        <span>倍数: ${result.multiplier}x</span>
                        <span>总分: ${result.score.toLocaleString()}</span>
                        <span>成功率: ${(result.successRate * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function getHandTypeName(handType) {
    const names = {
        'high-card': '高牌',
        'pair': '一对',
        'two-pair': '两对',
        'three-kind': '三条',
        'straight': '顺子',
        'flush': '同花',
        'full-house': '满堂彩',
        'four-kind': '四条',
        'straight-flush': '同花顺'
    };
    return names[handType] || handType;
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// 模态框创建
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// 数据导出功能
function exportCalculationData() {
    const data = {
        timestamp: new Date().toISOString(),
        handType: document.getElementById('hand-type').value,
        handCount: document.getElementById('hand-count').value,
        cardMult: document.getElementById('card-mult').value,
        jokerMult: document.getElementById('joker-mult').value,
        otherMult: document.getElementById('other-mult').value,
        blindRequirement: document.getElementById('blind-requirement').value,
        finalScore: document.getElementById('final-score').textContent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balatro-calculation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('计算数据已导出', 'success');
}

// 添加键盘快捷键
document.addEventListener('keydown', (e) => {
    // Ctrl+E 导出数据
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportCalculationData();
    }
    
    // Ctrl+O 计算最优方案
    if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        calculateOptimalHand();
    }
    
    // ESC 关闭模态框
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
});

// 工具函数
function formatNumber(num) {
    return num.toLocaleString();
}

function parseNumber(value, defaultValue = 0) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

// 错误处理
window.addEventListener('error', (e) => {
    console.error('计算器错误:', e.error);
    showNotification('计算器发生错误，请刷新页面重试', 'danger');
});

// 导出主要函数
window.BalatroCalculator = {
    loadPresetCombination,
    calculateOptimalHand,
    exportCalculationData,
    showNotification
};