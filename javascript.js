let skillCount = 0;
let roleImageData = '';
let colorTemplates = [];
let editingTemplateId = null;

// 默认模板数据
const defaultTemplates = [
    { id: '1', name: '深曜黑', primary: '#0B0E11', accent: '#941919', accent2: '#C2A35A', description: '深曜黑 + 暗藏红 + 冷金' },
    { id: '2', name: '墨绿黑', primary: '#0F1A14', accent: '#1F5E4A', accent2: '#E6C76E', description: '墨绿黑 + 深祖母绿 + 奢靡金' },
    { id: '3', name: '灰蓝白', primary: '#42494D', accent: '#8A8F92', accent2: '#E6E1A3', description: '灰蓝白 + 混浊灰 + 病态淡黄' },
    { id: '4', name: '脏紫黑', primary: '#1A1420', accent: '#892979', accent2: '#4FB3C6', description: '脏紫黑 + 霓虹洋红 + 冷屏蓝' },
    { id: '5', name: '深棕金', primary: '#2C1810', accent: '#8B4513', accent2: '#D4AF37', description: '深棕 + 棕色 + 金色' },
    { id: '6', name: '深海蓝', primary: '#1A1A2E', accent: '#16213E', accent2: '#0F3460', description: '深蓝 + 蓝紫 + 海军蓝' },
    { id: '7', name: '深红', primary: '#2D1B1B', accent: '#8B0000', accent2: '#FF4500', description: '深红黑 + 深红 + 橙红' },
    { id: '8', name: '经典灰', primary: '#1C1C1C', accent: '#4A4A4A', accent2: '#C0C0C0', description: '炭黑 + 中灰 + 银灰' },
    { id: '9', name: '神秘紫', primary: '#1B1B2F', accent: '#533483', accent2: '#9B59B6', description: '深紫黑 + 深紫 + 紫色' },
    { id: '10', name: '森林绿', primary: '#0D2818', accent: '#1B5E20', accent2: '#4CAF50', description: '深绿 + 深绿 + 绿色' }
];

// 加载模板数据
function loadTemplates() {
    const saved = localStorage.getItem('colorTemplates');
    if (saved) {
        try {
            colorTemplates = JSON.parse(saved);
        } catch (e) {
            colorTemplates = [...defaultTemplates];
        }
    } else {
        colorTemplates = [...defaultTemplates];
    }
    renderTemplates();
}

// 保存模板数据
function saveTemplates() {
    localStorage.setItem('colorTemplates', JSON.stringify(colorTemplates));
}

// 渲染模板按钮
function renderTemplates() {
    const container = document.getElementById('colorTemplates');
    container.innerHTML = '';
    
    colorTemplates.forEach(template => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'template-btn';
        btn.textContent = template.name;
        btn.title = template.description || `${template.name} - 双击重命名，右键保存当前配色`;
        btn.dataset.templateId = template.id;
        
        // 点击应用模板
        btn.addEventListener('click', function(e) {
            if (editingTemplateId !== template.id) {
                applyTemplate(template.primary, template.accent, template.accent2, template.id);
            }
        });
        
        // 双击重命名
        btn.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            renameTemplate(template.id);
        });
        
        // 右键保存当前配色到模板
        btn.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            updateTemplateColors(template.id);
        });
        
        container.appendChild(btn);
    });
}

// 应用模板
function applyTemplate(primaryColor, accentColor, accentColor2, templateId = null) {
    document.getElementById('primaryColor').value = primaryColor;
    document.getElementById('accentColor').value = accentColor;
    document.getElementById('accentColor2').value = accentColor2;
    updateColors();
    
    // 如果提供了模板ID，标记为正在编辑（避免双击时触发点击）
    if (templateId) {
        editingTemplateId = templateId;
        setTimeout(() => {
            editingTemplateId = null;
        }, 300);
    }
}

// 保存当前配色为新模板
function saveCurrentColors() {
    const name = prompt('请输入模板名称：', '新模板');
    if (!name || name.trim() === '') return;
    
    const primary = document.getElementById('primaryColor').value;
    const accent = document.getElementById('accentColor').value;
    const accent2 = document.getElementById('accentColor2').value;
    
    const newTemplate = {
        id: Date.now().toString(),
        name: name.trim(),
        primary: primary,
        accent: accent,
        accent2: accent2,
        description: `${name} - 主色: ${primary}, 辅助色: ${accent}, 点缀色: ${accent2}`
    };
    
    colorTemplates.push(newTemplate);
    saveTemplates();
    renderTemplates();
    
    alert(`模板 "${name}" 已保存！`);
}

// 更新模板的配色
function updateTemplateColors(templateId) {
    const template = colorTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    if (confirm(`确定要用当前配色更新模板 "${template.name}" 吗？`)) {
        template.primary = document.getElementById('primaryColor').value;
        template.accent = document.getElementById('accentColor').value;
        template.accent2 = document.getElementById('accentColor2').value;
        template.description = `${template.name} - 主色: ${template.primary}, 辅助色: ${template.accent}, 点缀色: ${template.accent2}`;
        
        saveTemplates();
        renderTemplates();
        
        alert(`模板 "${template.name}" 已更新！`);
    }
}

// 重命名模板
function renameTemplate(templateId) {
    const template = colorTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const newName = prompt('请输入新名称：', template.name);
    if (!newName || newName.trim() === '') return;
    
    template.name = newName.trim();
    template.description = `${template.name} - 主色: ${template.primary}, 辅助色: ${template.accent}, 点缀色: ${template.accent2}`;
    
    saveTemplates();
    renderTemplates();
}

document.addEventListener('DOMContentLoaded', function() {
    // 加载模板
    loadTemplates();
    document.getElementById('roleName').addEventListener('input', updatePreview);
    document.getElementById('cardId').addEventListener('input', updatePreview);
    document.getElementById('primaryColor').addEventListener('input', updateColors);
    document.getElementById('accentColor').addEventListener('input', updateColors);
    document.getElementById('accentColor2').addEventListener('input', updateColors);
    document.getElementById('spacingSize').addEventListener('input', updateSpacingSize);
    document.getElementById('imageHeight').addEventListener('input', updateImageHeight);
    
    // 监听技能标题输入框，标记为手动编辑
    const skillTitleInput = document.getElementById('skillSectionTitle');
    if (skillTitleInput) {
        skillTitleInput.addEventListener('input', function() {
            this.dataset.manuallyEdited = 'true';
            updatePreview();
        });
    }
    
    // 初始化文字样式
    const styleItems = ['roleName', 'sectionTitle', 'skillName', 'skillDesc', 'skillCost', 'cardId', 'cardSet'];
    styleItems.forEach(item => {
        const sizeInput = document.getElementById(item + 'Size');
        const fontInput = document.getElementById(item + 'Font');
        const boldInput = document.getElementById(item + 'Bold');
        const scaleInput = document.getElementById(item + 'Scale');
        if (sizeInput) sizeInput.addEventListener('input', () => updateTextStyle(item));
        if (fontInput) fontInput.addEventListener('change', () => updateTextStyle(item));
        if (boldInput) boldInput.addEventListener('change', () => updateTextStyle(item));
        if (scaleInput) scaleInput.addEventListener('input', () => updateTextStyle(item));
        // 应用默认样式
        updateTextStyle(item);
    });
    
    document.getElementById('previewScaleValue').textContent = document.getElementById('previewScale').value + '%';
    
    // 应用默认颜色
    updateColors();
    
    // 初始化配图框高度
    updateImageHeight();
    
    loadExample();
});

function showCard(side) {
    const front = document.getElementById('roleCard');
    const back = document.getElementById('cardBack');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (side === 'front') {
        front.style.display = 'flex';
        back.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        front.style.display = 'none';
        back.style.display = 'flex';
        tabs[1].classList.add('active');
    }
}

function addSkill(name = '', desc = '', cost = '') {
    const container = document.getElementById('skillsContainer');
    const id = ++skillCount;
    
    container.insertAdjacentHTML('beforeend', `
        <div class="item-card" id="skill-${id}">
            <button class="delete-btn" onclick="removeItem('skill-${id}')">×</button>
            <div class="form-group">
                <label>名称</label>
                <input type="text" id="skillName-${id}" placeholder="技能名称" value="${name}" oninput="updatePreview()">
            </div>
            <div class="form-group">
                <label>效果</label>
                <textarea id="skillDesc-${id}" placeholder="技能效果" rows="2" oninput="updatePreview()">${desc}</textarea>
            </div>
            <div class="form-group">
                <label>消耗</label>
                <input type="text" id="skillCost-${id}" placeholder="消耗" value="${cost}" oninput="updatePreview()">
            </div>
        </div>
    `);
    updatePreview();
}


function removeItem(id) {
    document.getElementById(id)?.remove();
    updatePreview();
}

function updateSkillTitleByCardSet() {
    const cardSet = document.getElementById('cardSet').value || '角色卡';
    const skillTitleInput = document.getElementById('skillSectionTitle');
    if (skillTitleInput && !skillTitleInput.dataset.manuallyEdited) {
        // 如果用户没有手动编辑过，则根据卡牌系列自动设置
        if (cardSet.includes('决策')) {
            skillTitleInput.value = '📋 决策';
        } else if (cardSet.includes('角色')) {
            skillTitleInput.value = '⚔ 技能';
        }
    }
    updatePreview();
}

function updatePreview() {
    document.getElementById('displayRoleName').textContent = 
        document.getElementById('roleName').value || '未命名';
    document.getElementById('displayCardId').textContent = 
        document.getElementById('cardId').value || 'R-000';
    document.getElementById('displayCardSet').textContent = 
        document.getElementById('cardSet').value || '角色卡';
    
    // 更新技能标题
    const skillTitle = document.getElementById('skillSectionTitle')?.value || '⚔ 技能';
    document.getElementById('displaySkillTitle').textContent = skillTitle;

    // 技能
    const skillsHtml = [];
    document.querySelectorAll('[id^="skill-"]').forEach(el => {
        const id = el.id.split('-')[1];
        const name = document.getElementById(`skillName-${id}`)?.value;
        const desc = document.getElementById(`skillDesc-${id}`)?.value;
        const cost = document.getElementById(`skillCost-${id}`)?.value;
        
        if (name) {
            skillsHtml.push(`
                <div class="skill-item">
                    <div class="skill-header">
                        <span class="skill-name">${name}</span>
                        ${cost ? `<span class="skill-cost">${cost}</span>` : ''}
                    </div>
                    <div class="skill-desc">${desc || ''}</div>
                </div>
            `);
        }
    });
    document.getElementById('displaySkills').innerHTML = 
        skillsHtml.join('') || '<div style="color:#999;font-size:0.8rem;">暂无技能</div>';
}

function updateColors() {
    const primary = document.getElementById('primaryColor').value;
    const accent = document.getElementById('accentColor').value;
    const accent2 = document.getElementById('accentColor2').value;
    const card = document.getElementById('roleCard');
    const cardBack = document.getElementById('cardBack');
    
    // 计算主色深色版本（用于渐变）
    const primaryDark = adjustColor(primary, -20);
    const primaryLight = adjustColor(primary, 10);
    const accentDark = adjustColor(accent, -30);
    
    // 设置CSS变量
    card.style.setProperty('--primary-color', primary);
    card.style.setProperty('--primary-color-dark', primaryDark);
    card.style.setProperty('--primary-color-light', primaryLight);
    card.style.setProperty('--accent-color', accent);
    card.style.setProperty('--accent-color-dark', accentDark);
    card.style.setProperty('--accent-color2', accent2);
    
    // 更新卡牌边框和阴影
    card.style.boxShadow = `
        0 4px 12px rgba(0,0,0,0.3),
        inset 0 0 0 2px ${accent}
    `;
    card.style.borderColor = accent;
    
    cardBack.style.boxShadow = `
        0 4px 12px rgba(0,0,0,0.3),
        inset 0 0 0 2px ${accent}
    `;
    cardBack.style.borderColor = accent;
    cardBack.style.setProperty('--primary-color', primary);
    cardBack.style.setProperty('--primary-color-dark', primaryDark);
    cardBack.style.setProperty('--accent-color', accent);
    cardBack.style.setProperty('--accent-color2', accent2);
    
    // 更新四角装饰
    document.querySelectorAll('.corner-decoration').forEach(el => {
        el.style.borderColor = accent;
    });
    
    // 更新卡牌头部背景
    const header = document.querySelector('.card-header');
    if (header) {
        header.style.setProperty('--accent-color', accent);
        header.style.setProperty('--accent-color-dark', accentDark);
        header.style.setProperty('--accent-color2', accent2);
    }
    
    // 更新卡牌底部背景
    const footer = document.querySelector('.card-footer');
    if (footer) {
        footer.style.setProperty('--accent-color', accent);
        footer.style.setProperty('--accent-color-dark', accentDark);
        footer.style.setProperty('--accent-color2', accent2);
    }
    
    // 更新主题色元素
    document.querySelectorAll('.section-title').forEach(el => {
        el.style.setProperty('--accent-color2', accent2);
    });
    
    document.querySelectorAll('.skill-name').forEach(el => {
        el.style.setProperty('--accent-color', accent);
    });
    
    // 更新背面边框和文字颜色
    const cardBackEl = document.querySelector('.card-back');
    if (cardBackEl) {
        cardBackEl.style.setProperty('--back-border-color', accent2);
    }
    
    const backTitle = document.querySelector('.card-back-title');
    if (backTitle) {
        backTitle.style.color = accent2;
    }
    
    const backLogo = document.querySelector('.card-back-logo');
    if (backLogo) {
        backLogo.style.color = accent2;
    }
    
    // 更新卡牌编号颜色
    const cardSet = document.querySelector('.card-set');
    if (cardSet) {
        cardSet.style.setProperty('--accent-color2', accent2);
    }
}

function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0,2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2,2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4,2), 16) + amount));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function updateCardSize() {
    const width = parseInt(document.getElementById('cardWidth').value) || 252;
    const height = parseInt(document.getElementById('cardHeight').value) || 352;
    const card = document.getElementById('roleCard');
    const cardBack = document.getElementById('cardBack');
    
    card.style.width = width + 'px';
    card.style.height = height + 'px';
    cardBack.style.width = width + 'px';
    cardBack.style.height = height + 'px';
}

function updateImageHeight() {
    const imageHeight = parseInt(document.getElementById('imageHeight').value) || 120;
    const imageContainer = document.getElementById('roleImageContainer');
    if (imageContainer) {
        imageContainer.style.height = imageHeight + 'px';
    }
}

function applyPreset() {
    const preset = document.getElementById('cardPreset').value;
    const widthInput = document.getElementById('cardWidth');
    const heightInput = document.getElementById('cardHeight');
    let width = parseInt(widthInput.value) || 252;
    let height = parseInt(heightInput.value) || 352;
    
    switch(preset) {
        case '63:88':
            height = Math.round(width * 88 / 63);
            break;
        case '2:3':
            height = Math.round(width * 3 / 2);
            break;
        case '3:4':
            height = Math.round(width * 4 / 3);
            break;
        case '1:1':
            height = width;
            break;
        case '4:3':
            height = Math.round(width * 3 / 4);
            break;
        case 'custom':
            return;
    }
    
    widthInput.value = width;
    heightInput.value = height;
    updateCardSize();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            roleImageData = e.target.result;
            const img = document.getElementById('displayRoleImage');
            img.src = roleImageData;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeImage() {
    roleImageData = '';
    const img = document.getElementById('displayRoleImage');
    img.src = '';
    img.style.display = 'none';
    document.getElementById('roleImageInput').value = '';
}

// applyTemplate函数已在上面重新定义（支持templateId参数）

function updateSpacingSize() {
    const size = document.getElementById('spacingSize').value;
    const card = document.getElementById('roleCard');
    card.style.setProperty('--spacing-size', size + 'px');
}

function toggleCardSize() {
    const panel = document.getElementById('cardSizePanel');
    const toggle = document.getElementById('cardSizeToggle');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        panel.style.display = 'none';
        toggle.textContent = '▼';
    }
}

function toggleTextStyles() {
    const panel = document.getElementById('textStylesPanel');
    const toggle = document.getElementById('textStylesToggle');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        toggle.textContent = '▲';
    } else {
        panel.style.display = 'none';
        toggle.textContent = '▼';
    }
}

function toggleStyleItem(itemId) {
    const content = document.getElementById(itemId + 'Styles');
    const btn = event.target;
    if (content.style.display === 'none') {
        content.style.display = 'grid';
        btn.textContent = '收起';
    } else {
        content.style.display = 'none';
        btn.textContent = '展开';
    }
}

function camelToKebab(str) {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function updateTextStyle(itemType) {
    const card = document.getElementById('roleCard');
    const sizeInput = document.getElementById(itemType + 'Size');
    const fontInput = document.getElementById(itemType + 'Font');
    const boldInput = document.getElementById(itemType + 'Bold');
    const scaleInput = document.getElementById(itemType + 'Scale');
    
    const varPrefix = camelToKebab(itemType);
    
    if (sizeInput) {
        card.style.setProperty(`--${varPrefix}-size`, sizeInput.value + 'px');
    }
    if (fontInput) {
        card.style.setProperty(`--${varPrefix}-font`, fontInput.value);
    }
    if (boldInput) {
        card.style.setProperty(`--${varPrefix}-weight`, boldInput.checked ? 'bold' : 'normal');
    }
    // 为技能描述、技能名称、消耗标签添加缩放比例支持
    if (scaleInput && (itemType === 'skillDesc' || itemType === 'skillName' || itemType === 'skillCost')) {
        card.style.setProperty(`--${varPrefix}-scale`, scaleInput.value);
    }
    
    // 强制触发重绘
    card.offsetHeight;
}

function updatePreviewScale() {
    const scale = document.getElementById('previewScale').value;
    document.getElementById('previewScaleValue').textContent = scale + '%';
    const container = document.querySelector('.card-container');
    container.style.transform = `scale(${scale / 100})`;
}

function loadExample() {
    const data = {
        "角色": "中央决策层",
        "卡牌编号": "R-001",
        "卡牌系列": "角色卡",
        "角色技能": [
            { "名称": "战略调整", "描述": "选择一项国家战略，增益效果额外+1", "消耗": "权威-1" },
            { "名称": "维稳令", "描述": "社会稳定+2，改革动力-1", "消耗": "无" }
        ]
    };
    loadData(data);
}

function loadData(data) {
    document.getElementById('skillsContainer').innerHTML = '';
    skillCount = 0;

    document.getElementById('roleName').value = data.角色 || '';
    document.getElementById('cardId').value = data.卡牌编号 || 'R-001';
    document.getElementById('cardSet').value = data.卡牌系列 || '角色卡';
    
    // 加载技能标题
    if (data.技能标题) {
        document.getElementById('skillSectionTitle').value = data.技能标题;
    } else {
        // 根据卡牌系列自动设置默认标题
        const cardSet = data.卡牌系列 || '角色卡';
        const defaultTitle = cardSet === '决策牌' ? '📋 决策' : '⚔ 技能';
        document.getElementById('skillSectionTitle').value = defaultTitle;
    }

    // 加载配图
    if (data.角色配图) {
        roleImageData = data.角色配图;
        const img = document.getElementById('displayRoleImage');
        img.src = roleImageData;
        img.style.display = 'block';
    } else {
        removeImage();
    }

    // 加载卡牌设置
    if (data.卡牌设置) {
        const settings = data.卡牌设置;
        if (settings.宽度) document.getElementById('cardWidth').value = settings.宽度;
        if (settings.高度) document.getElementById('cardHeight').value = settings.高度;
        if (settings.配图框高度) {
            document.getElementById('imageHeight').value = settings.配图框高度;
            updateImageHeight();
        }
        if (settings.间距) {
            document.getElementById('spacingSize').value = settings.间距;
            updateSpacingSize();
        }
        if (settings.主色) document.getElementById('primaryColor').value = settings.主色;
        if (settings.辅助色) document.getElementById('accentColor').value = settings.辅助色;
        if (settings.点缀色) document.getElementById('accentColor2').value = settings.点缀色;
        if (settings.预设比例) document.getElementById('cardPreset').value = settings.预设比例;
        if (settings.预览缩放) {
            document.getElementById('previewScale').value = settings.预览缩放;
            updatePreviewScale();
        }
        // 兼容旧版本数据
        if (settings.边框颜色 && !settings.主色) document.getElementById('accentColor').value = settings.边框颜色;
        if (settings.主题颜色 && !settings.辅助色) document.getElementById('accentColor').value = settings.主题颜色;
        updateCardSize();
        updateImageHeight();
        updateColors();
    }

    // 加载文字样式
    if (data.文字样式) {
        const textStyles = data.文字样式;
        const styleItems = ['roleName', 'sectionTitle', 'skillName', 'skillDesc', 'skillCost', 'cardId', 'cardSet'];
        styleItems.forEach(item => {
            if (textStyles[item]) {
                const style = textStyles[item];
                if (style.字号) {
                    const sizeInput = document.getElementById(item + 'Size');
                    if (sizeInput) sizeInput.value = style.字号;
                }
                if (style.字体) {
                    const fontInput = document.getElementById(item + 'Font');
                    if (fontInput) fontInput.value = style.字体;
                }
                if (style.加粗 !== undefined) {
                    const boldInput = document.getElementById(item + 'Bold');
                    if (boldInput) boldInput.checked = style.加粗;
                }
                if (style.缩放比例 !== undefined && (item === 'skillDesc' || item === 'skillName' || item === 'skillCost')) {
                    const scaleInput = document.getElementById(item + 'Scale');
                    if (scaleInput) scaleInput.value = style.缩放比例;
                }
                updateTextStyle(item);
            }
        });
    }

    (data.角色技能 || []).forEach(s => addSkill(s.名称, s.描述, s.消耗));
    
    updatePreview();
}

function collectData() {
    const data = {
        角色: document.getElementById('roleName').value,
        卡牌编号: document.getElementById('cardId').value,
        卡牌系列: document.getElementById('cardSet').value,
        角色配图: roleImageData || '',
        技能标题: document.getElementById('skillSectionTitle')?.value || '⚔ 技能',
        卡牌设置: {
            宽度: parseInt(document.getElementById('cardWidth').value) || 252,
            高度: parseInt(document.getElementById('cardHeight').value) || 352,
            配图框高度: parseInt(document.getElementById('imageHeight').value) || 120,
            间距: parseInt(document.getElementById('spacingSize').value) || 8,
            主色: document.getElementById('primaryColor').value,
            辅助色: document.getElementById('accentColor').value,
            点缀色: document.getElementById('accentColor2').value,
            预设比例: document.getElementById('cardPreset').value || '63:88',
            预览缩放: parseInt(document.getElementById('previewScale').value) || 100
        },
        文字样式: {},
        角色技能: []
    };

    // 收集文字样式
    const styleItems = ['roleName', 'sectionTitle', 'skillName', 'skillDesc', 'skillCost', 'cardId', 'cardSet'];
    styleItems.forEach(item => {
        const sizeInput = document.getElementById(item + 'Size');
        const fontInput = document.getElementById(item + 'Font');
        const boldInput = document.getElementById(item + 'Bold');
        const scaleInput = document.getElementById(item + 'Scale');
        if (sizeInput || fontInput || boldInput || scaleInput) {
            data.文字样式[item] = {};
            if (sizeInput) data.文字样式[item].字号 = parseInt(sizeInput.value);
            if (fontInput) data.文字样式[item].字体 = fontInput.value;
            if (boldInput) data.文字样式[item].加粗 = boldInput.checked;
            if (scaleInput && (item === 'skillDesc' || item === 'skillName' || item === 'skillCost')) {
                data.文字样式[item].缩放比例 = parseFloat(scaleInput.value);
            }
        }
    });

    document.querySelectorAll('[id^="skill-"]').forEach(el => {
        const id = el.id.split('-')[1];
        const name = document.getElementById(`skillName-${id}`)?.value;
        if (name) {
            data.角色技能.push({
                名称: name,
                描述: document.getElementById(`skillDesc-${id}`)?.value || '',
                消耗: document.getElementById(`skillCost-${id}`)?.value || ''
            });
        }
    });

    return data;
}

function exportJSON() {
    const data = collectData();
    // 添加元数据
    data.元数据 = {
        版本: '1.0',
        导出时间: new Date().toISOString(),
        工具: 'CardMaker'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${data.角色 || '卡牌'}.json`;
    a.click();
}

function importJSON() {
    const input = document.getElementById('jsonFileInput');
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    // 验证数据格式
                    if (!data || typeof data !== 'object') {
                        throw new Error('无效的JSON数据');
                    }
                    // 加载数据
                    loadData(data);
                    // 显示成功消息
                    if (data.元数据 && data.元数据.版本) {
                        console.log(`成功导入卡牌数据 (版本: ${data.元数据.版本})`);
                    } else {
                        console.log('成功导入卡牌数据');
                    }
                } catch (error) {
                    alert('导入失败: ' + (error.message || 'JSON格式错误'));
                    console.error('导入错误:', error);
                }
            };
            reader.onerror = () => {
                alert('文件读取失败');
            };
            reader.readAsText(file);
        }
        input.value = '';
    };
    input.click();
}

function resetCard() {
    if (confirm('确定重置?')) {
        document.getElementById('roleName').value = '';
        document.getElementById('cardId').value = 'R-001';
        document.getElementById('cardSet').value = '角色卡';
        document.getElementById('skillSectionTitle').value = '⚔ 技能';
        document.getElementById('skillsContainer').innerHTML = '';
        skillCount = 0;
        removeImage();
        
        // 重置卡牌设置
        document.getElementById('cardWidth').value = 252;
        document.getElementById('cardHeight').value = 352;
        document.getElementById('imageHeight').value = 120;
        updateImageHeight();
        document.getElementById('spacingSize').value = 8;
        document.getElementById('previewScale').value = 100;
        document.getElementById('primaryColor').value = '#0B0E11';
        document.getElementById('accentColor').value = '#4A1414';
        document.getElementById('accentColor2').value = '#C2A35A';
        document.getElementById('cardPreset').value = '63:88';
        updateCardSize();
        updateImageHeight();
        
        // 重置文字样式
        const styleDefaults = {
            roleName: { size: 12, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: true },
            sectionTitle: { size: 10, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: true },
            skillName: { size: 10, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: true, scale: 0.9 },
            skillDesc: { size: 7, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: false, scale: 0.8 },
            skillCost: { size: 8, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: false, scale: 0.7 },
            cardId: { size: 9, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: true },
            cardSet: { size: 9, font: "'Microsoft YaHei', 'PingFang SC', sans-serif", bold: false }
        };
        Object.keys(styleDefaults).forEach(item => {
            const def = styleDefaults[item];
            const sizeInput = document.getElementById(item + 'Size');
            const fontInput = document.getElementById(item + 'Font');
            const boldInput = document.getElementById(item + 'Bold');
            const scaleInput = document.getElementById(item + 'Scale');
            if (sizeInput) sizeInput.value = def.size;
            if (fontInput) fontInput.value = def.font;
            if (boldInput) boldInput.checked = def.bold;
            if (scaleInput && def.scale !== undefined) {
                scaleInput.value = def.scale;
            }
            updateTextStyle(item);
        });
        
        updateCardSize();
        updateSpacingSize();
        updatePreviewScale();
        updateColors();
        updatePreview();
    }
}

function exportAsImage() {
    const card = document.getElementById('roleCard');
    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.onload = () => doExport(card);
        document.head.appendChild(script);
        return;
    }
    doExport(card);
}

function doExport(card) {
    // 临时移除预览缩放以获取实际尺寸
    const container = document.querySelector('.card-container');
    const originalTransform = container.style.transform;
    container.style.transform = 'scale(1)';
    
    html2canvas(card, { 
        scale: 3, 
        backgroundColor: null,
        width: card.offsetWidth,
        height: card.offsetHeight
    }).then(canvas => {
        // 恢复预览缩放
        container.style.transform = originalTransform;
        
        const a = document.createElement('a');
        a.download = `${document.getElementById('roleName').value || '卡牌'}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
    });
}