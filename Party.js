import { Convict } from './Convict.js';

// パーティとして保持する値
export class Party {
    constructor() {
        this.convicts = []; // コンビクトたち
        this.commBuffs = {
            atkMods: [],      // 最終ATK補正
            defMods: [],      // 最終DEF補正
            damageMods: [],   // ダメージ係数
            critMods: [],     // クリティカル補正
            etcMods: []       // その他補正
        };
    }

    addConvict(convict) {
        this.convicts.push(convict);
        this.addCommBuffs(convict.name, convict.getBuffMods());
    }

    addCommBuffs(name, buffs) {
        if (!buffs) return;

        Object.keys(buffs).forEach(category => {
            if (!this.commBuffs[category]) return;

            const categoryBuffs = buffs[category];
            if (!Array.isArray(categoryBuffs)) return;

            categoryBuffs.forEach(mod => {
                if (mod.scope === 'ALL') {
                    this.commBuffs[category].push({
                        ...mod,
                        sourceName: name
                    });
                }
            })
        })
    }

    getCommBuffs() {
        return this.commBuffs;
    }

    calculatePartyDamage(enemyDef, isCoreBroken) {
        return this.convicts.map(convict => {
            const damage = convict.calculateOneHitFinalAttackDamage(convict, this.commBuffs, enemyDef, isCoreBroken);
            return {
                name: convict.name,
                baseAtk: convict.baseAtk,
                damage: damage,
            }
        })
    }
}