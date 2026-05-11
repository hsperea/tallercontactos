const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const telefonoInput = document.getElementById('telefono');
const ciudadInput = document.getElementById('ciudad');
const direccionInput = document.getElementById('direccion');

const generoRadios = document.querySelectorAll('input[name="genero"]');

const btnAdd = document.getElementById('btnAdd');

const contactListContainer = document.getElementById('contactListContainer');

let editModeId = null;


// Obtener género
function getSelectedGender() {

    for (let radio of generoRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }

    return 'female';
}


// Obtener contactos API
async function getContacts() {

    const response = await fetch('/api/contacts');

    return await response.json();
}


// Renderizar lista
async function renderContacts() {

    const contacts = await getContacts();

    if (!contacts.length) {
        contactListContainer.innerHTML =
            '<li class="placeholder-msg">No hay contactos</li>';
        return;
    }

    let html = '';

    contacts.forEach(contact => {

        const genderIcon =
            contact.genero === 'female'
            ? '♀️'
            : '♂️';

        html += `
            <li>
                <div class="contact-info">

                    <div class="contact-name">
                        ${genderIcon}
                        <strong>
                            ${contact.nombre} ${contact.apellido}
                        </strong>
                    </div>

                    <div class="contact-detail">
                        <span>${contact.telefono}</span>
                        <span>${contact.ciudad}</span>
                        <span>${contact.direccion}</span>
                    </div>

                </div>

                <div class="contact-actions">

                    <button
                        class="edit-btn"
                        onclick="loadContact(${contact.id})">
                        ✏️
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteContact(${contact.id})">
                        🗑️
                    </button>

                </div>
            </li>
        `;
    });

    contactListContainer.innerHTML = html;
}


// Agregar contacto
async function addContact() {

    const newContact = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        telefono: telefonoInput.value,
        ciudad: ciudadInput.value,
        direccion: direccionInput.value,
        genero: getSelectedGender()
    };

    await fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newContact)
    });

    resetForm();

    renderContacts();
}


// Cargar para editar
async function loadContact(id) {

    const contacts = await getContacts();

    const contact = contacts.find(c => c.id === id);

    if (!contact) return;

    nombreInput.value = contact.nombre;
    apellidoInput.value = contact.apellido;
    telefonoInput.value = contact.telefono;
    ciudadInput.value = contact.ciudad;
    direccionInput.value = contact.direccion;

    if (contact.genero === 'female') {
        document.querySelector('input[value="female"]').checked = true;
    } else {
        document.querySelector('input[value="male"]').checked = true;
    }

    editModeId = id;

    btnAdd.innerText = 'Actualizar';
}


// Actualizar
async function updateContact() {

    const updatedContact = {
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        telefono: telefonoInput.value,
        ciudad: ciudadInput.value,
        direccion: direccionInput.value,
        genero: getSelectedGender()
    };

    await fetch(`/api/contacts/${editModeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedContact)
    });

    resetForm();

    editModeId = null;

    btnAdd.innerText = 'Agregar';

    renderContacts();
}


// Eliminar
async function deleteContact(id) {

    await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
    });

    renderContacts();
}


// Limpiar formulario
function resetForm() {

    nombreInput.value = '';
    apellidoInput.value = '';
    telefonoInput.value = '';
    ciudadInput.value = '';
    direccionInput.value = '';

    document.querySelector(
        'input[value="female"]'
    ).checked = true;
}


// Botón agregar/actualizar
btnAdd.addEventListener('click', async () => {

    if (editModeId) {
        await updateContact();
    } else {
        await addContact();
    }
});


// Inicializar
renderContacts();