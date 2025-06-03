<script setup>
defineProps({
  n: {
    default: 1,
  },
})
</script>

<template>
  <div data-placeholder class="timeline-header ">
    <hr>
    <div data-placeholder class="timeline-text">
    </div>
  </div>

  <div class="contacts-placeholder">
    <div data-placeholder class="user-icon">
    </div>

    <div class="contact-item">
      <div>
        <div data-placeholder class="contact-title"></div>
      </div>
    </div>

    <div data-placeholder>
    </div>

    <div data-placeholder class="contact-item">
    </div>

    <div data-placeholder class="contact-item">
      <div data-placeholder></div>
    </div>
    <div data-placeholder class="contact-item">
    </div>
  </div>
</template>

<style scoped>

div[data-placeholder] {
  position: relative;
  background-color: #e2e4e3;
}

div[data-placeholder]::after {
  content: " ";
  box-shadow: 0 0 20px 9px #fefefe;
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  animation: load 1s infinite;
}

@keyframes load {
  0% {
    left: -100%;
  }

  100% {
    left: 150%;
  }
}

@keyframes fade-in-keyframe {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.fade-in-keyframe {
  animation: fade-in-keyframe 0.4s ease forwards;
}

.contacts-placeholder {
  height: 50px;
  padding: 2px 16px;
  display: flex;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 2px;
  padding: 0 5px 0 5px;
}

.user-icon {
  align-items: center;
  width: 10%;
  display: flex;
  padding: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px; 
   width: 30%;
}

.contact-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-word;
  -webkit-line-clamp: 1;
  justify-content: space-between;
}
</style>