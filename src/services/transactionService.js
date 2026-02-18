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
    writeBatch,
    getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'transactions';

export function subscribeToTransactions(userId, callback, onError) {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId)
    );
    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));

            const sorted = data.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
            callback(sorted);
        },
        (error) => {
            console.error('Snapshot error:', error);
            if (onError) onError(error);
        }
    );
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

export async function clearAllTransactions(userId) {
    const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
    });
    return batch.commit();
}
