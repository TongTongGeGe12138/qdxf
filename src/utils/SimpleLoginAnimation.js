// ===========================================
// 1. SimpleLoginAnimation.js (放在 src/utils/ 目录下)
// ===========================================

/**
 * SimpleLoginAnimation - Vue 专用登录动画组件
 * 只支持 logo 自定义，其他动画内容固定不变
 */
class SimpleLoginAnimation {
    constructor(options = {}) {
        this.config = {
            container: options.container,
            logo: {
                type: options.logo?.type || 'icon',
                content: options.logo?.content || '⚡',
                text: options.logo?.text || 'BeesFPD',
                highlight: options.logo?.highlight || 'FPD'
            },
            onComplete: options.onComplete || (() => {})
        };
        
        this.routeSelectionInProgress = false;
        this.isAnimating = false;
    }
    
    init() {
        if (typeof window.gsap === 'undefined') {
            console.error('SimpleLoginAnimation: 需要在 main.js 中全局引入 GSAP');
            return false;
        }
        
        if (!this.config.container) {
            console.error('SimpleLoginAnimation: 容器元素未找到');
            return false;
        }
        
        this.render();
        this.injectStyles();
        return true;
    }
    
    render() {
        const html = `
            <div class="simple-login-animation">
                <div class="logo-animation">
                    ${this.renderLogo()}
                </div>

                <div class="thinking-content">
                    <div class="thinking-step" id="mainStep">
                        <div class="step-header">
                            <div class="step-icon"></div>
                            <div class="step-title" id="stepTitle">系统评估</div>
                        </div>
                        
                        <div class="step-content-wrapper">
                            <div class="step-content" id="content1">
                                <div style="margin-bottom: 12px;">正在评估系统状态...</div>
                                <div style="font-family: 'Courier New', monospace; font-size: 13px;">
                                    <div>算力状态: <span style="color: #2ecc71;">良好</span></div>
                                </div>
                            </div>

                            <div class="step-content" id="content2">
                                <div style="margin-bottom: 12px;">正在检测网络线路状态...</div>
                                <div class="network-detection">
                                    <div class="region-item" id="region-north">
                                        <div class="region-name">华北</div>
                                        <div class="region-lines">
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                        </div>
                                        <div class="region-status">待检测</div>
                                    </div>
                                    <div class="region-item" id="region-east">
                                        <div class="region-name">华东</div>
                                        <div class="region-lines">
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                        </div>
                                        <div class="region-status">待检测</div>
                                    </div>
                                    <div class="region-item" id="region-south">
                                        <div class="region-name">华南</div>
                                        <div class="region-lines">
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                        </div>
                                        <div class="region-status">待检测</div>
                                    </div>
                                    <div class="region-item" id="region-southwest">
                                        <div class="region-name">西南</div>
                                        <div class="region-lines">
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                            <div class="line-indicator"></div>
                                        </div>
                                        <div class="region-status">待检测</div>
                                    </div>
                                </div>
                            </div>

                            <div class="step-content" id="content3">
                                <div style="margin-bottom: 12px;">正在为您选择最优线路...</div>
                                <div style="margin-top: 12px;">
                                    <div>🎯 <span style="color: #f5d13a; font-weight: 600;" id="selectedRoute">正在分析...</span></div>
                                    <div style="font-size: 12px; color: #888; margin-top: 6px;">已为您匹配最佳连接路径</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="progress-dots">
                    <div class="progress-dot" data-step="1"></div>
                    <div class="progress-dot" data-step="2"></div>
                    <div class="progress-dot" data-step="3"></div>
                </div>
            </div>
        `;
        
        this.config.container.innerHTML = html;
    }
    
    renderLogo() {
        const { logo } = this.config;
        
        switch (logo.type) {
            case 'svg':
                return logo.content;
            case 'image':
                return `<img src="${logo.content}" alt="Logo" style="width: 263px; height: 64px; object-fit: contain;">`;
            case 'icon':
            default:
                return logo.content;
        }
    }
    
    renderLogoText() {
        return ''; // 不再需要文字
    }
    
    injectStyles() {
        if (document.getElementById('simpleLoginAnimationStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'simpleLoginAnimationStyles';
        style.textContent = `
            .simple-login-animation {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 40px 35px;
                background: #1a1a1a;
                color: #ffffff;
                font-family: 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .logo-animation {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 40px;
                opacity: 0;
                transform: translateY(30px);
            }

            .logo-animation img {
                display: block;
                margin: 0 auto;
            }

            .thinking-content {
                width: 100%;
                max-width: 320px;
                opacity: 0;
                transform: translateY(20px);
                position: relative;
            }

            .thinking-step {
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                padding: 20px;
                overflow: hidden;
                position: relative;
                width: 100%;
                min-height: 180px;
                transition: all 0.3s ease;
            }

            .step-content-wrapper {
                position: relative;
                min-height: 140px;
            }

            .step-content {
                color: #ffffff;
                font-size: 14px;
                line-height: 1.6;
                opacity: 0;
                transform: translateX(20px);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                transition: all 0.4s ease;
            }

            .step-content.show {
                opacity: 1;
                transform: translateX(0);
            }

            .step-header {
                display: flex;
                align-items: center;
                margin-bottom: 14px;
            }

            .step-icon {
                width: 6px;
                height: 6px;
                background: #f5d13a;
                border-radius: 50%;
                margin-right: 10px;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.3); }
            }

            .step-title {
                font-size: 12px;
                color: #f5d13a;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.8px;
            }

            .progress-dots {
                display: flex;
                justify-content: center;
                margin: 25px 0;
                opacity: 0;
                transform: translateY(10px);
            }

            .progress-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: rgba(245, 209, 58, 0.25);
                margin: 0 3px;
                transition: all 0.4s ease;
            }

            .progress-dot.active {
                background: #f5d13a;
                transform: scale(1.3);
                box-shadow: 0 0 8px rgba(245, 209, 58, 0.5);
            }

            .number-display {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                color: #f5d13a;
                font-weight: bold;
            }

            .network-detection {
                margin-top: 10px;
            }

            .region-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 6px;
                padding: 6px 0;
                opacity: 0.3;
                transition: all 0.4s ease;
            }

            .region-item.checking {
                opacity: 1;
                background: rgba(245, 209, 58, 0.1);
                border-radius: 4px;
                padding: 6px 8px;
            }

            .region-item.completed {
                opacity: 0.8;
            }

            .region-name {
                font-size: 12px;
                color: #ffffff;
                min-width: 60px;
            }

            .region-lines {
                display: flex;
                gap: 4px;
            }

            .line-indicator {
                width: 12px;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                transition: all 0.3s ease;
            }

            .line-indicator.good {
                background: #2ecc71;
            }

            .line-indicator.fair {
                background: #f39c12;
            }

            .line-indicator.poor {
                background: #e74c3c;
            }

            .line-indicator.checking {
                background: #f5d13a;
                animation: pulse-line 0.6s infinite;
            }

            @keyframes pulse-line {
                0%, 100% { opacity: 0.6; transform: scaleY(1); }
                50% { opacity: 1; transform: scaleY(1.5); }
            }

            .region-status {
                font-size: 11px;
                color: #888;
                min-width: 50px;
                text-align: right;
            }

            .region-status.checking {
                color: #f5d13a;
            }

            .region-status.completed {
                color: #2ecc71;
            }
        `;
        document.head.appendChild(style);
    }
    
    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const gsap = window.gsap;

        gsap.set('.logo-animation', { opacity: 0, y: 30 });
        gsap.set('.thinking-content', { opacity: 0, y: 20 });
        gsap.set('.progress-dots', { opacity: 0, y: 10 });
        gsap.set('.step-content', { opacity: 0, x: 20 });

        const timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
                this.config.onComplete();
            }
        });

        timeline
            .to('.logo-animation', {
                duration: 0.6,
                opacity: 1,
                y: 0,
                ease: 'power2.out'
            })
            .to('.thinking-content', {
                duration: 0.5,
                opacity: 1,
                y: 0,
                ease: 'power2.out'
            }, '-=0.3')
            .to('.progress-dots', {
                duration: 0.4,
                opacity: 1,
                y: 0,
                ease: 'power2.out'
            }, '-=0.2')
            .call(() => this.showStep(1, '系统评估'))
            .call(() => this.startCountAnimation(), null, '+=0.1')
            .call(() => this.switchToStep(2, '网络检测'), null, '+=0.5')
            .call(() => this.startNetworkDetection(), null, '+=0.2')
            .call(() => this.switchToStep(3, '路由优化'), null, '+=1.0')
            .to({}, { duration: 1.0 });
    }
    
    showStep(stepNumber, title) {
        const gsap = window.gsap;
        const dot = document.querySelector(`[data-step="${stepNumber}"]`);
        if (dot) dot.classList.add('active');
        
        const stepTitle = document.getElementById('stepTitle');
        if (stepTitle) stepTitle.textContent = title;
        
        const content = document.getElementById(`content${stepNumber}`);
        if (content) {
            gsap.to(content, {
                duration: 0.4,
                opacity: 1,
                x: 0,
                ease: 'power2.out'
            });
            content.classList.add('show');
        }
        
        const mainStep = document.getElementById('mainStep');
        if (mainStep) mainStep.classList.add('active');
    }
    
    switchToStep(stepNumber, title) {
        const gsap = window.gsap;
        const currentContent = document.querySelector('.step-content.show');
        if (currentContent) {
            gsap.to(currentContent, {
                duration: 0.3,
                opacity: 0,
                x: -20,
                ease: 'power2.in',
                onComplete: () => {
                    currentContent.classList.remove('show');
                    this.showStep(stepNumber, title);
                    
                    if (stepNumber === 3 && !this.routeSelectionInProgress) {
                        setTimeout(() => this.selectRandomRoute(), 300);
                    }
                }
            });
        }
    }
    
    startCountAnimation() {
        const target = this.calculateOnlineUsers();
        const element = document.getElementById('onlineCount');
        if (element) {
            this.animateNumber(element, target, 400);
        }
    }
    
    calculateOnlineUsers() {
        const hours = new Date().getHours();
        if (hours >= 9 && hours <= 12) {
            return this.getRandomNumber(15000, 15500);
        } else if (hours > 12 && hours <= 18) {
            return this.getRandomNumber(8000, 10000);
        } else if (hours > 18 && hours <= 24) {
            return this.getRandomNumber(600, 800);
        } else {
            return this.getRandomNumber(500, 600);
        }
    }
    
    animateNumber(element, target, duration = 600) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    startNetworkDetection() {
        const regions = [
            { id: 'region-north', name: '华北' },
            { id: 'region-east', name: '华东' },
            { id: 'region-south', name: '华南' },
            { id: 'region-southwest', name: '西南' }
        ];
        
        const checkRegion = (regionIndex) => {
            if (regionIndex >= regions.length) return;
            
            const region = regions[regionIndex];
            const regionElement = document.getElementById(region.id);
            if (!regionElement) return;
            
            const statusElement = regionElement.querySelector('.region-status');
            const lineIndicators = regionElement.querySelectorAll('.line-indicator');
            
            regionElement.classList.add('checking');
            statusElement.textContent = '检测中';
            statusElement.classList.add('checking');
            
            let lineIndex = 0;
            const checkLine = () => {
                if (lineIndex < lineIndicators.length) {
                    const line = lineIndicators[lineIndex];
                    line.classList.add('checking');
                    
                    setTimeout(() => {
                        line.classList.remove('checking');
                        const statuses = ['good', 'fair', 'poor'];
                        const weights = [0.7, 0.2, 0.1];
                        const rand = Math.random();
                        let status;
                        if (rand < weights[0]) status = 'good';
                        else if (rand < weights[0] + weights[1]) status = 'fair';
                        else status = 'poor';
                        
                        line.classList.add(status);
                        lineIndex++;
                        
                        if (lineIndex < lineIndicators.length) {
                            setTimeout(checkLine, 50);
                        } else {
                            setTimeout(() => {
                                regionElement.classList.remove('checking');
                                regionElement.classList.add('completed');
                                statusElement.textContent = '已完成';
                                statusElement.classList.remove('checking');
                                statusElement.classList.add('completed');
                                
                                setTimeout(() => checkRegion(regionIndex + 1), 80);
                            }, 50);
                        }
                    }, 80);
                }
            };
            
            setTimeout(checkLine, 50);
        };
        
        setTimeout(() => checkRegion(0), 100);
    }
    
    selectRandomRoute() {
        if (this.routeSelectionInProgress) return;
        this.routeSelectionInProgress = true;
        
        const regions = ['华北', '华东', '华南', '西南'];
        const routes = ['线路一', '线路二', '线路三'];
        
        const randomRegion = regions[Math.floor(Math.random() * regions.length)];
        const randomRoute = routes[Math.floor(Math.random() * routes.length)];
        
        const selectedRouteElement = document.getElementById('selectedRoute');
        if (selectedRouteElement) {
            const parentDiv = selectedRouteElement.parentElement;
            const existingSuccess = parentDiv.querySelector('.success-indicator');
            if (existingSuccess) {
                existingSuccess.remove();
            }
            
            selectedRouteElement.textContent = '正在分析最优路径...';
            
            setTimeout(() => {
                selectedRouteElement.textContent = '分析网络质量与延迟...';
                
                setTimeout(() => {
                    selectedRouteElement.textContent = `${randomRegion} - ${randomRoute}`;
                    
                    const gsap = window.gsap;
                    gsap.fromTo(selectedRouteElement, 
                        { scale: 0.8, opacity: 0.5 },
                        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
                    );
                    
                    setTimeout(() => {
                        const successText = parentDiv.querySelector('.success-indicator');
                        if (!successText) {
                            const newDiv = document.createElement('div');
                            newDiv.className = 'success-indicator';
                            newDiv.style.cssText = 'font-size: 12px; color: #2ecc71; margin-top: 8px; opacity: 0;';
                            newDiv.textContent = '✓ 路径优化完成，连接质量优秀';
                            parentDiv.appendChild(newDiv);
                            
                            gsap.to(newDiv, { opacity: 1, duration: 0.3, ease: 'power2.out' });
                        }
                        
                        this.routeSelectionInProgress = false;
                    }, 300);
                    
                }, 300);
            }, 200);
        }
    }
    
    destroy() {
        const styles = document.getElementById('simpleLoginAnimationStyles');
        if (styles) styles.remove();
        if (this.config.container) this.config.container.innerHTML = '';
    }
}

export default SimpleLoginAnimation; 