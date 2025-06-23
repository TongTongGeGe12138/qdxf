<template>
    <div class="account-container">
        <h1 class="page-title">账号管理</h1>
        <div class="account-card">
            <div class="profile-header">
                <el-avatar :size="55" :icon="UserFilled" :src="getFullImageUrl(user.avatarUrl)"
                    @click="openAvatarDialog" style="cursor: pointer;" />
                <div class="user-details">
                    <div class="username">{{ user.userName }}</div>
                    <div class="edit-links">
                        <a href="javascript:;" class="edit-link" @click="openAvatarDialog">更换头像</a>
                        <el-divider direction="vertical" />
                        <a href="javascript:;" class="edit-link" @click="openEditDialog">编辑资料</a>
                    </div>
                </div>
            </div>

            <div class="details-list">
                <div v-for="(item, index) in profileItems" :key="index" class="detail-item">
                    <span class="detail-label">{{ item.label }}</span>
                    <div class="detail-value">
                        <span v-if="!editMode || !item.editable">{{ item.value }}</span>
                        <el-input v-else v-model="user[item.key as keyof typeof user]" size="small" />
                    </div>
                </div>
            </div>

            <div v-if="editMode" class="save-button-container">
                <el-button type="primary" @click="saveProfile" :loading="saving">保存</el-button>
            </div>
        </div>

        <el-dialog v-model="editDialogVisible" title="编辑资料" width="480px" class="profile-dialog" center
            :before-close="handleCloseDialog">
            <div class="dialog-content">
                <el-tabs v-model="activeTab" class="profile-tabs">
                    <el-tab-pane label="个人资料" name="personal">
                        <el-form :model="dialogFormData" label-position="right" label-width="80px">
                            <el-form-item label="注册日期">
                                <el-date-picker :model-value="dialogFormData.registedDate" type="date"
                                    placeholder="注册日期" disabled />
                            </el-form-item>
                            <el-form-item label="用户姓名">
                                <el-input v-model="dialogFormData.nickName" placeholder="请输入姓名" />
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-radio-group v-model="dialogFormData.gender">
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="专业身份">
                                <el-select v-model="dialogFormData.profession" placeholder="请选择">
                                    <el-option label="消防工程师" value="消防工程师"></el-option>
                                    <el-option label="结构工程师" value="结构工程师"></el-option>
                                    <el-option label="其他" value="其他"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职业资格">
                                <el-input v-model="dialogFormData.qualifications" placeholder="请输入职业资格" />
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="账号安全" name="security">
                        <el-form label-position="right" label-width="80px">
                            <el-form-item label="用户ID">
                                <el-input :model-value="user.userName" disabled />
                            </el-form-item>
                            <el-form-item label="手机号">
                                <div class="form-item-content">
                                    <span>{{ user.phone || '未绑定' }}</span>
                                    <el-button type="text" class="action-link"
                                        @click="openChangePhoneDialog">更换</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="密码">
                                <div class="form-item-content">
                                    <span>••••••</span>
                                    <el-button type="text" class="action-link">修改密码</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="绑定微信">
                                <div class="form-item-content">
                                    <span>{{ user.wechat_nickname || '未关联' }}</span>
                                    <el-button type="text" class="action-link" @click="openBindWechatDialog">
                                        {{ user.wechat_nickname ? '换绑' : '绑定' }}
                                    </el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="dialog-button cancel" @click="handleCloseDialog">取消</div>
                    <div class="dialog-button confirm" @click="handleConfirmUpdate">确定</div>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="avatarDialogVisible" title="设置头像" width="300px" height="410px" class="avatar-dialog" center
            :before-close="() => (avatarDialogVisible = false)">
            <div class="dialog-content">
                <el-upload class="avatar-uploader" :auto-upload="false" :show-file-list="false"
                    :on-change="handleAvatarFileChange" :before-upload="beforeAvatarUpload">
                    <img v-if="uploadedAvatarUrl" :src="getFullImageUrl(uploadedAvatarUrl)" class="avatar" />
                    <div v-else class="uploader-icon-container">
                        <el-icon class="avatar-uploader-icon">
                            <UploadFilled />
                        </el-icon>
                        <span>重新上传</span>
                        <span class="upload-tip">不超过 5 MB (JPG/PNG)</span>
                    </div>
                </el-upload>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="dialog-button cancel" @click="() => (avatarDialogVisible = false)">取消</div>
                    <div class="dialog-button confirm" @click="handleSaveAvatar">保存</div>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="changePhoneDialogVisible" title="更换手机号" width="480px" class="change-phone-dialog" center
            :before-close="() => (changePhoneDialogVisible = false)">
            <div class="dialog-content">
                <el-form :model="phoneForm" label-position="top">
                    <el-form-item>
                        <el-input v-model="phoneForm.phone" placeholder="请输入新的手机号" />
                    </el-form-item>
                    <el-form-item>
                        <div class="verify-code-wrapper">
                            <el-input v-model="phoneForm.code" placeholder="请输入验证码" />
                            <el-button :disabled="isCountingDown" @click="getVerifyCode">
                                {{ countdownText }}
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="dialog-button cancel" @click="() => (changePhoneDialogVisible = false)">取消</div>
                    <div class="dialog-button confirm" @click="handleChangePhone">确定</div>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="bindWechatDialogVisible" title="绑定微信" width="320px" class="bind-wechat-dialog" center
            :before-close="() => (bindWechatDialogVisible = false)">
            <div class="dialog-content">
                <div class="qrcode-container">
                    <div v-if="isQrcodeExpired" class="qrcode-expired-overlay">
                        <span>二维码已过期</span>
                        <el-button type="primary" size="small" @click="refreshQrcode">点击刷新</el-button>
                    </div>
                    <img :src="wechatQrcodeUrl" alt="WeChat QR Code" :class="{ expired: isQrcodeExpired }" />
                </div>
                <p class="scan-tip">扫码绑定微信</p>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { UserFilled, UploadFilled } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { isDark } from '@/utils/theme';
import { UserCenterGetUserInfo, UserCenterUpdateUserInfo, UserUpdateAvatar } from '@/api/userCenter';
import type { UploadProps } from 'element-plus';

const userStore = useUserStore();
const editMode = ref(false);
const saving = ref(false);

const user = reactive({
    userName: '',
    nickName: '',
    registedDate: '',
    gender: null,
    profession: '',
    qualifications: null,
    avatarUrl: '',
    phone: '',
    wechat_nickname: '',
});

const originalUser = { ...user };

const profileItems = computed(() => [
    { label: '姓名', value: user.nickName || '-', key: 'nickName', editable: true },
    { label: '注册日期', value: user.registedDate ? new Date(user.registedDate).toLocaleDateString() : '-', key: 'registedDate', editable: false },
    { label: '性别', value: user.gender === 1 ? '男' : (user.gender === 2 ? '女' : '未设置'), key: 'gender', editable: true },
    { label: '专业身份', value: user.profession || '-', key: 'profession', editable: true },
    { label: '职业资格', value: user.qualifications || '-', key: 'qualifications', editable: true },
]);

const fetchUserInfo = async () => {
    try {
        const res = await UserCenterGetUserInfo();
        if (res.data) {
            Object.assign(user, res.data);
            Object.assign(originalUser, res.data);
        }
    } catch (error) {
        ElMessage.error('获取用户信息失败');
        console.error('Fetch user info error:', error);
    }
};

const toggleEditMode = () => {
    editMode.value = !editMode.value;
    if (!editMode.value) {
        Object.assign(user, originalUser);
    }
};

const changeAvatar = () => {
    ElMessage.info('更换头像功能正在开发中');
};

const saveProfile = async () => {
    saving.value = true;
    try {
        const payload = {
            nickName: user.nickName,
            gender: user.gender,
            profession: user.profession,
            qualifications: user.qualifications,
        };
        await UserCenterUpdateUserInfo(payload);
        Object.assign(originalUser, user);
        ElMessage.success('保存成功');
        editMode.value = false;
    } catch (error) {
        ElMessage.error('保存失败');
        console.error('Save profile error:', error);
    } finally {
        saving.value = false;
    }
};

const editDialogVisible = ref(false);
const activeTab = ref('personal');
const dialogFormData = reactive({
    nickName: '',
    gender: null,
    profession: '',
    qualifications: null,
    registedDate: '',
});

const openEditDialog = () => {
    Object.assign(dialogFormData, {
        nickName: user.nickName,
        gender: user.gender,
        profession: user.profession,
        qualifications: user.qualifications,
        registedDate: user.registedDate,
    });
    activeTab.value = 'personal';
    editDialogVisible.value = true;
};

const handleCloseDialog = () => {
    editDialogVisible.value = false;
};

const handleConfirmUpdate = async () => {
    try {
        const payload = {
            nickName: dialogFormData.nickName,
            gender: dialogFormData.gender,
            profession: dialogFormData.profession,
            qualifications: dialogFormData.qualifications,
        };
        await UserCenterUpdateUserInfo(payload);
        ElMessage.success('更新成功');
        await fetchUserInfo();
        handleCloseDialog();
    } catch (error) {
        ElMessage.error('更新失败');
        console.error('Update profile error:', error);
    }
};

const avatarDialogVisible = ref(false);
const uploadedAvatarUrl = ref('');
const avatarFileToUpload = ref<File | null>(null);

const openAvatarDialog = () => {
    uploadedAvatarUrl.value = user.avatarUrl;
    avatarFileToUpload.value = null;
    avatarDialogVisible.value = true;
};

const handleAvatarFileChange: UploadProps['onChange'] = (uploadFile) => {
    avatarFileToUpload.value = uploadFile.raw!;
    uploadedAvatarUrl.value = URL.createObjectURL(uploadFile.raw!);
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const isJpgOrPng = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
    if (!isJpgOrPng) {
        ElMessage.error('头像必须是 JPG/PNG 格式!');
        return false;
    }
    const isLt5M = rawFile.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        ElMessage.error('头像大小不能超过 5MB!');
        return false;
    }
    return true;
};

const getFullImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:')) {
        return path;
    }
    const baseUrl = import.meta.env.VITE_BASE_URL_AVATAR || '';
    const imagePath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${imagePath}`;
};

const handleSaveAvatar = async () => {
    if (!avatarFileToUpload.value) {
        ElMessage.warning('请先上传一张新头像');
        return;
    }
    try {
        const formData = new FormData();
        formData.append('file', avatarFileToUpload.value);

        await UserUpdateAvatar(formData);

        ElMessage.success('头像更新成功');
        // After successful upload, re-fetch user info to get the latest data
        await fetchUserInfo();
        avatarDialogVisible.value = false;
    } catch (e) {
        ElMessage.error('头像更新失败');
        console.error('头像上传失败:', e); // Log the actual error
    }
};

const changePhoneDialogVisible = ref(false);
const phoneForm = reactive({
    phone: '',
    code: ''
});
const isCountingDown = ref(false);
const countdown = ref(60);
const countdownText = computed(() => {
    return isCountingDown.value ? `${countdown.value}s` : '获取验证码';
});

const openChangePhoneDialog = () => {
    editDialogVisible.value = false;
    changePhoneDialogVisible.value = true;
    phoneForm.phone = '';
    phoneForm.code = '';
};

const getVerifyCode = () => {
    if (!phoneForm.phone || !/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
        ElMessage.warning('请输入有效的手机号');
        return;
    }

    isCountingDown.value = true;
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            isCountingDown.value = false;
            countdown.value = 60;
        }
    }, 1000);

    ElMessage.success(`验证码已发送至 ${phoneForm.phone}`);
};

const handleChangePhone = async () => {
    if (!phoneForm.phone || !phoneForm.code) {
        ElMessage.warning('请填写所有字段');
        return;
    }
    try {
        console.log("Changing phone to:", phoneForm);
        ElMessage.success('手机号更换成功');
        await fetchUserInfo();
        changePhoneDialogVisible.value = false;
    } catch (e) {
        ElMessage.error('手机号更换失败');
    }
};

const bindWechatDialogVisible = ref(false);
const wechatQrcodeUrl = ref('src/assets/file-icons/QRcode.png'); // Placeholder QR code
const isQrcodeExpired = ref(false);
let qrcodeTimer: any = null;

const openBindWechatDialog = () => {
    editDialogVisible.value = false;
    bindWechatDialogVisible.value = true;
    refreshQrcode(); // Get a new QR code when opening
};

const refreshQrcode = () => {
    console.log('Refreshing QR code...');
    isQrcodeExpired.value = false;

    // TODO: Call API to get a new QR code URL
    // wechatQrcodeUrl.value = 'new_qrcode_url_from_api';

    // Clear any existing timer
    if (qrcodeTimer) clearTimeout(qrcodeTimer);

    // Simulate expiration
    qrcodeTimer = setTimeout(() => {
        isQrcodeExpired.value = true;
    }, 10000); // Expire after 10 seconds

    ElMessage.success('二维码已刷新');
};

onMounted(() => {
    fetchUserInfo();
});

const bgColor = computed(() => isDark.value ? '#000000' : '#FFFFFF');
const textColor = computed(() => isDark.value ? '#E7E7E0' : '#333333');
const labelColor = computed(() => isDark.value ? '#8E9094' : '#606266');
const borderColor = computed(() => isDark.value ? 'rgba(51, 51, 51, 0.3)' : 'rgba(231, 231, 224, 0.3)');
const linkColor = computed(() => isDark.value ? '#C4C4D3' : '#333333');
const linkHoverColor = computed(() => isDark.value ? '#FFFFFF' : '#000000');
</script>

<style scoped lang="less">
.account-container {
    padding: 20px;
    background-color: v-bind(bgColor);
    min-height: 100%;
    max-width: 437px;
    margin: 0 auto;
}

.page-title {
    font-size: 24px;
    color: v-bind(textColor);
    margin-bottom: 30px;
    font-weight: 600;
    text-align: left;
}

.account-card {
    background-color: v-bind(bgColor);
    color: v-bind(textColor);
}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .el-avatar {
        margin-right: 20px;
    }

    .user-details {
        width: 80%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 8px;
    }

    .username {
        font-size: 16px;
        font-weight: 500;
    }

    .edit-links {
        display: flex;
        align-items: center;

        .edit-link {
            font-size: 12px;
            color: v-bind(linkColor);
            text-decoration: none;
            transition: color 0.3s;

            &:hover {
                color: v-bind(linkHoverColor);
            }
        }

        .el-divider--vertical {
            height: 12px;
            margin: 0 10px;
            background-color: v-bind(borderColor);
        }
    }
}

.details-list {
    display: flex;
    flex-direction: column;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid v-bind(borderColor);

    &:first-child {
        border-top: 1px solid v-bind(borderColor);
    }

    .detail-label {
        font-size: 12px;
        color: v-bind(labelColor);
    }

    .detail-value {
        font-size: 12px;
        font-weight: 500;
        color: v-bind(textColor);

        .el-input {
            width: 200px;
        }
    }
}

.save-button-container {
    margin-top: 30px;
    text-align: right;
}

.profile-dialog {
    .el-dialog__header {
        text-align: center;
        padding-top: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid v-bind(borderColor);

        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
        }
    }

    .el-dialog__body {
        padding: 30px 30px 0 30px;
    }

    .dialog-content {
        .profile-tabs {
            .el-tabs__header {
                margin: 0 0 30px;

                .el-tabs__nav-wrap::after {
                    height: 1px;
                    background-color: v-bind(borderColor);
                }

                .el-tabs__item {
                    font-size: 14px;
                }
            }
        }

        .form-item-content {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: space-between;

            .action-link {
                color: #F9DE4A;
                padding: 0;
                text-decoration: none;
                border: none !important;

            }
        }
    }

    .el-dialog__footer {
        padding: 30px;

        .el-button {
            // width: 80px; // remove fixed size
            // height: 36px; // remove fixed size
        }
    }
}

.avatar-dialog {
    width: 300px;
    height: 410px;

    .el-dialog__header {
        text-align: left;
        padding: 30px;

        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
        }
    }

    .dialog-content {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 30px 40px;

        .avatar-uploader {
            width: 200px;
            height: 200px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #2a2a2a;
            border: 1px solid v-bind(borderColor);

            &:hover {
                border-color: #F9DE4A;
            }

            .avatar {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .uploader-icon-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #8c939d;

                .avatar-uploader-icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                }

                .upload-tip {
                    font-size: 12px;
                    margin-top: 5px;
                    color: #666;
                }
            }
        }
    }

    .el-dialog__footer {
        padding: 30px;

        .el-button {
            // width: 80px; // remove fixed size
            // height: 36px; // remove fixed size
        }
    }
}

.change-phone-dialog {
    .el-dialog__header {
        padding: 30px;
        border-bottom: 1px solid v-bind(borderColor);

        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
        }
    }

    .dialog-content {
        padding: 20px 30px;

        .verify-code-wrapper {
            display: flex;
            width: 100%;

            .el-input {
                margin-right: 15px;
            }

            .el-button {
                flex-shrink: 0;
            }
        }
    }

    .el-dialog__footer {
        padding: 30px;

        .el-button {
            // width: 80px; // remove fixed size
            // height: 36px; // remove fixed size
        }
    }
}

.bind-wechat-dialog {
    .el-dialog__header {
        padding: 30px;
        border-bottom: 1px solid v-bind(borderColor);

        .el-dialog__title {
            font-size: 18px;
            font-weight: 600;
        }
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 30px 40px;

        .qrcode-container {
            position: relative;
            width: 180px;
            height: 180px;
            border: 1px solid v-bind(borderColor);
            padding: 10px;
            background-color: white;

            img {
                width: 100%;
                height: 100%;

                &.expired {
                    filter: blur(3px);
                }
            }

            .qrcode-expired-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10;

                span {
                    margin-bottom: 15px;
                }
            }
        }

        .scan-tip {
            margin-top: 15px;
            font-size: 14px;
            color: v-bind(labelColor);
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;

    .dialog-button {
        padding: 8px 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        margin-left: 12px;

        &.cancel {
            background-color: #F5F5F5;
            color: #666666;
            border: 1px solid #E4E4E4;

            &:hover {
                background-color: #E8E8E8;
                border-color: #D4D4D4;
            }
        }

        &.confirm {
            background-color: rgba(249, 222, 74, 1);
            color: #1B2126;

            &:hover {
                background-color: #B4B4C3;
            }
        }
    }
}

html.dark {
    .dialog-footer {
        .dialog-button {
            &.cancel {
                background-color: #2B2B2B;
                color: #C4C4D3;
                border: 1px solid #3B3B3B;

                &:hover {
                    background-color: #3B3B3B;
                    border-color: #4B4B4B;
                }
            }

            &.confirm {
                background-color: rgba(249, 222, 74, 1);
                color: #1B2126;

                &:hover {
                    background-color: #B4B4C3;
                }
            }
        }
    }
}
</style>