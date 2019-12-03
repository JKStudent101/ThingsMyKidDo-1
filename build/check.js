var sendLogin = () => {
    // console.log('testing login')
    var register = new window.XMLHttpRequest();
    let email = document.getElementById('email').value;
    let upassword = document.getElementById('password').value;
    let data = {
        email: email,
        password: upassword
    };
    register.open('post', "/checklogin", false);
    register.setRequestHeader('Content-Type', 'application/json');
    register.send(JSON.stringify(data));
    let failed = JSON.parse(register.response);
    // console.log(passed)
    let errorDiv = document.getElementById('error');
    if (failed) {
        errorDiv.innerHTML = 'Incorrect Login Credentials';
        event.preventDefault();
        return false
    }
}
