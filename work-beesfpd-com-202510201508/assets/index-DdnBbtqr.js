import{e as ge,k as F,ak as U,y as N,o as fe,D as ve,$ as we,t as B,A as l,h as n,w as s,am as ye,z as V,I as J,u as H,an as Y,r as I,f as _,E as b,L as be,M as ke,a1 as R,G as z,J as S,H as ne,C as xe,g as v,n as he}from"./vendor-D1U3vd9f.js";import{u as Ce,I as Ve,b as Ae,J as _e,K as Se,L as Le,M as Pe}from"./index-Bz-KOdQ0.js";import{e as Fe}from"./dict-BkvdzF-A.js";import{_ as O}from"./dark-Bq7MYVvb.js";import{_ as Re}from"./_plugin-vue_export-helper-DlAUqK2U.js";class Ie{constructor(t={}){var p,x,w,m;this.config={container:t.container,logo:{type:((p=t.logo)==null?void 0:p.type)||"icon",content:((x=t.logo)==null?void 0:x.content)||"⚡",text:((w=t.logo)==null?void 0:w.text)||"BeesFPD",highlight:((m=t.logo)==null?void 0:m.highlight)||"FPD"},onComplete:t.onComplete||(()=>{})},this.routeSelectionInProgress=!1,this.isAnimating=!1}init(){return typeof window.gsap>"u"?(console.error("SimpleLoginAnimation: 需要在 main.js 中全局引入 GSAP"),!1):this.config.container?(this.render(),this.injectStyles(),!0):(console.error("SimpleLoginAnimation: 容器元素未找到"),!1)}render(){const t=`
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
        `;this.config.container.innerHTML=t}renderLogo(){const{logo:t}=this.config;switch(t.type){case"svg":return t.content;case"image":return`<img src="${t.content}" alt="Logo" style="width: 263px; height: 64px; object-fit: contain;">`;case"icon":default:return t.content}}renderLogoText(){return""}injectStyles(){if(document.getElementById("simpleLoginAnimationStyles"))return;const t=document.createElement("style");t.id="simpleLoginAnimationStyles",t.textContent=`
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
        `,document.head.appendChild(t)}start(){if(this.isAnimating)return;this.isAnimating=!0;const t=window.gsap;t.set(".logo-animation",{opacity:0,y:30}),t.set(".thinking-content",{opacity:0,y:20}),t.set(".progress-dots",{opacity:0,y:10}),t.set(".step-content",{opacity:0,x:20}),t.timeline({onComplete:()=>{this.isAnimating=!1,this.config.onComplete()}}).to(".logo-animation",{duration:.6,opacity:1,y:0,ease:"power2.out"}).to(".thinking-content",{duration:.5,opacity:1,y:0,ease:"power2.out"},"-=0.3").to(".progress-dots",{duration:.4,opacity:1,y:0,ease:"power2.out"},"-=0.2").call(()=>this.showStep(1,"系统评估")).call(()=>this.startCountAnimation(),null,"+=0.1").call(()=>this.switchToStep(2,"网络检测"),null,"+=0.5").call(()=>this.startNetworkDetection(),null,"+=0.2").call(()=>this.switchToStep(3,"路由优化"),null,"+=1.0").to({},{duration:1})}showStep(t,p){const x=window.gsap,w=document.querySelector(`[data-step="${t}"]`);w&&w.classList.add("active");const m=document.getElementById("stepTitle");m&&(m.textContent=p);const g=document.getElementById(`content${t}`);g&&(x.to(g,{duration:.4,opacity:1,x:0,ease:"power2.out"}),g.classList.add("show"));const C=document.getElementById("mainStep");C&&C.classList.add("active")}switchToStep(t,p){const x=window.gsap,w=document.querySelector(".step-content.show");w&&x.to(w,{duration:.3,opacity:0,x:-20,ease:"power2.in",onComplete:()=>{w.classList.remove("show"),this.showStep(t,p),t===3&&!this.routeSelectionInProgress&&setTimeout(()=>this.selectRandomRoute(),300)}})}startCountAnimation(){const t=this.calculateOnlineUsers(),p=document.getElementById("onlineCount");p&&this.animateNumber(p,t,400)}calculateOnlineUsers(){const t=new Date().getHours();return t>=9&&t<=12?this.getRandomNumber(15e3,15500):t>12&&t<=18?this.getRandomNumber(8e3,1e4):t>18&&t<=24?this.getRandomNumber(600,800):this.getRandomNumber(500,600)}animateNumber(t,p,x=600){const m=p/(x/16);let g=0;const C=setInterval(()=>{g+=m,g>=p&&(g=p,clearInterval(C)),t.textContent=Math.floor(g).toLocaleString()},16)}getRandomNumber(t,p){return Math.floor(Math.random()*(p-t+1))+t}startNetworkDetection(){const t=[{id:"region-north",name:"华北"},{id:"region-east",name:"华东"},{id:"region-south",name:"华南"},{id:"region-southwest",name:"西南"}],p=x=>{if(x>=t.length)return;const w=t[x],m=document.getElementById(w.id);if(!m)return;const g=m.querySelector(".region-status"),C=m.querySelectorAll(".line-indicator");m.classList.add("checking"),g.textContent="检测中",g.classList.add("checking");let P=0;const $=()=>{if(P<C.length){const u=C[P];u.classList.add("checking"),setTimeout(()=>{u.classList.remove("checking");const L=[.7,.2,.1],E=Math.random();let D;E<L[0]?D="good":E<L[0]+L[1]?D="fair":D="poor",u.classList.add(D),P++,P<C.length?setTimeout($,50):setTimeout(()=>{m.classList.remove("checking"),m.classList.add("completed"),g.textContent="已完成",g.classList.remove("checking"),g.classList.add("completed"),setTimeout(()=>p(x+1),80)},50)},80)}};setTimeout($,50)};setTimeout(()=>p(0),100)}selectRandomRoute(){if(this.routeSelectionInProgress)return;this.routeSelectionInProgress=!0;const t=["华北","华东","华南","西南"],p=["线路一","线路二","线路三"],x=t[Math.floor(Math.random()*t.length)],w=p[Math.floor(Math.random()*p.length)],m=document.getElementById("selectedRoute");if(m){const g=m.parentElement,C=g.querySelector(".success-indicator");C&&C.remove(),m.textContent="正在分析最优路径...",setTimeout(()=>{m.textContent="分析网络质量与延迟...",setTimeout(()=>{m.textContent=`${x} - ${w}`;const P=window.gsap;P.fromTo(m,{scale:.8,opacity:.5},{scale:1,opacity:1,duration:.4,ease:"back.out(1.7)"}),setTimeout(()=>{if(!g.querySelector(".success-indicator")){const u=document.createElement("div");u.className="success-indicator",u.style.cssText="font-size: 12px; color: #2ecc71; margin-top: 8px; opacity: 0;",u.textContent="✓ 路径优化完成，连接质量优秀",g.appendChild(u),P.to(u,{opacity:1,duration:.3,ease:"power2.out"})}this.routeSelectionInProgress=!1},300)},300)},200)}}destroy(){const t=document.getElementById("simpleLoginAnimationStyles");t&&t.remove(),this.config.container&&(this.config.container.innerHTML="")}}const $e={class:"login-container dark"},Ee={class:"login-card"},Te={class:"right"},Be={class:"form-container"},De={class:"logo"},Ue=["src"],ze={key:1,class:"qrcode-container"},Me={class:"logo"},qe=["src"],Ne={class:"logo"},Oe=["src"],Ge={class:"logo"},He=["src"],Xe={key:4,class:"login-footer",style:{"margin-top":"20px"}},je={key:1},We=120,Je=ge({__name:"index",setup(ie){const t=/^1[3-9]\d{9}$/,p=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/,x=xe(),w=ve(),m=Ce(),g=F(),C=F(),P=F(),$=F(!1),u=F("account"),L=F(0),E=F("获取验证码"),D=F([]),X=F(!1),Z=F(null);let M=null;const G=F(!1),h=U({account:"",password:"",agreement:!0}),c=U({mobile:"",password:"",confirmPassword:"",verifyCode:"",identity:"其他",description:"",agreement:!0}),A=U({mobile:"",verifyCode:"",newPassword:"",confirmPassword:""}),a=U({account:"",password:"",username:"",confirmPassword:"",mobile:"",verifyCode:""}),le={account:[{required:!0,message:"请输入账户名",trigger:"blur",validateStatus:"success"}],password:[{required:!0,message:"请输入密码",trigger:"blur",validateStatus:"success"}],agreement:[{validator:(i,e,r)=>{e?r():r(new Error("请阅读并同意用户协议和隐私政策"))},trigger:"change",validateStatus:"success"}]},ae=U({mobile:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:t,message:"请输入正确的手机号",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,max:16,message:"请输入6-16位包含字母大小写及数字密码",trigger:"blur"},{pattern:p,message:"密码必须包含大小写字母和数字",trigger:"blur"}],confirmPassword:[{required:!0,message:"请确认密码",trigger:"blur"},{validator:(i,e,r)=>{e!==c.password?r(new Error("两次输入密码不一致")):r()},trigger:"blur"}],verifyCode:[{required:!0,message:"请输入验证码",trigger:"blur"},{len:4,message:"验证码长度应为4位",trigger:"blur"}]}),de=U({mobile:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:t,message:"请输入正确的手机号",trigger:"blur"}],verifyCode:[{required:!0,message:"请输入验证码",trigger:"blur"},{len:4,message:"验证码长度应为4位",trigger:"blur"}],newPassword:[{required:!0,message:"请输入新密码",trigger:"blur"},{min:6,max:16,message:"请输入6-16位包含字母大小写及数字密码",trigger:"blur"},{pattern:p,message:"密码必须包含大小写字母和数字",trigger:"blur"}],confirmPassword:[{required:!0,message:"请确认新密码",trigger:"blur"},{validator:(i,e,r)=>{e!==A.newPassword?r(new Error("两次输入密码不一致")):r()},trigger:"blur"}]});let T=null;const ce=async()=>{try{const i=await Fe();i.code===200&&i.data?D.value=i.data.map(e=>({value:e.value,label:e.name})):b.error("获取专业身份列表失败")}catch(i){console.error("获取专业身份列表错误：",i),b.error("获取专业身份列表失败")}},K=async()=>{if($.value=!0,await ue(g.value))try{const e=await Ve({account:h.account,password:h.password});if(e.code===200){const r=Ae();m.clearUserInfo(),r.clearStore(),m.setUserInfo({sessionId:e.data.sessionId,accessToken:e.data.accessToken,refreshToken:e.data.refreshToken,extra:e.data.extra}),b.success("登录成功");const d=w.query.redirect;console.log("登录后 redirect 参数：",d),d&&typeof d=="string"&&d.startsWith("/")?x.replace(d):x.replace("/dashboard")}else e.data&&e.data.password?a.password=e.data.password[0]:b.error(e.msg||"登录失败，请稍后重试")}catch(e){if(console.error("登录错误：",e),e.response&&e.response.data){const{data:r}=e.response;r.password?a.password=r.password[0]:b.error(r.msg||"登录失败，请稍后重试")}}finally{$.value=!1}else $.value=!1},ue=async i=>{if(!i)return!1;try{let e=!1;return await i.validate(r=>{e=r}),e}catch{return!1}},pe=async()=>{if(L.value>0)return;if(!await ee(C.value,"mobile")){b.warning("请输入手机号码");return}try{const e=await _e(c.mobile);e.code===200?(b.success("验证码发送成功"),Q()):b.error(e.msg||"验证码发送失败")}catch(e){console.error("验证码发送错误：",e),b.error("验证码发送失败，请稍后重试")}},Q=()=>{L.value=We,E.value=`${L.value}s后重新获取`,T=setInterval(()=>{L.value--,E.value=`${L.value}s后重新获取`,L.value<=0&&(E.value="获取验证码",T&&(clearInterval(T),T=null))},1e3)},ee=async(i,e)=>{if(!i)return!1;try{return await i.validateField(e),!0}catch{return!1}},te=async i=>{i&&await i.validate(async(e,r)=>{if(e)try{const d=await Se({phone:c.mobile,code:c.verifyCode,password:c.password,PwdTwo:c.confirmPassword,profession:c.identity||"",utm:{source:"referral"},referrer:String(c.description??"")});d.code===200?(b.success("注册成功"),u.value="account",h.account=c.mobile,h.password=c.password):b.error(d.msg||"注册失败")}catch(d){console.error("注册失败：",d)}else if(r){let d="请检查以下字段：";Object.keys(r).forEach(f=>{const y=r[f];y&&y.length>0&&(d+=`${y[0].message}；`)}),b.error(d)}})},oe=()=>{const{hostname:i}=window.location;let e="signin";i==="work-uat.gatherbee.cn"?e+="-uat":i==="work.dev.ifeng.com"&&(e+="-sit");const r=`https://www.gatherbee.cn/${e}`;new WxLogin({self_redirect:!1,id:"login_container",appid:"wx0d30a914d26c73aa",scope:"snsapi_login",redirect_uri:r,state:"from_wxweb",style:"black",stylelite:1,href:"data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30uaW1wb3dlckJveCAucXJjb2RlIHtib3JkZXI6IG5vbmU7d2lkdGg6IDIwMHB4O2hlaWdodDogMjAwcHg7fS5pbXBvd2VyQm94IC5pbmZve3dpZHRoOiAyMDlweH0uaW1wb3dlckJveCAud3JwX2NvZGV7d2lkdGg6IDEwMCU7fS5pbXBvd2VyQm94IHt3aWR0aDogMjA5cHg7fS5pbXBvd2VyQm94IC5pY29uMzhfbXNnIHtkaXNwbGF5OiBub25lO3dpZHRoOiA0NHB4O2hlaWdodDogNDRweDtiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO30uaW1wb3dlckJveCAuc3RhdHVzX3R4dCB7dGV4dC1hbGlnbjogY2VudGVyO30="}),window.addEventListener("message",se,!1)},se=i=>{if(i.origin!=="https://open.work.weixin.qq.com")return;const e=i.data;e.wx_code&&console.log("微信登录成功，code:",e.wx_code)};N(()=>h.account,()=>{a.account=""}),N(()=>h.password,()=>{a.password=""}),N(()=>c.description,i=>{typeof i=="string"&&i.length>25&&(c.description="")}),N(u,i=>{i==="qrcode"&&he(()=>{oe()})}),fe(()=>{if(M=new Ie({container:Z.value,logo:{type:"image",content:O,text:"BeesFPD",highlight:"FPD"},onComplete:()=>{X.value=!0}}),M.init()?setTimeout(()=>{M.start()},500):X.value=!0,ce(),u.value==="qrcode"&&oe(),w.path==="/register"){u.value="register";const i=w.query.code;if(i){const e=String(i),r=e.length<=25?e:"";c.description=r,G.value=r.length>0}}}),we(()=>{window.removeEventListener("message",se),T&&(clearInterval(T),T=null),M&&M.destroy()});const me=async()=>{if(L.value>0)return;if(!await ee(P.value,"mobile")){b.warning("请输入手机号码");return}try{const e=await Le(A.mobile);e.code===200?(b.success("验证码发送成功"),Q()):b.error(e.msg||"验证码发送失败")}catch{b.error("验证码发送失败，请稍后重试")}},re=async i=>{i&&await i.validate(async(e,r)=>{if(e)try{const d=await Pe({phone:A.mobile,code:A.verifyCode,password:A.newPassword});d.code===200?(b.success("密码重置成功"),u.value="account",h.account=A.mobile):b.error(d.msg||"密码重置失败")}catch{b.error("密码重置失败，请稍后重试")}else if(r){let d="请检查以下字段：";Object.keys(r).forEach(f=>{const y=r[f];y&&y.length>0&&(d+=`${y[0].message}；`)}),N(()=>w.query.code,f=>{if(w.path==="/register"&&(G.value=!!f,f)){const y=String(f);c.description=y.length<=25?y:"",G.value=c.description.length>0}}),b.error(d)}})},k=i=>{const e=i==="user"?"/userAgreement.html":"/privacyPolicy.html";window.open(e,"_blank")};return(i,e)=>{const r=I("el-input"),d=I("el-tooltip"),f=I("el-form-item"),y=I("el-link"),j=I("el-checkbox"),q=I("el-button"),W=I("el-form"),Ye=I("el-option"),Ze=I("el-select");return v(),B("div",$e,[l("div",Ee,[e[74]||(e[74]=l("div",{class:"left"},null,-1)),l("div",Te,[n(ye,{name:"fade-out"},{default:s(()=>[be(l("div",{ref_key:"animationContainer",ref:Z,class:"animation-overlay"},null,512),[[ke,!X.value]])]),_:1}),l("div",Be,[u.value==="account"?(v(),B(J,{key:0},[l("div",De,[l("img",{src:H(O),alt:"BeesFPD"},null,8,Ue)]),e[47]||(e[47]=l("h2",null,"欢迎回来",-1)),e[48]||(e[48]=l("p",{class:"subtitle"},"即刻登录使用智能绘制",-1)),n(W,{ref_key:"loginFormRef",ref:g,model:h,rules:le,class:"login-form",onKeyup:Y(K,["enter"])},{default:s(()=>[n(f,{prop:"account"},{default:s(()=>[n(r,{modelValue:h.account,"onUpdate:modelValue":e[0]||(e[0]=o=>h.account=o),placeholder:"账户名/手机号",class:R({"error-input":a.account})},null,8,["modelValue","class"]),a.account?(v(),_(d,{key:0,content:a.account,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[40]||(e[40]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[40]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"password"},{default:s(()=>[n(r,{modelValue:h.password,"onUpdate:modelValue":e[1]||(e[1]=o=>h.password=o),type:"password",placeholder:"请输入A-16位包含字母大小写及数字密码","show-password":"",class:R({"error-input":a.password})},null,8,["modelValue","class"]),a.password?(v(),_(d,{key:0,content:a.password,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[41]||(e[41]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[41]},8,["content"])):V("",!0)]),_:1}),n(f,null,{default:s(()=>[n(j,{modelValue:h.agreement,"onUpdate:modelValue":e[8]||(e[8]=o=>h.agreement=o),class:"dark-checkbox"},{default:s(()=>[e[44]||(e[44]=l("span",{style:{"font-size":"10px",color:"#A1A1A1"}},"我已阅读并同意",-1)),n(y,{type:"primary",class:"yellow-link",style:{color:"#FFEA65 !important","font-size":"10px !important",margin:"0 2px"},onClick:e[2]||(e[2]=o=>k("user")),onDblclick:e[3]||(e[3]=o=>k("user")),onContextmenu:e[4]||(e[4]=z(o=>k("user"),["prevent"]))},{default:s(()=>e[42]||(e[42]=[S("用户协议")])),_:1,__:[42]}),e[45]||(e[45]=l("span",{style:{"font-size":"10px",color:"#A1A1A1"}},"和",-1)),n(y,{type:"primary",class:"yellow-link",style:{color:"#FFEA65 !important","font-size":"10px !important",margin:"0 2px"},onClick:e[5]||(e[5]=o=>k("privacy")),onDblclick:e[6]||(e[6]=o=>k("privacy")),onContextmenu:e[7]||(e[7]=z(o=>k("privacy"),["prevent"]))},{default:s(()=>e[43]||(e[43]=[S("隐私政策")])),_:1,__:[43]})]),_:1,__:[44,45]},8,["modelValue"])]),_:1}),n(q,{type:"primary",class:"login-button",loading:$.value,disabled:!h.agreement,onClick:K,style:{"background-color":"#ff9900 !important",color:"#000 !important",border:"none !important",transition:"background-color 0.3s"}},{default:s(()=>e[46]||(e[46]=[S(" 登录 ")])),_:1,__:[46]},8,["loading","disabled"])]),_:1},8,["model"])],64)):u.value==="qrcode"?(v(),B("div",ze,[l("div",Me,[l("img",{src:H(O),alt:"BeesFPD"},null,8,qe)]),e[53]||(e[53]=l("h2",null,"请使用微信扫码登录",-1)),e[54]||(e[54]=l("div",{class:"qrcode-box"},[l("div",{id:"login_container"})],-1)),n(j,{modelValue:h.agreement,"onUpdate:modelValue":e[15]||(e[15]=o=>h.agreement=o),class:"dark-checkbox"},{default:s(()=>[e[51]||(e[51]=l("span",{style:{"font-size":"10px",color:"#A1A1A1"}},"我已阅读并同意",-1)),n(y,{type:"primary",class:"yellow-link",style:{color:"#FFEA65 !important","font-size":"10px !important",margin:"0 2px"},onClick:e[9]||(e[9]=o=>k("user")),onDblclick:e[10]||(e[10]=o=>k("user")),onContextmenu:e[11]||(e[11]=z(o=>k("user"),["prevent"]))},{default:s(()=>e[49]||(e[49]=[S("用户协议")])),_:1,__:[49]}),e[52]||(e[52]=l("span",{style:{"font-size":"10px",color:"#A1A1A1"}},"和",-1)),n(y,{type:"primary",class:"yellow-link",style:{color:"#FFEA65 !important","font-size":"10px !important",margin:"0 2px"},onClick:e[12]||(e[12]=o=>k("privacy")),onDblclick:e[13]||(e[13]=o=>k("privacy")),onContextmenu:e[14]||(e[14]=z(o=>k("privacy"),["prevent"]))},{default:s(()=>e[50]||(e[50]=[S("隐私政策")])),_:1,__:[50]})]),_:1,__:[51,52]},8,["modelValue"])])):u.value==="register"?(v(),B(J,{key:2},[l("div",Ne,[l("img",{src:H(O),alt:"BeesFPD"},null,8,Oe)]),e[64]||(e[64]=l("h2",{class:"form-title"},"注册账号",-1)),n(W,{ref_key:"registerFormRef",ref:C,model:c,rules:ae,class:"login-form",onKeyup:e[30]||(e[30]=Y(o=>te(C.value),["enter"]))},{default:s(()=>[n(f,{prop:"mobile"},{default:s(()=>[n(r,{modelValue:c.mobile,"onUpdate:modelValue":e[16]||(e[16]=o=>c.mobile=o),placeholder:"输入手机号",class:R({"error-input":a.mobile})},null,8,["modelValue","class"]),a.mobile?(v(),_(d,{key:0,content:a.mobile,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[55]||(e[55]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[55]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"password"},{default:s(()=>[n(r,{modelValue:c.password,"onUpdate:modelValue":e[17]||(e[17]=o=>c.password=o),type:"password",placeholder:"请输入6-16位包含字母大小写及数字密码","show-password":"",class:R({"error-input":a.password})},null,8,["modelValue","class"]),a.password?(v(),_(d,{key:0,content:a.password,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[56]||(e[56]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[56]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"confirmPassword"},{default:s(()=>[n(r,{modelValue:c.confirmPassword,"onUpdate:modelValue":e[18]||(e[18]=o=>c.confirmPassword=o),type:"password",placeholder:"确认密码","show-password":"",class:R({"error-input":a.confirmPassword})},null,8,["modelValue","class"]),a.confirmPassword?(v(),_(d,{key:0,content:a.confirmPassword,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[57]||(e[57]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[57]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"verifyCode",class:"verify-code-item"},{default:s(()=>[n(r,{modelValue:c.verifyCode,"onUpdate:modelValue":e[19]||(e[19]=o=>c.verifyCode=o),placeholder:"输入验证码",class:R({"error-input":a.verifyCode})},null,8,["modelValue","class"]),n(q,{type:"text",class:"get-code-btn",disabled:L.value>0,onClick:pe},{default:s(()=>[S(ne(E.value),1)]),_:1},8,["disabled"]),a.verifyCode?(v(),_(d,{key:0,content:a.verifyCode,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[58]||(e[58]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[58]},8,["content"])):V("",!0)]),_:1}),V("",!0),G.value?V("",!0):(v(),_(f,{key:1,prop:"description"},{default:s(()=>[n(r,{modelValue:c.description,"onUpdate:modelValue":e[21]||(e[21]=o=>c.description=o),placeholder:"若有分享码，请填写"},null,8,["modelValue"])]),_:1})),n(f,null,{default:s(()=>[n(j,{modelValue:c.agreement,"onUpdate:modelValue":e[28]||(e[28]=o=>c.agreement=o),class:"dark-checkbox"},{default:s(()=>[e[61]||(e[61]=l("span",{style:{"font-size":"10px",color:"#A1A1A1"}},"我已阅读并同意",-1)),n(y,{type:"primary",class:"yellow-link",style:{color:"#FFEA65 !important","font-size":"10px !important",margin:"0 2px"},onClick:e[22]||(e[22]=o=>k("user")),onDblclick:e[23]||(e[23]=o=>k("user")),onContextmenu:e[24]||(e[24]=z(o=>k("user"),["prevent"]))},{default:s(()=>e[59]||(e[59]=[S("用户协议")])),_:1,__:[59]}),e[62]||(e[62]=l("span",{style:{"font-size":"10px",color:"#A1A1A1"}},"和",-1)),n(y,{type:"primary",class:"yellow-link",style:{color:"#FFEA65 !important","font-size":"10px !important",margin:"0 2px"},onClick:e[25]||(e[25]=o=>k("privacy")),onDblclick:e[26]||(e[26]=o=>k("privacy")),onContextmenu:e[27]||(e[27]=z(o=>k("privacy"),["prevent"]))},{default:s(()=>e[60]||(e[60]=[S("隐私政策")])),_:1,__:[60]})]),_:1,__:[61,62]},8,["modelValue"])]),_:1}),n(q,{type:"primary",class:"login-button",disabled:!c.agreement,onClick:e[29]||(e[29]=o=>te(C.value)),style:{"background-color":"#ff9900 !important",color:"#000 !important",border:"none !important",transition:"background-color 0.3s"}},{default:s(()=>e[63]||(e[63]=[S(" 注册登录 ")])),_:1,__:[63]},8,["disabled"])]),_:1},8,["model","rules"])],64)):u.value==="forgot"?(v(),B(J,{key:3},[l("div",Ge,[l("img",{src:H(O),alt:"BeesFPD"},null,8,He)]),e[70]||(e[70]=l("h2",{class:"form-title",style:{"margin-bottom":"20px"}},"找回密码",-1)),n(W,{ref_key:"forgotFormRef",ref:P,model:A,rules:de,class:"login-form",onKeyup:e[36]||(e[36]=Y(o=>re(P.value),["enter"]))},{default:s(()=>[n(f,{prop:"mobile"},{default:s(()=>[n(r,{modelValue:A.mobile,"onUpdate:modelValue":e[31]||(e[31]=o=>A.mobile=o),placeholder:"输入手机号",class:R({"error-input":a.mobile})},null,8,["modelValue","class"]),a.mobile?(v(),_(d,{key:0,content:a.mobile,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[65]||(e[65]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[65]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"verifyCode",class:"verify-code-item"},{default:s(()=>[n(r,{modelValue:A.verifyCode,"onUpdate:modelValue":e[32]||(e[32]=o=>A.verifyCode=o),placeholder:"输入验证码",class:R({"error-input":a.verifyCode})},null,8,["modelValue","class"]),n(q,{type:"text",class:"get-code-btn",disabled:L.value>0,onClick:me},{default:s(()=>[S(ne(E.value),1)]),_:1},8,["disabled"]),a.verifyCode?(v(),_(d,{key:0,content:a.verifyCode,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[66]||(e[66]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[66]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"newPassword"},{default:s(()=>[n(r,{modelValue:A.newPassword,"onUpdate:modelValue":e[33]||(e[33]=o=>A.newPassword=o),type:"password",placeholder:"请输入新密码","show-password":"",class:R({"error-input":a.password})},null,8,["modelValue","class"]),a.password?(v(),_(d,{key:0,content:a.password,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[67]||(e[67]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[67]},8,["content"])):V("",!0)]),_:1}),n(f,{prop:"confirmPassword"},{default:s(()=>[n(r,{modelValue:A.confirmPassword,"onUpdate:modelValue":e[34]||(e[34]=o=>A.confirmPassword=o),type:"password",placeholder:"确认新密码","show-password":"",class:R({"error-input":a.confirmPassword})},null,8,["modelValue","class"]),a.confirmPassword?(v(),_(d,{key:0,content:a.confirmPassword,placement:"bottom",effect:"dark","show-after":0,visible:!0,"raw-content":!1,offset:8,"show-arrow":!0,"popper-class":"error-tooltip"},{default:s(()=>e[68]||(e[68]=[l("div",{class:"error-trigger"},null,-1)])),_:1,__:[68]},8,["content"])):V("",!0)]),_:1}),n(q,{type:"primary",class:"login-button",onClick:e[35]||(e[35]=o=>re(P.value)),style:{"background-color":"#ff9900 !important",color:"#000 !important",border:"none !important",transition:"background-color 0.3s"}},{default:s(()=>e[69]||(e[69]=[S(" 重置密码 ")])),_:1,__:[69]})]),_:1},8,["model","rules"])],64)):V("",!0),u.value!=="forgot"?(v(),B("div",Xe,[u.value==="account"?(v(),_(y,{key:0,class:"dark-link",onClick:e[37]||(e[37]=o=>u.value="forgot"),style:{"font-size":"12px",color:"#A1A1A1"}},{default:s(()=>e[71]||(e[71]=[S("忘记密码？")])),_:1,__:[71]})):V("",!0),u.value==="account"?(v(),B("br",je)):V("",!0),u.value!="register"?(v(),_(y,{key:2,class:"dark-link",onClick:e[38]||(e[38]=o=>u.value="register"),style:{"margin-top":"10px","font-size":"12px",color:"#A1A1A1"}},{default:s(()=>e[72]||(e[72]=[S("没有账户？"),l("span",{style:{"text-decoration":"underline"}},"注册账号",-1)])),_:1,__:[72]})):(v(),_(y,{key:3,class:"dark-link",onClick:e[39]||(e[39]=o=>u.value="account"),style:{"font-size":"12px",color:"#A1A1A1"}},{default:s(()=>e[73]||(e[73]=[S("已有账户？登录")])),_:1,__:[73]}))])):V("",!0)])])])])}}}),st=Re(Je,[["__scopeId","data-v-31efd021"]]);export{st as default};
