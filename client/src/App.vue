<template style="display: flex; align-items: center;">
<section>
  <h1 id="main">Додаток ТуДу-Апп</h1>
  <form @submit.prevent="">
    <label id="login-label">Ув1йти в систему</label>
    <div>
      <div style="width: 100%" id="input-div">
        <input
            autocomplete="off"
            id="input-id"
            name="newTodo"
            style="width: 100%"
        >
      </div>
      <div id="button-div" style="width: 100%;">
        <div style="width: 100%;">
          <button style="width: 100%;" v-on:click="createButton()">Створити</button>
        </div>
        <div style=" width: 100%">
          <button style="width: 100%;" v-on:click="loginButton()">Ув1йти</button>
        </div>
      </div>
      <div id="one-button-div" style="width: 100%" hidden="true">
        <button style="width: 100%;" v-on:click="reload()">Вийти</button>
      </div>
    </div>
    <h3 hidden="true" id="text-error" style="text-align: center; color: #DA0037"></h3>
  </form>

  <div id="shownTodo" style="display: none;">
    <form id='shownForm' @submit.prevent="addTodo()">
        <label>Нова таска </label>
        <input
            autocomplete="off"
            disabled="true"
            id="input-to-do"
            maxlength="40"
            name="newTodo"
            v-model="newTodo"
        >
        <button disabled="true" id="button-to-do">Додати до листа</button>
      </form>
      <div>
      <h2>Ваш список</h2>
      <ul style="height: 250px; overflow: auto;">
        <li
            :key="index"
            v-for="(todo, index) in todos">
          <span>{{ todo.text }}</span>
          <button @click="removeTodo(index, todo)">Видалити</button>
        </li>
      </ul>
      </div>
      <h4 v-if="todos.length === 0">Пустий список</h4>
    </div>
    </section>
</template>

<script>
import axios from "axios"
import {ref} from 'vue';

localStorage.setItem('todos', JSON.stringify([]));
const newTodo = ref('');
const todosData = JSON.parse(localStorage.getItem('todos'));
const todos = ref(todosData);

export default {
  name: 'App',
  methods: {
    createButton: function () {
      axios.post("http://localhost:3000/create?username=" + document.getElementById('input-id').value)
          .catch(() => {
            document.getElementById('text-error').hidden = false;
            document.getElementById('text-error').textContent = "Такий користувач уже е в систем1";
            document.getElementById('input-id').style.border = "1px solid #DA0037";
            document.getElementById('button-to-do').disabled = true;
            document.getElementById('input-to-do').disabled = true;
          })
          .then((response) => {
            if (response.status === 200) {
              document.getElementById('button-to-do').disabled = false;
              document.getElementById('input-to-do').disabled = false;
              document.getElementById('main').textContent = `Доброго дня, ${document.getElementById('input-id').value}`;
              document.getElementById('text-error').hidden = true;
              document.getElementById('button-div').hidden = true;
              document.getElementById('input-div').style.width = '100%';
              document.getElementById('shownTodo').style.display = 'block';
              document.getElementById('input-id').style.border = "1px solid #171717";
              document.getElementById('input-id').disabled = true;
              document.getElementById('login-label').textContent = "Користувач";
              document.getElementById('one-button-div').hidden = false;

              todos.value.splice(0, todos.value.length);
            }
          });
    },
    loginButton: function () {
      axios.post("http://localhost:3000/login?username=" + document.getElementById('input-id').value)
          .catch(() => {
            document.getElementById('text-error').hidden = false;
            document.getElementById('text-error').textContent = "Такого користувача немае у систем1";
            document.getElementById('main').textContent = "ToDo App";
            document.getElementById('input-id').style.border = "1px solid #DA0037";
            document.getElementById('button-to-do').disabled = true;
            document.getElementById('input-to-do').disabled = true;
          })
          .then((response) => {
            if (response.status === 200) {
              document.getElementById('button-to-do').disabled = false;
              document.getElementById('input-to-do').disabled = false;
              document.getElementById('main').textContent = `Доброго дня, ${document.getElementById('input-id').value} !`;
              document.getElementById('text-error').hidden = true;
              document.getElementById('button-div').hidden = true;
              document.getElementById('input-div').style.width = '100%';
              document.getElementById('shownTodo').style.display = 'block';
              document.getElementById('input-id').style.border = "1px solid #171717";
              document.getElementById('input-id').disabled = true;
              document.getElementById('login-label').textContent = "Аккаунт";
              document.getElementById('one-button-div').hidden = false;

              axios.get("http://localhost:3000/todos?username=" + document.getElementById('input-id').value)
                  .then(response => {
                    localStorage.setItem('todos', JSON.stringify([]));
                    todos.value.splice(0, todos.value.length);
                    response.data.forEach(todo => {
                      todos.value.push({
                        _id: todo._id,
                        text: todo.text
                      });
                    })
                  })
            }
          });
    },
    reload: function () {
      window.location.reload();
    },
    show: function () {
      return localStorage.getItem('enable')
    }
  },
  setup() {
    function addTodo() {
      axios.post("http://localhost:3000/todo?username=" + document.getElementById('input-id').value + "&text=" + newTodo.value)
          .then(response => {
            console.log("ADD ID: " + response.data.id);
            if (newTodo.value) {
              todos.value.push({
                _id: response.data.id,
                text: response.data.text
              });
              newTodo.value = '';
            }
          });
      saveData();
    }

    function removeTodo(index, todo) {
      axios.delete("http://localhost:3000/todo?todoId=" + todo._id);
      todos.value.splice(index, 1);
      saveData();
    }

    function saveData() {
      const storageData = JSON.stringify(todos.value);
      localStorage.setItem('todos', storageData);
    }

    return {
      todos,
      newTodo,
      addTodo,
      removeTodo,
      saveData
    }
  }
}
</script>

<style lang="scss">
$border: 2px solid rgba(
    $color: black,
    $alpha: 0.35,
);
$size1: 6px;
$size2: 12px;
$size3: 18px;
$size4: 24px;
$size5: 48px;
$backgroundColor: #B0C4DE;
$textColor: black;
$primaryColor: #677381;
$secondTextColor: white;
body {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #444444;
  color: #EDEDED;

  #app {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px;

    h1 {
      font-weight: bold;
      font-size: 28px;
      text-align: center;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 100%;

      label {
        font-size: 14px;
        font-weight: bold;
      }

      input,
      button {
        height: $size5;
        box-shadow: none;
        outline: none;
        padding-left: $size2;
        padding-right: $size2;
        border-radius: $size1;
        font-size: 18px;
        margin-top: $size1;
        margin-bottom: $size2;
        box-sizing: border-box;
      }

      button:disabled {
        height: $size5;
        box-shadow: none;
        outline: none;
        padding-left: $size2;
        padding-right: $size2;
        border-radius: $size1;
        font-size: 18px;
        margin-top: $size1;
        margin-bottom: $size2;
        background-color: transparent;
        color: #171717;
        border: 1px solid #171717;
        cursor: default;
      }

      input {
        background-color: transparent;
        border: $border;
        color: inherit;
      }
    }

    button {
      cursor: pointer;
      background-color: #DA0037;
      border: 1px solid transparent;
      color: $secondTextColor;
      font-weight: bold;
      outline: none;
      border-radius: $size1;
      transition: all 0.5s ;
      &:not(:disabled):hover{
        transform: scale(1.02, 1.02);
        box-shadow: 2px 2px 2px 2px #1717177e;
      }
    }

    h2 {
      font-size: 22px;
      border-bottom: 1px solid #171717;
      padding-bottom: $size1;
    }

    ul {
      padding: 10px;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: $border;
        padding: $size2 $size4;
        border-radius: $size1;
        margin-bottom: $size2;

        span {
          cursor: pointer;
        }

        .done {
          text-decoration: line-through;
        }

        button {
          font-size: $size2;
          padding: $size1;
        }
      }
    }

    h4 {
      text-align: center;
      opacity: 0.5;
      margin: 0;
    }
    ::-webkit-scrollbar{
      width: 10px;
      background-color: #171717;

    }
    ::-webkit-scrollbar-thumb{
      width: 10px;
      background-color: #DA0037;

    }
  }
}
</style>
