#!/usr/bin/env bash
set -eu

bundle install
npm ci
npm test
