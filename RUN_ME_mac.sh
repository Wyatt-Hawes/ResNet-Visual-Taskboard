#!/bin/sh

# Open frontend terminal window
gnome-terminal -- bash -c "npm run start-frontend; exec bash"

# Open backend terminal window
gnome-terminal -- bash -c "npm run host; exec bash"
