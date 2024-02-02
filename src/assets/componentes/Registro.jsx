import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Registro = () => {
  const navigate = useNavigate();
  const irLogin = () => navigate("/")
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistro = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
        nombre,
        apellido,
        email,
        password,
      });

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Ve al inicio de sesion por favor!',
      }).then(() => {
        irLogin();
      })
      console.log(response.data);

    } catch (error) {
        if (error.response.status === 422) {
            Swal.fire({
                icon: 'warning',
                title: 'Notificacion',
                text: 'Por favor ingresa todos los campos y de manera correcta.',
            });
        }

        if (error.response.status === 400) {
            Swal.fire({
                icon: 'warning',
                title: 'Notificacion',
                text: 'Por favor ingrese otro correo electronico',
            }).then(() => {
                setEmail("");
            })
        }

        if (error.response.status === 500) {
            Swal.fire({
                icon: 'error',
                title: 'ops...',
                text: 'A ocurrido un error por favor intentar mas tarde',
            });
        }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div className="card registro-card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Registrarse</h2>
          <form style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="form-group">
              <label htmlFor="nombre">
                <FontAwesomeIcon icon={faUser} /> Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="Apellido">
                <FontAwesomeIcon icon={faUser} /> Apellido:
              </label>
              <input
                type="text"
                id="apellido"
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                <FontAwesomeIcon icon={faEnvelope} /> Email:
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <FontAwesomeIcon icon={faLock} /> Contraseña:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleRegistro}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Registrarse
            </button>
          </form>
          <div className="mt-3">
            <span className="mr-2">¿tienes cuenta?</span>
            <a onClick={irLogin} className="text-primary" style={{ cursor: 'pointer' }}>
              Inicia sesion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;
