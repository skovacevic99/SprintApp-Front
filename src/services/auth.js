import SprintAxios from '../apis/SprintAxios';

export const login = async function(username, password){
    const cred={
        username: username,
        password: password
    }

    try {
        const res = await SprintAxios.post('korisnici/auth', cred);
        window.localStorage.setItem('jwt', res.data);
    } catch (error) {
        console.log(error)
    }
    window.location.replace("/");
}

export const logout = function(){
    window.localStorage.removeItem('jwt');
    window.location.reload();
}