
async function mySignUpFunc(event){
    try{
    
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const number = document.getElementById('number').value;
    const password = document.getElementById('password').value;
    console.log(number);
    event.target.reset();

    const myObj={ firstName, lastName, email, number, password };

    const response = await axios.post(`http://localhost:8000/signup`,myObj);
        if(response.status == 201){
            alert("Successfuly signed up");
            window.location.href ='../login/login.html';
        }
    }
    catch(err){
        console.log(JSON.stringify(err));
        alert("Invalid Username and Password")
    }
}