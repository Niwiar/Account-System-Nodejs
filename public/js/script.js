function showLoadTable(){
    Swal.fire({
        title: 'Token required',
        html:
        '<input id="token" class="swal2-input" placeholder="ACCESS TOKEN">',
        focusConfirm: false,
        preConfirm: () => {
            loadTable();
        }
    })
}

function loadTable(token) {
    if (!token) token = document.getElementById("token").value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/users");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "token": token
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = '';
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += '<tr>'
                trHTML += '<td>'+object['userId']+'</td>'
                trHTML += '<td><img width="40px" src="'+object['avatar_url']+'" class="avatar"></td>'
                trHTML += '<td>'+object['username']+'</td>'
                trHTML += '<td>'+object['email']+'</td>'
                trHTML += '<td><button type="button" class="btn btn-outline-danger" onclick="showDelete('+object['userId']+')">Delete</button>'
                trHTML += '</td>'
                trHTML += '</tr>'
            }
            document.getElementById("user-t").innerHTML = trHTML;
        }
    }
}

function showDelete(id){
    Swal.fire({
        title: 'Token required',
        html:
        '<input id="token" class="swal2-input" placeholder="ACCESS TOKEN">',
        focusConfirm: false,
        preConfirm: () => {
            userDelete(id);
        }
    })
}

function userDelete(id){
    const token = document.getElementById("token").value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/users/user");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "id": id, "token": token
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(objects['message']);
            loadTable(token);
        }
    }
}
