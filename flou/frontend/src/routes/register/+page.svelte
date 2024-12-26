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
        return /^(?=.{1,32}$)[a-z0-9]+([\-._][a-z0-9]+)*$/.test(value)
    }

    const validatePassword = (value: string): boolean => {
        return /^(?=.{8,}$)[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]*$/.test(value)
    }

    async function register() {
        await action("?/register", {username, password})
    }
</script>

<Card>
    <div class="title">Register</div>

    <div class="input">
        <label for="username">username</label>
        <input bind:value={username} id="username">
    </div>

    <div class="input">
        <label for="password">password</label>
        <input bind:value={password} id="password" type="password">
    </div>

    <Button on:click={register} disabled="{!valid}">Register</Button>

    <div>Already have an account? <a href="/login">Login</a></div>
</Card>

<style lang="scss">
  .title {
    font-size: 2rem;
    font-weight: bold;
  }
</style>
