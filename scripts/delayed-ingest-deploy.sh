#!/bin/bash
# Scheduled: wait for Spotify rate limit to clear, run scraper, deploy

LOG="/Users/mg/sd-shows/scripts/ingest-deploy.log"
echo "$(date): Waiting 3 hours for Spotify rate limit to clear..." > "$LOG"

sleep 10800  # 3 hours

echo "$(date): Starting events-scraper ingest..." >> "$LOG"
cd /Users/mg/events-scraper
npm run dev ingest >> "$LOG" 2>&1
SCRAPER_EXIT=$?

if [ $SCRAPER_EXIT -ne 0 ]; then
  echo "$(date): Scraper failed with exit code $SCRAPER_EXIT" >> "$LOG"
  osascript -e 'display notification "Scraper failed — check ingest-deploy.log" with title "SD Shows" sound name "Basso"'
  exit 1
fi

echo "$(date): Scraper complete. Deploying to Vercel..." >> "$LOG"
cd /Users/mg/sd-shows
npx vercel --prod --force >> "$LOG" 2>&1
DEPLOY_EXIT=$?

if [ $DEPLOY_EXIT -ne 0 ]; then
  echo "$(date): Deploy failed with exit code $DEPLOY_EXIT" >> "$LOG"
  osascript -e 'display notification "Deploy failed — check ingest-deploy.log" with title "SD Shows" sound name "Basso"'
  exit 1
fi

echo "$(date): All done! Site is live with artist images." >> "$LOG"
osascript -e 'display notification "Scraper + deploy complete! Artist images are live on sd-shows.vercel.app" with title "SD Shows ✅" sound name "Glass"'
say "SD Shows deployment complete. Artist images are now live."
