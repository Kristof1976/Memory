// PWA Installation and Service Worker Registration
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.init();
  }

  async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/Memory/sw.js');
        console.log('Service Worker registered successfully:', registration.scope);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available
              this.showUpdateAvailable();
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      this.deferredPrompt = e;
      // Show install button
      this.showInstallButton();
    });

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  showInstallButton() {
    const installButton = document.getElementById('pwa-install');
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', () => this.installApp());
    } else {
      // Create install button dynamically
      this.createInstallButton();
    }
  }

  createInstallButton() {
    const button = document.createElement('button');
    button.id = 'pwa-install';
    button.className = 'btn btn-primary pwa-install-btn';
    button.textContent = '📱 Install App';
    button.addEventListener('click', () => this.installApp());
    
    // Add to controls section
    const controls = document.querySelector('.controls .buttons');
    if (controls) {
      controls.appendChild(button);
    }
  }

  hideInstallButton() {
    const installButton = document.getElementById('pwa-install');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    // Show the install prompt
    this.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  showUpdateAvailable() {
    // Show a notification or banner that an update is available
    const banner = document.createElement('div');
    banner.className = 'update-banner';
    banner.innerHTML = `
      <span>🆕 App update available!</span>
      <button onclick="location.reload()">Refresh</button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PWAManager();
});

export default PWAManager;