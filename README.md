# Contact Management API

### API Setups

-   npm init
-   npm install
-   npm run start

### API Endpoints

-   Contact Route : /api/v1/contacts
-   User Route : /api/v1/users

#### Contact Route

-   You can make a GET request on this route for accessing all contacts.
    It also includes queries like _Sort_, _Filter_, _Pagination_ and _Limit_ on one page.
    Default _Limit_ on one page is 5.

-   You can also make a POST request on this route for creating a contact. You need to login for this opertaion.

-   You have to login for all request on **/:id** endpoint.

-   You can make a GET request on using **/:id**, where id is document id, to get a particular contact.

-   For updating and deleting contact, you must be an admin.

#### User Route

-   You can make a get request for getting user data.

-   For security reasons you cannot access admin email and password.

-   This whole route is for authorized users.

-   User can update their own data. For updating other users data you must be an admin.

-   Similar as contact route you can make request to _/:id_ endpoint in this route.

-   Additionally, _/signup_, _/login_, _/forgotPasword_ and _resetPassword_ for authentication processes.
