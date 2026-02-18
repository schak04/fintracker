import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'transactions';

export function subscribeToTransactions(userId, callback) {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const transactions = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
        callback(transactions);
    });
}

export async function addTransaction(userId, data) {
    return addDoc(collection(db, COLLECTION), {
        ...data,
        userId,
        createdAt: serverTimestamp(),
    });
}

export async function updateTransaction(id, data) {
    const ref = doc(db, COLLECTION, id);
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTransaction(id) {
    const ref = doc(db, COLLECTION, id);
    return deleteDoc(ref);
}
