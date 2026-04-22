
// ---------- Elementos del DOM ----------
const nombreInput = document.getElementById('nombre');
const apellidoInput = document.getElementById('apellido');
const telefonoInput = document.getElementById('telefono');
const ciudadInput = document.getElementById('ciudad');
const direccionInput = document.getElementById('direccion');
const generoRadios = document.querySelectorAll('input[name="genero"]');
const btnAdd = document.getElementById('btnAdd');
const btnTextSpan = document.getElementById('btnText');
const spinner = document.getElementById('spinner');
const contactListContainer = document.getElementById('contactListContainer');

// Variable para controlar si estamos editando (id del contacto en edición)
let editModeId = null;

// ---------- Función para obtener género seleccionado ----------
function getSelectedGender() {
    let selected = 'female';
    for (let radio of generoRadios) {
        if (radio.checked) {
            selected = radio.value;
            break;
        }
    }
    return selected;
}

// ---------- Obtener contactos desde localStorage ----------
function getContactsFromStorage() {
    const contacts = localStorage.getItem('contactList');
    if (contacts) {
        return JSON.parse(contacts);
    }
    return []; // retorna array vacío si no hay datos
}

// ---------- Guardar contactos en localStorage ----------
function saveContactsToStorage(contacts) {
    localStorage.setItem('contactList', JSON.stringify(contacts));
}


function renderContactList() {
  
    contactListContainer.innerHTML = '<li class="placeholder-msg"><i class="fas fa-circle-notch fa-spin"></i> Cargando contactos...</li>';
    
    // Simulamos pequeño retardo para visualizar el spinner 
    setTimeout(() => {
        const contacts = getContactsFromStorage();
        if (!contacts.length) {
            contactListContainer.innerHTML = '<li class="placeholder-msg"> No hay contactos. ¡Agrega uno!</li>';
            return;
        }
        
        let html = '';
        contacts.forEach(contact => {
            // Determinar icono según género
            const genderIcon = contact.genero === 'female' 
                ? '<i class="fas fa-venus" style="color:#ec489a;"></i>' 
                : '<i class="fas fa-mars" style="color:#3b82f6;"></i>';
            
            // Mostrar nombre completo: nombre + apellido
            const fullName = `${contact.nombre} ${contact.apellido}`.trim();
            
            html += `
                <li data-id="${contact.id}">
                    <div class="contact-info">
                        <div class="contact-name">
                            <span class="gender-icon">${genderIcon}</span>
                            <strong>${escapeHtml(fullName)}</strong>
                        </div>
                        <div class="contact-detail">
                            <span><i class="fas fa-phone-alt"></i> ${escapeHtml(contact.telefono)}</span>
                            <span><i class="fas fa-city"></i> ${escapeHtml(contact.ciudad)}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(contact.direccion)}</span>
                        </div>
                    </div>
                    <div class="contact-actions">
                        <button class="edit-btn" data-id="${contact.id}" title="Editar"><i class="fas fa-pen"></i></button>
                        <button class="delete-btn" data-id="${contact.id}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </li>
            `;
        });
        contactListContainer.innerHTML = html;
        
        // Agregar event listeners a botones de editar/eliminar 
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const contactId = parseInt(btn.getAttribute('data-id'));
                loadContactToEdit(contactId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const contactId = parseInt(btn.getAttribute('data-id'));
                deleteContactById(contactId);
            });
        });
    }, 300);
}


function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

// ---------- Validar campos  ----------
function validateInputs() {
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const telefono = telefonoInput.value.trim();
    const ciudad = ciudadInput.value.trim();
    const direccion = direccionInput.value.trim();
    
    if (!nombre) {
        alert(' El nombre es obligatorio.');
        nombreInput.focus();
        return false;
    }
    if (!apellido) {
        alert(' El apellido es obligatorio.');
        apellidoInput.focus();
        return false;
    }
    if (!telefono) {
        alert(' El teléfono es obligatorio.');
        telefonoInput.focus();
        return false;
    }
    if (!ciudad) {
        alert(' La ciudad es obligatoria.');
        ciudadInput.focus();
        return false;
    }
    if (!direccion) {
        alert(' La dirección es obligatoria.');
        direccionInput.focus();
        return false;
    }
    // validación extra de teléfono 
    if (telefono.length < 5) {
        alert(' El teléfono debe tener al menos 5 caracteres.');
        telefonoInput.focus();
        return false;
    }
    return true;
}

// ---------- Limpiar formulario despues de agregar o editar ----------
function resetForm() {
    nombreInput.value = '';
    apellidoInput.value = '';
    telefonoInput.value = '';
    ciudadInput.value = '';
    direccionInput.value = '';
   
    document.querySelector('input[value="female"]').checked = true;
    editModeId = null;
    btnTextSpan.innerText = 'Agregar';
    //Para cambiar estilo si estaba en modo edición
    btnAdd.style.background = '#3b82f6';
}

// ---------- Crear nuevo contacto  ----------
function addContact() {
    if (!validateInputs()) return false;
    
    const contacts = getContactsFromStorage();
    const newId = Date.now(); 
    
    const newContact = {
        id: newId,
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        ciudad: ciudadInput.value.trim(),
        direccion: direccionInput.value.trim(),
        genero: getSelectedGender()
    };
    
    contacts.push(newContact);
    saveContactsToStorage(contacts);
    resetForm();
    renderContactList(); // Para refrescar la lista con spinner 
    return true;
}

// ---------- Cargar contacto al formulario para EDITAR  ----------
function loadContactToEdit(id) {
    const contacts = getContactsFromStorage();
    const contact = contacts.find(c => c.id === id);
    if (!contact) {
        alert('Contacto no encontrado');
        return;
    }
    
    // Rellenar formulario
    nombreInput.value = contact.nombre;
    apellidoInput.value = contact.apellido;
    telefonoInput.value = contact.telefono;
    ciudadInput.value = contact.ciudad;
    direccionInput.value = contact.direccion;
    
    // Seleccionar género
    if (contact.genero === 'female') {
        document.querySelector('input[value="female"]').checked = true;
    } else {
        document.querySelector('input[value="male"]').checked = true;
    }
    
    // Cambiar modo edición
    editModeId = contact.id;
    btnTextSpan.innerText = 'Actualizar';
    btnAdd.style.background = '#f59e0b'; // color distintivo para update
    
    // Hacer scroll al formulario
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Actualizar contacto  ----------
function updateContact() {
    if (!validateInputs()) return false;
    if (editModeId === null) return false;
    
    const contacts = getContactsFromStorage();
    const index = contacts.findIndex(c => c.id === editModeId);
    if (index === -1) {
        alert('Error: contacto no existe');
        resetForm();
        return false;
    }
    
    // Actualizar datos
    contacts[index] = {
        ...contacts[index],
        nombre: nombreInput.value.trim(),
        apellido: apellidoInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        ciudad: ciudadInput.value.trim(),
        direccion: direccionInput.value.trim(),
        genero: getSelectedGender()
    };
    
    saveContactsToStorage(contacts);
    resetForm();   // Aqui limpiamos campos 
    renderContactList();
    return true;
}

// ---------- Eliminar contacto  ----------
function deleteContactById(id) {
    const confirmDelete = confirm(' ¿Estás seguro de eliminar este contacto?');
    if (!confirmDelete) return;
    
    let contacts = getContactsFromStorage();
    const newContacts = contacts.filter(contact => contact.id !== id);
    
    if (newContacts.length === contacts.length) {
        alert('Contacto no encontrado');
        return;
    }
    
    saveContactsToStorage(newContacts);
    // Si estábamos editando justo ese contacto y lo borramos, resetear formulario
    if (editModeId === id) {
        resetForm();
    }
    renderContactList();
}

async function handleAddOrUpdate() {
    spinner.classList.remove('hidden');
    btnTextSpan.classList.add('hidden');
    btnAdd.disabled = true;
    
    // Simular llamado a BD 
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let operationSuccess = false;
    if (editModeId !== null) {
        operationSuccess = updateContact();
    } else {
        operationSuccess = addContact();
    }
    spinner.classList.add('hidden');
    btnTextSpan.classList.remove('hidden');
    btnAdd.disabled = false;
    
    if (!operationSuccess && editModeId === null) {

    } else if (!operationSuccess && editModeId !== null) {
        
    }
}

function init() {
   
    const initialContacts = [
        {
            id: 1001,
            nombre: "Michael",
            apellido: "Olise",
            telefono: "3123456789",
            ciudad: "Cali",
            direccion: "Calle 10 #5-60",
            genero: "male"
        },
        {
            id: 1002,
            nombre: "Cardi",
            apellido: "B",
            telefono: "3159876543",
            ciudad: "Palmira",
            direccion: "Calle 88",
            genero: "female"
        }
    ];
    
    
    const stored = localStorage.getItem('contactList');
    if (!stored) {
        saveContactsToStorage(initialContacts);
    }
    
    
    renderContactList();
    

    btnAdd.addEventListener('click', handleAddOrUpdate);
}


init();