// Handle login form
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Check if user exists
    const userData = JSON.parse(localStorage.getItem('eternize_user'));
    
    if (userData && userData.email === email) {
        // Simulate login
        window.location.href = 'dashboard.html';
    } else {
        // For demo purposes, create a user and login
        const newUser = {
            nome: 'Usuário Demo',
            email: email,
            telefone: '(31) 99999-9999',
            plan: 'premium',
            purchaseDate: new Date().toISOString()
        };
        
        localStorage.setItem('eternize_user', JSON.stringify(newUser));
        window.location.href = 'dashboard.html';
    }
});

// Check if already logged in
const userData = JSON.parse(localStorage.getItem('eternize_user'));
if (userData) {
    window.location.href = 'dashboard.html';
}
