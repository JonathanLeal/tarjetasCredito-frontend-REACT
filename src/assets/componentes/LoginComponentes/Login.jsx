import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import 'sweetalert2/dist/sweetalert2.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); 
  const irRegistro = () => navigate("/registro");
  const irHome = () => navigate("/home");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
        email,
        password,
      });

      sessionStorage.setItem('token', response.data.access_token);

      Swal.fire({
        icon: 'success',
        title: 'Login Exitoso',
        text: '¡Bienvenido!',
      }).then(() => {
        irHome();
      })
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
            icon: 'warning',
            title: 'Oppsss....',
            text: '¡Credenciales incorrectas! por favor ingresa las correctas',
        }).then(() => {
            setPassword("");
            setEmail("");
        })
      }

      if (error.response.status === 422) {
        Swal.fire({
            icon: 'warning',
            title: 'Oppsss....',
            text: 'Ingresa todos los campos y de manera correcta por favor',
        });
      }

      if (error.response.status === 500) {
        Swal.fire({
            icon: 'error',
            title: 'Oppsss....',
            text: 'A corrido un error en nuestro servidor, por favor intenta mas tarde',
        });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card login-card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
          <form>
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
              onClick={handleLogin}
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesión
            </button>
          </form>
          <div className="mt-3">
            <span className="mr-2">¿No tienes cuenta?</span>
            <a onClick={irRegistro} className="text-primary" style={{ cursor: 'pointer' }}>
              Regístrate aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
