<script lang="ts">
    import ToDoItem from './ToDoItem.svelte';
    import {action} from "$lib";
    import type {ToDoResponse} from "$lib/api/todo";

    export let todos: ToDoResponse[] = [];

    let newTodoName = "";

    function addTodo() {
        if (newTodoName.trim().length !== 0) {
            action("?/createTodo", {
                name: newTodoName
            })
            newTodoName = ""; // Clear the input field after adding
        }
    }


    function handleDone(todo: ToDoResponse) {
        todo.done = !todo.done;

        action("?/updateTodo", {
            id: `${todo.id}`,
            done: `${todo.done}`
        })

    }

    function handleDelete(todo: ToDoResponse) {
        action("?/deleteTodo", {
            id: `${todo.id}`
        })
    }
</script>

<style lang="scss">
    /*General Styling -----------------------------------------------*/
    input[type="text"] {
        border: 1px solid currentColor;
        border-radius: 5px;
        padding: 8px;
        background-color: transparent;
        color: currentColor;
        width: 200px;
        margin-right: 10px;
        font-size: 25px;
    }

    button {
        border: 1px solid currentColor;
        border-radius: 5px;
        padding: 8px 12px;
        background-color: transparent;
        color: currentColor;
        cursor: pointer;
        font-size: 25px;
    }

    button:hover {
        background-color: grey;
    }

    .container {
        padding: 20px;
        text-align: left;
        background-color: transparent;
    }

    .container .scrollable {
        max-height: 800px; /* Hier kannst du die gewünschte Höhe einstellen */
        overflow-y: auto; /* Fügt eine vertikale Scrollbar hinzu, wenn der Inhalt die Höhe überschreitet */
    }

    /*Scrollbar Styling -----------------------------------------------*/

    .scrollable{
      &::-webkit-scrollbar-track {
        background: grey;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: currentColor;
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      &::-webkit-scrollbar {
        width: 12px;
      }

    }
</style>


<div class="container">
    <ul>
        <input type="text" bind:value={newTodoName} placeholder="Enter new ToDo"/>
        <button on:click={addTodo}>Add Todo</button>
    </ul>

    <ul class="scrollable">
        {#each todos as todo (todo.id)}
            <ToDoItem {todo} on:delete={() => handleDelete(todo) } on:done={() => handleDone(todo)}/>
        {/each}
    </ul>
</div>