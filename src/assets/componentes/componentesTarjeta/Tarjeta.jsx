import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBill, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const Tarjeta =() => {
    const [tarjetas, setTarjetas] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nuevaTarjeta, setNuevaTarjeta] = useState({
        monto: '',
        banco: '',
        cvv: '',
        vencimiento: '',
        numTarjeta: '',
    });
    const [tarjetaEdit, setTarjetaEdit] = useState(null); // Nuevo estado para la tarjeta seleccionada para editar
    const [editMode, setEditMode] = useState(false);
    const [filasDeTarjetas, setFilasDeTarjetas] = useState([]);
    const token = sessionStorage.getItem('token');

    const obtenerTarjetas = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/tarjetas', {}, { headers: { Authorization: `Bearer ${token}` } });
            setTarjetas(response.data);
            
            // Divide las tarjetas en filas de tres
            const tarjetasDivididas = response.data.reduce((acc, tarjeta, index) => {
                const rowIndex = Math.floor(index / 3);
                acc[rowIndex] = acc[rowIndex] ? [...acc[rowIndex], tarjeta] : [tarjeta];
                return acc;
            }, []);
            
            setFilasDeTarjetas(tarjetasDivididas);
        } catch (error) {
            console.error('Error al obtener las tarjetas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al obtener las tarjetas.',
            });
        }
    };

    useEffect(() => {
        obtenerTarjetas();
    }, []); 

    const handleClickTarjeta = async (numTarjeta) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/tarjetasTransacciones', { numTarjeta }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransacciones(response.data);
            setTarjetaSeleccionada(numTarjeta);
            setEditMode(false);
        } catch (error) {
            console.error('Error al obtener las transacciones:', error);
            if (error.response.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'No hay transacciones registradas para esta tarjeta.',
                });
            }
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
        document.body.classList.add('modal-open');  // Agrega esta línea para manejar la clase modal-open del body
    };
    
    // Dentro de la función handleCloseModal, asegúrate de cambiar setShowModal(false) así:
    const handleCloseModal = () => {
        setShowModal(false);
        document.body.classList.remove('modal-open');  // Agrega esta línea para manejar la clase modal-open del body
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevaTarjeta((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditTarjeta = (tarjeta) => {
        setTarjetaEdit(tarjeta);
        setEditMode(true);
    
        // Setear los campos del modal con la información de la tarjeta seleccionada para editar
        setNuevaTarjeta({
            monto: tarjeta.monto,
            banco: tarjeta.banco,
            cvv: tarjeta.cvv,
            vencimiento: tarjeta.fechaVencimiento, // Asumo que 'fechaVencimiento' es el campo correcto
            numTarjeta: tarjeta.numTarjeta,
        });
    
        handleOpenModal();
    };

    const handleInsertarTarjeta = async () => {
        try {
            if (editMode) {
                // Si estamos en modo edición, llamamos a la función de editarTarjeta
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/auth/editarTarjeta/${tarjetaEdit.id}`,
                    nuevaTarjeta,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // Si no estamos en modo edición, llamamos a la función de insertarTarjeta
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/auth/inserTarjeta',
                    nuevaTarjeta,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            obtenerTarjetas();

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Tarjeta guardada exitosamente.',
            }).then(() => {
                handleCloseModal();
            });
        } catch (error) {
            if (error.response.status === 422) {
                Swal.fire({
                    icon: 'error',
                    title: 'Notificacion',
                    text: 'Debe guardar ingresar todos los datos y de manera correcta por favor',
                });
            }

            if (error.response.status === 400) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Notificacion',
                    text: 'El CVV o numera de tarjetas ya estan registrados',
                });
            }

            if (error.response.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Notificacion',
                    text: 'a ocurrido un error desconocido por favor intente mas tarde',
                });
            }
        }
    };

    const handleEliminarTarjeta = async (id, e) => {
        e.stopPropagation();
        try {
            await axios.post(`http://127.0.0.1:8000/api/auth/eliminarTarjeta/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            obtenerTarjetas();

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Tarjeta eliminada exitosamente.',
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'No se puede eliminar la tarjeta porque tiene transacciones hechas',
                });
            }

            if (error.response && error.response.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'La tarjeta no existe o no se puede eliminar.',
                });
            } 

            if (error.response && error.response.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Opsss',
                    text: 'Ocurrio un error desconocido',
                });
            }
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Tarjetas de Crédito</h1>
            <button className="btn btn-primary mb-3" onClick={handleOpenModal}>
                Agregar Nueva Tarjeta
            </button>
            <div className="row">
                {tarjetas.map((tarjeta) => (
                    <div
                        key={tarjeta.id}
                        className={`col-md-6 ${tarjeta.numTarjeta === tarjetaSeleccionada ? 'selected' : ''}`}
                        onClick={() => handleClickTarjeta(tarjeta.numTarjeta)}
                    >
                        <div className="card mb-4" style={{ maxWidth: '18rem', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div className="card-header text-right small" style={{ backgroundColor: '#3498db', color: '#fff', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                {tarjeta.banco}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <FontAwesomeIcon icon={faMoneyBill} className="mr-2" style={{ color: '#27ae60' }} />
                                    Monto: ${tarjeta.monto}
                                </h5>
                                <p className="card-text small">
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" style={{ color: '#e74c3c' }} />
                                    Número: {tarjeta.numTarjeta}
                                </p>
                                <p className="card-text x-small">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" style={{ color: '#f39c12' }} />
                                    {tarjeta.name}
                                </p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="card-text small">
                                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" style={{ color: '#e74c3c' }} />
                                            CVV: {tarjeta.cvv}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="card-text small">
                                            <FontAwesomeIcon icon={faCalendar} className="mr-2" style={{ color: '#27ae60' }} />
                                            Valida: {tarjeta.fechaVencimiento}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-secondary btn-sm" onClick={() => handleEditTarjeta(tarjeta)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger btn-sm ml-2" onClick={(e) => handleEliminarTarjeta(tarjeta.id,e)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {tarjetaSeleccionada && (
                <div className="mt-4">
                    <h2 className="text-center mb-4">Transacciones de la tarjeta {tarjetaSeleccionada}</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Monto</th>
                                <th>Concepto</th>
                                <th>Fecha</th>
                                <th>Asignado a</th>
                                <th>Día</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transacciones.map((transaccion) => (
                                <tr key={transaccion.id}>
                                    <td>{transaccion.id}</td>
                                    <td>{transaccion.name}</td>
                                    <td>${transaccion.monto}</td>
                                    <td>{transaccion.concepto}</td>
                                    <td>{transaccion.fecha}</td>
                                    <td>{transaccion.aignado_a}</td>
                                    <td>{transaccion.dia}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Modal para insertar nueva tarjeta */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Insertar Nueva Tarjeta</h5>
                            <button type="button" className="close" onClick={handleCloseModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Campos de entrada para la nueva tarjeta */}
                            <div className="form-group">
                                <label>Monto</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="monto"
                                    value={nuevaTarjeta.monto}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Banco</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="banco"
                                    value={nuevaTarjeta.banco}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cvv"
                                    value={nuevaTarjeta.cvv}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vencimiento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="vencimiento"
                                    value={nuevaTarjeta.vencimiento}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Número de Tarjeta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="numTarjeta"
                                    value={nuevaTarjeta.numTarjeta}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Botón para insertar la nueva tarjeta */}
                            <button className="btn btn-primary" onClick={handleInsertarTarjeta}>
                                Insertar Tarjeta
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tarjeta;