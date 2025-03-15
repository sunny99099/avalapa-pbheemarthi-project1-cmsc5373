import { HomeView } from '../view/HomeView.js';
import { HomeController } from './HomeController.js';
import { Router } from './Router.js';
import { loginFirebase, logoutFirebase, createAccount } from './firebase_auth.js';
import { startspinner, stopspinner } from '../view/util.js';
import { currentUser } from './firebase_auth.js';
import { HistoryView } from '../view/HistoryView.js';
import { HistoryController } from './HistoryController.js';


// Firebase authentication imports
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

document.getElementById('appHeader').textContent = "Dice Roll Game";
document.title = "Dice Game";

const routes = [
    { path: '/', view: HomeView, controller: HomeController },
    { path: '/history', view: HistoryView, controller: HistoryController },
];

export const router = new Router(routes);
router.navigate(window.location.pathname);

// Handle navigation menu clicks
const menuItems = document.querySelectorAll('a[data-path]');
menuItems.forEach(item => {
    item.onclick = function (e) {
        const path = item.getAttribute('data-path');
        router.navigate(path);
    };
});

// User email display logic
const userEmailElement = document.getElementById("user_email");

// Function to update the email display
function updateUserEmailDisplay(user) {
    if (user) {
        userEmailElement.textContent = user.email;
        userEmailElement.classList.remove("d-none");
    } else {
        userEmailElement.textContent = "";
        userEmailElement.classList.add("d-none");
    }
}

// Firebase authentication state listener
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    updateUserEmailDisplay(user);
});

// Handle login form submission
document.forms.loginForm.onsubmit = async function (e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    startspinner();
    try {
        await loginFirebase(email, password);
        stopspinner();
        console.log('User logged in:', email);
    } catch (e) {
        stopspinner();
        console.error('Error logging in', e);
        alert('Sign in failed: ' + e.code + ', ' + e.message);
    }
};

// Handle logout button click
document.getElementById('logoutButton').onclick = async function () {
    startspinner();
    try {
        await logoutFirebase();
        stopspinner();
        console.log('User logged out');
    } catch (e) {
        console.error('Error logging out', e);
        alert('Sign out failed: ' + e.code + ', ' + e.message);
    }
};

// Handle account creation form submission
document.forms.CreateAccountForm.onsubmit = async function (e) {
    e.preventDefault();
    const email = e.target.email.value;
    const emailConfirm = e.target.emailConform.value;
    if (email !== emailConfirm) {
        alert('Emails do not match');
        return;
    }
    const password = e.target.password.value;
    try {
        await createAccount(email, password);
        stopspinner();
        document.getElementById('CreateAccountDiv').classList.replace('d-block', 'd-none');
    } catch (e) {
        stopspinner();
        console.error('Error creating user', e);
        alert('Create account failed: ' + e.code + ', ' + e.message);
    }
};

// Navigation between login and create account forms
document.getElementById('gotoCreateAccount').onclick = function () {
    document.getElementById('loginDiv').classList.replace('d-block', 'd-none');
    document.getElementById('CreateAccountDiv').classList.replace('d-none', 'd-block');
};

document.getElementById('gotoLogin').onclick = function () {
    document.getElementById('CreateAccountDiv').classList.replace('d-block', 'd-none');
    document.getElementById('loginDiv').classList.replace('d-none', 'd-block');
};
