const API_KEY = 'AIzaSyDoxMJgC_5gqDDSNMscY-AsBr8O2bOP62E';
const axios = require('axios');

email = 'hoss.naserrrrr@gmail.com';
password = '111111';
serialNumber = '012345';

const username = email.substring( 0, email.indexOf( '@' ) ).replace( '\.', '' );  

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

    // response.status( 200 ).json( { success: true } );
} )
.catch( err => {
    // response.status( 500 ).json( { success: false, msg: 'Failed to sign up'} )
} );