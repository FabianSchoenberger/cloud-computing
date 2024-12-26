<script lang="ts">
    import {action} from "$lib";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";

    let username = ""
    let password = ""
    $: usernameValid = validateUsername(username)
    $: passwordValid = validatePassword(password)
    $: valid = usernameValid && passwordValid

    const validateUsername = (value: string): boolean => {
        return value.length > 0
    }
    const validatePassword = (value: string): boolean => {
        return value.length > 0
    }

    async function login() {
        await action("?/login", {username, password})
    }
</script>

<Card>
    <div class="title">Login</div>

    <div class="input">
        <label for="username">username</label>
        <input bind:value={username} id="username">
    </div>

    <div class="input">
        <label for="password">password</label>
        <input bind:value={password} id="password" type="password">
    </div>

    <Button on:click={login} disabled="{!valid}">Login</Button>

    <div>Don't have an account? <a href="/register">Register</a></div>
</Card>

<style lang="scss">
  .title {
    font-size: 2rem;
    font-weight: bold;
  }
</style>
