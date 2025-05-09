
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

                    if (project.url) {
                        card.style.cursor = 'pointer';
                        card.addEventListener('click', () => {
                            window.open(project.url, '_blank');
                        });
                    }

                    // Contenedar de media
                    const mediaContainer = document.createElement('div');
                    mediaContainer.classList.add('media-container');
                    
                    if(project.type !== 'carousel')
                    {
                        const staticImg = document.createElement('img');
                        staticImg.classList.add('static-media');
                        staticImg.src = project.thumbnail;
                        staticImg.alt = `Thumbnail ${project.title}`;
                        mediaContainer.appendChild(staticImg);
                    }

                    // Elemento animado segun el tipo
                    if(project.type === 'video') {
                        const video = document.createElement('video');
                        video.classList.add('animated-media');
                        video.muted = true;
                        video.loop = true;
                        video.preload = "none";
                        //video.autoplay = true;

                        const source = document.createElement('source');
                        source.src = project.media;
                        source.type = 'video/mp4';
                        video.appendChild(source);

                        card.addEventListener('mouseenter', () => {
                            video.play().catch(err => {
                                console.warn(`No se pudo reproducir el video de ${project.title}:`, err);
                            });
                        });
                        card.addEventListener('mouseleave', () => {
                            video.pause();
                            video.currentTime = 0;
                        });

                        mediaContainer.appendChild(video);

                        // video.play().catch(err => {
                        //     console.warn(`No se pudo reproducir el video de ${project.title}:`, err);
                        // });
                    }
                    else if(project.type === 'gif') {
                        const animatedImg = document.createElement('img');
                        animatedImg.classList.add('animated-media');
                        animatedImg.src = project.media;
                        animatedImg.alt = `Animacion ${project.title}`;
                        mediaContainer.appendChild(animatedImg);
                    }
                    else if (project.type === 'carousel') {
                        const carousel = document.createElement('div');
                        carousel.classList.add('carousel-container');

                        const inner = document.createElement('div');
                        inner.classList.add('carousel-inner');

                        project.images.forEach(src => {
                            const img = document.createElement('img');
                            img.src = src;
                            img.classList.add('carousel-image');
                            inner.appendChild(img);
                        });

                        carousel.appendChild(inner);
                        mediaContainer.appendChild(carousel);

                        // Desplazamiento automático
                        let index = 0;
                        let intervalId;

                        card.addEventListener('mouseenter', () => {
                        intervalId = setInterval(() => {
                            index = (index + 1) % project.images.length;
                            inner.style.transform = `translateX(-${index * 100}%)`;
                        }, 2000); // o 3000 ms si prefieres más lento
                        });

                        card.addEventListener('mouseleave', () => {
                        clearInterval(intervalId);
                        index = 0;
                        inner.style.transform = `translateX(0%)`; // Reiniciar al inicio si quieres
                        });
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