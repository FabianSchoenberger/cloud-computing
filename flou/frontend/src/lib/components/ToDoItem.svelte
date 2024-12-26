<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import Accept from "$lib/assets/icon/accept.svg?raw"
    import Cancel from "$lib/assets/icon/cancel.svg?raw"
    import IconButton from "$lib/components/IconButton.svelte";
    import type {ToDoResponse} from "$lib/api/todo";

    export let todo: ToDoResponse;
    const dispatch = createEventDispatcher();

    function markAsDone() {
        dispatch("done");
    }

    function deleteTodo() {
        dispatch("delete");
    }
</script>

<style>
    /*General styling*/
    li {
        display: flex;
        align-items: center;
    }

    .todo-name {
        flex: 1;
        padding-left: 20px;
        font-size: 25px;
    }

    /*Styling refered to the done state*/
    .todo-done .todo-name{
        text-decoration: line-through;
        text-decoration-color: black;
        text-decoration-thickness: 5px;

    }

    .todo-not-done {
        background-color: transparent;
    }

    .todo-not-done .done-message {
        visibility: hidden;
    }

    .todo-done .done-message{
        font-size: 10px; writing-mode: vertical-lr; text-orientation: upright;
    }
</style>


<li class:todo-done={todo.done} class:todo-not-done={!todo.done}>
    <IconButton on:click={markAsDone}>{@html Accept}</IconButton>
    <IconButton on:click={deleteTodo}>{@html Cancel}</IconButton>

    <div class="todo-name">{todo.name}    </div>
    <div class="done-message">Done</div>
</li>
<hr/>

