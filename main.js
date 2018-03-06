(function(window, document) {

    let todoList = [];

    // fetch取得待辦事項清單（GET）
    fetch('http://localhost:3000/todolist')
    .then(res => res.json())
    .then(json => {
        todoList = todoList.concat(json);
        console.log(todoList);
        renderTodoList(todoList); // render todoList
    })
    .catch(err => {
        console.log(err);
    })  

    const todoListDOM = document.getElementById('todoList');
    // render
    function renderTodoList(todoList) {
        const html = todoList.map((item, index) => `<li class="list">
            <p class="desc" data-id=${item.id}>
                ${item.desc}
            </p>
        </li>`).join('')
        todoListDOM.innerHTML = html;
    }

}(window, document));
