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
Registers a service worker
*/
const registerServiceWorker = async () => {
    try {
        const swRegistration = await navigator.serviceWorker.register('/worker.js', { scope: '/' });
        return swRegistration;
    } catch (err) {
        console.log(err);
        return err
    }
}

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

async function openPushSubscription() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        let permission = await Notification.requestPermission()
        if (permission != 'denied') {
            let register = await registerServiceWorker();
            let applicationServerKey = urlB64ToUint8Array('BI01Zbibo97CgCD60S9MO6HhlAbcTtfGOIayxUKG3o5QJbfU3eVMT3v_T-i2r7rK6QH8Zbv1So2VrPsT4FTjaes');


            let PushSubscription = await register.pushManager.getSubscription();
            // console.log(PushSubscription)
            if (PushSubscription === null) {
                PushSubscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey
                });
                let SERVER_URL = 'http://localhost:10000/saveSubscription'
                let response = await fetch(SERVER_URL, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(PushSubscription),
                })
                displayNoButton();
                response.json().then(res => console.log(res.message))
            }
        } else {
            getInstruction = confirm("Oops! \nIt looks like you blocked us from sending you notifications. \n" +
                "Would you like instructions on how to reset your permissions?")
            if (getInstruction) {
                window.open('https://support.google.com/chrome/answer/3220216?co=GENIE.Platform%3DDesktop&hl=en')
            }
        }
    }
}

async function closePushSubscription() {
    try {
        let registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        let successful = subscription.unsubscribe();
        let SERVER_URL = 'http://localhost:10000/deleteSubscription'
        let response = await fetch(SERVER_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        })
        displayYesButton();
        response.json().then(res => console.log(res.message))
        // console.log("Unsubscribed", successful);
    } catch (e) {
        // Unsubscription failed
        console.log("Unsubscribe failed: ", e);
    };
}

const displayYesButton = () => {
    let button = document.getElementById('permission-btn-yes');
    if (button) {
        button.style.display = 'block'
        button = document.getElementById('permission-btn-no');
        button.style.display = 'none'
    }

}

const displayNoButton = () => {
    let button = document.getElementById('permission-btn-no');
    if (button) {
        button.style.display = 'block'
        button = document.getElementById('permission-btn-yes');
        button.style.display = 'none'
    }
}

navigator.serviceWorker.ready.then((registration) => {
    registration.pushManager.getSubscription().then(subscription => {
        if (subscription === null) {
            displayYesButton();
        } else {
            displayNoButton();
        }
    })
});









/*
Checks that browser has push notification functionality
*/
// const check = () => {
//     if (!('serviceWorker' in navigator)) {
//         throw new Error('No Service Worker support!')
//     }
//     if (!('PushManager' in window)) {
//         throw new Error('No Push API Support!')
//     }
// }


// const main = async () => {
//     console.log(Notification.permission);
//     check();
//     const swRegistration = await registerServiceWorker();
//     const permission = await requestNotificationPermission();
// }

/*
// Asks permission to send notifications
// */
// const requestNotificationPermission = async () => {
//     const permission = await Notification.requestPermission();
//     // value of permission can be 'granted', 'default', 'denied'
//     // granted: user has accepted the request
//     // default: user has dismissed the notification permission popup by clicking on x
//     // denied: user has denied the request.
//     if (permission !== 'granted') {
//         throw new Error('Permission not granted for Notification');
//     }
//     // console.log(Notification.permission)
// }