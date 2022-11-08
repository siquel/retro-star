## Retro star

## Setup

```shell
# Create a nomad app for main application
flyctl launch --name retro-star --remote-only --build-arg "GIT_COMMIT=<sha>" --image-label <sha> --region fra --copy-config --now
# Create machines app for scheduled jobs
flyctl apps create retro-star-scheduled --machines
# Schedule cronjob with previously built image
flyctl m run -a retro-star-scheduled --name huuto-net-scraper --schedule hourly "registry.fly.io/retro-star:<sha>" "npm" "run" "cron:huuto"
```
