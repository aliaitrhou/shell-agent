#!/bin/bash

# for file in public/S3/*; do
#   echo "Start Processing: $file"
#   python3 script.py $file
#   echo "Finish Processing: $file"
# done

for file in public/S4/*; do
  echo "Processing: $file"
  python3 script.py $file
  echo "End Processing: $file"
done
