// Debug script to check LOCAL_ADMIN configuration
console.log('=== LOCAL ADMIN DEBUG ===');
console.log('Current hostname:', window.location.hostname);
console.log('Is development?', ['localhost','127.0.0.1','l457.com'].includes(window.location.hostname));
console.log('LOCAL_ADMIN exists?', !!window.LOCAL_ADMIN);
console.log('LOCAL_ADMIN value:', window.LOCAL_ADMIN);
console.log('Expected password:', window.LOCAL_ADMIN?.password);
console.log('FIREBASE_CONFIG exists?', !!window.FIREBASE_CONFIG);
console.log('=== END DEBUG ===');

// Add this to the admin panel for easy debugging
if (document.getElementById('adminInfo')) {
  const debugBtn = document.createElement('button');
  debugBtn.textContent = '🔍 Debug Login';
  debugBtn.style.cssText = 'margin: 10px; padding: 5px 10px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;';
  debugBtn.onclick = function() {
    const info = document.getElementById('adminInfo');
    const isDev = ['localhost','127.0.0.1','l457.com'].includes(location.hostname);
    const hasLocalAdmin = !!window.LOCAL_ADMIN;
    const password = window.LOCAL_ADMIN?.password;
    
    info.innerHTML = `
      <div style="font-family: monospace; font-size: 12px; text-align: left;">
        <strong>🔍 DEBUG INFO:</strong><br>
        Hostname: ${location.hostname}<br>
        Is Development: ${isDev}<br>
        LOCAL_ADMIN exists: ${hasLocalAdmin}<br>
        Password: ${password || 'NOT SET'}<br>
        Expected: ${isDev ? password : 'null'}
      </div>
    `;
  };
  
  const adminActions = document.querySelector('.admin-actions') || document.getElementById('adminInfo').parentNode;
  if (adminActions) {
    adminActions.appendChild(debugBtn);
  }
}