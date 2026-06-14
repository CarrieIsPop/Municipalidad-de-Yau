<template>
  <div class="dashboard">
    <header>
      <h1>Panel de Gestión - Municipalidad de Yau</h1>
      <p>Módulo de revisión de trámites priorizados por IA</p>
    </header>

    <!-- NUEVO: Zona de Búsqueda y Filtros -->
    <div class="filtros-container">
      <input 
        v-model="filtroNombre" 
        type="text" 
        placeholder="🔍 Buscar por nombre de trámite..." 
        class="input-busqueda"
      />
      <input 
        v-model="filtroDni" 
        type="text" 
        placeholder="🔍 Buscar por DNI (Ej: 12345678)" 
        class="input-busqueda"
        maxlength="8"
      />
    </div>

    <div class="tramites-container">
      <!-- Usamos tramitesFiltrados en lugar de tramites -->
      <div v-for="tramite in tramitesFiltrados" :key="tramite.id" class="tarjeta-tramite">
        <div class="info-principal">
          <h2>{{ tramite.tipo_documento }}</h2>
          <span :class="'badge ' + (tramite.prioridad_ml === 'Alta' ? 'alta' : tramite.prioridad_ml === 'Baja' ? 'baja' : 'media')">
            Prioridad: {{ tramite.prioridad_ml }}
          </span>
        </div>
        
        <p><strong>DNI Solicitante:</strong> {{ tramite.dni_ciudadano }}</p>
        <p><strong>Estado Actual:</strong> <span class="estado">{{ tramite.estado }}</span></p>

        <div class="acciones">
          <button v-if="tramite.estado === 'Pendiente'" @click="aprobarTramite(tramite.id)" class="btn-aprobar">
            ✓ Aprobar
          </button>
          <!-- Nuevo botón de eliminar -->
          <button @click="eliminarTramite(tramite.id)" class="btn-eliminar">
          🗑️ Eliminar
          </button>
        </div>
      </div>
      
      <!-- Mensaje si no hay resultados -->
      <div v-if="tramitesFiltrados.length === 0" class="sin-resultados">
        <p>No se encontraron trámites con esos criterios.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// IMPORTACIÓN CORREGIDA: Todo en una sola línea
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'; 
import { db } from './firebase';

const tramites = ref([]);

// Variables para los buscadores
const filtroNombre = ref('');
const filtroDni = ref('');

onMounted(() => {
  const tramitesRef = collection(db, 'tramites');
  
  onSnapshot(tramitesRef, (snapshot) => {
    const lista = [];
    snapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    // Ordenamos por prioridad (Alta primero)
    tramites.value = lista.sort((a, b) => {
      if (a.prioridad_ml === 'Alta' && b.prioridad_ml !== 'Alta') return -1;
      if (a.prioridad_ml !== 'Alta' && b.prioridad_ml === 'Alta') return 1;
      return 0;
    });
  });
});

// Lógica computada para filtrar la lista en tiempo real
const tramitesFiltrados = computed(() => {
  return tramites.value.filter(tramite => {
    const coincideNombre = tramite.tipo_documento.toLowerCase().includes(filtroNombre.value.toLowerCase());
    const coincideDni = tramite.dni_ciudadano.includes(filtroDni.value);
    
    return coincideNombre && coincideDni;
  });
});

const aprobarTramite = async (idDocumento) => {
  try {
    const tramiteRef = doc(db, 'tramites', idDocumento);
    await updateDoc(tramiteRef, {
      estado: 'Aprobado'
    });
    alert('¡Trámite aprobado exitosamente!');
  } catch (error) {
    console.error('Error al actualizar: ', error);
  }
};

// Función para eliminar
const eliminarTramite = async (idDocumento) => {
  if (confirm("¿Estás seguro de eliminar este trámite?")) {
    try {
      await deleteDoc(doc(db, 'tramites', idDocumento));
    } catch (error) {
      console.error('Error al eliminar: ', error);
    }
  }
};
</script>

<style>
/* Importamos una fuente moderna y profesional */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
}

.dashboard {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

header {
  background: linear-gradient(135deg, #0D47A1 0%, #1976D2 100%);
  color: white;
  padding: 30px 20px;
  border-radius: 12px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(13, 71, 161, 0.2);
  /* Usamos flexbox para que los textos nunca se monten */
  display: flex;
  flex-direction: column;
  gap: 10px; 
}

header h1 { 
  margin: 0; 
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.tramites-container {
  display: grid;
  gap: 20px;
}

.tarjeta-tramite {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #eaeaea;
  transition: transform 0.2s ease;
}

.tarjeta-tramite:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.info-principal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.info-principal h2 { 
  margin: 0; 
  color: #2c3e50; 
  font-size: 20px;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.badge.alta { background-color: #fee2e2; color: #dc2626; }
.badge.media { background-color: #dcfce7; color: #16a34a; }

.estado { 
  color: #f59e0b; 
  font-weight: 700; 
}

.acciones { margin-top: 20px; }

.btn-aprobar {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.2s;
  width: 100%; /* Botón ancho para mejor click */
}

.btn-aprobar:hover { background-color: #1d4ed8; }
/* Estilos para los filtros */
.filtros-container {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.input-busqueda {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  font-family: 'Inter', sans-serif;
}

.input-busqueda:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.sin-resultados {
  text-align: center;
  color: #6b7280;
  padding: 40px;
  background: white;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
}

/* Color para prioridad baja que agregamos en la vista */
.badge.baja { background-color: #f3f4f6; color: #4b5563; }

.btn-eliminar {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
.btn-eliminar:hover { background-color: #dc2626; }
</style>
