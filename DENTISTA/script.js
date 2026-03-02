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
// ELEMENTOS DEL DOM
// =============================
const form = document.getElementById("formReserva");
const tablaCitas = document.getElementById("tablaCitas");

// =============================
// ENVIAR FORMULARIO (GUARDAR EN FIREBASE)
// =============================
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
    console.error("Error al guardar:", error);
    alert("Error al guardar la cita ❌");
  }
}

// =============================
// MOSTRAR CITAS EN TIEMPO REAL
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
// RENDERIZAR TABLA
// =============================
function renderCitas() {
  if (!tablaCitas) return;

  tablaCitas.innerHTML = "";

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

    tablaCitas.appendChild(fila);
  });
}

// =============================
// ELIMINAR CITA
// =============================
window.eliminarCita = async function (id) {
  try {
    await deleteDoc(doc(db, "citas", id));
  } catch (error) {
    console.error("Error eliminando:", error);
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

// =============================
// HACER FUNCIONES GLOBALES
// =============================
window.mostrarAgenda = mostrarAgenda;
window.mostrarAdmin = mostrarAdmin;
window.irInicio = irInicio;
