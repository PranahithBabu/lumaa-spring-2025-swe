# Backend Setup Guide

### 1. After cloning this repository, perform below command;
### `npm install`

### 2. Make sure to install all the packages available in package.json using `npm install package_name`.

### 3. Install PostgreSQL, and create a database. Mention all the required details as specified in <i>step 4</i>.

### 4. Create a .env file in this root directory and store respective values for the below mentioned variables
* DB_USER
* DB_HOST
* DB_NAME
* DB_PASSWORD
* DB_PORT // 5432 (default)
* PORT // 5000 (default)
* JWT_SECRET // based on your requirement, anything to be precise.

### 5. Then run `npm start` in the backend directory
```
If any errors thrown with regards to module not found, then please install those modules using below format;
npm install module_name
```