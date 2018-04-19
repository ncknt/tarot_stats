
export function rankInFrench(rank) {
    if (rank === 1) {
        return '1er';
    }
    return `${rank}eme`;
}


export function getRank(player, players, totals) {
    let rank = 1;
    players.forEach(p => {
        if (p !== player && totals[p] > totals[player]) {
            rank++;
        }
    });
    return rank;
}