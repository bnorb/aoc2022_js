#!/bin/bash

for day in {1..25}; do
  echo "~~~~~~~~~~~~~~~~~~~~~~~ Day $day ~~~~~~~~~~~~~~~~~~~~~~~"
  node "./day$day"
done