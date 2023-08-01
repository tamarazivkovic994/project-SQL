console.log(window.location.href);
if (window.location.href == "http://localhost:5500/") {



    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        const email = document.querySelector("#email").value;
        const imePrezime = document.querySelector("#imePrezime").value;

        const user = {
            username,
            password,
            email,
            imePrezime
        }


        axios.post("http://localhost:3000/register", user).then(function (response) {

            checkInsert(response.data);


        }).catch(function (error) {
            console.log(error);
        })
    })


}
function checkInsert(data) {

    if (data.data == "ok") {

        window.location.href = "http://localhost:5500/login.html"
    } else {

        alert("Korisnik vec postoji - ako implemtirate na serveru deo koji proverava postojanje korisnika");
    }

}


if (window.location.href == "http://localhost:5500/login.html") {

    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        const user = {
            username,
            password
        }

        axios.post("http://localhost:3000/login", user).then(function (response) {

            checkLogin(response.data);

        }).catch(function (error) {

            console.log(error);
        })


    })


}

function checkLogin(data) {


    if (data.data == "ok") {

        localStorage.setItem("user", JSON.stringify({ username: data.result[0].USERNAME, rola: data.result[0].ROLA }));
        window.location.href = "http://localhost:5500/home.html";

    }else {

        alert(data.message)
    }

}



if (window.location.href == "http://localhost:5500/home.html") {

    if (localStorage.getItem("user") == null) {
        window.location.href = "http://localhost:5500/login.html";
    }

    if (JSON.parse(localStorage.getItem("user"))) {

        document.getElementById("ulogovan").innerHTML = "Ulogovan je:" + JSON.parse(localStorage.getItem("user")).username;
        document.getElementById("ulogovan").innerHTML += `<button class="btn btn-danger" id="logout">Logout</button>`;



        allUsers();

        document.querySelector("#logout").addEventListener("click", function () {

            localStorage.removeItem("user");
            window.location.href = "http://localhost:5500/login.html";

        }

        )

    }

    function allUsers() {
        axios.get("http://localhost:3000/users").then(function (response) {

            showUsers(response.data);


        }).catch(function (error) {
            console.log(error);

        })
    }
    function showUsers(data) {

        let html = "";
        html += `<table class="table table-striped table-dark">

<tr>
<th>Id</th>
<th>Username</th>
<th>Ime i prezime</th>
<th>Email</th>
<th >Control</th>
</tr>`;


        for (let i = 0; i < data.result.length; i++) {

            html += `<tr> <td>${data.result[i].ID}</td><td>${data.result[i].USERNAME}</td>
<td>${data.result[i].IMEPREZIME}</td>
<td><input type="text" value="${data.result[i].EMAIL}" class="user${data.result[i].ID}"></td><td>`;


            if (JSON.parse(localStorage.getItem("user")).rola == 1) {
                html += `<button class="btn btn-danger delete" data-id="${data.result[i].ID}">Delete</button>`;
            }
            html += `<button class="btn btn-warning update" data-id="${data.result[i].ID}">Update</button></td></tr>`;
        }
        html += `</table>`;


        document.querySelector("#ispis").innerHTML = html;


        if (JSON.parse(localStorage.getItem("user")).rola == 1) {


            const btns = document.querySelectorAll("button.delete");



            btns.forEach(function (btn) {


                btn.addEventListener("click", function () {
                    alert("test")
                    const id = this.dataset.id;


                    axios.delete(`http://localhost:3000/user`, { data: { id: id } }).then(function (response) {

                        alert(response.data.message);

                        allUsers();
                    }).catch(function (error) {

                        console.log(error);
                    })

                })

            })

        }


        const btns = document.querySelectorAll("button.update");

        btns.forEach(function (btn) {

            btn.addEventListener("click", function () {

                const id = this.dataset.id;
                const email = document.querySelector(`.user${id}`).value;

                axios.put(`http://localhost:3000/user`, { id: id, email: email }).then(function (response) {


                    alert(response.data.message);
                    allUsers();
                }).catch(function (error) {

                    console.log(error);
                })




            })

        })

    }

}