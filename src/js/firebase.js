import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
    apikey:          import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:       import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:   import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messageSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId :          import.meta.env.VITE_FIREBASE_APP_ID,  
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveVote = (productID) => {
    const votesRef = ref(database,'votes');
    const newVoteRef = push(votesRef);

    const voteData = {
        productID: productID,
        date: new Date().toISOString()
    };

    return set(newVoteRef, voteData)
        .then(() =>{
            return {
                status: 'success',
                message: 'voto guardado correctamente'
            };
        })
        .catch((error) => {
            return {
                status: 'error',
                message: 'Error al gaurdar el voto' + error.message
            };
        });
};

const getVotes = async () => {
  try {
    const votesRef = ref(database, 'votes');
    const snapshot = await get(votesRef);

    if (snapshot.exists()) {
      return {
        status: 'success',
        data: snapshot.val()
      };
    } else {
      return {
        status: 'empty',
        message: 'No hay votos registrados.'
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Error al obtener los votos: ' + error.message
    };
  }
};

export { saveVote, getVotes };