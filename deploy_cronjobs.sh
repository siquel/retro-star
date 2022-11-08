#!/bin/bash


SHA=$1

if [ -z "$SHA" ]; then
  echo "Usage: $0 [GIT SHA]"
  exit 1
fi

huuto=$(flyctl machines list -a retro-star-scheduled | grep huuto-net-scraper | cut -d$'\t' -f1)

if [ -z "$huuto" ]; then
  echo "Could not find huuto scraper"
  exit 1
fi

flyctl machines update "$huuto" -a retro-star-scheduled --schedule hourly --image "registry.fly.io/retro-star:$SHA"

