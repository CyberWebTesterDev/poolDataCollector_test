const ldap = require('ldapjs');


exports.authDummy = (userName, password) => {

    return new Promise ( (resolve, reject) => {

        const isLoginValid = userName ? userName == 'demo' ? true : false : false;
        const isPasswordValid = password ? password == 'demo' ? true : false : false;

        if (isLoginValid && isPasswordValid) {
            resolve(true);
        } else reject(false);
    });

}



exports.authLDAP = (userName, password) => {
    return new Promise( (resolve, reject) => {
        const client = ldap.createClient({
            url: 'ldap://***'
        });

        
        let userNameDN = `CN=${userName},OU=MSK,OU=Common,OU=_Users,DC=int,DC=***,DC=ru`;

        client.bind(userNameDN, password, (err) => {
            if (err) {
                console.log(`authLDAP: Auth failed`+'\n');
                client.destroy();
                console.error(err);
                reject(false);
            } else {
                console.log(`authLDAP: Auth success`+'\n');
                client.destroy();
                resolve(true);
            }
        });


    });
}