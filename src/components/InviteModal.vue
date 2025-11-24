<template>
    <el-dialog v-model="dialogVisible" :title="t('message.inviteFriends')" width="520px" class="invite-dialog"
        :class="{ 'dark-mode': isDark }" align-center destroy-on-close append-to-body>
        <div class="invite-content">
            <p class="invite-desc">
                <i18n-t keypath="message.inviteDesc" tag="span">
                    <template #code>
                        <span class="invite-code" @click="handleCopyCode">{{ inviteCode }}</span>
                    </template>
                </i18n-t>
            </p>

            <div class="link-container">
                <el-input v-model="inviteLink" readonly class="invite-input" />
            </div>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button class="cancel-btn" @click="dialogVisible = false">{{ t('message.cancel') }}</el-button>
                <el-button type="primary" class="copy-btn" @click="handleCopy">{{ t('message.copyInviteLink')
                }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { isDark } from '@/utils/theme'

const props = defineProps<{
    modelValue: boolean
    url: string
}>()

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const inviteLink = computed(() => {
    return props.url || ''
})

const inviteCode = computed(() => {
    if (!props.url) return ''
    const lastIndex = props.url.lastIndexOf('=')
    if (lastIndex !== -1) {
        return props.url.substring(lastIndex + 1)
    }
    return ''
})

const copyText = async (text: string) => {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
            ElMessage.success(t('message.copySuccess'))
        } else {
            const textArea = document.createElement("textarea")
            textArea.value = text
            textArea.style.position = "fixed"
            textArea.style.left = "-9999px"
            textArea.style.top = "0"
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            const successful = document.execCommand('copy')
            document.body.removeChild(textArea)
            if (successful) {
                ElMessage.success(t('message.copySuccess'))
            } else {
                throw new Error('Copy failed')
            }
        }
    } catch (e) {
        console.error('Copy error:', e)
        ElMessage.error(t('message.copyFailed'))
    }
}

const handleCopy = async () => {
    await copyText(inviteLink.value)
    dialogVisible.value = false
}

const handleCopyCode = async () => {
    await copyText(inviteCode.value)
}
</script>

<style scoped>
.invite-content {
    padding: 10px 0;
}

.invite-desc {
    font-size: 14px;
    color: #333333;
    margin-bottom: 20px;
    line-height: 1.5;
}

.invite-code {
    color: #999999;
    margin: 0 4px;
    cursor: pointer;
}

.link-container {
    margin-bottom: 10px;
}

:deep(.el-dialog) {
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

:deep(.el-dialog__header) {
    margin-right: 0;
    padding: 20px 24px;
    border-bottom: none;
}

:deep(.el-dialog__title) {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
}

:deep(.el-dialog__body) {
    padding: 0 24px 20px;
}

:deep(.el-dialog__footer) {
    padding: 0 24px 24px;
    border-top: none;
}

.invite-input :deep(.el-input__wrapper) {
    background-color: #F5F7FA;
    box-shadow: none;
    border: 1px solid #E4E7ED;
    border-radius: 4px;
}

.invite-input :deep(.el-input__inner) {
    color: #999999 !important;
    font-size: 12px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.cancel-btn {
    background-color: #F2F3F5;
    border: none;
    color: #666666;
    padding: 8px 20px;
    height: 36px;
    border-radius: 4px;
}

.cancel-btn:hover {
    background-color: #E4E7ED;
    color: #606266;
}

.copy-btn {
    background-color: #FABD33 !important;
    border: none;
    color: #333333;
    padding: 8px 20px;
    height: 36px;
    border-radius: 4px;
    font-weight: 600;
}

.copy-btn:hover {
    background-color: #FFC845 !important;
    color: #333333;
}

/* Dark Mode Styles */
.dark-mode :deep(.el-dialog) {
    background-color: #0A0A0A;
    border: 1px solid rgba(34, 34, 34, 0.3);
}

.dark-mode :deep(.el-dialog__title) {
    color: #FFFFFF;
}

.dark-mode .invite-desc {
    color: #C9C9C9;
}

.dark-mode .invite-input :deep(.el-input__wrapper) {
    background-color: #1B2126;
    border: 1px solid #333333;
}

.dark-mode .invite-input :deep(.el-input__inner) {
    color: #C9C9C9;
}

.dark-mode .cancel-btn {
    background-color: #1B2126;
    color: #C9C9C9;
}

.dark-mode .cancel-btn:hover {
    background-color: #333333;
}
</style>
