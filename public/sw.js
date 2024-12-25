self.addEventListener("install", function (event) {
  console.log("Service Worker instalado");

  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  console.log("Service Worker activado");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/account.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
        url: data.url || "/", 
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
  event.notification.close();
  
  const url = event.notification.data ? event.notification.data.url : '/';
  event.waitUntil(clients.openWindow(url));
});
