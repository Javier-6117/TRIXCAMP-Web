# 🌐 TRIXCAMP - Plataforma Web de Gestión Deportiva

## Descripción
TRIXCAMP es una plataforma web progresiva (PWA) diseñada para la gestión integral de instalaciones deportivas de fútbol. Permite el monitoreo en tiempo real de jugadores, control de condiciones del campo mediante sensores IoT, programación de actividades y administración de seguridad.

## 🚀 Características Principales
- **Dashboard centralizado** con métricas en tiempo real
- **Gestión completa de equipos y jugadores** (CRUD)
- **Monitoreo ambiental** de campos (temperatura, humedad, lluvia)
- **Sistema de reservas** y agendamiento de entrenamientos
- **Autenticación segura** con Firebase Auth
- **Interfaz responsive** para todos los dispositivos

## 🛠️ Tecnologías
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js + Express.js
- **Base de datos:** Firebase Firestore
- **Autenticación:** Firebase Auth
- **Hosting:** (Por definir)

## 👥 Equipo INFINITUM
| Rol | Integrante |
|-----|------------|
| Product Owner | Andrés Manuel Ramírez Gómez |
| Scrum Master | Edgar Ulises Alanis Guerrero |
| Desarrollador Full Stack | Daniel García Ríos |
| Diseñadora UI/UX | Claudia Lizbeth López Ramos |
| Desarrollador Backend/Tester | Javier Adrián Frausto Alvarado |

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 16+
- Cuenta de Firebase
- Navegador web moderno

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/tuusuario/TRIXCAMP-Web.git

# Instalar dependencias
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Ejecutar servidor
npm start
