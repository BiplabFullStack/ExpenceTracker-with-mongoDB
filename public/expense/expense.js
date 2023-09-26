//---------------------------------------------  Post allData into Backend -------------------------------------------------------
async function myWebFunc(event) {
    try {
        event.preventDefault();
        //Collect All the data from the page
        const itemName = document.getElementById('itemName').value;
        const expense = document.getElementById('expense').value;
        const item = document.getElementById('item').value;
        const category = document.getElementById('category').value;
        event.target.reset();

        const myObj = {
            itemName,
            expense,
            item,
            category

        }
        if (itemName && expense && item && category) {
            const token = localStorage.getItem('token')
            const postdata = await axios.post("http://localhost:8000/post-expense", myObj, { headers: { "Authorization": token } })
           // window.location.reload()
            onScreenFunction(myObj);

           // console.log(`ItemName : ${itemName} -  Expense : ${expense} - Item : ${item} - Category : ${category}`);

        } else {
            alert('Enter All the things please');
        }
    }
    catch (err) {
        console.log(err.message);
    }
}







function onScreenFunction(myObj) {
    const ul = document.getElementById('listOnScreen');

    const li = document.createElement('li');
    li.innerHTML = `ItemName : ${myObj.itemName}  -  Expense : ${myObj.expense} - Item : ${myObj.item} -  Category : ${myObj.category} `;

    // Create Delete Button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.style.backgroundColor = 'red';
    delBtn.style.color = 'white';
    delBtn.style.borderRadius = '8px';

   
    delBtn.classList.add('delete-button');

    // Attach a click event listener to the delete button
    delBtn.addEventListener('click', async () => {
        const confirmed = confirm("Are you sure want to delete this expense?");
        if (confirmed) {
            const token = localStorage.getItem('token');
            try {
               // console.log('myObj.id-->',myObj);
                await axios.delete(`http://localhost:8000/deletedata/${myObj._id}`, {
                    headers: { "Authorization": token }
                });
                ul.removeChild(li);
                window.location.reload()
            } catch (error) {
                console.error("Error deleting expense:", error);
            }
        } else {
            console.log("Nothing was deleted.");
        }
    });

    // Append the delete button to the list item
    li.appendChild(delBtn);
    li.style.color = 'Maroon';

    // Append the list item to the unordered list
    ul.appendChild(li);
}


//---------------------------------------------  Show Only for Premium User -------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token')
    axios.get("http://localhost:8000/premiumuser", { headers: { "Authorization": token } })
        .then((result) => {
            if (result.data.ispremium == true) {
                const form = document.getElementById("rzp-button1")
                form.style.display = 'none'
                document.getElementById('ispremium').innerHTML = `${result.data.firstName} ~ You are a premium member    `
                premiumfeature(result)
            }
        })
        .catch((err) => {
            console.log(err.meessage);
        })
})



//---------------------------------------------  Show all Expense With Pagination -------------------------------------------------------

window.addEventListener('DOMContentLoaded', async () => {
    const objUrlParams = new URLSearchParams(window.location.search);

    const page = objUrlParams.get('page') || 1;
    //console.log('objUrlParams', objUrlParams);
   // console.log('page', page)
    const token = localStorage.getItem('token')
    // const setData = Number(document.getElementById('datashowno').value);
    // localStorage.setItem('itemNo',setData)
    const finalItemNo = localStorage.getItem('itemNo')
    let detail = await axios.get(`http://localhost:8000/getdata?page=${page}`, { headers: { 'Authorization': token },params:{ITEM_PER_PAGE:finalItemNo} }).then(({ data: { expense, ...PageData } }) => {
        console.log("Expenses " + expense);
        console.log("PageData" + PageData);
        for (let i = 0; i < expense.length; i++) {

            onScreenFunction(expense[i])
        }

        showpagination(PageData);
    }).catch(err => {
        console.log(err);
    })


})


//---------------------------------------------  Show Page Number On the Page -------------------------------------------------------

const pagination = document.getElementById('pagination')

async function showpagination({
    currentPage,
    hasNextPage,
    nextPage,
    hasPreviousPage,
    previousPage,
    lastPage }) {

    pagination.innerHTML = ''
   // console.log(previousPage, currentPage, nextPage)
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.innerHTML = previousPage;
        btn2.addEventListener('click', () => {

            document.getElementById("listOnScreen").innerHTML = "";
            getExpense(previousPage)
        });

        pagination.appendChild(btn2);
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`;
    btn1.addEventListener('click', () => {
        document.getElementById("listOnScreen").innerHTML = "";
        getExpense(currentPage)
    });

    pagination.appendChild(btn1);

    if (hasNextPage && nextPage <= lastPage) {
        const btn3 = document.createElement('button');
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () => {
            document.getElementById("listOnScreen").innerHTML = "";
            getExpense(nextPage)
        });

        pagination.appendChild(btn3);
    }
}



//---------------------------------------------  Get Expence From Backend -------------------------------------------------------

async function getExpense(page) {
    console.log(page)
    const token = localStorage.getItem('token')
    const finalItemNo = localStorage.getItem('itemNo')
    await axios.get(`http://localhost:8000/getdata?page=${page}`, { headers: { 'Authorization': token },params:{ITEM_PER_PAGE:finalItemNo}}).then(({ data: { expense, ...PageData } }) => {
        // console.log(expence);
        for (let i = 0; i < expense.length; i++) {
            onScreenFunction(expense[i])
        }
        showpagination(PageData);
    }).catch(err => {
        console.log(err);
    })
}



//---------------------------------------------  Payment  -------------------------------------------------------

document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.get('http://localhost:8000/purchase/premiummembership', { headers: { 'Authorization': token } })
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const result = await axios.post('http://localhost:8000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { 'Authorization': token } })

            alert('you are now a premium user')
            const form = document.getElementById("rzp-button1")
            form.style.display = 'none'
            document.getElementById('ispremium').innerHTML = `<h5>You are a premium user</h5>  `
            localStorage.setItem('token', result.data.token)  //set new token
             premiumfeature (result)

        }
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on('payment.failed', function (response) {
        console.log(response);
        alert('something wrong')
    });
};



//----------------------------------------  Show Leader-Board Button Only for Premum Users-------------------------------------------------------

async function premiumfeature(result) {
    const ispremium = document.getElementById('ispremium')
    const leaderboardbutton = document.createElement('input')
    leaderboardbutton.type = 'button'
    leaderboardbutton.value = 'leaderboard'

    leaderboardbutton.style.backgroundColor = 'red'
    leaderboardbutton.style.color = 'white'
    leaderboardbutton.style.borderRadius = '5px'


    //when Mouse over the Delete Button
    leaderboardbutton.addEventListener('mouseover', (e) => {
        leaderboardbutton.style.backgroundColor = 'cyan';
        leaderboardbutton.style.color = 'red'
    })

    //when Mouse remove from Delete Button
    leaderboardbutton.addEventListener('mouseout', (e) => {
        leaderboardbutton.style.backgroundColor = 'red';
        leaderboardbutton.style.color = 'white'
    })



    leaderboardbutton.onclick = async () => {
        const token = localStorage.getItem('token');
        const userleaderboardArray = await axios.get('http://localhost:8000/premium/leaderboard', { headers: { 'Authorization': token } })
        console.log(userleaderboardArray);
        const leaderboardElement = document.getElementById('leaderboard')
        leaderboardElement.innerHTML = '<h2 style="color:red">Leader Board</h2>'
        userleaderboardArray.data.forEach((ele) => {
            leaderboardElement.innerHTML += `<li style="color:magenta">Name : ${ele.firstName} - TotalExpense : ${ele.totalexpense}</li>`
        })

    }
    // ispremium.appendChild(leaderboardbutton)


//---------------------------------------------  Download Expense -------------------------------------------------------

    const downloadExpense = document.createElement('input');
    downloadExpense.type = 'button'
    downloadExpense.value = 'Download List'

    downloadExpense.style.backgroundColor = 'green'
    downloadExpense.style.color = 'white'
    downloadExpense.style.borderRadius ='5px';

      //when Mouse over the downloadExpense Button
      downloadExpense.addEventListener('mouseover', (e) => {
        downloadExpense.style.backgroundColor = 'cyan';
        downloadExpense.style.color = 'red'
    })

    //when Mouse remove from downloadExpense Button
    downloadExpense.addEventListener('mouseout', (e) => {
        downloadExpense.style.backgroundColor = 'green';
        downloadExpense.style.color = 'white'
    })


    downloadExpense.onclick = async () => {
        try {
            const token = localStorage.getItem('token');
            const file = await axios.get('http://localhost:8000/premium/download', { headers: { 'Authorization': token } })
        
          // console.log(file.data.fileURl);
            if (file.status === 200) {
                const a = document.createElement('a');
                a.href = file.data.fileURl;
                a.download = 'myexpense.csv';
                a.click()
            } else {
                throw new Error(file.data.message)
            }
        }
        catch (err) {
            console.log(err.message);
        }

    }
    ispremium.appendChild(leaderboardbutton)
    ispremium.appendChild(downloadExpense)
}




//---------------------------------------------  How many Expense want to show  -------------------------------------------------------

async function datashow(event){
    event.preventDefault()
    const setData = Number(document.getElementById('datashowno').value);
    localStorage.setItem('itemNo',setData)
    window.location.reload();
}


