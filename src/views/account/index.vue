<template>
    <div class="account-container">
        <h1 class="page-title">账号管理</h1>
        <div class="account-card">
            <div class="profile-header">
                <el-avatar :size="55" :icon="UserFilled" :src="getFullImageUrl(user.avatarUrl)"
                    @click="openAvatarDialog" style="cursor: pointer;" />
                <div class="user-details">
                    <!-- <div class="username">{{ user.userName }}</div> -->
                    <div class="username">
                        <div class="topname">用户名</div>
                        <div class="topnamev">{{ user.userName }}</div>
                    </div>
                    <div class="edit-links">
                        <a href="javascript:;" class="edit-link" @click="openAvatarDialog">更换头像</a>
                        <!-- <el-divider direction="vertical" /> -->
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

        <el-dialog v-model="editDialogVisible" title="编辑资料" width="480px" class="profile-dialog" left
            :before-close="handleCloseDialog">
            <div class="dialog-content">
                <el-tabs v-model="activeTab" class="profile-tabs">
                    <el-tab-pane label="个人资料" name="personal">
                        <el-form :model="dialogFormData" label-position="right" label-width="80px">
                            <el-form-item label="注册日期">
                                <el-date-picker :model-value="dialogFormData.registedDate" type="date"
                                    placeholder="注册日期" disabled style="width: 100%;" />
                            </el-form-item>
                            <el-form-item label="用户姓名">
                                <el-input v-model="dialogFormData.nickName" placeholder="请输入姓名" class="custom-input" />
                            </el-form-item>
                            <el-form-item label="性别">
                                <el-radio-group v-model="dialogFormData.gender">
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="所在地区">
                                <div class="address-group">
                                    <el-select v-model="country" disabled>
                                        <el-option label="中国" value="中国" />
                                    </el-select>
                                    <el-select v-model="selectedProvince" placeholder="选择省份" @change="onProvinceChange"
                                        clearable>
                                        <el-option v-for="item in provinceOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                    <el-select v-model="selectedCity" placeholder="选择城市" :disabled="!selectedProvince"
                                        clearable>
                                        <el-option v-for="item in cityOptions" :key="item.value" :label="item.label"
                                            :value="item.value" />
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="专业身份">
                                <el-select v-model="dialogFormData.profession" placeholder="请选择" class="custom-input">
                                    <el-option v-for="item in professionOptions" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职业资格">
                                <el-select v-model="dialogFormData.qualifications" placeholder="请选择职业资格" clearable
                                    class="custom-input">
                                    <el-option v-for="item in qualificationOptions" :key="item.value"
                                        :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>


                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="账号安全" name="security">
                        <el-form label-position="right" label-width="80px" style="padding-top: 5px;padding-right: 2px;">
                            <el-form-item label="用户名">
                                <span>{{ user.userName }}</span>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <div class="phone-row">
                                    <el-input :model-value="maskedPhone" disabled
                                        style="width: 200px; margin-right: 16px;" class="custom-input">
                                        <template #suffix>
                                            <div class="change-phone-btn" @click="openChangePhoneDialog">更改</div>
                                        </template>
                                    </el-input>
                                    <el-checkbox v-model="dialogFormData.phoneInvisible" style="color: #ff9900 !important;">不公开我的手机号</el-checkbox>
                                </div>
                            </el-form-item>
                            <el-form-item label="登录密码">
                                <div class="form-item-content">
                                    <span>******</span>
                                    <el-button type="text" class="action-link"
                                        @click="openChangePasswordDialog">修改</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="绑定微信">
                                <div class="form-item-content">
                                    <span>{{ user.wechat_nickname || '未关联' }}</span>
                                    <el-button type="text" class="action-link"
                                        @click="user.wechat_nickname ? handleUnbindWechat() : openBindWechatDialog()">
                                        {{ user.wechat_nickname ? '解除绑定' : '绑定' }}
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

        <el-dialog v-model="avatarDialogVisible" title="设置头像" width="400px" class="avatar-dialog" left
            :before-close="() => (avatarDialogVisible = false)">
            <div class="dialog-content" >
                <!-- 上传头像部分，只在未选择图片时显示 -->
                <el-upload v-if="!isImageSelected" class="avatar-uploader" :auto-upload="false" :show-file-list="false"
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

                <!-- 裁剪头像部分，只在已选择图片时显示 -->
                <div v-if="isImageSelected" class="cropper-container">
                    <img ref="imageRef" :src="uploadedAvatarUrl" alt="选择的头像" style="max-width: 100%;" />
                    <!-- <div style="text-align:center;margin-top:10px;">
                        <el-button size="small" @click="isImageSelected = false">重新选择图片</el-button>
                    </div> -->
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <div class="dialog-button cancel" @click="() => (avatarDialogVisible = false)">
                        取消
                    </div>
                    <div class="dialog-button confirm" @click="handleSaveAvatar">
                        保存
                    </div>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="changePhoneDialogVisible" title="更换手机号" width="480px" class="profile-dialog" center
            :before-close="handleClosePhoneDialog">
            <div class="dialog-content">
                <el-form :model="phoneForm" label-position="top" class="phone-form">
                    <el-form-item label="新手机号" prop="phone">
                        <el-input v-model="phoneForm.phone" placeholder="请输入新手机号" />
                    </el-form-item>
                    <el-form-item label="验证码" prop="code" class="verify-code-item">
                        <el-input v-model="phoneForm.code" placeholder="请输入验证码" />
                        <el-button type="text" class="get-code-btn" @click="handleSendCode" :disabled="countdown > 0">
                            {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="dialog-button cancel" @click="handleClosePhoneDialog">取消</div>
                    <div class="dialog-button confirm" @click="handleConfirmChangePhone">确定</div>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="bindWechatDialogVisible" title="绑定微信" width="320px" class="bind-wechat-dialog" center
            :before-close="() => (bindWechatDialogVisible = false)">
            <div class="dialog-content">
                <div class="qrcode-container" v-loading="isQrcodeLoading" element-loading-text="二维码加载中...">
                    <div v-if="isQrcodeExpired" class="qrcode-expired-overlay">
                        <span>二维码已过期</span>
                        <el-button type="primary" size="small" @click="refreshQrcode">点击刷新</el-button>
                    </div>
                    <div id="bind_wechat_container" class="wechat-login-container"></div>
                </div>
                <p class="scan-tip">扫码绑定微信</p>
            </div>
        </el-dialog>

        <!-- Change Password Dialog -->
        <el-dialog v-model="changePasswordDialogVisible" title="修改密码" width="480px" class="profile-dialog" center
            :before-close="() => changePasswordDialogVisible = false">
            <div class="dialog-content">
                <el-form :model="passwordForm" ref="passwordFormRef" :rules="passwordRules" label-position="top"
                    class="phone-form">
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码"
                            show-password />
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword">
                        <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码"
                            show-password />
                    </el-form-item>
                    <el-form-item label="确认新密码" prop="confirmPassword">
                        <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码"
                            show-password />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <div class="dialog-button cancel" @click="() => changePasswordDialogVisible = false">取消</div>
                    <div class="dialog-button confirm" @click="handleConfirmChangePassword">确定</div>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { UserFilled, UploadFilled } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { isDark } from '@/utils/theme';
import {
    UserCenterGetUserInfo,
    UserCenterUpdateUserInfo,
    UserUpdateAvatar,
    sendBindPhoneCode,
    bindPhone,
    UserCenterUpdatePwd,
    UserLoginOut,
    wedBindWx,
    unbindWxAll
} from '@/api/userCenter';
import { getProfessionList, getProfessionalList } from '@/api/dict';
import { getProvinceList, getCityList, getAddressInfo } from '@/api/location';
import type { UploadProps } from 'element-plus';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

interface AddressOption {
    value: string | number;
    label: string;
    children?: AddressOption[];
}

const router = useRouter();
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
    address: '',
    locationId: null,
    phoneInvisible: false,
});

const originalUser = { ...user };

const allProvinces = ref<any[]>([]);
const allCities = ref<any[]>([]);

// 按需加载：不再全量预取所有城市，仅在选择省份时加载城市列表

// 已移除旧的 getLocationNameById，按需加载下不再使用
const locationDisplay = ref('-');

const profileItems = computed(() => [
    { label: '姓名', value: user.nickName || '-', key: 'nickName', editable: true },
    { label: '注册日期', value: user.registedDate ? new Date(user.registedDate).toLocaleDateString() : '-', key: 'registedDate', editable: false },
    { label: '性别', value: user.gender === 1 ? '男' : (user.gender === 2 ? '女' : '未设置'), key: 'gender', editable: true },
    { label: '专业身份', value: user.profession || '-', key: 'profession', editable: true },
    { label: '职业资格', value: user.qualifications || '-', key: 'qualifications', editable: true },
    { label: '所在地区', value: locationDisplay.value, key: 'address', editable: false },
]);

const fetchUserInfo = async () => {
    try {
        const res = await UserCenterGetUserInfo();
        if (res.data) {
            Object.assign(user, res.data);
            Object.assign(originalUser, res.data);
            // 优先使用后端 address
            if (user.address) {
                locationDisplay.value = user.address;
            } else if (user.locationId) {
                try {
                    const info = await getAddressInfo(user.locationId);
                    if (info && info.code === 200) {
                        // 期望 info.data 返回 { name, parentName } 之类，这里做兜底拼接
                        const data: any = info.data || {};
                        const name = data.name || '';
                        const parentName = data.parentName || '';
                        const parts = ['中国', parentName, name].filter(Boolean);
                        locationDisplay.value = parts.length > 1 ? parts.join(',') : (name || '-');
                    }
                } catch (e) {
                    // 忽略错误，保持默认显示
                }
            } else {
                locationDisplay.value = '-';
            }
        }
    } catch (error) {
        console.error('Fetch user info error:', error);
    }
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
        console.error('Save profile error:', error);
    } finally {
        saving.value = false;
    }
};

const editDialogVisible = ref(false);
const activeTab = ref('personal');
const dialogFormData = ref<Partial<typeof user>>({});

const maskedPhone = computed(() => {
    if (dialogFormData.value.phoneInvisible && user.phone) {
        const phoneStr = String(user.phone);
        // A simple check for Chinese mobile numbers
        if (phoneStr.length === 11) {
            return phoneStr.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
    }
    return user.phone;
});

const professionOptions = ref<{ label: string; value: any; }[]>([]);
const qualificationOptions = ref<{ label: string; value: any; }[]>([]);

// 地址选择相关
const country = ref('中国');
const selectedProvince = ref('');
const selectedCity = ref('');
const provinceOptions = ref<AddressOption[]>([]);
const cityOptions = ref<AddressOption[]>([]);

const fetchProfessionOptions = async () => {
    try {
        const res = await getProfessionList();
        if (res.code === 200 && res.data) {
            professionOptions.value = res.data.map((item: any) => ({
                label: item.name,
                value: item.name,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch profession options:', error);
    }
};

const fetchQualificationOptions = async () => {
    try {
        const res = await getProfessionalList();
        if (res.code === 200 && res.data) {
            qualificationOptions.value = res.data.map((item: any) => ({
                label: item.name,
                value: item.name,
            }));
        }
    } catch (error) {
        console.error('Failed to fetch qualification options:', error);
    }
};

const getProvinceData = async () => {
    try {
        const res = await getProvinceList();
        if (res.code === 200) {
            provinceOptions.value = res.data.map((item: any) => ({
                value: item.id,
                label: item.name
            }));
        }
    } catch (error) {
        console.error('获取省份列表失败:', error);
    }
};

const getCityData = async (provinceId: string | number) => {
    try {
        const res = await getCityList(provinceId);
        if (res.code === 200) {
            cityOptions.value = res.data.map((item: any) => ({
                value: item.id,
                label: item.name
            }));
        } else {
            cityOptions.value = [];
        }
    } catch (error) {
        console.error('获取城市列表失败:', error);
        cityOptions.value = [];
    }
};

const onProvinceChange = async (provinceId: string | number) => {
    selectedCity.value = '';
    if (provinceId) {
        await getCityData(provinceId);
    } else {
        cityOptions.value = [];
    }
};

const openEditDialog = async () => {
    dialogFormData.value = { ...user };
    activeTab.value = 'personal';
    editDialogVisible.value = true;

    // 优先根据 locationId 回显
    if (user.locationId) {
        // 查城市
        const city = allCities.value.find((c: any) => String(c.id) === String(user.locationId));
        if (city) {
            selectedProvince.value = city.provinceId;
            await getCityData(city.provinceId);
            selectedCity.value = city.id;
            return;
        }
        // 查省份
        const province = allProvinces.value.find((p: any) => String(p.id) === String(user.locationId));
        if (province) {
            selectedProvince.value = province.id;
            await getCityData(province.id);
            selectedCity.value = '';
            return;
        }
    }
    // 兜底用 address
    selectedProvince.value = '';
    selectedCity.value = '';
    cityOptions.value = [];
    const address = dialogFormData.value.address;
    if (address) {
        const arr = address.split(',');
        if (arr.length > 1 && arr[1]) {
            const provinceName = arr[1];
            if (provinceOptions.value.length === 0) {
                await getProvinceData();
            }
            const province = provinceOptions.value.find(p => p.label === provinceName);
            if (province) {
                selectedProvince.value = province.value as string;
                await getCityData(province.value);
                if (arr.length > 2 && arr[2]) {
                    const cityName = arr[2];
                    const city = cityOptions.value.find(c => c.label === cityName);
                    if (city) {
                        selectedCity.value = city.value as string;
                    }
                }
            }
        }
    }
};

const handleCloseDialog = () => {
    editDialogVisible.value = false;
};

const handleConfirmUpdate = async () => {
    console.log('handleConfirmUpdate 被调用');
    console.log('activeTab.value:', activeTab.value);

    if (activeTab.value === 'personal') {
        try {
            console.log('开始处理个人资料更新');
            const provinceLabel = provinceOptions.value.find(p => p.value === selectedProvince.value)?.label;
            const cityLabel = cityOptions.value.find(c => c.value === selectedCity.value)?.label;

            const addressParts = ['中国', provinceLabel, cityLabel].filter(Boolean);
            const addressString = addressParts.length > 1 ? addressParts.join(',') : '中国';

            const locationId = selectedCity.value || selectedProvince.value || dialogFormData.value.locationId;

            // 构建完整的请求体，包含所有必要字段
            const params = {
                // userName: dialogFormData.value.userName,
                nickName: dialogFormData.value.nickName,
                gender: dialogFormData.value.gender,
                profession: dialogFormData.value.profession,
                qualifications: dialogFormData.value.qualifications,
                // registedDate: dialogFormData.value.registedDate,
                address: addressString,
                locationId: locationId,
                phoneInvisible: dialogFormData.value.phoneInvisible,
                phone: dialogFormData.value.phone,
                oldPhone: dialogFormData.value.phone, // 保持原手机号
                password: '', // 密码字段为空
                status: false // 状态字段
            };


            await UserCenterUpdateUserInfo(params);
            await fetchUserInfo(); // 重新获取用户信息
            editDialogVisible.value = false;
            ElMessage.success('更新成功');
        } catch (error) {
            ElMessage.error('更新失败，请重试');
        }
    } else if (activeTab.value === 'security') {
        try {
            console.log('开始处理账号安全更新');
            // 账号安全标签页只需要更新 phoneInvisible 字段
            const params = {
                // userName: dialogFormData.value.userName,
                nickName: dialogFormData.value.nickName,
                gender: dialogFormData.value.gender,
                profession: dialogFormData.value.profession,
                qualifications: dialogFormData.value.qualifications,
                // registedDate: dialogFormData.value.registedDate,
                address: dialogFormData.value.address,
                locationId: dialogFormData.value.locationId,
                phoneInvisible: dialogFormData.value.phoneInvisible,
                phone: dialogFormData.value.phone,
                oldPhone: dialogFormData.value.phone,
                password: '',
                status: false
            };

            await UserCenterUpdateUserInfo(params);
            await fetchUserInfo(); // 重新获取用户信息
            editDialogVisible.value = false;
            ElMessage.success('更新成功');
        } catch (error) {
            console.error('更新失败:', error);
            ElMessage.error('更新失败，请重试');
        }
    } else {
        console.log('不是个人资料或账号安全标签页，直接关闭对话框');
        editDialogVisible.value = false;
    }
};

const avatarDialogVisible = ref(false);
const uploadedAvatarUrl = ref('');
const avatarFileToUpload = ref<File | null>(null);
const isImageSelected = ref(false);
const cropper = ref<any>(null);
const imageRef = ref<HTMLImageElement | null>(null);

const openAvatarDialog = () => {
    uploadedAvatarUrl.value = user.avatarUrl;
    avatarFileToUpload.value = null;
    isImageSelected.value = false;

    // 安全地销毁裁剪器实例
    if (cropper.value && typeof cropper.value.destroy === 'function') {
        try {
            cropper.value.destroy();
        } catch (error) {
            console.warn('销毁裁剪器时出错:', error);
        }
    }
    cropper.value = null;

    avatarDialogVisible.value = true;
};

const handleAvatarFileChange: UploadProps['onChange'] = (uploadFile) => {
    const file = uploadFile.raw!;
    avatarFileToUpload.value = file;

    const reader = new FileReader();
    reader.onload = () => {
        uploadedAvatarUrl.value = URL.createObjectURL(file);
        isImageSelected.value = true;

        // 等图片加载完成后初始化裁剪器
        nextTick(() => {
            if (imageRef.value) {
                // 安全地销毁之前的裁剪器
                if (cropper.value && typeof cropper.value.destroy === 'function') {
                    try {
                        cropper.value.destroy();
                    } catch (error) {
                        console.warn('销毁旧裁剪器时出错:', error);
                    }
                }

                // 创建新的Image对象来确保加载完成
                const img = new Image();
                img.onload = () => {
                    try {
                        // 创建新的裁剪器实例
                        cropper.value = new Cropper(imageRef.value!, {
                            aspectRatio: 1, // 设置裁剪框为正方形
                            viewMode: 1, // 设置视图模式
                            autoCropArea: 1, // 自动裁剪区域
                            zoomable: true, // 是否允许缩放
                            scalable: true, // 是否允许缩放
                            cropBoxResizable: false, // 禁止裁剪框调整
                            background: false, // 不显示背景
                        } as any);
                    } catch (error) {
                        console.error('创建裁剪器实例失败:', error);
                        ElMessage.error('初始化图片裁剪器失败，请重试');
                    }
                };
                img.onerror = () => {
                    console.error('图片加载失败');
                    ElMessage.error('图片加载失败，请重试');
                };
                img.src = uploadedAvatarUrl.value;
            }
        });
    };
    reader.readAsDataURL(file);
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
    if (!cropper.value || typeof cropper.value.getCroppedCanvas !== 'function') {
        ElMessage.warning('请先选择并裁剪头像');
        return;
    }

    try {
        console.log('Cropper instance:', cropper.value);
        console.log('Cropper methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(cropper.value)));

        // 获取裁剪后的canvas
        const canvas = cropper.value.getCroppedCanvas({
            width: 200,
            height: 200,
        });

        if (!canvas) {
            ElMessage.error('裁剪失败，请重试');
            return;
        }

        // 将canvas转换为blob
        canvas.toBlob(async (blob: Blob | null) => {
            if (blob) {
                // 创建FormData
                const formData = new FormData();
                formData.append('file', blob, 'avatar.png');

                try {
                    await UserUpdateAvatar(formData);
                    ElMessage.success('头像上传成功');
                    avatarDialogVisible.value = false;
                    await fetchUserInfo();
                } catch (error) {
                    console.error('Avatar upload error:', error);
                    ElMessage.error('头像上传失败');
                }
            } else {
                ElMessage.error('图片转换失败');
            }
        }, 'image/png');
    } catch (error) {
        console.error('Crop error:', error);
        ElMessage.error('头像裁剪失败，请重试');
    }
};

const changePhoneDialogVisible = ref(false);
const phoneForm = reactive({
    phone: '',
    code: '',
});
const countdown = ref(0);
let timer: any = null;

const openChangePhoneDialog = () => {
    phoneForm.phone = '';
    phoneForm.code = '';
    countdown.value = 0;
    if (timer) clearInterval(timer);
    changePhoneDialogVisible.value = true;
};

const handleSendCode = async () => {
    if (!phoneForm.phone) {
        ElMessage.warning('请输入手机号');
        return;
    }
    // Basic phone number validation
    if (!/^1\d{10}$/.test(phoneForm.phone)) {
        ElMessage.warning('请输入正确的手机号格式');
        return;
    }
    try {
        await sendBindPhoneCode(phoneForm.phone);
        ElMessage.success('验证码已发送');
        countdown.value = 60;
        timer = setInterval(() => {
            if (countdown.value > 0) {
                countdown.value--;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    } catch (error) {
        console.error('Send code error:', error);
    }
};

const handleConfirmChangePhone = async () => {
    if (!phoneForm.phone || !phoneForm.code) {
        ElMessage.warning('请填写完整的手机号和验证码');
        return;
    }
    try {
        await bindPhone({ phone: phoneForm.phone, code: phoneForm.code });
        ElMessage.success('手机号更换成功');
        changePhoneDialogVisible.value = false;
        await fetchUserInfo();
    } catch (error) {
        console.error('Change phone error:', error);
    }
};

const handleClosePhoneDialog = () => {
    changePhoneDialogVisible.value = false;
};

const bindWechatDialogVisible = ref(false);
const isQrcodeExpired = ref(false);
const isQrcodeLoading = ref(false);
let qrcodeTimer: any = null;

const openBindWechatDialog = () => {
    editDialogVisible.value = false;
    bindWechatDialogVisible.value = true;
    refreshQrcode(); // Get a new QR code when opening
};

const refreshQrcode = async () => {
    console.log('Refreshing QR code...');
    isQrcodeLoading.value = true;
    isQrcodeExpired.value = false;

    try {
        // 初始化微信登录
        initWxLogin();

        // Clear any existing timer
        if (qrcodeTimer) clearTimeout(qrcodeTimer);

        // 设置二维码过期时间（5分钟）
        qrcodeTimer = setTimeout(() => {
            isQrcodeExpired.value = true;
        }, 300000); // 5分钟

        ElMessage.success('二维码已刷新');
    } catch (error) {
        console.error('Failed to refresh QR code:', error);
        ElMessage.error('二维码刷新失败，请重试');
    } finally {
        isQrcodeLoading.value = false;
    }
};

// 微信登录相关
const initWxLogin = () => {
    const { hostname } = window.location;
    let signinUrl = 'WorkHome';
    if (hostname === 'work-uat.gatherbee.cn') {
        signinUrl += '-uat';
    } else if (hostname === 'work.dev.ifeng.com') {
        signinUrl += '-sit';
    }
    const redirectUri = `https://www.gatherbee.cn/${signinUrl}`;

    // 清空容器
    const container = document.getElementById('bind_wechat_container');
    if (container) {
        container.innerHTML = '';
    }

    // 声明WxLogin类型
    const WxLogin = (window as any).WxLogin;

    new WxLogin({
        self_redirect: true,
        id: 'bind_wechat_container',
        appid: import.meta.env.VITE_BASE_APP_ID,
        scope: 'snsapi_login',
        redirect_uri: redirectUri,
        state: 'from_wxweb',
        style: 'black',
        href: 'data:text/css;base64,LmltcG93ZXJCb3ggLnRpdGxlIHsKCWRpc3BsYXk6IG5vbmU7Cn0KCi5pbXBvd2VyQm94IC5xcmNvZGUgewoJYm9yZGVyOiAxcHggc29saWQgIzk5OTsKCXdpZHRoOiAyMzhweDsKCWhlaWdodDogMjM4cHg7Cglib3JkZXItcmFkaXVzOiA4cHg7CgltYXJnaW46IDA7Cn0KCi5pbXBvd2VyQm94IC5pbmZvIHsKCWRpc3BsYXk6IG5vbmU7Cn0KCi5pbXBvd2VyQm94IC53cnBfY29kZSB7Cgl3aWR0aDogMTAwJTsKfQoKLmltcG93ZXJCb3ggewoJd2lkdGg6IDIzOHB4Owp9CgouaW1wb3dlckJveCAuaWNvbjM4X21zZyB7CglkaXNwbGF5OiBub25lOwoJd2lkdGg6IDQ0cHg7CgloZWlnaHQ6IDQ0cHg7CgliYWNrZ3JvdW5kLXNpemU6IGNvdmVyOwp9CgouaW1wb3dlckJveCAuc3RhdHVzX3R4dCB7Cgl0ZXh0LWFsaWduOiBjZW50ZXI7Cn0KLndlYl9xcmNvZGVfdHlwZV9pZnJhbWUgewoJaGVpZ2h0OiAzMDBweDsKfQ==',
    });

    // 监听微信登录消息
    window.addEventListener('message', handleWxBindMessage, false);
};

const handleWxBindMessage = (event: MessageEvent) => {
    if (event.origin !== 'https://open.work.weixin.qq.com') return;

    const loginData = event.data;
    if (loginData.wx_code) {
        console.log('微信绑定成功，code:', loginData.wx_code);
        handleWxBindSuccess(loginData.wx_code);
    }
};

const handleWxBindSuccess = async (code: string) => {
    try {
        // 调用绑定微信API
        const { data, code: responseCode, msg } = await wedBindWx(code);
        if (data && responseCode === 200) {
            ElMessage.success('微信绑定成功');
            bindWechatDialogVisible.value = false;
            await fetchUserInfo(); // 重新获取用户信息
        } else {
            ElMessage.error(msg || '微信绑定失败');
        }
    } catch (error) {
        console.error('微信绑定失败:', error);
        ElMessage.error('微信绑定失败，请重试');
    }
};

// 解绑微信
const handleUnbindWechat = async () => {
    try {
        const { data, code, msg } = await unbindWxAll();
        if (data && code === 200) {
            ElMessage.success('解除微信绑定成功');
            await fetchUserInfo(); // 重新获取用户信息
        } else {
            ElMessage.error(msg || '解除绑定失败');
        }
    } catch (error) {
        console.error('解除微信绑定失败:', error);
        ElMessage.error('解除绑定失败，请重试');
    }
};

// Change Password Dialog
const changePasswordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const validatePass = (_rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入新密码'));
    } else if (value.length < 6 || value.length > 16) {
        callback(new Error('密码长度应为6-16位'));
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        callback(new Error('密码必须包含大小写字母和数字'));
    } else if (value === passwordForm.oldPassword) {
        callback(new Error('新密码不能与旧密码相同'));
    } else {
        if (passwordForm.confirmPassword !== '') {
            if (!passwordFormRef.value) return;
            passwordFormRef.value.validateField('confirmPassword', () => { });
        }
        callback();
    }
};
const validatePass2 = (_rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== passwordForm.newPassword) {
        callback(new Error("两次输入的密码不一致!"));
    } else {
        callback();
    }
};

const passwordRules = reactive<FormRules>({
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [{ validator: validatePass, trigger: 'blur' }],
    confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
});

const openChangePasswordDialog = () => {
    passwordForm.oldPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    if (passwordFormRef.value) {
        passwordFormRef.value.resetFields();
    }
    changePasswordDialogVisible.value = true;
};

const handleConfirmChangePassword = async () => {
    if (!passwordFormRef.value) return;
    await passwordFormRef.value.validate(async (valid) => {
        if (valid) {
            try {
                await UserCenterUpdatePwd({
                    originalPassword: passwordForm.oldPassword,
                    password: passwordForm.newPassword,
                    passwordTwo: passwordForm.confirmPassword,
                });
                ElMessage.success('密码修改成功，请重新登录');

                // Logout user
                await UserLoginOut();
                userStore.clearUserInfo();
                router.push('/login');

            } catch (error) {
                console.error('Change password error:', error);
            }
        }
    });
};

onMounted(async () => {
    await fetchUserInfo();
    await fetchProfessionOptions();
    await fetchQualificationOptions();
    await getProvinceData();
});

// 组件卸载时清理定时器
onUnmounted(() => {
    if (qrcodeTimer) {
        clearTimeout(qrcodeTimer);
        qrcodeTimer = null;
    }
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    // 清理微信登录事件监听器
    window.removeEventListener('message', handleWxBindMessage);
    // 安全地清理裁剪器实例
    if (cropper.value && typeof cropper.value.destroy === 'function') {
        try {
            cropper.value.destroy();
        } catch (error) {
            console.warn('组件卸载时销毁裁剪器出错:', error);
        }
    }
    cropper.value = null;
});

const bgColor = computed(() => isDark.value ? '#000' : '#faf9f5');
const textColor = computed(() => isDark.value ? '#EDEDED' : '#13343C');
const labelColor = computed(() => isDark.value ? '#8E9094' : '#8E9094');
const borderColor = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7');
const linkColor = computed(() => isDark.value ? '#ff9900' : '#ff9900');
const linkHoverColor = computed(() => isDark.value ? '#FFFFFF' : '#000000');
const desktopBboder = computed(() => isDark.value ? 'rgba(231,231,224,.3)' : '#D7D7D7')//11111

// Dynamic colors for form inputs to adapt to theme changes
const formInputBgColor = computed(() => isDark.value ? '#2a2a2a' : '#faf9f5');
const formInputBorderColor = computed(() => isDark.value ? '#4c4d4f' : '#dcdfe6');
const formInputTextColor = computed(() => isDark.value ? '#FFFFFF' : '#606266');
const formPlaceholderColor = computed(() => isDark.value ? '#666' : '#a8abb2');
</script>

<style lang="less" scoped>
/* Common styles from login page */
@bg-darker: #2a2a2a;
@text-color: #FFFFFF;
@primary-color: #FFBD33;

:deep(.el-tabs__item.is-active) {
    color: v-bind(textColor) !important;
}
:deep(.el-tabs__active-bar) {
    background-color: v-bind(textColor) !important;
}
:deep(.el-checkbox__input.is-checked+.el-checkbox__label ) {
    color: #ff9900 !important;
}
:deep( .el-checkbox__inner) {
    background-color: #ff9900 !important;
    border-color: #ff9900 !important;
}


.account-container {
    padding: 20px;
    // background-color: v-bind(bgColor);
    min-height: 100%;
    max-width: 437px;
    margin: 0 auto;
}

.page-title {
    font-size: 24px;
    color: v-bind(textColor);
    margin-bottom: 30px;
    // font-weight: 500;
    font-weight: 400;
    text-align: left;
}

.account-card {
    background-color: v-bind(bgColor);
    color: v-bind(textColor);
    padding: 30px;
    border-radius: 10px;
    padding-bottom: 10px;
    border: 1px solid v-bind(desktopBboder) !important;

}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

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
        font-weight: 400;
        color: v-bind(labelColor);

        .topname {
            font-size: 12px;
            color: v-bind(textColor);
        }

        .topnamev {
            font-size: 14px;
            font-weight: 500;
            color: v-bind(textColor);
        }
    }

    .edit-links {
        display: flex;
        align-items: center;

        .edit-link {
            font-size: 14px;
            color: v-bind(linkColor);
            text-decoration: none;
            transition: color 0.3s;
            margin-left: 10px;

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
    margin-top: 20px;
}

.detail-item {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 18px 0;
    flex-direction: column;
    border-bottom: 1px solid v-bind(borderColor);

    &:first-child {
        border-top: 1px solid v-bind(borderColor);
    }

    &:last-child {
        border-bottom: none;
    }

    .detail-label {
        font-size: 12px;
        color: v-bind(labelColor);
        padding-left: 10px;
    }

    .detail-value {
        font-size: 14px;
        font-weight: 500;
        color: v-bind(textColor);
        margin-top: 5px;
        padding-left: 10px;


        .el-input {
            width: 200px;
        }
    }
}

.save-button-container {
    margin-top: 30px;
    text-align: right;
}

.profile-dialog,
.avatar-dialog,
.bind-wechat-dialog {
    background-color: v-bind(bgColor);

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
                color: #ff9900 !important;
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

    :deep(.el-input),
    :deep(.el-select) {
        --el-input-bg-color: v-bind(formInputBgColor);
        --el-input-border-color: v-bind(formInputBorderColor);
        --el-input-text-color: v-bind(formInputTextColor);
        --el-input-placeholder-color: v-bind(formPlaceholderColor);

        .el-input__wrapper {
            box-shadow: none !important;
            height: 40px !important;
            background-color: var(--el-input-bg-color) !important;
            border: 1px solid var(--el-input-border-color) !important;
            box-sizing: border-box !important;
            outline: none !important;
            transition: border-color 0.3s ease !important;

            &:hover {
                border-color: #FFBD33 !important;
                box-shadow: none !important;
            }

            &.is-focus {
                border-color: #FFBD33 !important;
                box-shadow: none !important;
            }
        }

        .el-input__inner {
            height: 40px !important;
            line-height: 40px !important;
            color: var(--el-input-text-color) !important;
            box-sizing: border-box !important;
        }

        // 覆盖Element Plus的默认聚焦样式
        &.is-focus .el-input__wrapper {
            border-color: #FFBD33 !important;
            box-shadow: none !important;
        }
    }

    // 全局覆盖Element Plus输入框样式
    :deep(.el-input.is-focus .el-input__wrapper) {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }

    :deep(.el-input .el-input__wrapper.is-focus) {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }

    :deep(.el-select.is-focus .el-input__wrapper) {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }

    // 更具体的选择器
    :deep(.el-form-item .el-input.is-focus .el-input__wrapper) {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }

    :deep(.el-form-item .el-select.is-focus .el-input__wrapper) {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }

    // 确保所有输入框的聚焦状态
    :deep(.el-input__wrapper:focus-within) {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }

    .phone-form {
        :deep(.el-form-item) {
            margin-bottom: 20px;

            .el-form-item__label {
                color: #8E9094;
                margin-bottom: 8px;
            }
        }

        .verify-code-item {
            position: relative;

            .get-code-btn {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: @primary-color;
                font-size: 14px;
                z-index: 2;
                border: none !important;
                background: none !important;
                padding: 0;
                box-shadow: none !important;

                &:disabled {
                    color: #666;
                }

                &:hover,
                &:focus {
                    background: none !important;
                    border: none !important;
                    color: darken(@primary-color, 5%);
                }
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
                    background-color: darken(rgba(249, 222, 74, 1), 10%);
                }
            }
        }
    }
}

.avatar-dialog {
    width: 400px;
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
        padding-bottom: 0;
        // padding: 20px 30px 40px;

        .avatar-uploader {
            width: 340px;
            height: 340px;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: v-bind(bgColor);
            
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

        .cropper-container {
            width: 300px;
            height: 300px;
            border-radius: 6px;
            overflow: hidden;
            background-color: #2a2a2a;
            border: 1px solid v-bind(borderColor);
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        }
    }

    .el-dialog__footer {
        padding: 30px;
        padding-top: 0;

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
        // padding: 20px 30px 40px;

        .qrcode-container {
            position: relative;
            width: 220px;
            height: 220px;
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

            .wechat-login-container {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 60px;
                margin-top: 160px;

                :deep(.wxqrcode) {
                    width: 100% !important;
                    height: 100% !important;
                    box-sizing: border-box;
                    background: transparent !important;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .qrcode {
                        width: 200px !important;
                        height: 200px !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        background: transparent !important;
                    }

                    canvas {
                        width: 200px !important;
                        height: 200px !important;
                        display: block !important;
                    }

                    .status {
                        display: none !important;
                    }

                    .qrcode-area {
                        margin: 0 !important;
                        border: none !important;
                        background: transparent !important;
                    }
                }
            }

            img {
                width: 200px;
                height: 200px;
                object-fit: contain;
                transition: all 0.3s ease;

                &.expired {
                    filter: blur(3px) grayscale(50%);
                    opacity: 0.6;
                }
            }

            .qrcode-expired-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10;
                border-radius: 8px;

                span {
                    margin-bottom: 15px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .el-button {
                    background-color: rgba(249, 222, 74, 1);
                    color: #1B2126;
                    border: none;
                    font-size: 12px;
                    padding: 6px 12px;
                    border-radius: 4px;
                    transition: background-color 0.3s;

                    &:hover {
                        background-color: rgba(255, 234, 101, 1);
                    }
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

.address-group {
    display: flex;
    width: 100%;
    gap: 8px;

    .el-select:nth-child(1) {
        flex: 0 0 120px;
    }

    .el-select:nth-child(2) {
        flex-grow: 2;
    }

    .el-select:nth-child(3) {
        flex-grow: 3;
    }
}

.dialog-content .phone-row {
    display: flex;
    align-items: center;
    gap: 0;

    .change-phone-btn {
        color: #ff9900;
        cursor: pointer;
        font-size: 14px;
    }
}

// 自定义输入框样式
:deep(.custom-input) {
    .el-input__wrapper {
        border: 1px solid var(--el-input-border-color) !important;
        box-shadow: none !important;
        transition: border-color 0.3s ease !important;

        &:hover {
            border-color: #FFBD33 !important;
        }

        &.is-focus {
            border-color: #FFBD33 !important;
            box-shadow: none !important;
        }
    }

    &.is-focus .el-input__wrapper {
        border-color: #FFBD33 !important;
        box-shadow: none !important;
    }
}

// Cropper.js 基本样式
:deep(.cropper-container) {
    position: relative;
    overflow: hidden;
    background-color: #000;
    width: 100%;
    height: 100%;
}

:deep(.cropper-wrap-box) {
    position: relative;
    overflow: hidden;
    background-color: #000;
}

:deep(.cropper-canvas) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.6;
}

:deep(.cropper-drag-box) {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
    opacity: 0.1;
}

:deep(.cropper-crop-box) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

:deep(.cropper-view-box) {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);
}
</style>