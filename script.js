// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const profileModal = document.getElementById('profileModal');
const addProfileBtn = document.getElementById('addProfileBtn');
const closeModal = document.querySelectorAll('.close');
const profileForm = document.getElementById('profileForm');
const profilesContainer = document.querySelector('.profiles-container');
const offersContainer = document.querySelector('.offers-container');
const postOfferBtn = document.getElementById('postOfferBtn');
const offerFormContainer = document.getElementById('offerFormContainer');
const jobOfferForm = document.getElementById('jobOfferForm');
const cancelOfferBtn = document.getElementById('cancelOfferBtn');
const studentBtn = document.getElementById('studentBtn');
const companyBtn = document.getElementById('companyBtn');

// Login Modals
const studentLoginModal = document.getElementById('studentLoginModal');
const companyLoginModal = document.getElementById('companyLoginModal');
const studentLoginForm = document.getElementById('studentLoginForm');
const companyLoginForm = document.getElementById('companyLoginForm');

// Signup Modals
const studentSignupModal = document.getElementById('studentSignupModal');
const companySignupModal = document.getElementById('companySignupModal');
const studentSignupForm = document.getElementById('studentSignupForm');
const companySignupForm = document.getElementById('companySignupForm');

// Login Choice Modal
const loginChoiceModal = document.getElementById('loginChoiceModal');

// Profile Menu Modal
const profileMenuModal = document.getElementById('profileMenuModal');
const createOrModifyProfileBtn = document.getElementById('createOrModifyProfileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileFormHeading = document.getElementById('profileFormHeading');

// Admin Modal
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminBtn = document.getElementById('adminBtn');
const adminCode = document.getElementById('adminCode');
const adminErrorMsg = document.getElementById('adminErrorMsg');

// Authentication state
let currentUser = null;
let studentProfiles = {};
let isAdminMode = false;
const ADMIN_CODE = '123456789';

function updateAuthUI() {
    const studentEls = document.querySelectorAll('.auth-student');
    const companyEls = document.querySelectorAll('.auth-company');

    if (currentUser && currentUser.type === 'student') {
        companyEls.forEach(el => el.style.display = 'none');
        
        // Check if student has a profile
        const hasProfile = studentProfiles[currentUser.email];
        
        // Always hide "Ajouter mon profil" button when logged in as student
        addProfileBtn.style.display = 'none';
        
        // Show student action buttons
        studentEls.forEach(el => el.style.display = 'inline-block');
        
        // Clear profiles container and show only current user's profile
        profilesContainer.innerHTML = '';
        if (hasProfile) {
            addProfileCard(studentProfiles[currentUser.email]);
        } else {
            profilesContainer.innerHTML = '<p style="text-align:center; color:#666; padding: 20px;">Vous n\'avez pas encore créé votre profil. Cliquez sur "Mon profil" pour commencer.</p>';
        }
    } else if (currentUser && currentUser.type === 'company') {
        companyEls.forEach(el => el.style.display = 'inline-block');
        studentEls.forEach(el => el.style.display = 'none');
    } else {
        studentEls.forEach(el => el.style.display = 'none');
        companyEls.forEach(el => el.style.display = 'none');
        
        // Show initial profiles when logged out
        profilesContainer.innerHTML = '';
        initialProfiles.forEach(profile => addProfileCard(profile));
        const savedProfiles = loadProfilesFromLocalStorage();
        savedProfiles.forEach(profile => addProfileCard(profile));
    }
    // Update navConnexion label and click behavior
    if (navConnexion) {
        if (currentUser) {
            navConnexion.textContent = 'Mon profil';
            navConnexion.onclick = function(e) {
                e.preventDefault();
                if (currentUser.type === 'student') {
                    // Show profile menu modal
                    profileMenuModal.style.display = 'block';
                    createOrModifyProfileBtn.style.display = 'block';
                    // Check if student has profile and update button
                    if (studentProfiles[currentUser.email]) {
                        createOrModifyProfileBtn.textContent = 'Modifier mon profil';
                    } else {
                        createOrModifyProfileBtn.textContent = 'Créer mon profil';
                    }
                } else if (currentUser.type === 'company') {
                    // Show profile menu modal for company (only logout)
                    profileMenuModal.style.display = 'block';
                    createOrModifyProfileBtn.style.display = 'none';
                }
            };
        } else {
            navConnexion.textContent = 'Connexion';
            navConnexion.onclick = function(e) {
                e.preventDefault();
                loginChoiceModal.style.display = 'block';
            };
        }
    }
}

// Sample data
const initialProfiles = [
    {
        name: "Mohamed Ali",
        specialty: "Business Intelligence",
        description: "Étudiant en 3ème année, passionné par l'IA et le machine learning. Expérience en Python et R.",
        linkedin: "https://linkedin.com/in/mohamedali",
        cv: "https://drive.google.com/cv-mohamed",
        
    },
    {
        name: "Salma Ben Ahmed",
        specialty: "Business Information Systems",
        description: "Développement Full Stack, spécialisée en React et Node.js. À la recherche d'un stage de fin d'études.",
        linkedin: "https://linkedin.com/in/salmabenahmed",
        cv: "https://drive.google.com/cv-salma",
        
    }
];

const initialOffers = [
    {
        title: "Développeur Frontend",
        company: "Tunisie Telecom",
        description: "Nous recherchons un développeur Frontend pour rejoindre notre équipe digitale.",
        type: "stage"
    },
    {
        title: "Data Analyst",
        company: "BIAT",
        description: "Analyse de données financières et création de rapports pour la direction.",
        type: "emploi"
    }
];

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Login Modal Functions
studentBtn.addEventListener('click', () => {
    studentLoginModal.style.display = 'block';
});

companyBtn.addEventListener('click', () => {
    companyLoginModal.style.display = 'block';
});

// Connexion links in navigation and footer
const navConnexion = document.getElementById('navConnexion');
const footerConnexion = document.getElementById('footerConnexion');

// Login Choice Buttons
const chooseStudentLogin = document.getElementById('chooseStudentLogin');
const chooseCompanyLogin = document.getElementById('chooseCompanyLogin');

chooseStudentLogin.addEventListener('click', () => {
    loginChoiceModal.style.display = 'none';
    studentLoginModal.style.display = 'block';
});

chooseCompanyLogin.addEventListener('click', () => {
    loginChoiceModal.style.display = 'none';
    companyLoginModal.style.display = 'block';
});

// Profile Menu Button Handlers
createOrModifyProfileBtn.addEventListener('click', () => {
    profileMenuModal.style.display = 'none';
    
    // Check if this is for a student or company
    if (currentUser.type === 'student') {
        // Update form heading based on whether profile exists
        if (studentProfiles[currentUser.email]) {
            profileFormHeading.textContent = 'Modifier mon profil étudiant';
            // Load existing profile data
            const profile = studentProfiles[currentUser.email];
            document.getElementById('studentName').value = profile.name || '';
            document.getElementById('studentSpecialty').value = profile.specialty || '';
            document.getElementById('linkedin').value = profile.linkedin || '';
            document.getElementById('cv').value = profile.cv || '';
            document.getElementById('studentDescription').value = profile.description || '';
        } else {
            profileFormHeading.textContent = 'Créer mon profil étudiant';
            profileForm.reset();
        }
        profileModal.style.display = 'block';
    } else if (currentUser.type === 'company') {
        // Show company profile modification (placeholder)
        showNotification(`👔 Modifier le profil entreprise : ${currentUser.name || currentUser.email}`);
    }
});

logoutBtn.addEventListener('click', () => {
    profileMenuModal.style.display = 'none';
    currentUser = null;
    updateAuthUI();
    showNotification('👋 Vous avez été déconnecté(e)');
});

// Close all modals
closeModal.forEach(button => {
    button.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === studentLoginModal) {
        studentLoginModal.style.display = 'none';
    }
    if (e.target === studentSignupModal) {
        studentSignupModal.style.display = 'none';
    }
    if (e.target === companyLoginModal) {
        companyLoginModal.style.display = 'none';
    }
    if (e.target === companySignupModal) {
        companySignupModal.style.display = 'none';
    }
    if (e.target === loginChoiceModal) {
        loginChoiceModal.style.display = 'none';
    }
    if (e.target === profileMenuModal) {
        profileMenuModal.style.display = 'none';
    }
    if (e.target === profileModal) {
        profileModal.style.display = 'none';
    }
    if (e.target === adminLoginModal) {
        adminLoginModal.style.display = 'none';
    }
});

// Admin Button Click Handler
adminBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminLoginModal.style.display = 'block';
    adminErrorMsg.style.display = 'none';
    adminCode.value = '';
});

// Admin Login Form Submission
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const code = document.getElementById('adminCode').value;
    
    if (code === ADMIN_CODE) {
        isAdminMode = true;
        adminErrorMsg.style.display = 'none';
        adminLoginModal.style.display = 'none';
        showNotification("✅ Admin mode activé!");
        showDeleteButtons();
        
        // Update navigation to show "Déconnexion"
        if (navConnexion) {
            navConnexion.textContent = 'Déconnexion';
            navConnexion.onclick = function(e) {
                e.preventDefault();
                exitAdminMode();
            };
        }
    } else {
        adminErrorMsg.style.display = 'block';
        adminCode.value = '';
    }
});

// Student Login Form Submission
studentLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('studentEmail').value;
    const password = document.getElementById('studentPassword').value;
    
    // Validate email ends with @esen.tn
    if (!email.endsWith('@esen.tn')) {
        showNotification("❌ L'email doit se terminer par @esen.tn");
        return;
    }
    
    if (password.length < 6) {
        showNotification("❌ Le mot de passe doit contenir au moins 6 caractères");
        return;
    }
    
    // Show success message
    showNotification("✅ Connexion étudiant réussie!");
    // Set auth state and update UI
    currentUser = { type: 'student', email };
    updateAuthUI();
    studentLoginForm.reset();
    studentLoginModal.style.display = 'none';
});

// Company Login Form Submission
companyLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('companyEmail').value;
    const password = document.getElementById('companyPassword').value;
    
    // Validate email format (basic validation)
    if (!email.includes('@')) {
        showNotification("❌ Veuillez entrer une adresse email valide");
        return;
    }
    
    if (password.length < 6) {
        showNotification("❌ Le mot de passe doit contenir au moins 6 caractères");
        return;
    }
    
    // Show success message
    showNotification("✅ Connexion entreprise réussie!");
    // Set auth state and update UI
    currentUser = { type: 'company', email };
    updateAuthUI();
    companyLoginForm.reset();
    companyLoginModal.style.display = 'none';
});

// Modal Switching Functions
document.getElementById('switchToStudentSignup').addEventListener('click', (e) => {
    e.preventDefault();
    studentLoginModal.style.display = 'none';
    studentSignupModal.style.display = 'block';
});

document.getElementById('switchToStudentLogin').addEventListener('click', (e) => {
    e.preventDefault();
    studentSignupModal.style.display = 'none';
    studentLoginModal.style.display = 'block';
});

document.getElementById('switchToCompanySignup').addEventListener('click', (e) => {
    e.preventDefault();
    companyLoginModal.style.display = 'none';
    companySignupModal.style.display = 'block';
});

document.getElementById('switchToCompanyLogin').addEventListener('click', (e) => {
    e.preventDefault();
    companySignupModal.style.display = 'none';
    companyLoginModal.style.display = 'block';
});

// Student Signup Form Submission
studentSignupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupStudentEmail').value;
    const password = document.getElementById('signupStudentPassword').value;
    const confirmPassword = document.getElementById('signupStudentConfirmPassword').value;
    
    // Validate email ends with @esen.tn
    if (!email.endsWith('@esen.tn')) {
        showNotification("❌ L'email doit se terminer par @esen.tn");
        return;
    }
    
    if (password.length < 6) {
        showNotification("❌ Le mot de passe doit contenir au moins 6 caractères");
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification("❌ Les mots de passe ne correspondent pas");
        return;
    }
    
    // Show success message
    showNotification("✅ Compte créé avec succès — vous êtes connecté(e) !");
    // Auto-login the new student
    currentUser = { type: 'student', email };
    updateAuthUI();
    studentSignupForm.reset();
    studentSignupModal.style.display = 'none';
});

// Company Signup Form Submission
companySignupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const companyName = document.getElementById('companyName').value;
    const email = document.getElementById('signupCompanyEmail').value;
    const password = document.getElementById('signupCompanyPassword').value;
    const confirmPassword = document.getElementById('signupCompanyConfirmPassword').value;
    
    // Validate email format
    if (!email.includes('@')) {
        showNotification("❌ Veuillez entrer une adresse email valide");
        return;
    }
    
    if (password.length < 6) {
        showNotification("❌ Le mot de passe doit contenir au moins 6 caractères");
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification("❌ Les mots de passe ne correspondent pas");
        return;
    }
    
    if (companyName.trim().length < 2) {
        showNotification("❌ Veuillez entrer le nom de l'entreprise");
        return;
    }
    
    // Show success message
    showNotification("✅ Compte créé avec succès — vous êtes connecté(e) !");
    // Auto-login the new company (store name and email)
    const signupCompanyEmail = document.getElementById('signupCompanyEmail').value;
    currentUser = { type: 'company', email: signupCompanyEmail, name: companyName };
    updateAuthUI();
    companySignupForm.reset();
    companySignupModal.style.display = 'none';
});

// Profile Modal Functions
addProfileBtn.addEventListener('click', () => {
    profileModal.style.display = 'block';
});

// Handle Profile Form Submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProfile = {
        name: document.getElementById('studentName').value,
        specialty: document.getElementById('studentSpecialty').value,
        description: document.getElementById('studentDescription').value,
        linkedin: document.getElementById('linkedin').value,
        cv: document.getElementById('cv').value
    };
    
    // Check if this is a create or modify
    const isNew = !studentProfiles[currentUser.email];
    
    // Store in studentProfiles
    studentProfiles[currentUser.email] = newProfile;
    
    profileForm.reset();
    profileModal.style.display = 'none';
    
    // Show success message
    const message = isNew ? "✅ Profil créé avec succès!" : "✅ Profil modifié avec succès!";
    showNotification(message);
    
    // Save to localStorage (FEATURE 1 - Not studied in class)
    saveProfileToLocalStorage(newProfile);
    
    // Update UI to hide "Ajouter mon profil" button and refresh profile display
    updateAuthUI();
});

// Add Profile Card to DOM
function addProfileCard(profile) {
    const profileCard = document.createElement('div');
    profileCard.className = 'profile-card';
    
    // Check if this is the current user's profile
    const isOwnProfile = currentUser && currentUser.type === 'student' && studentProfiles[currentUser.email] === profile;
    
    profileCard.innerHTML = `
        <h3>${profile.name}</h3>
        <p><strong>Spécialité:</strong> ${profile.specialty}</p>
        <p>${profile.description}</p>
        <div class="profile-links">
            ${profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
            ${profile.cv ? `<a href="${profile.cv}" target="_blank" title="CV"><i class="fas fa-file-pdf"></i></a>` : ''}
            ${isOwnProfile ? `<button class="btn-edit-profile" title="Modifier"><i class="fas fa-edit"></i></button>` : ''}
            <button class="btn-delete delete-hidden" title="Supprimer"><i class="fas fa-trash"></i> Supprimer</button>
        </div>
    `;
    
    profilesContainer.appendChild(profileCard);
    
    // Add edit button click handler for own profile
    if (isOwnProfile) {
        const editBtn = profileCard.querySelector('.btn-edit-profile');
        editBtn.addEventListener('click', () => {
            profileFormHeading.textContent = 'Modifier mon profil étudiant';
            // Load existing profile data
            const profile = studentProfiles[currentUser.email];
            document.getElementById('studentName').value = profile.name || '';
            document.getElementById('studentSpecialty').value = profile.specialty || '';
            document.getElementById('linkedin').value = profile.linkedin || '';
            document.getElementById('cv').value = profile.cv || '';
            document.getElementById('studentDescription').value = profile.description || '';
            profileModal.style.display = 'block';
        });
    }
    
    // Add delete button handler
    const deleteBtn = profileCard.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${profile.name}?`);
        if (confirmation) {
            // Find and remove profile from studentProfiles by name
            for (const email in studentProfiles) {
                if (studentProfiles[email].name === profile.name) {
                    delete studentProfiles[email];
                    // Remove from localStorage
                    let savedProfiles = JSON.parse(localStorage.getItem('studentProfiles')) || [];
                    savedProfiles = savedProfiles.filter(p => p.name !== profile.name);
                    localStorage.setItem('studentProfiles', JSON.stringify(savedProfiles));
                    break;
                }
            }
            profileCard.remove();
            showNotification(`🗑️ Profil de ${profile.name} supprimé!`);
        }
    });
}

// Job Offers Functions
postOfferBtn.addEventListener('click', () => {
    offerFormContainer.style.display = 'block';
    postOfferBtn.style.display = 'none';
});

cancelOfferBtn.addEventListener('click', () => {
    offerFormContainer.style.display = 'none';
    postOfferBtn.style.display = 'inline-block';
    jobOfferForm.reset();
});

jobOfferForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newOffer = {
        title: document.getElementById('offerTitle').value,
        company: document.getElementById('offerCompany').value,
        description: document.getElementById('offerDescription').value,
        type: document.getElementById('offerType').value,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    addOfferCard(newOffer);
    jobOfferForm.reset();
    offerFormContainer.style.display = 'none';
    postOfferBtn.style.display = 'inline-block';
    
    // Show success message
    showNotification("✅ Offre publiée avec succès!");
});

function addOfferCard(offer) {
    const offerCard = document.createElement('div');
    offerCard.className = 'offer-card';
    
    const typeLabels = {
        'stage': 'Stage',
        'emploi': 'Emploi',
        'alternance': 'Alternance'
    };
    
    offerCard.innerHTML = `
        <h3>${offer.title}</h3>
        <p><strong>Entreprise:</strong> ${offer.company}</p>
        <p>${offer.description}</p>
        <p><small><i class="far fa-calendar"></i> Publié le: ${offer.date}</small></p>
        <span class="tag">${typeLabels[offer.type] || offer.type}</span>
        ${!currentUser || currentUser.type === 'student' ? `<button class="btn apply-btn" style="margin-top: 15px; padding: 8px 20px;">Postuler</button>` : ''}
        <button class="btn-delete delete-hidden" style="margin-top: 15px; padding: 8px 20px;" title="Supprimer"><i class="fas fa-trash"></i> Supprimer</button>
    `;
    
    offersContainer.prepend(offerCard);
    
    // Add apply functionality only for students
    const applyBtn = offerCard.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const confirmation = confirm(`Voulez-vous postuler pour: ${offer.title} chez ${offer.company}?`);
            if (confirmation) {
                showNotification(`📨 Candidature envoyée pour: ${offer.title}`);
            }
        });
    }
    
    // Add delete button handler
    const deleteBtn = offerCard.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${offer.title}"?`);
        if (confirmation) {
            offerCard.remove();
            showNotification(`🗑️ Offre "${offer.title}" supprimée!`);
        }
    });
}

// Notification System (FEATURE 3 - Not studied in class)
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 1002;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: slideIn 0.5s ease;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// (Reddit feature removed)

// Admin Functions
function showDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.classList.remove('delete-hidden');
    });
}

function hideDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.classList.add('delete-hidden');
    });
}

function exitAdminMode() {
    isAdminMode = false;
    hideDeleteButtons();
    showNotification("👋 Mode admin désactivé");
    
    // Reset navigation
    if (navConnexion) {
        navConnexion.textContent = 'Connexion';
        navConnexion.onclick = function(e) {
            e.preventDefault();
            loginChoiceModal.style.display = 'block';
        };
    }
}

// Local Storage Functions (FEATURE 1 - Not studied in class)
function saveProfileToLocalStorage(profile) {
    let profiles = JSON.parse(localStorage.getItem('esenProfiles')) || [];
    profiles.push(profile);
    localStorage.setItem('esenProfiles', JSON.stringify(profiles));
}

function loadProfilesFromLocalStorage() {
    const savedProfiles = JSON.parse(localStorage.getItem('esenProfiles')) || [];
    return savedProfiles;
}

// Initialize Page
function init() {
    // Load initial profiles
    initialProfiles.forEach(profile => addProfileCard(profile));
    
    // Load saved profiles from localStorage
    const savedProfiles = loadProfilesFromLocalStorage();
    savedProfiles.forEach(profile => addProfileCard(profile));
    
    // Load initial offers
    initialOffers.forEach(offer => addOfferCard(offer));
    // Update UI based on auth state (hide/show actions)
    updateAuthUI();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', init);