// BarSportTV Service Worker – handles web push notifications

self.addEventListener('push', function (event) {
  const data = event.data?.json() ?? {}
  const title = data.title ?? 'BarSportTV'
  const options = {
    body:    data.body ?? 'Un partido empieza pronto',
    icon:    '/favicon.svg',
    badge:   '/favicon.svg',
    tag:     data.matchId ?? 'bstv-reminder',
    renotify: true,
    data:    { url: data.url ?? '/' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const targetUrl = event.notification.data?.url ?? '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus()
      }
      return clients.openWindow(targetUrl)
    })
  )
})
