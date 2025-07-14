
/* 
FIREBASE CONFIGURATION
An object that contains the configuration details 
of your Firebase project. Includes the API Key, 
authDomain, etc.
*/  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjvJR-kq7RW5ON6BzBWboqPYXsJtjX45c",
  authDomain: "fir-70835.firebaseapp.com",
  projectId: "fir-70835",
  storageBucket: "fir-70835.firebasestorage.app",
  messagingSenderId: "144199934335",
  appId: "1:144199934335:web:778e0173d659cce0ff7a4a"
};
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
/*
FIREBASE AUTHENTICATION SETUP
firebase.auth() initializes the Firebase Authentication
service to allow the application to handle user
application.
*/
// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();


/*
DOM ELEMENT REFERENCES
These store references to HTML elements identified
by their IDs. They are used to update the UI based 
on the user's authentication state.
*/
const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');
const btnSignIn = document.getElementById('btnSignIn');
const btnSignOut = document.getElementById('btnSignOut');
const userDetails = document.getElementById('user-details');
const tableBody = document.getElementById('table-body'); // Reference to table body in HTML


/*
GOOGLE AUTHENTICATION PROVIDER
It creates an instance of the Google Authentication
Provider, allowing users to sign in with their Google
Accounts
*/
const provider = new firebase.auth.GoogleAuthProvider();

/*
EVENT HANDLERS
btnSignIn.onclick 
- handles the click event on the "Sign in with Google" button
- initiates the sign in process using a popup window
- success: logs the user object to the console.
- error: logs the error to the console
*/

btnSignIn.onclick = () => {
    console.log('Sign-in button clicked!'); // Debug log
    console.log('Provider:', provider); // Check provider
    console.log('Auth:', auth); // Check auth
    
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('User signed in:', result.user);
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
            alert('Sign-in failed: ' + error.message); // Show error to user
        });
};

/*
EVENT HANDLERS
btnSignOut.onclick 
- handles the sign out button
- signs the user out
- success: logs the user object to the console
- error: logs the error to the console
*/


btnSignOut.onclick = () => {
    auth.signOut()
        .then(() => {
            console.log('User signed out');
        })
        .catch((error) => {
            console.error('Error during sign-out:', error);
        });
};

/*
AUTH STATE CHANGE LISTENER
- listener is triggered when the authentication state
  changes (user sign in/out)
- takes a callback function with user as its parameter
representing the current authenticated user
    - null if no user authenticated
- updates the visibility of whenSignedIn and whenSignedOut
  sections depending on whether the user is signed in or signed out
- updates the user's name (if available) in the userDetails section
*/

auth.onAuthStateChanged(user => {
    console.log('Auth state changed:', user); // Debug log check this everytime you run the app

    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Welcome, ${user.displayName}! </h3>`;

        // Fetch Firestore data example
        const db = firebase.firestore();
        const colRef = db.collection('people');

        colRef.get()
            .then((querySnapshot) => {
                tableBody.innerHTML = ''; // Clear previous table rows
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    const data = doc.data();
                    const docID = doc.id; //auto-generated in firebase
                    const bloom = data.bloom;
                    const fname = data.first_name;
                    const song = data.song;
                    const year = data.year;
                    //case-sensitive

                    // create table row for each element, and each value
                    // will be placed as table data
                    const row = document.createElement('tr');
                    const docIDCell = document.createElement('td');
                    const bloomCell = document.createElement('td');
                    const firstNameCell = document.createElement('td');
                    const songCell = document.createElement('td');
                    const yearCell = document.createElement('td');

                    //assign text content for each cell
                    docIDCell.textContent = docID;
                    bloomCell.textContent = bloom;
                    firstNameCell.textContent = fname;
                    songCell.textContent = song;
                    yearCell.textContent = year;

                    //append values to each row
                    row.appendChild(docIDCell);
                    row.appendChild(bloomCell);
                    row.appendChild(firstNameCell);
                    row.appendChild(songCell);
                    row.appendChild(yearCell);

                    tableBody.appendChild(row);
                });
            })
            .catch((error) => {
                console.error("Error fetching collection:", error);
            }); 
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
        tableBody.innerHTML = ''; 
        // table body is cleared once the user signs out.
    }
});