function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken');
let form = document.getElementById('form-wrapper');
let activeItem = null

buildList()

function buildList() {
    let wrapper = document.getElementById('list-wrapper')
    wrapper.innerHTML = ""
    let url = "http://127.0.0.1:8000/api/task-list"
    if (activeItem != null) {
        let url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
        activeItem = null
    }

    fetch(url)
        .then(resp => resp.json())
        .then((data) => {
            let tasks = data
            for (const i in tasks) {
                let item =
                    `
                        <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                            <div style="flex:7">
                                ${tasks[i].title}
                            </div>
                            <div style="flex:1">
                                <button class="btn btn-sm btn-outline-info edit">Edit </button>
                            </div>
                            <div style="flex:1">
                                <button class="btn btn-sm btn-outline-danger delete">delete</button>
                            </div>
                        </div>
                    `
                wrapper.innerHTML += item
            }
            for (const i in tasks) {
                let editBtn = document.getElementsByClassName('edit')[i]
                let deleteBtn = document.getElementsByClassName('delete')[i]
                
                editBtn.addEventListener('click', (item => {
                    
                    return () => {
                        editTask(item)
                    }
                })(tasks[i]))

                deleteBtn.addEventListener('click', (item => {
                    return () => {
                        deleteItem(item)
                    }
                })(tasks[i]))
            }
        })

}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let url = "http://127.0.0.1:8000/api/task-create/"
    let title = document.getElementById('title').value
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                title: title
            })
        })
        .then(resp => buildList())
    document.getElementById('form').reset()
})

function editTask(item) {
    activeItem = item
    document.getElementById('title').value = activeItem.title
    

}

function deleteItem(item) {
    fetch(`http://127.0.0.1:8000/api/task-delete/${item.id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    }).then((response) => {
        buildList()
    })
}