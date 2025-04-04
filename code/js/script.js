
document.addEventListener("DOMContentLoaded", () => {
    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            projects.forEach(project => {
                // Determina el contenedor de acuerdo a la categoría
                const galleryId = `gallery-${project.category.toLowerCase()}`;
                const gallery = document.getElementById(galleryId);
                if(gallery) {
                    // Crea la tarjeta del proyecto
                    const card = document.createElement('div');
                    card.classList.add('project-card');
                    card.dataset.type = project.type;

                    // Contenedar de media
                    const mediaContainer = document.createElement('div');
                    mediaContainer.classList.add('media-container');

                    // Imagen estatica
                    const staticImg = document.createElement('img');
                    staticImg.classList.add('static-media');
                    staticImg.src = project.thumbnail;
                    staticImg.alt = `Thumbnail ${project.title}`;
                    mediaContainer.appendChild(staticImg);

                    // Elemento animado segun el tipo
                    if(project.type === 'video') {
                        const video = document.createElement('video');
                        video.classList.add('animated-media');
                        video.muted = true;
                        video.loop = true;
                        video.preload = "none";
                        const source = document.createElement('source');
                        source.src = project.media;
                        source.type = 'video/mp4';
                        video.appendChild(source);
                        mediaContainer.appendChild(video);
                    }
                    else if(project.type === 'gif') {
                        const animatedImg = document.createElement('img');
                        animatedImg.classList.add('animated-media');
                        animatedImg.src = project.media;
                        animatedImg.alt = `Animacion ${project.title}`;
                        mediaContainer.appendChild(animatedImg);
                    }

                    // Agregar el contenedor de medios a la tarjeta
                    card.appendChild(mediaContainer);

                    // Insertar la tarjeta en la galería correspondiente
                    gallery.appendChild(card);
                }
            });

            // Configurar animación al hacer scroll con IntersectionObserver
            const projectCards = document.querySelectorAll('.project-card');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
                });
            }, { threshold: 0.2 });

            projectCards.forEach(card => {
                observer.observe(card);
            });
        })
    .catch(error => console.error('Error cargando los proyectos:', error));
});