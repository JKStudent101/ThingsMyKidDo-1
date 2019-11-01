/*
Sends a push notification from the test notifications endpoint texbox
*/
const send = () => {
    // console.log("Sending xml request");
    var request = new window.XMLHttpRequest();
    let text = document.getElementById('txt').value;
    let data = {
        message: text
    }
    request.open('post', '/text-me', false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(data));
    // console.log("request sent");
    // let response = JSON.parse(request.response);
    // console.log(response)
}

/*
Checks that browser has push notification functionality
*/
const check = () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
      throw new Error('No Push API Support!')
    }
  }
 
/*
Registers a service worker
*/
const registerServiceWorker = async () => {
    try{
        const swRegistration = await navigator.serviceWorker.register('/scripts/worker.js'); //notice the file name
        return swRegistration;
    } catch (err) {
        console.log(err);
        return err
    }
}

/*
Asks permission to send notifications
*/
const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if(permission !== 'granted'){
        throw new Error('Permission not granted for Notification');
    }
    // console.log(Notification.permission)
}

const main = async () => {
    console.log(Notification.permission);
    check();
    const swRegistration = await registerServiceWorker();
    const permission =  await requestNotificationPermission();
}
