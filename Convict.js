import { ATTACK_TYPE, EFFECT_TYPE } from './Constants.js';

// 基底クラス（まだあるとよくなるプログラムの流れがわかってない）
export class Convict {
    /**
     * @param {string} id - キャラID
     * @param {string} name - キャラ名
     * @param {number} baseAtkLv1 - Lv1時点の基礎攻撃力（固定値）
     * @param {number} baseAtkLv90 - Lv90時点の基礎攻撃力（固定値）
     * @param {string} pas1Name - パッシブ1の名前
     * @param {string} pas2Name - パッシブ2の名前
     */
    // 各キャラ固有のステータス、子クラスから初期値を設定する
    constructor(id, name, baseAtkLv1, baseAtkLv90, pas1Name = "パッシブ1", pas2Name = "パッシブ2") {
        this.id = id;
        this.name = name;
        this.baseAtkLv1 = baseAtkLv1;
        this.baseAtkLv90 = baseAtkLv90;
        this.pas1Name = pas1Name;
        this.pas2Name = pas2Name;

        // 画面からの入力値を保持する、super()した直後は未初期化状態のため、初期値-1とする
        // 多分ここに追加：専属とか刻印とか
        this.level = -1;
        this.baseAtk = -1;
        this.normalLv = -1;
        this.ultLv = -1;
        this.pas1Lv = -1;
        this.pas2Lv = -1;
    }

    /**
     * 画面で入力された育成ステータスを更新・保持する
     */
    setUserData(level, normalLv, ultLv, pas1Lv, pas2Lv) {
        this.level = level;
        this.baseAtk = this.calculateBaseAtk(level);
        this.normalLv = normalLv;
        this.ultLv = ultLv;
        this.pas1Lv = pas1Lv;
        this.pas2Lv = pas2Lv;
    }

    /** 画面で入力したレベルに応じた攻撃力の計算  線形想定 */
    calculateBaseAtk(level) {
        const atkPerLv = (this.baseAtkLv90 - this.baseAtkLv1) / 89;
        const absentAtkLv = 90 - this.level;
        return Math.floor(this.baseAtkLv90 - (atkPerLv * absentAtkLv));
    }

    /** スキル効果の取得（子クラスで上書きする）⇒ 用途よくわかってないので一旦コメントアウト */
    getBuffMods() {
        return {
            atkMods: [],      // ATKアップ、ATKダウン
            defMods: [],      // DEF/MDFアップ、DEF/MDFダウン、物理/魔法貫通※mdf用まだ作ってない
            damageMods: [],   // 基礎ダメージ係数、ダメージ係数アップ
            critMods: [],     // クリティカルダメージアップ
            etcMods: []       // ダメージアップ系、被ダメージアップ系、ダメージダウン系、被ダメージダウン系、コア状態被ダメージ補正
        };
    }

    // ダメージ計算で使う最終的なATKの計算
    calculateFinalAtk(convict) {
        const atkMods = convict.getBuffMods().atkMods;
        // atkModsのEFFECT_TYPEを見て、基礎atkを足し引きする
        
        return 10; // dummy
    }

    // ダメージ計算で使う最終的なDEFの計算
    calculateFinalDef(convict) {

        return 10; // dummy
    }

    // ダメージ計算で使う最終的なダメージ係数の計算
    calculateFinalDamageMult(convict, attackType) {
        const damageMods = convict.getBuffMods().damageMods;
        // 通常攻撃なら通常攻撃のスキル倍率、必殺技ならそのスキル倍率をそれぞれ返す
        const matchedMod = damageMods.find(mod => mod.attackType === attackType);
        // もし該当の倍率がなければ、エラーを示すために-1を返す
        return matchedMod ? matchedMod : -1;
    }

    // ダメージ計算で使う最終的なクリティカル補正の計算
    calculateFinalCriticalMult(convict) {
        return 1; // dummy
    }

    // ダメージ計算で使う最終的なその他色々補正の計算
    calculateFinalEtcMult(convict) {
        return 1; // dummy
    }

    /**
     * ダメージ計算式。共通
     */
    calculateOneTimeFinalDamage(convict, attackType) {
        // 1. 最終ATKの算出
        const finalAtk = this.calculateFinalAtk(convict);

        // 2. 最終DEF/MDFの算出
        const finalDef = this.calculateFinalDef(convict);
        // const finalMdf = calculateFinalMdf(convict);

        // 3. 最終ダメージ係数の算出
        const finalDamageMult = this.calculateFinalDamageMult(convict, attackType);

        // 4. クリティカル補正の算出
        const finalCriticalMult = this.calculateFinalCriticalMult(convict);

        // 5. その他補正の算出
        const etcMult = this.calculateFinalEtcMult(convict);

        // 6. 最終ダメージ
        // = (最終ATK - 最終DEF/MDF) × ダメージ係数 × クリティカル × その他補正
        const finalDamage = (finalAtk - finalDef) * finalDamageMult * finalCriticalMult * etcMult

        return finalDamage;
    }

    // 通常攻撃ダメージ
    calculateOneTimeFinalAttackDamage(convict) {
        return this.calculateOneTimeFinalDamage(convict, ATTACK_TYPE.NORMAL)
    }

    // 必殺技ダメージ
    calculateOneTimeFinalUltDamage(convict) {
        return this.calculateOneTimeFinalDamage(convict, ATTACK_TYPE.ULT)
    }


}
