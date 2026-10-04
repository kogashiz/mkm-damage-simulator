/**
 * 画面から「分」と「秒」を取得し、合計秒数を返す関数
 * @returns {number} 合計秒数 (例: 1分30秒 ➔ 90)
 */
export function getBattleTimeInSeconds() {
    const min = parseInt(document.getElementById('time-min').value) || 0;
    const sec = parseInt(document.getElementById('time-sec').value) || 0;

    // 分を秒に変換 (1分 = 60秒) して足し算
    const totalSeconds = (min * 60) + sec;
    
    return totalSeconds;
}

// バフオブジェクトの buffRatio を % 表示に変換するヘルパー関数
export function formatBuffsForDebug(buffs) {
    if (!buffs) return {};
    
    // オブジェクトを深かいコピーして元のデータを壊さないようにする
    const formatted = JSON.parse(JSON.stringify(buffs));

    Object.keys(formatted).forEach(category => {
        if (Array.isArray(formatted[category])) {
            formatted[category].forEach(mod => {
                if (typeof mod.buffRatio === 'number') {
                    // 表示用のパーセント文字列を追加（小数1桁など）
                    mod.displayRatio = `${(mod.buffRatio * 100).toFixed(1)}%`;
                }
            });
        }
    });

    return formatted;
}
