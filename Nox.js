import { Convict } from './Convict.js';

/**
 * NOX（子クラス）の実装例
 * 各コンビクトの初期ステータス、スキルレベルに応じた倍率を保持
 */
export class Nox extends Convict {
    constructor() {
        // super()で親を初期化。id(いる？漢字のキャラだとつづり困る), name(ゲーム中の正式名表記), lv1atk, lv90atk, passive名(いる？)
        super("nox", "NOX", 145, 622, "魂の侵蝕", "幽冥戦慄");
    }

    /**
     * 考えどころ
     * NOX固有のスキル効果をどう保持するか。計算しやすいのがいい。分けてるほうがいい
    getSkillEffects(attackType) {
        const effects = [];
        
        // 自身のインスタンスに保持されている this.pas2Lv を参照
        const defDebuffRatio = 0.15 + ((this.pas2Lv - 1) * 0.01);
        effects.push({
            effectType: 'DEBUFF',
            target: 'ENEMY',
            stat: 'DEF_DOWN',
            ratio: defDebuffRatio
        });
        
        if (attackType === 'NORMAL') {
            const multiplier = 0.90 + (0.07 * (this.normalLv - 1));
            effects.push({
                effectType: 'DAMAGE',
                damageType: 'PHYSICAL',
                multiplier: multiplier
            });
        }
        
        return effects;
    }
    */
    
}
