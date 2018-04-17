export const CONTRACTS = [
    { lab: 'Petite', val: 'P' },
    { lab: 'Garde', val: 'G' },
    { lab: 'Garde Sans', val: 'GS' },
    { lab: 'Garde Contre', val: 'GC' },
];

export const CHIENS = [
    { val: 1, lab: 'Mauvais' },
    { val: 2, lab: 'Moyen' },
    { val: 3, lab: 'Super' }
]

export const SUITS = {
    P: {
        lab: 'Pic', code: String.fromCharCode(9824), //'\u2660'
    },
    C: {
        lab: 'Coeur', code: String.fromCharCode(9829), // '\u2665'
    },
    R: {
        lab: 'Carreau', code: String.fromCharCode(9830), //'\u2666'
    },
    T: {
        lab: 'Trèfle', code: String.fromCharCode(9831) //'\u2667'
    }
}