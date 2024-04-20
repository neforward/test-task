<script setup></script>

<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/">
          <div class="header-logo">
            <img
              src="https://www.freeiconspng.com/thumbs/logo-design/circle-logo-brand-design-png-transparent-image-19.png"
              alt=""
            />
          </div>
        </router-link>
        <nav class="nav">
          <router-link to="/order">Order Book</router-link>
          <router-link to="/settings">Settings</router-link>
        </nav>
      </div>
    </div>
  </header>
</template>
<style>
.header-logo img {
  width: 48px;
  height: 48px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.nav a {
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  color: #121212;
}
</style>
