import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'

const store = createPinia()

export { useUserStore }
export default store 