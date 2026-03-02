// =============================
// IMPORTAR FIREBASE
// =============================
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = window.db;

// =============================
// VARIABLES
// =============================
let citas = [];

// =============================
// SECCIONES (NAVEGACIÓN)
// =============================
function mostrarAgenda() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("agenda").style.display = "block";
  document.getElementById("admin").style.display = "none";
}

function mostrarAdmin() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("agenda").style.display = "none";
  document.getElementById("admin").style.display = "block";
}

function irInicio() {
  document.getElementById("inicio").style.display = "block";
  document.getElementById("agenda").style.display = "none";
  document.getElementById("admin").style.display = "none";
}

// HACER FUNCIONES GLOBALES (IMPORTANTE)
window.mostrarAgenda = mostrarAgenda;
window.mostrarAdmin = mostrarAdmin;
window.irInicio = irInicio;

// =============================
// FORMULARIO
// =============================
const form = document.getElementById("formReserva");

async function enviarFormulario(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const servicio = document.getElementById("servicio").value;

  const datos = {
    nombre,
    telefono,
    fecha,
    hora,
    servicio,
    createdAt: new Date()
  };

  try {
    await addDoc(collection(db, "citas"), datos);
    alert("Cita registrada correctamente ✅");
    form.reset();
  } catch (error) {
    console.error(error);
    alert("Error al guardar ❌");
  }
}

// =============================
// ADMIN TIEMPO REAL
// =============================
function escucharCitas() {
  onSnapshot(collection(db, "citas"), (snapshot) => {
    citas = [];

    snapshot.forEach((docSnap) => {
      citas.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    renderCitas();
  });
}

// =============================
// RENDER TABLA ADMIN
// =============================
function renderCitas() {
  const tabla = document.getElementById("tablaCitas");
  if (!tabla) return;

  tabla.innerHTML = "";

  citas.forEach((cita) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${cita.nombre}</td>
      <td>${cita.telefono}</td>
      <td>${cita.fecha}</td>
      <td>${cita.hora}</td>
      <td>${cita.servicio}</td>
      <td>
        <button onclick="eliminarCita('${cita.id}')">
          Eliminar
        </button>
      </td>
    `;

    tabla.appendChild(fila);
  });
}

// =============================
// ELIMINAR
// =============================
window.eliminarCita = async function (id) {
  try {
    await deleteDoc(doc(db, "citas", id));
  } catch (error) {
    console.error(error);
  }
};

// =============================
// INICIALIZAR
// =============================
document.addEventListener("DOMContentLoaded", () => {
  if (form) {
    form.addEventListener("submit", enviarFormulario);
  }

  escucharCitas();
});
