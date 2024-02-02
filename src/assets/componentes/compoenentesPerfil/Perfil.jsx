import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Perfil = () => {
  const token = sessionStorage.getItem('token');
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario al cargar el componente
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/me',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const handleEdit = async () => {
    try {
      // Validar datos antes de enviar la solicitud de edición
      const { name, email } = userData;
      if (!name || !email) {
        showError('Nombre y correo electrónico son obligatorios');
        return;
      }

      // Enviar solicitud para editar usuario
      await axios.post(
        'http://127.0.0.1:8000/api/auth/user',
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess('Usuario editado con éxito');
    } catch (error) {
      if (error.response.status === 422) {
        showError('Ingresa ambos datos de manera correcta por favor');
      }

      if (error.response.status === 500) {
        showError('A ocurrido un error');
      }
    }
  };

  const handleChange = (e) => {
    // Manejar cambios en los campos del formulario
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleEditing = () => {
    setIsEditing((prevEditing) => !prevEditing);
  };

  const showError = (message) => {
    Swal.fire('Error', message, 'error');
  };

  const showSuccess = (message) => {
    Swal.fire('Éxito', message, 'success');
  };

  return (
    <div className="card perfil-card">
      <div className="card-header">
        <FontAwesomeIcon icon={faUser} size="2x" />
        <h2>Perfil de Usuario</h2>
      </div>
      <div className="card-body">
        <form className="perfil-form">
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${isEditing ? 'editable' : ''}`}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`form-input ${isEditing ? 'editable' : ''}`}
            />
          </div>
          {isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="edit-button"
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleEditing}
              className="edit-button"
            >
              Editar Perfil
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Perfil;
