import { Party } from './Party.js';
import { Nox } from './Nox.js';
import { Shin } from './Shin.js';
import { formatBuffsForDebug } from './Helper.js';

// 扱いたいコンビクトのインスタンスを生成して保持
export const convicts = {
    nox: new Nox(),
    shin: new Shin(),
};

// 1人分のフォームデータをまとめて取得するヘルパー関数
function getConvictFormData(prefix) {
    const selectConvict = document.getElementById(`select-${prefix}`);
    
    if (!selectConvict) return null; // 要素がなければスキップ

    return {
        key: selectConvict.value,
        level: parseInt(document.getElementById(`${prefix}-char-level`)?.value) || 1,
        normalLv: parseInt(document.getElementById(`${prefix}-normal-skill-lv`)?.value) || 1,
        ultLv: parseInt(document.getElementById(`${prefix}-ult-skill-lv`)?.value) || 1,
        pas1Lv: parseInt(document.getElementById(`${prefix}-pas1-skill-lv`)?.value) || 1,
        pas2Lv: parseInt(document.getElementById(`${prefix}-pas2-skill-lv`)?.value) || 1,
    };
}

/**
 * 画面の入力値を読み取り、コンビクトインスタンスを更新して再計算・画面反映を行う
 */
function updateCalculation() {
    // 画面の敵ステータスを取得
    const enemyDef = parseInt(document.getElementById('enemy-def').value) || 0;
    const isCoreBroken = document.getElementById('is-core-broken').checked;

    const party = new Party();
    // プレフィックスの配列（人数分増やす）
    const prefixes = ['cvt1', 'cvt2'];
    const activeConvicts = [];
    // 設定した人数分データを用意する
    prefixes.forEach(prefix => {
        const data = getConvictFormData(prefix);
        if (!data) return;

        const convict = convicts[data.key];
        if (convict) {
            convict.setUserData(data.level, data.normalLv, data.ultLv, data.pas1Lv, data.pas2Lv);
            activeConvicts.push(convict);
            party.addConvict(convict);
        }
    });

    const debugDataArray = [];
    for (let i = 0; i < party.convicts.length; i++) {
        const convict = party.convicts[i];
        const oneHitFinalDamage = convict.calculateOneHitFinalAttackDamage(convict, party.commBuffs, enemyDef, isCoreBroken);

        const prefix = `cvt${i + 1}`;
        const elDamage = document.getElementById(`output-one-hit-damage-${prefix}`);
        const elAtk = document.getElementById(`out-base-atk-${prefix}`);
        if (elDamage) elDamage.textContent = `${oneHitFinalDamage.toLocaleString()} Damage`;
        if (elAtk) elAtk.textContent = convict.baseAtk;

        debugDataArray.push({
            slot: i + 1,
            selectConvict: convict.name,
            convictAtk: convict.baseAtk,
            attackSpeed: convict.attackSpeed,
            oneHitDamage: oneHitFinalDamage,
            buffMods: convict.getBuffMods() ? formatBuffsForDebug(convict.getBuffMods()) : [],
        });
    }
    console.log(party.getCommBuffs());
    debugDataArray.push({
        slot: party.convicts.length,
        selectConvict: '全体',
        oneHitDamage: party.calculatePartyDamage(enemyDef, isCoreBroken),
        buffMods: formatBuffsForDebug(party.getCommBuffs()),
    });
    document.getElementById('debug-json').textContent = JSON.stringify(debugDataArray, null, 2);
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
    'time-min',
    'time-sec',
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
