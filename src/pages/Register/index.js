import { useState } from 'react'

import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (email !== '' && password !== '') {
            await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/admin', {replace: true});
            })
            .catch((err) => {
                console.error("Erro ao fazer um cadastro: " + err);
            });
        }

        alert('Preencha todos os campos!');
    }

    return (
        <div className='home-container' onSubmit={handleRegister}>
            <h1> Lista de tarefas </h1>
            <span> Gerencie sua agenda de forma fácil. </span>
            <form className="form">
                <input
                    type="text"
                    placeholder="Digite o seu e-mail..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="*******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit"> Cadastrar </button>
            </form>

            <Link className="button-link" to="/">
                já possui uma conta ? faça o login
            </Link>
        </div>
    );
}