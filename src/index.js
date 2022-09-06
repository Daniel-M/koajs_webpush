const Koa = require('koa')
const app = new Koa()
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const path = require('path')

const webpush = require('web-push')

// $ ./node_modules/.bin/web-push generate-vapid-keys

// =======================================

// Public Key:
// BFCYuTC-jDNCCVeBIx1MPUVEdtmWph60epIs9KQKG2e3fZtR-dU0DCIS8LszJtzJFxieT9M36EIqRHi8aWljQNc

// Private Key:

// =======================================

//storing the keys in variables
const publicVapidKey =
  'BFCYuTC-jDNCCVeBIx1MPUVEdtmWph60epIs9KQKG2e3fZtR-dU0DCIS8LszJtzJFxieT9M36EIqRHi8aWljQNc'
const privateVapidKey = ''

//setting vapid keys details
webpush.setVapidDetails(
  process.env.WEBPUSH_MAILTO,
  publicVapidKey,
  privateVapidKey
)

app.use(bodyParser())

app.use(koaStatic(path.join(__dirname, '/static')))

const router = new Router()

router.post('/subscribe', async (ctx, next) => {
  try {
    //get push subscription object from the request
    const subscription = ctx.request.body

    ctx.response.status = 201
    ctx.response.body = {}

    //create paylod: specified the detals of the push notification
    const payload = JSON.stringify({
      title: 'Server Push Notification',
      message: 'This is a message',
    })

    //pass the object into sendNotification fucntion and catch any error
    await webpush.sendNotification(subscription, payload)
  } catch (error) {
    console.log('Error!!')
    console.error(error)
  }
})

router.get('/hello', async (ctx) => {
  ctx.body = 'Hello World'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log('This server is running at port 3000')
})
