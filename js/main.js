// En tu archivo main.js
async function cargarContenido(url, updateHistory = false) {
    function actualizarNavActivo(url) {
        // Remover clase 'active' de todos los links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
    
        // Determinar qué link activar basado en la URL
        const nombreArchivo = url.split('/').pop();
        let selector;
        
        switch(nombreArchivo) {
            case 'sobre-mi.html':
                selector = 'a[data-cargar="contenido/sobre-mi.html"]';
                break;
            case 'experiencia.html':
                selector = 'a[data-cargar="contenido/experiencia.html"]';
                break;
            case 'formacion.html':
                selector = 'a[data-cargar="contenido/formacion.html"]';
                break;
            case 'contacto.html':
                selector = 'a[data-cargar="contenido/contacto.html"]';
                break;
        }
    
        // Añadir clase 'active' al link correspondiente
        if (selector) {
            const linkActivo = document.querySelector(selector);
            if (linkActivo) {
                linkActivo.classList.add('active');
            }
        }
    }
    
    try {
        // Mostrar loader
        document.getElementById('contenido-dinamico').innerHTML = `
            <div class="text-center my-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const html = await response.text();
        document.getElementById('contenido-dinamico').innerHTML = html;
        actualizarNavActivo(url);

        // Solo actualiza el historial si se solicita explícitamente
        if (updateHistory) {
            history.pushState({ url }, '', getCleanUrl(url));
        }

    } catch (error) {
        console.error('Error al cargar el contenido:', error);
        document.getElementById('contenido-dinamico').innerHTML = `
            <div class="alert alert-danger">
                Error al cargar el contenido: ${error.message}
            </div>
        `;
    }
}

// Función auxiliar para obtener URLs limpias
function getCleanUrl(url) {
    if (url.includes('sobre-mi.html')) return '/';
    return url.replace('contenido/', '');
}

// Eventos para los links del navbar (modificado)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-cargar]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // ¡Esto es clave!
            const url = e.target.getAttribute('data-cargar');
            cargarContenido(url, false); // No actualizar historial
        });
    });
});

// Elimina el event listener de popstate si no quieres manejar el botón atrás