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
            let key = await fetch("/api/vapidPublicKey", {
                method: "GET"
            }).then(response => {
                return response.clone().json();
            });
            let applicationServerKey = await urlB64ToUint8Array(key.key);
            let PushSubscription = await register.pushManager.getSubscription();
            // console.log(PushSubscription)
            if (PushSubscription === null) {
                PushSubscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey
                });
                let SERVER_URL = '/saveSubscription'
                let response = await fetch(SERVER_URL, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(PushSubscription),
                })
                // response.json().then(res => console.log(res.message))
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
        let SERVER_URL = '/deleteSubscription'
        let response = await fetch(SERVER_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        })
        // response.json().then(res => console.log(res.message))
        // console.log("Unsubscribed", successful);
    } catch (e) {
        // Unsubscription failed
        console.log("Unsubscribe failed: ", e);
    };
}

if (document.getElementById("notif-check")){
    // console.log('element exists')
    let checkbox = document.getElementById("notif-check");
    navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then(subscription => {
            if (subscription === null) {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
            }
        })
    });
    checkbox.addEventListener( 'change', function() {
        if(this.checked) {
            // console.log('checked');
            openPushSubscription();
        } else {
            // console.log('unchecked');
            closePushSubscription();
        }
    });
}
