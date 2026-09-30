import { Nox } from './Nox.js';
import { Demolia } from './Demolia.js';

// 扱いたいコンビクトのインスタンスを生成して保持
export const convicts = {
    nox: new Nox(),
    demolia: new Demolia()
};

/**
 *  入力したコンビクトのステータスに応じたダメージを計算（攻撃速度吟味しての、回数込みで、合計のダメージ？）
 */
function calculateFinalDamage(convict) {
    // 1. 最終ATKの算出
    const finalAtk = calculateFinalAtk(convict);

    // 2. 最終DEF/MDFの算出
    const finalDef = calculateFinalDef(convict);
    // const finalMdf = calculateFinalMdf(convict);

    // 3. 最終ダメージ係数の算出
    const finalDamageMult = calculateFinalDamgeMult(convict);

    // 4. クリティカル補正の算出
    const finalCriticalMult = calculateFinalCriticalMult(convict);

    // 5. その他補正の算出
    const etcMult = calculateFinalEtcMult(convict);

    // 6. 最終ダメージ
    // = (最終ATK - 最終DEF/MDF) × ダメージ係数 × クリティカル × その他補正
    const finalDamage = (finalAtk - finalDef) * finalDamageMult * finalCriticalMult * etcMult

    return finalDamage;
}

/**
 * 画面の入力値を読み取り、コンビクトインスタンスを更新して再計算・画面反映を行う
 */
function updateCalculation() {
    // 1. 画面の入力要素を取得
    const selectConvict = document.getElementById('select-convict').value;
    const level = parseInt(document.getElementById('char-level').value) || 1;
    const normalLv = parseInt(document.getElementById('normal-skill-lv').value) || 1;
    const ultLv = parseInt(document.getElementById('ult-skill-lv').value) || 1;
    const pas1Lv = parseInt(document.getElementById('pas1-skill-lv').value) || 1;
    const pas2Lv = parseInt(document.getElementById('pas2-skill-lv').value) || 1;

    // 2. 選択されたコンビクトインスタンスを取得
    const convict = convicts[selectConvict];
    if (!convict) return;

    // 画面の入力値を反映
    convict.setUserData(level, normalLv, ultLv, pas1Lv, pas2Lv);

    // 3. インスタンス側のメソッドを使って計算
    const finalDamage = calculateFinalDamage(convict);
    // 使ってるところ参考になるかも
    // const currentAtk = convict.calculateBaseAtk();
    // const attackType = document.getElementById('attack-type').value;
    // const skillEffects = convict.getSkillEffects(attackType);

    // 4. 画面表示の更新（例: 基礎攻撃力の表示）
    const outBaseAtk = document.getElementById('out-base-atk');
    if (outBaseAtk) {
        outBaseAtk.textContent = currentAtk;
    }
    
    // （※ ここでさらに敵ステータスとのダメージ計算エンジンを呼び出す）
}

// 【① 画面が開いた時（初期化時）に呼び出す】
window.addEventListener('DOMContentLoaded', () => {
    updateCalculation();
});

// 【② 入力欄の値が変わった時に呼び出す】
const inputIds = [
    'select-convict',
    'char-level',
    'attack-type',
    'normal-skill-lv',
    'ult-skill-lv',
    'pas1-skill-lv',
    'pas2-skill-lv'
];

inputIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        // 数値変更（input）とフォーカス外れ/選択変更（change）の両方をトリガーにする
        element.addEventListener('input', updateCalculation);
        element.addEventListener('change', updateCalculation);
    }
});
