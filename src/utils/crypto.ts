// 引用 crypto-js 加密模块
import CryptoJS from 'crypto-js';

export function RC4Encrypt(val: any) {
  return CryptoJS.RC4.encrypt(val, key).toString();
}

export function RC4Decrypt(val: any) {
  return CryptoJS.RC4.decrypt(val, key).toString(CryptoJS.enc.Utf8);
}
const key = '129828826ASDFG';
