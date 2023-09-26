

async function myloginFunc(event){
    try{
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        console.log(username);
        event.target.reset()
        const myObj = { username,password };
        const response = await axios.post(`http://localhost:8000/login`,myObj);
       // console.log(response.data.token);
        if(response.status == 200){
            alert("login Successfully")
          //  console.log('token ---->',response.data.token);
            localStorage.setItem('token',response.data.token);
            window.location.href ="../expense/expense.html";
        }
        else {
            throw new Error(response.data.message)
        }
    }
    catch(err){
        console.log(err.message);
        alert("Invalid Username and Password")
        document.body.innerHTML += `<div style ="color:red">${err.message}</div>`
    }
}



// ------------------------------------------   Forget Password -------------------------------------------------------

const forgetData = document.getElementById('forgotPassword')
forgetData.onclick = async () => {
    window.location.href = '../forgotpassword/forgotpassword.html'  // Go to the forgot page 

}