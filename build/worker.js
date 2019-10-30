// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
    console.log(subscription)
    const SERVER_URL = 'http://localhost:10000/saveSubscription'
    const response = await fetch(SERVER_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json
  }

self.addEventListener('activate', async () => {
    //this will be called only once when the service worker is activated
    // console.log('Autobots, rollout!')
        const applicationServerKey = urlB64ToUint8Array('BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes');
        const options = {
            applicationServerKey,
            userVisibleOnly: true
        };
        // const subscription = await self.registration.pushManager.getSubscription();
        const subscription = await self.registration.pushManager.subscribe(options);
        // console.log(subscription);
        const response = await saveSubscription(subscription);
        // console.log(response);
    
})

self.addEventListener('push', (event) => {
    if (event.data) {
        // console.log('Push event!! ', event.data.text());
        showLocalNotification("Yolo", event.data.text(), self.registration);
    } else {
        console.log('Push event but no data');
    }
})

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body
    //can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
}