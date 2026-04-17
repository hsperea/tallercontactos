const form = document.getElementById("form");
const list = document.getElementById("list");
const spinner = document.getElementById("spinner");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = null;

// Mostrar contactos