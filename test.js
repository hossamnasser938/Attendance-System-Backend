const axios = require('axios');
console.log('قول اي حاجة')
const API_KEY = 'AIzaSyDoxMJgC_5gqDDSNMscY-AsBr8O2bOP62E';

const email = 'hos@gmail.com';
const password = '111111';

// if( !email || !password ) {
//     response.status( 400 ).json( { 
//         success: false, 
//         msg: 'email and password are required fields'
//     } );
// }

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
    console.log( 'res:', res );
} )
.catch( err => { 
    console.log( 'err:', err );
} );


