#!/bin/zsh

# Open frontend terminal window
osascript -e 'tell application "Terminal" to do script "cd Desktop/ResNet-Visual-Taskboard && npm run start-frontend"'

# Open backend terminal window
osascript -e 'tell application "Terminal" to do script "cd Desktop/ResNet-Visual-Taskboard && npm run host"'

exit