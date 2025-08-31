#!/bin/bash

# .env.local
if [ ! -r ".env.local" ]; then
  pnpm run vercel env pull .env.local && sed -i '' -e '/^VERCEL/d' .env.local
fi
