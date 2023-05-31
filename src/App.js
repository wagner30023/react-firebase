// Database
import { db } from './firebaseConnection'

// hooks
import { useState } from 'react';

// css 
import './App.css';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [posts, setPosts] = useState([]);
  const [idpost, setidPost] = useState('');

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   console.log("Dados registrado no banco");
    // })
    // .then().catch((error) => {
    //   console.log("Erro ocorrido " + error);
    // })

    //  gerar um ID único
    await addDoc(collection(db, "posts"), {
      titulo,
      autor,
    })
      .then(() => {
        console.log("Dados registrados com sucesso!");
        setAutor('');
        setTitulo('');
      })
      .catch((error) => {
        console.log("Erro ocorrido " + error);
      });

  }

  async function buscarPost() {

    // buscar post 
    // const postRef = doc(db,"posts","jnPAMQScrggUmuw5UXEp");

    // await getDoc(postRef)
    // .then((snapshot) => {
    //   setAutor(snapshot.data().autor);
    //   setTitulo(snapshot.data().titulo);
    // }).catch((error) => {
    //   console.error("Erro ao buscar" + error);
    // });

    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];

        // percorre todos os documentos
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        })

        setPosts(lista);
      }).catch((error) => {
        console.error("Erro ao buscar" + error)
      });

  }

  async function editarPost() {
    const docRef = doc(db, "posts", idpost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Post atualizado com sucesso");
        setidPost('');
        setTitulo('');
        setAutor('');
      })
      .catch((error) => {
        if(docRef == ''){
          console.log("" + error.message);
        }
        console.log("Erro ao tentar atualizar post => " + error);
      });
  }

  return (
    <div>
      <h1> React + Firebase :) </h1>
      <div className='container'>
        <label> ID do Post </label>
        <input
          placeholder='Digite o ID do post'
          value={idpost}
          onChange={(e) => setidPost(e.target.value)}
        />
        <br />

        <label> Título: </label>
        <textarea
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <br />

        <label> Auttor: </label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}> Cadastrar </button>
        <button onClick={buscarPost}> Buscar post </button>
        <br />

        <button onClick={editarPost}> Atualizar post </button>

        <ul>
          {
            posts.map((post) => {
              return (
                <li key={post.id}>
                  <strong> ID: {post.id} </strong> <br />
                  <span> Título: {post.titulo} </span> <br />
                  <span> Autor: {post.autor} </span> <br /> <br />
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
