import { auth } from './firebaseconfig.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const formLogin = document.getElementById('form-login');
const formSignup = document.getElementById('form-signup');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const authError = document.getElementById('auth-error');

// Se o usuário já estiver logado, redireciona imediatamente
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace('index.html');
  }
});

// Troca de Abas (Entrar / Cadastrar)
tabLogin?.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  formLogin.classList.remove('hidden');
  formSignup.classList.add('hidden');
  if (authError) authError.textContent = '';
});

tabSignup?.addEventListener('click', () => {
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  formSignup.classList.remove('hidden');
  formLogin.classList.add('hidden');
  if (authError) authError.textContent = '';
});

// AÇÃO: LOGAR
formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (authError) authError.textContent = 'Autenticando...';

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // O redirecionamento é disparado pelo onAuthStateChanged acima
  } catch (error) {
    console.error("Erro Login:", error);
    if (authError) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        authError.textContent = 'E-mail ou senha incorretos. Se não tiver conta, clique na aba "Cadastrar".';
      } else if (error.code === 'auth/unauthorized-domain') {
        authError.textContent = 'Erro: Domínio da Vercel não autorizado no Firebase.';
      } else {
        authError.textContent = `Erro: ${error.message}`;
      }
    }
  }
});

// AÇÃO: CADASTRAR
formSignup?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (authError) authError.textContent = 'Criando conta...';

  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // O redirecionamento é disparado pelo onAuthStateChanged acima
  } catch (error) {
    console.error("Erro Cadastro:", error);
    if (authError) {
      if (error.code === 'auth/email-already-in-use') {
        authError.textContent = 'Este e-mail já existe. Clique na aba "Entrar".';
      } else if (error.code === 'auth/weak-password') {
        authError.textContent = 'A senha deve ter pelo menos 6 caracteres.';
      } else {
        authError.textContent = `Erro: ${error.message}`;
      }
    }
  }
});
