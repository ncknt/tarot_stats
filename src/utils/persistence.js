import { firestore } from 'firebase'

var db;

export default function initialize() {
    if (!db) {
        db = firestore();
    }
    return db;
}