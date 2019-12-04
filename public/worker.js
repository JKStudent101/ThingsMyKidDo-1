self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('push', (event) => {
  if (event.data) {
    // console.log('Push event!! ', event.data.text());
    // console.log(event.data.text());
    // console.log(event.data.json());
    options = event.data.json();
    title = options.title;
    message = options.message;
    url = options.url;
    // console.log(options)
    showLocalNotification(title, message, self.registration, url);
  } else {
    console.log('Push event but no data');
  }
})

const showLocalNotification = (title, body, swRegistration, url) => {
  const options = {
    body,
    icon: "/css/src/thingsMyKidsDo.jpg",
    badge: "/css/src/thingsMyKidsDo.jpg",
    data: url
    //can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
}

self.addEventListener("notificationclick", async (event) => {
  let url = event.notification.data;
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
