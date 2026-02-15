<template>
  <div id="app">
    <nav class="navbar">
      <div class="magic-particles">
        <div class="particle particle-1">✨</div>
        <div class="particle particle-2">⭐</div>
        <div class="particle particle-3">💫</div>
        <div class="particle particle-4">🌟</div>
        <div class="particle particle-5">✨</div>
      </div>
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo magic-font">
            <span class="logo-text">🔮 塔罗占卜 🔮</span>
            <div class="logo-glow"></div>
          </router-link>
          <div class="nav-links">
            <router-link to="/" class="nav-link magic-btn">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">首页</span>
              <div class="magic-sparkles">
                <span class="sparkle sparkle-1">✨</span>
                <span class="sparkle sparkle-2">⭐</span>
                <span class="sparkle sparkle-3">💫</span>
              </div>
            </router-link>
            <router-link to="/settings" class="nav-link magic-btn">
              <span class="nav-icon">⚙️</span>
              <span class="nav-text">设置</span>
              <div class="magic-sparkles">
                <span class="sparkle sparkle-1">✨</span>
                <span class="sparkle sparkle-2">🔮</span>
                <span class="sparkle sparkle-3">💎</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.navbar {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  position: relative;
  overflow: hidden;
}

.magic-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  font-size: 0.8rem;
  opacity: 0.6;
  animation: floatParticle 6s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  left: 25%;
  animation-delay: 1.2s;
}

.particle-3 {
  top: 30%;
  right: 20%;
  animation-delay: 2.4s;
}

.particle-4 {
  top: 70%;
  right: 35%;
  animation-delay: 3.6s;
}

.particle-5 {
  top: 40%;
  left: 60%;
  animation-delay: 4.8s;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-10px) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-5px) rotate(180deg);
    opacity: 0.6;
  }
  75% {
    transform: translateY(-15px) rotate(270deg);
    opacity: 0.9;
  }
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent-color);
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease;
}

.logo-text {
  position: relative;
  z-index: 2;
  background: linear-gradient(45deg, var(--accent-color), #ff6b6b, #4ecdc4, var(--accent-color));
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: pulse 2s ease-in-out infinite;
}

.logo:hover .logo-glow {
  opacity: 1;
}

.logo:hover .logo-text {
  animation-duration: 1s;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.magic-btn {
  background: linear-gradient(135deg, rgba(74, 20, 140, 0.3), rgba(123, 31, 162, 0.3));
  border: 2px solid transparent;
  border-radius: 25px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(123, 31, 162, 0.2);
}

.magic-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 25px;
  padding: 2px;
  background: linear-gradient(45deg, 
    transparent, 
    rgba(255, 215, 0, 0.3), 
    rgba(255, 107, 107, 0.3), 
    rgba(78, 205, 196, 0.3), 
    transparent
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.magic-btn:hover::before {
  opacity: 1;
}

.nav-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.nav-text {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 0.95rem;
}

.magic-sparkles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sparkle {
  position: absolute;
  font-size: 0.8rem;
  animation: sparkleFloat 2s ease-in-out infinite;
}

.sparkle-1 {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.sparkle-2 {
  top: 60%;
  right: 20%;
  animation-delay: 0.7s;
}

.sparkle-3 {
  bottom: 15%;
  left: 70%;
  animation-delay: 1.4s;
}

.magic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(123, 31, 162, 0.4);
  background: linear-gradient(135deg, rgba(74, 20, 140, 0.5), rgba(123, 31, 162, 0.5));
}

.magic-btn:hover .nav-icon {
  transform: scale(1.2) rotate(10deg);
}

.magic-btn:hover .magic-sparkles {
  opacity: 1;
}

.magic-btn.router-link-active {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
  color: var(--accent-color);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.magic-btn.router-link-active::before {
  opacity: 1;
  background: linear-gradient(45deg, 
    rgba(255, 215, 0, 0.6), 
    rgba(255, 215, 0, 0.3), 
    rgba(255, 215, 0, 0.6)
  );
}

.magic-btn.router-link-active .nav-icon {
  color: var(--accent-color);
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.magic-btn.router-link-active .magic-sparkles {
  opacity: 1;
}

@keyframes sparkleFloat {
  0%, 100% {
    transform: translateY(0px) scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-8px) scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .nav-links {
    gap: 15px;
  }
  
  .magic-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .nav-icon {
    font-size: 1.1rem;
  }
  
  .sparkle {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  
  .magic-btn {
    justify-content: center;
    width: 100%;
  }
  
  .navbar {
    padding: 10px 0;
  }
}
</style>