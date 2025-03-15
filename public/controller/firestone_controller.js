import { 
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { app } from './firebase_core.js';
import { currentUser } from './firebase_auth.js';

const db = getFirestore(app);
const COLLECTION_DICE = 'dice_game';

// Save a new game history record
export async function saveHistory(record) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_DICE), record);
        console.log('History saved with ID:', docRef.id);
    } catch (e) {
        console.error("Error saving history:", e);
    }
}

// Retrieve history records for the current user
export async function getHistoryList() {
    let historyList = [];
    const q = query(
        collection(db, COLLECTION_DICE),
        where('email', '==', currentUser.email),
        orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnapshot) => {
        const t = { docId: docSnapshot.id, ...docSnapshot.data() };
        historyList.push(t);
    });
    return historyList;
}

// Clear all history records for the current user
export async function clearHistory() {
    try {
        const q = query(
            collection(db, COLLECTION_DICE),
            where('email', '==', currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        const deletePromises = [];
        querySnapshot.forEach((docSnapshot) => {
            // Get a document reference for each record and queue it for deletion
            const docRef = doc(db, COLLECTION_DICE, docSnapshot.id);
            deletePromises.push(deleteDoc(docRef));
        });
        await Promise.all(deletePromises);
        console.log("All history records cleared for", currentUser.email);
    } catch (e) {
        console.error("Error clearing history:", e);
        throw e;
    }
}
