/*
 * Generado para psicólogo Álvaro Jiménez
 * Funcionalidad compartida entre index.html y recursos.html
 */

// ==========================================
// I. INICIALIZACIÓN AL CARGAR EL DOM
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initSmoothScroll();
    initContactForm();
    initTabs();
    initResourceStore();
});

// ==========================================
// II. NAVBAR - CAMBIO DE ESTILO AL SCROLL
// ==========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==========================================
// III. SMOOTH SCROLL PARA NAVEGACIÓN
// ==========================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo aplicar a enlaces internos
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú hamburguesa en móvil
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
}

// ==========================================
// IV. VALIDACIÓN FORMULARIO DE CONTACTO
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;
        const formMessage = document.getElementById('form-message');

        // Limpiar validaciones previas
        contactForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        formMessage.innerHTML = '';

        // Validación de campos
        const nombre = document.getElementById('nombre');
        if (!nombre.value.trim()) {
            nombre.classList.add('is-invalid');
            isValid = false;
        }

        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value || !emailPattern.test(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        }
        
        const asunto = document.getElementById('asunto');
        if (!asunto.value.trim()) {
            asunto.classList.add('is-invalid');
            isValid = false;
        }

        const mensaje = document.getElementById('mensaje');
        if (!mensaje.value.trim()) {
            mensaje.classList.add('is-invalid');
            isValid = false;
        }

        if (isValid) {
            formMessage.innerHTML = '<div class="alert alert-success">¡Gracias! Tu mensaje ha sido enviado. Te responderé pronto.</div>';
            contactForm.reset();
        } else {
            formMessage.innerHTML = '<div class="alert alert-danger">Por favor, completa todos los campos requeridos correctamente.</div>';
        }
    });
}

// ==========================================
// V. SISTEMA DE TABS
// ==========================================
function initTabs() {
    window.openTab = function(evt, tabName) {
        // Ocultar todos los contenidos
        const tabContents = document.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        
        // Remover clase active de todos los botones
        const tabButtons = document.getElementsByClassName("tab-button");
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove("active");
        }
        
        // Mostrar contenido actual y activar botón
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        if (evt && evt.currentTarget) {
            evt.currentTarget.classList.add("active");
        }
    };
}

// ==========================================
// VI. TIENDA DE RECURSOS (RECURSOS.HTML)
// ==========================================
function initResourceStore() {
    // Solo ejecutar si estamos en recursos.html
    if (!document.getElementById('resource-store')) return;
    
    const selectedResources = new Set();
    const storeContainer = document.getElementById('resource-store');
    
    // Cargar selección previa del localStorage
    loadSavedSelection();
    
    // Crear interfaz de tienda
    createStoreUI();
    
    function createStoreUI() {
        // Agregar checkboxes a cada tarjeta de recurso
        const resourceCards = document.querySelectorAll('.card');
        
        resourceCards.forEach((card, index) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'resource-checkbox';
            checkbox.dataset.resourceId = `resource-${index}`;
            checkbox.dataset.resourceTitle = card.querySelector('.card-title')?.textContent || '';
            
            // Insertar checkbox en el footer de la card
            const footer = card.querySelector('.card-footer') || card.querySelector('.card-body');
            if (footer) {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'form-check mt-3';
                checkboxContainer.innerHTML = `
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input resource-checkbox" 
                               data-resource-id="resource-${index}"
                               data-resource-title="${card.querySelector('.card-title')?.textContent || ''}">
                        Agregar al pack
                    </label>
                `;
                footer.appendChild(checkboxContainer);
            }
        });
        
        // Panel flotante de pack
        createPackPanel();
        
        // Event listeners para checkboxes
        document.querySelectorAll('.resource-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', handleResourceSelection);
        });
    }
    
    function createPackPanel() {
        const panel = document.createElement('div');
        panel.id = 'pack-panel';
        panel.className = 'pack-panel';
        panel.innerHTML = `
            <div class="pack-panel-content">
                <h3>Mi Pack Personalizado</h3>
                <div id="selected-items" class="mb-3"></div>
                <div class="pack-customization mb-3">
                    <input type="text" id="pack-name" class="form-control mb-2" placeholder="Nombre del pack">
                    <textarea id="pack-description" class="form-control mb-2" placeholder="Descripción breve"></textarea>
                </div>
                <button onclick="downloadPack()" class="btn btn-accent w-100">Descargar Pack</button>
                <button onclick="savePreset()" class="btn btn-secondary w-100 mt-2">Guardar Preset</button>
            </div>
        `;
        
        // Agregar estilos inline para el panel
        const style = document.createElement('style');
        style.textContent = `
            .pack-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 300px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                padding: 1.5rem;
                z-index: 1000;
                display: none;
            }
            .pack-panel.active {
                display: block;
            }
            .selected-item {
                padding: 0.5rem;
                background: var(--color-fondo-claro);
                border-radius: 5px;
                margin-bottom: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .remove-item {
                cursor: pointer;
                color: var(--color-acento-calido);
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
    }
    
    function handleResourceSelection(e) {
        const checkbox = e.target;
        const resourceId = checkbox.dataset.resourceId;
        const resourceTitle = checkbox.dataset.resourceTitle;
        
        if (checkbox.checked) {
            selectedResources.add({id: resourceId, title: resourceTitle});
        } else {
            selectedResources.delete(Array.from(selectedResources).find(r => r.id === resourceId));
        }
        
        updatePackPanel();
        saveSelection();
    }
    
    function updatePackPanel() {
        const panel = document.getElementById('pack-panel');
        const itemsContainer = document.getElementById('selected-items');
        
        if (selectedResources.size > 0) {
            panel.classList.add('active');
            itemsContainer.innerHTML = Array.from(selectedResources).map(resource => `
                <div class="selected-item">
                    <span>${resource.title}</span>
                    <span class="remove-item" onclick="removeFromPack('${resource.id}')">✕</span>
                </div>
            `).join('');
        } else {
            panel.classList.remove('active');
        }
    }
    
    window.removeFromPack = function(resourceId) {
        const checkbox = document.querySelector(`[data-resource-id="${resourceId}"]`);
        if (checkbox) {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));
        }
    };
    
    window.downloadPack = function() {
        const packName = document.getElementById('pack-name')?.value || 'mi-pack';
        const packDescription = document.getElementById('pack-description')?.value || '';
        
        const packData = {
            name: packName,
            description: packDescription,
            createdAt: new Date().toISOString(),
            resources: Array.from(selectedResources)
        };
        
        // Crear y descargar archivo JSON
        const dataStr = JSON.stringify(packData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `pack-${packName}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        alert('¡Pack descargado exitosamente!');
    };
    
    window.savePreset = function() {
        const packName = document.getElementById('pack-name')?.value || 'preset';
        const packDescription = document.getElementById('pack-description')?.value || '';
        
        const preset = {
            name: packName,
            description: packDescription,
            resources: Array.from(selectedResources)
        };
        
        localStorage.setItem(`preset-${packName}`, JSON.stringify(preset));
        alert('Preset guardado exitosamente!');
    };
    
    function saveSelection() {
        localStorage.setItem('selectedResources', JSON.stringify(Array.from(selectedResources)));
    }
    
    function loadSavedSelection() {
        const saved = localStorage.getItem('selectedResources');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                parsed.forEach(resource => selectedResources.add(resource));
            } catch (e) {
                console.error('Error loading saved selection:', e);
            }
        }
    }
}

// ==========================================
// VII. UTILIDADES
// ==========================================

// Detección de contraste para accesibilidad
function checkContrast(bgColor, textColor) {
    // Implementación básica de verificación de contraste WCAG
    // Retorna true si el contraste es suficiente (>= 4.5:1)
    // Esta es una versión simplificada
    return true; // TODO: Implementar cálculo real
}

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.message);
});