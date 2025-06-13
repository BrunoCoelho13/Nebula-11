import { auth } from "./firebase-config.js";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        let message = "Erro ao fazer login";
        if (error.code === "auth/invalid-credential") {
            message = "Email ou senha incorretos";
        }
        return { success: false, message };
    }
}

export async function cadastrarUsuario(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        let message = "Erro ao cadastrar";
        if (error.code === "auth/email-already-in-use") {
            message = "Email já está em uso";
        } else if (error.code === "auth/weak-password") {
            message = "Senha deve ter no mínimo 6 caracteres";
        }
        return { success: false, message };
    }
}