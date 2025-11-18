export async function checkForUpdates() {
  try {
    const response = await fetch('/version.json?' + Date.now());
    const data = await response.json();
    const currentVersion = localStorage.getItem('app_version');
    
    if (currentVersion && currentVersion !== data.version) {
      // Clear all caches and reload
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      localStorage.setItem('app_version', data.version);
      window.location.reload();
    } else if (!currentVersion) {
      localStorage.setItem('app_version', data.version);
    }
  } catch (error) {
    console.warn('Version check failed:', error);
  }
}