// Database
import { db, auth } from './firebaseConnection'
// import {  } from './firebase/auth'


// hooks
import { useState, useEffect } from 'react';

// css 
import './App.css';
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function App() {

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  const [idpost, setidPost] = useState('');

  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user,setUser] = useState(false);
  const [userDetail,setUserDetail] = useState({});

  // atualiza dados do banco em tempo real 
  useEffect(() => {
    async function loadPost() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        // percorre todos os documentos
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(listaPost);

      });
    }

    loadPost();
  }, []);

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
        console.log("Erro ao tentar atualizar post => " + error);
      });
  }


  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);

    await deleteDoc(docRef, "posts", id)
      .then(() => {
        console.log(" Post excluido com sucesso");
      })
      .catch((error) => {
        console.log("Erro ao tentar excluiro post => " + error);
      });
  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        console.log("Cadastrado com sucesso");

        // Limpar os campos após operação
        setEmail('');
        setSenha('');
      })
      .catch((error) => {
        if(error.code === 'auth/weak-password'){
          console.log("Senha muito fraca")
        } else if( error.code === 'auth/email-already-in-use'){
          console.log(" O email já existe")
        }
        console.log("Erro ao tentar cadastrar" + error);
      });
  }

  async function logaUsuario(){
    await signInWithEmailAndPassword(auth,email,senha)
      .then((value) => {
        console.log("Logado com sucesso");
        console.log(value.user);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email
        })

        setUser(true);

        setEmail('');
        setSenha('');
      })
      .catch((e) => { 
        console.log("Error ao fazer login: " + e.message);
      });
  }

  async function fazerLogout(){
    await signOut(auth)
        setUser(false)
        setUserDetail({});
  }

  return (
    <div>
      <h1> React + Firebase :) </h1>
      {
        user && (
          <div>
            <strong> Seja bem vindo(a) (Você está logado!) </strong> <br/>
            <span> ID: {userDetail.uid} - Email: {userDetail.email}</span>
            <br/> <br/>
            <button onClick={fazerLogout}> Sair da conta </button>
          </div>
        )
      }
      <div className='container'>
        <h2> Usuários </h2>
        <label> Email </label> <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
        /> <br />

        <label> Senha </label> <br />
        <input
        type='password'
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe a sua senha"
        /> <br />

        <button onClick={novoUsuario}> Cadastrar </button>
        <button onClick={logaUsuario}> Fazer Login </button>
      </div>

      <br /> <br />
      <hr />

      <div className='container'>
        <label> Posts </label>   <br />
        <label> ID do Post </label>   <br />
        <input
          placeholder='Digite o ID do post'
          value={idpost}
          onChange={(e) => setidPost(e.target.value)}
        />
        <br />

        <label> Título: </label>  <br />
        <textarea
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <br />
        <label> Autor: </label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        /> <br />

        <button onClick={handleAdd}> Cadastrar </button> <br />
        <button onClick={buscarPost}> Buscar post </button> <br />

        <button onClick={editarPost}> Atualizar post </button> <br />

        <br /> <br />
        <hr />

        <ul>
          {
            posts.map((post) => {
              return (
                <li key={post.id}>
                  <strong> ID: {post.id} </strong> <br /> <br />
                  <span> Título: {post.titulo} </span> <br /> <br />
                  <span> Autor: {post.autor} </span> <br /> <br />
                  <button onClick={() => excluirPost(post.id)}> Excluir </button> <br /> <br />
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
