// Check if user is logged in
const userData = JSON.parse(localStorage.getItem('eternize_user'));
if (!userData) {
    window.location.href = 'login.html';
}

// Display user name
document.getElementById('userName').textContent = `Olá, ${userData.nome.split(' ')[0]}`;

// Load events from localStorage
let events = JSON.parse(localStorage.getItem('eternize_events')) || [];

// Initialize dashboard
function initDashboard() {
    updateStats();
    renderEvents();
}

// Update statistics
function updateStats() {
    let totalPhotos = 0;
    let totalContributors = 0;
    
    events.forEach(event => {
        const photos = JSON.parse(localStorage.getItem(`event_${event.id}_photos`)) || [];
        totalPhotos += photos.length;
        totalContributors += event.contributors || 0;
    });
    
    document.getElementById('totalPhotos').textContent = totalPhotos;
    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('totalContributors').textContent = totalContributors;
    document.getElementById('storageUsed').textContent = (totalPhotos * 0.003).toFixed(2) + ' GB';
}

// Render events
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (events.length === 0) {
        eventsGrid.style.display = 'none';
        emptyState.classList.add('show');
        return;
    }
    
    eventsGrid.style.display = 'grid';
    emptyState.classList.remove('show');
    
    eventsGrid.innerHTML = events.map(event => {
        const photos = JSON.parse(localStorage.getItem(`event_${event.id}_photos`)) || [];
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
        
        return `
            <div class="event-card" onclick="openEvent('${event.id}')">
                <div class="event-cover theme-${event.theme}">
                    ${getEventIcon(event.type)}
                    <span class="event-status active">● Ativo</span>
                </div>
                <div class="event-info">
                    <h3>${event.name}</h3>
                    <p class="event-date">📅 ${formattedDate}</p>
                    <div class="event-stats">
                        <div class="event-stat">
                            <span>📸</span>
                            <span>${photos.length} fotos</span>
                        </div>
                        <div class="event-stat">
                            <span>👥</span>
                            <span>${event.contributors || 0} pessoas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get event icon based on type
function getEventIcon(type) {
    const icons = {
        casamento: '💍',
        aniversario: '🎂',
        formatura: '🎓',
        corporativo: '💼',
        debutante: '👑',
        outro: '🎉'
    };
    return icons[type] || '🎉';
}

// Create event modal
function openCreateModal() {
    document.getElementById('createModal').classList.add('active');
}

function closeCreateModal() {
    document.getElementById('createModal').classList.remove('active');
    document.getElementById('createEventForm').reset();
}

// Handle create event form
document.getElementById('createEventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newEvent = {
        id: Date.now().toString(),
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        type: document.getElementById('eventType').value,
        description: document.getElementById('eventDescription').value,
        theme: document.querySelector('input[name="theme"]:checked').value,
        createdAt: new Date().toISOString(),
        contributors: 0
    };
    
    events.push(newEvent);
    localStorage.setItem('eternize_events', JSON.stringify(events));
    
    closeCreateModal();
    initDashboard();
    
    // Show success message
    alert('Evento criado com sucesso! 🎉');
});

// Open event details
let currentEventId = null;

function openEvent(eventId) {
    currentEventId = eventId;
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('modalEventName').textContent = event.name;
    
    // Generate share link
    const shareUrl = `${window.location.origin}/eternize-checkout/upload.html?event=${event.id}`;
    document.getElementById('shareLink').value = shareUrl;
    
    // Generate QR Code
    generateQRCode(shareUrl);
    
    // Load photos
    loadEventPhotos(eventId);
    
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    currentEventId = null;
}

// Load event photos
function loadEventPhotos(eventId) {
    const photos = JSON.parse(localStorage.getItem(`event_${eventId}_photos`)) || [];
    
    // Update counts
    const allCount = photos.length;
    const pendingCount = photos.filter(p => p.status === 'pending').length;
    const approvedCount = photos.filter(p => p.status === 'approved').length;
    
    document.getElementById('countAll').textContent = allCount;
    document.getElementById('countPending').textContent = pendingCount;
    document.getElementById('countApproved').textContent = approvedCount;
    
    renderPhotos(photos);
}

// Render photos
function renderPhotos(photos, filter = 'all') {
    const photosGrid = document.getElementById('photosGrid');
    const emptyPhotos = document.getElementById('emptyPhotos');
    
    let filteredPhotos = photos;
    if (filter !== 'all') {
        filteredPhotos = photos.filter(p => p.status === filter);
    }
    
    if (filteredPhotos.length === 0) {
        photosGrid.style.display = 'none';
        emptyPhotos.classList.add('show');
        return;
    }
    
    photosGrid.style.display = 'grid';
    emptyPhotos.classList.remove('show');
    
    photosGrid.innerHTML = filteredPhotos.map(photo => `
        <div class="photo-item">
            <img src="${photo.url || 'https://via.placeholder.com/300'}" alt="Foto do evento">
            <span class="photo-status ${photo.status}">${photo.status === 'pending' ? 'Pendente' : 'Aprovada'}</span>
            ${photo.status === 'pending' ? `
                <div class="photo-actions">
                    <button class="btn-approve" onclick="approvePhoto('${photo.id}')">✓</button>
                    <button class="btn-reject" onclick="rejectPhoto('${photo.id}')">✕</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Filter photos
function filterPhotos(filter) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load and filter photos
    const photos = JSON.parse(localStorage.getItem(`event_${currentEventId}_photos`)) || [];
    renderPhotos(photos, filter);
}

// Approve photo
function approvePhoto(photoId) {
    const photos = JSON.parse(localStorage.getItem(`event_${currentEventId}_photos`)) || [];
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
        photo.status = 'approved';
        localStorage.setItem(`event_${currentEventId}_photos`, JSON.stringify(photos));
        loadEventPhotos(currentEventId);
    }
}

// Reject photo
function rejectPhoto(photoId) {
    if (!confirm('Tem certeza que deseja rejeitar esta foto?')) return;
    
    const photos = JSON.parse(localStorage.getItem(`event_${currentEventId}_photos`)) || [];
    const filteredPhotos = photos.filter(p => p.id !== photoId);
    localStorage.setItem(`event_${currentEventId}_photos`, JSON.stringify(filteredPhotos));
    loadEventPhotos(currentEventId);
}

// Copy share link
function copyLink() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Copiado';
    
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// Generate QR Code
function generateQRCode(url) {
    const qrContainer = document.getElementById('qrCodeDisplay');
    
    // Clear previous QR code
    qrContainer.innerHTML = '';
    
    // Create QR code
    const qrDiv = document.createElement('div');
    qrDiv.style.display = 'flex';
    qrDiv.style.justifyContent = 'center';
    qrDiv.style.padding = '20px';
    qrDiv.style.background = 'var(--white)';
    qrDiv.style.borderRadius = '15px';
    
    qrContainer.appendChild(qrDiv);
    
    new QRCode(qrDiv, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#333333",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Download QR Code
function downloadQR() {
    const qrCanvas = document.querySelector('#qrCodeDisplay canvas');
    if (qrCanvas) {
        const url = qrCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcode-evento-${currentEventId}.png`;
        link.href = url;
        link.click();
    } else {
        alert('Gere o QR Code primeiro abrindo os detalhes do evento!');
    }
}

// Download all photos
function downloadAllPhotos() {
    alert('Funcionalidade de download de todas as fotos será implementada em breve!');
}

// Logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('eternize_user');
        window.location.href = 'login.html';
    }
}

// Close modals on outside click
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Initialize
initDashboard();

// Add some demo data if no events exist
if (events.length === 0) {
    // Create a demo event
    const demoEvent = {
        id: 'demo-' + Date.now(),
        name: 'Meu Primeiro Evento',
        date: new Date().toISOString().split('T')[0],
        type: 'outro',
        description: 'Evento de demonstração',
        theme: 'rosa',
        createdAt: new Date().toISOString(),
        contributors: 5
    };
    
    // Add some demo photos
    const demoPhotos = [
        { id: '1', url: 'https://via.placeholder.com/300/FFD1DC/333333?text=Foto+1', status: 'approved' },
        { id: '2', url: 'https://via.placeholder.com/300/ADD8E6/333333?text=Foto+2', status: 'pending' },
        { id: '3', url: 'https://via.placeholder.com/300/98FF98/333333?text=Foto+3', status: 'approved' }
    ];
    
    // Uncomment to add demo data
    // events.push(demoEvent);
    // localStorage.setItem('eternize_events', JSON.stringify(events));
    // localStorage.setItem(`event_${demoEvent.id}_photos`, JSON.stringify(demoPhotos));
    // initDashboard();
}
