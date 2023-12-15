HOW TO LOAD WEBSITE

1) Ensure all files are included in folder CARROOM, including app folder, public folder, env.json, databaseEnv.json, setup.sql & package.json.

2) Ensure Postgres is setup on your machine prior to running the "npm run setup" step.

3) As a good practice, please delete node_modules folder before the npm i/npm install step.

4) Plug in your unique API key for API-Ninjas in the env.json file beside "api_key1" replacing "API_NINJAS_API_KEY_HERE".

5) Cd into the CARROOM working directory and run "npm install".

6) Run "npm run setup" and enter your postgres password when prompted. (This will execute the setup.sql script that sets up the user, database and permissions)

7) Run "npm run start" and then visit localhost:3000 on the browser

