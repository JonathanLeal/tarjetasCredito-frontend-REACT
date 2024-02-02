import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBill, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Transferencia = () => {
    const [tarjetas, setTarjetas] = useState([]);
    const token = sessionStorage.getItem('token');
    const [formulario, setFormulario] = useState({
        monto: '',
        tarjeta: '',
        concepto: '',
        beneficiario: '',
        numTarjetaBeneficiario: '',
        diaTransaccion: '',
    });

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/auth/selTarjetas', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setTarjetas(response.data);
            })
            .catch(error => {
                console.error('Error al obtener las tarjetas', error);
            });
    }, []);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = {
            tarjeta: formulario.tarjeta,
            concepto: formulario.concepto,
            beneficiario: formulario.beneficiario,
            numTarjetaBeneficiario: formulario.numTarjetaBeneficiario,
            diaTransaccion: formulario.diaTransaccion,
            monto: formulario.monto,
        };
    
        axios.post('http://127.0.0.1:8000/api/auth/hacerTransferencia', formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            Swal.fire('Transferencia realizada con éxito', 'Exito', 'success');
            setFormulario({
                monto: '',
                tarjeta: '',
                concepto: '',
                beneficiario: '',
                numTarjetaBeneficiario: '',
                diaTransaccion: '',
            });
        })
        .catch(error => {
            if (error.response.status === 422) {
                Swal.fire('Ingrese todos los campos y de manera correcta por favor', 'Notificacion', 'error');
            }

            if (error.response.status === 400) {
                Swal.fire('No tiene esa cantidad en su tarjeta para transferir', 'Notificacion', 'error');
            }

            if (error.response.status === 500) {
                Swal.fire('A ocurrido un error', 'Notificacion', 'error');
            }
        });
    };
    

    const diasDeLaSemana = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
    ];

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-primary text-white text-center">
                    <h3 className="mb-0">Formulario de Transferencia</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="tarjeta">
                                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                                Seleccionar Tarjeta
                            </label>
                            <select
                                className="form-control"
                                id="tarjeta"
                                name="tarjeta"
                                value={formulario.tarjeta}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar Tarjeta</option>
                                {tarjetas.map(tarjeta => (
                                    <option key={tarjeta.id} value={tarjeta.id}>
                                        {tarjeta.numTarjeta}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="concepto">
                                    <FontAwesomeIcon icon={faMoneyBill} className="mr-2" />
                                    Concepto
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="concepto"
                                    name="concepto"
                                    value={formulario.concepto}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="beneficiario">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                    Beneficiario
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="beneficiario"
                                    name="beneficiario"
                                    value={formulario.beneficiario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="numTarjetaBeneficiario">
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                                    Número Beneficiario
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="numTarjetaBeneficiario"
                                    name="numTarjetaBeneficiario"
                                    value={formulario.numTarjetaBeneficiario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="diaTransaccion">
                                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                    Día de Transacción
                                </label>
                                <select
                                    className="form-control"
                                    id="diaTransaccion"
                                    name="diaTransaccion"
                                    value={formulario.diaTransaccion}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar Día</option>
                                    {diasDeLaSemana.map((dia, index) => (
                                        <option key={dia} value={dia}>
                                            {dia}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha">
                                <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                Monto a transferir
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="monto"
                                name="monto"
                                value={formulario.monto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-primary">Realizar Transferencia</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Transferencia;
