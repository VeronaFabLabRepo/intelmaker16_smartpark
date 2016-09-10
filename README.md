# intelmaker16_smartpark
This project realizes a solution for smart parking, i.e. a system for parking monitoring. It is realized specially for parkings reserved to disabled people, but it can be applied to other situations, as pay and display parking or non-parking areas.<br>The parking lot have a sensor on the ground that can communicate to a server whether the place is free or taken, and if it is taken, the system can figure out if the vehicle is authorized or not.
Through an app, someone can check where there are free parking in that moment, and finally it will be possible to calculate some statistics, for example how many parkings are free or occupied or not allowed, divided for areas, days, time slots..

#Todos before starting webserver
- add your ssh keys in./bin and update files' name in ./bin/www
- update your ip details in ./bin/www
- update your MySQL database details in ./mysql
- install node modules (open the main folder in your terminal and type 'npm install')

#todos before starting your Intel Edison
- copy the entire ./edisonBeacon forlder in your Intel Edison
- update your IP details in ./main
- install node modules (open .../edisonBeacon in your terminal and type 'npm install')
