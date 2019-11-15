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

// saveSubscription saves the subscription to the backend
// const saveSubscription = async subscription => {
//     console.log(subscription)
//     const SERVER_URL = 'http://localhost:10000/saveSubscription'
//     const response = await fetch(SERVER_URL, {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(subscription),
//     })
//     return response.json
//   }


// self.addEventListener('activate', async () => {
//   //this will be called only once when the service worker is activated
//   // console.log('Autobots, rollout!')
//       const applicationServerKey = urlB64ToUint8Array('BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes');
//       const options = {
//           applicationServerKey,
//           userVisibleOnly: true
//       };
//       // const subscription = await self.registration.pushManager.getSubscription();
//       const subscription = await self.registration.pushManager.subscribe(options);
//       // console.log(subscription);
//       const response = await saveSubscription(subscription);
//       // console.log(response);

// })