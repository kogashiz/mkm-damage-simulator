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
