// 自动更新 footer 的年份
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // 如果后续需要简单的交互逻辑（如记录点击、深色模式切换），可写在这里
    console.log("Welcome to Austin's Lab.");
});
