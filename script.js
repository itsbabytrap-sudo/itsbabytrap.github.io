document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    const portfolioContainer = document.querySelector('.portfolio-container');
    const navLinks = document.querySelectorAll('.sidebar nav a');
    const typingElement = document.querySelector('.typing-text');
    
    // =======================================================
    // 1. GESTIÓN DE PANTALLA DE CARGA (PRELOADER)
    // =======================================================
    
    function hidePreloader() {
        // Duración total de la carga (2s de la animación de la barra + 0.5s de fade out)
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
                portfolioContainer.classList.remove('hidden');
                document.body.style.overflowY = 'auto'; // Habilita el scroll
                
                if (typingElement) {
                    startTypingAnimation(typingElement);
                }

            }, { once: true });

        }, 2000); 
    }

    hidePreloader();


    // =======================================================
    // 2. NAVEGACIÓN ENTRE SECCIONES
    // =======================================================

    function showSection(targetId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
            setTimeout(() => {
                 targetSection.classList.add('active');
            }, 10);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('href');
            showSection(targetId);
        });
    });

    // Muestra la sección de inicio al cargar y activa su enlace
    showSection('#home');
    document.querySelector('.sidebar nav a[href="#home"]').classList.add('active');


    // =======================================================
    // 3. EFECTO DE ESCRITURA (Typing con negritas)
    // =======================================================
    
    function startTypingAnimation(element) {
        const fullText = element.textContent.trim();
        const htmlText = fullText.replace(/\*\*(.*?)\*\*/g, '<span>$1</span>');
            
        element.innerHTML = ''; 
        let charIndex = 0;
        const typingSpeed = 50; 

        function typeHtml() {
            if (charIndex < htmlText.length) {
                // Maneja el salto de etiquetas HTML (para las negritas <span>)
                if (htmlText.charAt(charIndex) === '<') {
                    const tagEnd = htmlText.indexOf('>', charIndex);
                    if (tagEnd !== -1) {
                        const tag = htmlText.substring(charIndex, tagEnd + 1);
                        element.innerHTML += tag;
                        charIndex = tagEnd + 1;
                    }
                } else {
                    element.innerHTML += htmlText.charAt(charIndex);
                    charIndex++;
                }

                setTimeout(typeHtml, typingSpeed);
            } else {
                 element.style.borderRight = 'none';
            }
        }

        typeHtml();
    }
});