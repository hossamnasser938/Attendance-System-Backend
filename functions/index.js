const functions = require('firebase-functions');
const cors = require( 'cors' )( {origin: true} );
const axios = require( 'axios' );

const API_KEY = 'AIzaSyDoxMJgC_5gqDDSNMscY-AsBr8O2bOP62E';

exports.attendMe = functions.https.onRequest((request, response) => {
  cors( request, response, () => {
      const serialNumber = request.body;

      if ( !serialNumber ) {
          response.status( 400 ).json( {
              success: false,
              error: 'Serial number is not valid'
          } );          
      }

      const databaseUrl = 'https://attendancesystem-fe663.firebaseio.com/attendance/' + serialNumber + '.json';

      axios( databaseUrl )
        .then( res => {
            const { attended } = res.data;

            if ( !attended ) {
                throw new Error();
            }

            const attendedArray = JSON.parse( attended );
            const today = Date.now();  
            const newAttendedArray = attendedArray.concat( today );

            return axios( databaseUrl, {
                method: 'PUT',
                data: JSON.stringify( {
                    attended: JSON.stringify( newAttendedArray )
                } )
            } )
        } )
        .then( res => {
            if ( res.data.attended ) {
                response.status( 200 ).json( {
                    success: true
                } );
            }
            else {
                throw new Error();
            }
        } )
        .catch( err => {
            response.status( 500 ).json( {
                success: false,
                error: "Failed to attend you"
            } );
        } );
  } );
});

/* ################## */

exports.registerMe = functions.https.onRequest((request, response) => {
  cors( request, response, () => {
      const { email, password, serialNumber } = request.body;

      if( !email || !password || !serialNumber ) {
          response.status( 400 ).json( {
              success: false,
              error: 'email, password, and serial number are required fields'
          } );  
      }

      const username = email.slice( 0, email.indexOf( '@' ) ).replace( '\.', '' );  

      const signUpUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + API_KEY;
      const userDatabaseUserUrl = 'https://attendancesystem-fe663.firebaseio.com/users/' + username + '.json';
      const attendanceDatabaseUrl = 'https://attendancesystem-fe663.firebaseio.com/attendance/' + serialNumber + '.json';

      axios( signUpUrl, {
          method: 'POST',
          data: {
              email,
              password,
              returnSecureToken: true 
          }
      } )
      .then( res => {
          const { error } = res.data;

          if ( error ) {
              throw new Error();
          }

          return axios( userDatabaseUserUrl, {
              method: 'PUT',
              data: JSON.stringify( { serialNumber } )
          } );
      } )
      .then( res => {
          if ( !res.data.serialNumber ) {
              throw new Error();
          } 

          return axios( attendanceDatabaseUrl, {
              method: 'PUT',
              data: JSON.stringify( { attended: '[]' } )
          } );
      } )
      .then( res => {
          if ( !res.data.attended ) {
              throw new Error();
          }

          response.status( 200 ).json( { success: true } );
      } )
      .catch( err => {
          response.status( 500 ).json( { success: false, msg: 'Failed to sign up'} )
      } );
  });
});

/* ###################### */

exports.loginMe = functions.https.onRequest((request, response) => {
  cors( request, response, () => {
      const { email, password } = request.body;

      if( !email || !password ) {
          response.status( 400 ).json( { 
              success: false, 
              msg: 'email and password are required fields'
          } );
      }

      const username = email.slice( 0, email.indexOf( '@' ) ).replace( '\.', '' );  

      const signInUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY;
      const userDatabaseUserUrl = 'https://attendancesystem-fe663.firebaseio.com/users/' + username + '.json';

      axios( signInUrl, {
          method: 'POST',
          data: {
              email,
              password
          }
      } )
      .then( res => {
          if ( res.data.error ) {
              throw new Error();
          }

          return axios( userDatabaseUserUrl );
       } )
       .then( res => {
           const { serialNumber } = res.data;

           if ( !serialNumber ) {
              throw new Error();
           }

           const attendanceDatabaseUrl = 'https://attendancesystem-fe663.firebaseio.com/attendance/' + serialNumber + '.json';

           return axios( attendanceDatabaseUrl );
       } )
       .then( res => {
           const { attended } = res.data;

           if ( !attended ) {
              throw new Error();
           }

           response.status( 200 ).json( { attended } );
       } )
      .catch( err => { 
          respons.status( 500 ).json( {success: false, msg: 'Failed to sign in'} );
       } );
  });
});
 