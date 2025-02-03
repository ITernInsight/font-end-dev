<template>
  <div class="login-page">
    <div class="image-section">
      <img src="@/assets/login-bg.jpg" alt="Login Background" />
    </div>
    <div class="form-section">
      <h1>Welcome to the ITern Insighttt <br> Community</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input type="text" v-model="username" placeholder="Email or Username" />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" placeholder="Password" />
        </div>
        <div class="remember-group">
          <input type="checkbox" id="remember" v-model="rememberMe" />
          <label for="remember">Remember me</label>
        </div>
        <div class="button-group">
          <button type="submit">LOG IN</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const rememberMe = ref(false);

const handleLogin = () => {
  console.log(`Logging in with ${username.value}, Remember Me: ${rememberMe.value}`);

  router.push({ name: 'posts' });
};
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

h1 {
  font-family: "Arial", sans-serif;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  white-space: pre-line;
}

.image-section {
  flex: 1;
  background-color: #f0f0f0;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.input-group,
.button-group {
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.remember-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 300px;
  margin-bottom: 15px;
  gap: 6px;
}

.remember-group input[type="checkbox"] {
  width: auto;
}

.remember-group label {
  font-size: 14px;
  white-space: nowrap;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
