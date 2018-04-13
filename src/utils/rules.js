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