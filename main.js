import { Nox } from './Nox.js';
import { Demolia } from './Demolia.js';

// 扱いたいコンビクトのインスタンスを生成して保持
export const convicts = {
    nox: new Nox(),
    demolia: new Demolia()
};

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
    // 画面の敵ステータスを取得
    const enemyDef = parseInt(document.getElementById('enemy-def').value) || 0;
    const isCoreBroken = document.getElementById('is-core-broken').checked;

    // 3. インスタンス側のメソッドを使って計算
    // 1回あたりの通常攻撃ダメージ
    const oneHitFinalDamage = convict.calculateOneHitFinalAttackDamage(convict, enemyDef, isCoreBroken);

    // 4. 画面表示の更新（例: 基礎攻撃力の表示）
    document.getElementById('output-damage').textContent = `${oneHitFinalDamage.toLocaleString()} Damage`;
    const outBaseAtk = document.getElementById('out-base-atk');
    outBaseAtk.textContent = convict.baseAtk;
    
    // 5. デバッグ表示 (共通配列構造の可視化)
    const debugData = {
        targetConvict: convict.name,
        convictAtk: convict.baseAtk,
        returnedSkillEffects: convict.getBuffMods(), // スキルが返した効果配列
        // enemyCondition: {
        //     def: enemyDef,
        //     defFactorRate: `${(result.defRate * 100).toFixed(1)}%`,
        //     coreBreakMultiplier: isCoreBroken ? "150%" : "100%"
        // },
        // finalDamagePerHit: result.damage
    };
    document.getElementById('debug-json').textContent = JSON.stringify(debugData, null, 2);
}

// 【① 画面が開いた時（初期化時）に呼び出す】
window.addEventListener('DOMContentLoaded', () => {
    updateCalculation();
});

// 【② 入力欄の値が変わった時に呼び出す】
const inputIds = [
    'select-convict',
    'char-level',
    'normal-skill-lv',
    'ult-skill-lv',
    'pas1-skill-lv',
    'pas2-skill-lv',
    'enemy-def',
    'is-core-broken',
];

inputIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        // 数値変更（input）とフォーカス外れ/選択変更（change）の両方をトリガーにする
        element.addEventListener('input', updateCalculation);
        element.addEventListener('change', updateCalculation);
    }
});

window.addEventListener('DOMContentLoaded', updateCalculation);
