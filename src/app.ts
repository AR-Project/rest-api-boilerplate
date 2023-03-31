import * as dotenv from 'dotenv'
dotenv.config()
import 'reflect-metadata'
import container from './Infrastructure/container.js'
import createServer from './Infrastructure/http/createServer.js'

const PORT = process.env.PORT

const app = createServer(container)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
