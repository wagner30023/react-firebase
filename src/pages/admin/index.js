
import { useState, useEffect } from 'react';
import './admin.css';

import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
    doc,
    deleteDoc
} from 'firebase/firestore';

export default function Admin() {
    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});

    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem("@detailUser");
            setUser(JSON.parse(userDetail));

            if (userDetail) {
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, "tarefas");
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid));
                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        });
                    });

                    setTarefas(lista);
                })
            }
        }

        loadTarefas();
    }, []);

    async function handleRegister(e) {
        e.preventDefault();
        if (tarefaInput === '') {
            alert("Digite a sua tarefa");
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then(() => {
                console.log("Tarefa registrada");
                setTarefaInput('');
            })
            .catch((error) => {
                console.log("Erro ao registrar" + error);
            });
    }

    async function handleLogout() {
        await signOut(auth);
    }

    async function  deleteTarefa(id){
        const docRef = doc(db,"tarefas", id);
        await deleteDoc(docRef);  
    }

    return (
        <div className="admin-container" >
            <h1> Minhas tarefas </h1>
            <form onSubmit={handleRegister} className="form">
                <textarea
                    placeholder="Digite a sua tarefa..."
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />
                <button type="submit" className="btn-register"> Registrar tarefa </button>
            </form>

            {tarefas.map((item) => (
                <article key={item.id} className="list">
                    <p> { item.tarefa } </p>

                    <div>
                        <button> Editar </button>
                        <button onClick={() => deleteTarefa(item.id)} className="btn-delete"> Concluir </button>
                    </div>
                </article>
            ))}

            <button className="btn-logout" onClick={handleLogout}> Sair </button>
        </div>
    )
}