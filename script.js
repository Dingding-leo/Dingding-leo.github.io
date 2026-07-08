document.addEventListener('DOMContentLoaded', () => {
    // 自动更新年份
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 1. Apple 风格的滚动丝滑显现动画 (Scroll Reveal)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // 触发后停止观察，动画只播放一次
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 2. 高级光影交互：鼠标跟随发光 (Mouse Spotlight Effect)
    // 找到所有的卡片元素
    const cards = document.querySelectorAll('.project-card, .note-link, .now-list');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            // 计算鼠标在卡片内部的相对坐标
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 将坐标写入 CSS 变量，供伪元素 radial-gradient 使用
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
