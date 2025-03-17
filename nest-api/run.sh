#!/bin/sh

if [ "$ENV" == "dev" ]; then
  echo "Running in DEV mode"
  npm run start:debug
elif [ "$ENV" == "prod" ]; then
  echo "Running in PROD mode"
  npm run start:prod
else
  echo "ENV variable is either undefined or has an unsupported value : $ENV ( currently accepting 'dev' | 'prod' )"
fi
