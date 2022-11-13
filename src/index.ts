import { createServer } from './server'

const PORT = process.env.PORT || 3000
createServer().then((app) =>
  app.listen(PORT, () => {
    console.log(`️[server]: Server is running at http://localhost:${PORT}, commit sha: ${process.env.GIT_COMMIT}`)
  }),
)
