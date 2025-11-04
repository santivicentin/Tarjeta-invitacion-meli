
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SINCRONIZACIÓN DEL BOTÓN 'INGRESAR' (SOLO EN index.html)
    const enterButton = document.getElementById('enter-button');

    if (enterButton) {
        // Estamos en index.html
        enterButton.addEventListener('click', () => {
            // Redirige al usuario a la página principal de la tarjeta.
            window.location.href = 'pages/tarjeta.html'; 
        });
    }
    const mapButton = document.getElementById('view-map-button');

    if (mapButton) {
        // Enlace directo al lugar en Google Maps
        const googleMapsUrl = 'https://maps.app.goo.gl/7UdFsyTQmuJBfyLb9'; 

        mapButton.addEventListener('click', () => {
            // Abre el mapa en una nueva pestaña
            window.open(googleMapsUrl, '_blank');
        });
    }

    const countdownTarget = document.getElementById('countdown');

    if (countdownTarget) {
        // 06 de diciembre de 2025 a las 21:00:00
        // Nota: Los meses en JavaScript son 0-indexados (Diciembre es el mes 11)
        const countdownDate = new Date("Dec 6, 2025 21:00:00").getTime();

        const updateCountdown = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            // Cálculos de tiempo
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Mostrar el resultado en los elementos HTML (con IDs #days, #hours, etc.)
            document.getElementById("days").innerHTML = days;
            document.getElementById("hours").innerHTML = hours;
            document.getElementById("minutes").innerHTML = minutes;
            document.getElementById("seconds").innerHTML = seconds;

            // Cuando la cuenta termine
            if (distance < 0) {
                clearInterval(updateCountdown);
                countdownTarget.innerHTML = "¡ES HOY!";
            }
        }, 1000);
    }
    // 3. LÓGICA DEL FORMULARIO RSVP (Confirmación de Asistencia)
    // ----------------------------------------------------
    const numPersonsSelect = document.getElementById('num-persons');
    const personFieldsContainer = document.getElementById('person-fields-container');
    const rsvpForm = document.getElementById('rsvp-form');

    // WhatsApp: Reemplaza con tu número de teléfono y mensaje base
    const phoneNumber = '5493424081254'; // Tu número de WhatsApp, con código de país
    const baseWhatsappMessage = '¡Hola Meli! Confirmo mi asistencia a tus 50 años.';

    // Función para generar campos de persona
    const generatePersonFields = (num) => {
        personFieldsContainer.innerHTML = ''; // Limpiar campos existentes
        for (let i = 1; i <= num; i++) {
            const fieldSet = document.createElement('div');
            fieldSet.classList.add('person-field-set');
            fieldSet.setAttribute('data-person-id', i);
            fieldSet.innerHTML = `
                <h3>Invitado ${i}</h3>
                <div class="form-group">
                    <label for="name-${i}">Nombre *</label>
                    <input type="text" id="name-${i}" name="name-${i}" required>
                </div>
                <div class="form-group">
                    <label for="lastname-${i}">Apellido *</label>
                    <input type="text" id="lastname-${i}" name="lastname-${i}" required>
                </div>
                <div class="form-group">
                    <p>¿Confirmas tu asistencia? *</p>
                    <label class="radio-label">
                        <input type="radio" name="confirm-${i}" value="Sí" required> ¡Confirmo!
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="confirm-${i}" value="No"> No podré asistir
                    </label>
                </div>
                <div class="form-group">
                    <label for="food-req-${i}">¿Algún requerimiento en la alimentación?</label>
                    <div class="select-wrapper">
                        <select id="food-req-${i}" name="food-req-${i}" class="form-select">
                            <option value="Ninguno">Ninguno</option>
                            <option value="Vegetariano">Vegetariano</option>
                            <option value="Vegano">Vegano</option>
                            <option value="Celíaco">Celíaco</option>
                            <option value="Otro">Otro (especificar en canción)</option>
                        </select>
                        <i class="fas fa-chevron-down select-arrow"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label for="song-req-${i}">¿Qué canción no puede faltar?</label>
                    <input type="text" id="song-req-${i}" name="song-req-${i}">
                </div>
            `;
            personFieldsContainer.appendChild(fieldSet);
        }
    };

    // Generar campos iniciales (1 persona por defecto)
    if (numPersonsSelect) {
        generatePersonFields(parseInt(numPersonsSelect.value));
        numPersonsSelect.addEventListener('change', (event) => {
            generatePersonFields(parseInt(event.target.value));
        });
    }

    // Manejar el envío del formulario (Botón "Confirmar")
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evitar el envío normal del formulario

            let message = baseWhatsappMessage + '\n\n';
            const numConfirmed = parseInt(numPersonsSelect.value);

            for (let i = 1; i <= numConfirmed; i++) {
                const name = document.getElementById(`name-${i}`).value;
                const lastname = document.getElementById(`lastname-${i}`).value;
                const confirm = document.querySelector(`input[name="confirm-${i}"]:checked`).value;
                const foodReq = document.getElementById(`food-req-${i}`).value;
                const songReq = document.getElementById(`song-req-${i}`).value;

                message += `--- Invitado ${i} ---\n`;
                message += `Nombre: ${name} ${lastname}\n`;
                message += `Confirma: ${confirm}\n`;
                if (foodReq !== 'Ninguno') {
                    message += `Alimentación: ${foodReq}\n`;
                }
                if (songReq) {
                    message += `Canción: ${songReq}\n`;
                }
                message += '\n';
            }

            // Abrir WhatsApp con el mensaje
            const whatsappUrl = `https://wa.me/${5493424081254}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ----------------------------------------------------
    // 4. Lógica de la Ventana Emergente (Modal de Precio)
    // ----------------------------------------------------
    const viewPriceButton = document.getElementById('view-price-button');
    const priceModal = document.getElementById('price-modal');
    const closeModalButton = document.querySelector('.modal .close-button');

    if (viewPriceButton && priceModal && closeModalButton) {
        viewPriceButton.addEventListener('click', () => {
            priceModal.classList.add('open');
        });

        closeModalButton.addEventListener('click', () => {
            priceModal.classList.remove('open');
        });

        // Cerrar el modal haciendo clic fuera de él
        window.addEventListener('click', (event) => {
            if (event.target === priceModal) {
                priceModal.classList.remove('open');
            }
        });
    }

});