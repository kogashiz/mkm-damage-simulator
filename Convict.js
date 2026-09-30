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
        this.normalLv = normalLv;
        this.ultLv = ultLv;
        this.pas1Lv = pas1Lv;
        this.pas2Lv = pas2Lv;
    }

    /** 画面で入力したレベルに応じた攻撃力の計算  線形想定 */
    calculateBaseAtk(level) {
        // const gap = this.baseAtkLv90 - this.baseAtkLv1;
        // return Math.round(this.baseAtkLv1 + (gap * (level - 1) / 89));
    }

    // /** スキル効果の取得（子クラスで上書きする）⇒ 用途よくわかってないので一旦コメントアウト */
    // getSkillEffects(attackType, skills) {
    //     return [];
    // }
}
