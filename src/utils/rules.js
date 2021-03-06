/**
 * Number of points needed to fulfill contract
 * @param {*} oudlers 
 */
export function pointsNeeded(oudlers) {
    switch (oudlers) {
        case 1:
            return 51;
        case 2:
            return 41;
        case 3:
            return 36;
        default:
            return 56;
    }
}

/**
 * 
 * @param {*} contract 
 * @return Contract multiplier
 */
export function contractMultiplier(contract) {
    switch(contract) {
        case 'P':
            return 1;
        case 'G':
            return 2;
        case 'GS':
            return 4;
        case 'GC':
            return 6;
    }
}

export function basePoints(contract, attackPoints, oudlers, grandChelem) {
    let needed = pointsNeeded(oudlers);
    let diff = attackPoints - needed;
    let multiplier = contractMultiplier(contract);
    let base = multiplier * (25 + Math.abs(diff));
    if (attackPoints === 91) {
        // Grand chelem
        return base + (grandChelem ? 400 : 200);
    }
    if (diff >= 0) {
        return base;
    }
    if (grandChelem) {
        // Grand chelem called for but failed
        return -base - 200;
    }
    return -base;
} 

/**
 * 
 * @param {*} contract 
 * @param {*} attack Attack won it?
 * @return base points for petit au bout
 */
export function petitAuBout(contract, attack) {
    let multiplier = contractMultiplier(contract);
    return (attack ? 1: -1) * 10 * multiplier 
}

export function computeScores(players, basePoints, bidder, sidekick) {
    return players.reduce((h, p) => {
        if (p === bidder) {
            switch(players.length) {
                case 5:
                    if (sidekick === p) {
                        h[p] = basePoints * 4
                    } else {
                        h[p] = basePoints * 2
                    }
                    break;
                case 4:
                    h[p] = basePoints * 3;
                    break;
                case 3:
                    h[p] = basePoints * 2;
                    break;
            }
        } else if (p === sidekick) {
            h[p] = basePoints;
        } else {
            h[p] = -basePoints;
        }
        return h;
    }, {})
}


export function poignees(playerCount) {
    switch(playerCount) {
        case 5:
            return [{text: 8, points: 20}, {count: 10, points: 30}, {count: 13, points: 40}];
        case 4:
            return [{ count: 10, points: 20 }, { count: 13, points: 30 }, { count: 15, points: 40 }];        
        case 3:
            return [{ count: 13, points: 20 }, { count: 15, points: 30 }, { count: 18, points: 40 }];        
    }
}

export function poigneeDescription(level) {
    switch(level) {
        case 1:
            return 'Simple poignee';
        case 2:
            return 'Double poignee';
        case 3:
            return 'Triple poignee';
    }
}