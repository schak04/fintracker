import { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signInWithGoogle = () => {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        return signInWithPopup(auth, googleProvider);
    };

    const signInWithEmail = (email, password) =>
        signInWithEmailAndPassword(auth, email, password);

    const signUpWithEmail = (email, password, displayName) =>
        createUserWithEmailAndPassword(auth, email, password).then((cred) =>
            updateProfile(cred.user, { displayName })
        );

    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider
            value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
