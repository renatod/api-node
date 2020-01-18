# API Usage


### Sign in with email / password

You can sign in a user with an email and password by issuing an HTTP POST request to the `auth` endpoint.

```
Method: POST
Content-Type: application/json
Endpoint: http://localhost:3000/auth
```

Request Body Payload

| Property Name	| Type    | Description          |
|---------------|---------|----------------------|
| email         | string  | The user`s email.    |
| password      | string  | The user`s password. |

Response Payload

| Property Name	| Type    | Description                                                  |
|---------------|---------|--------------------------------------------------------------|
| user          | object  | The authenticated user.                                      |
| accessToken   | object  | The access (token and expiresIn) for the authenticated user. |



### Sign-up a new User

You can sign up a user with an email and password by issuing an HTTP POST request to the `auth/signup` endpoint.

```
Method: POST
Content-Type: application/json
Endpoint: http://localhost:3000/auth/signup
```

Request Body Payload

| Property Name	| Type    | Description                             |
|---------------|---------|-----------------------------------------|
| email         | string  | The user`s email.                       |
| password      | string  | Password must be at least 6 chars long. |

Response Payload

| Property Name	| Type    | Description                                            |
|---------------|---------|--------------------------------------------------------|
| user          | object  | The created user.                                      |
| accessToken   | object  | The access (token and expiresIn) for the created user. |


### List all customers

You can retrive the all customers by issuing an HTTP GET request to the `customers` endpoint.

```
Method: GET
Content-Type: application/json
Endpoint: http://localhost:3000/customers?page=1
Authorization: Bearer ${ACCESS_TOKEN}
```

### Create a new Customer

You can create a new customer issuing an HTTP POST request to the `customers` endpoint.

```
Method: POST
Content-Type: application/json
Endpoint: http://localhost:3000/customers
Authorization: Bearer ${ACCESS_TOKEN}
```

Request Body Payload

| Property Name	| Type    | Description                             |
|---------------|---------|-----------------------------------------|
| name          | string  | The customers`s name.                   |
| email         | string  | The customers`s email.                  |

### Update a Customer

You can update a customer issuing an HTTP PUT request to the `customers/${id}` endpoint.

```
Method: PUT
Content-Type: application/json
Endpoint: http://localhost:3000/customers/${id}
Authorization: Bearer ${ACCESS_TOKEN}
Example: http://localhost:3000/customers/1
```

Request Body Payload

| Property Name	| Type    | Description                             |
|---------------|---------|-----------------------------------------|
| name          | string  | The customers`s name. (OPTIONAL)        |
| email         | string  | The customers`s email. (OPTIONAL)       |

### Delete a Customer

You can delete a customer issuing an HTTP DELETE request to the `customers/${id}` endpoint.

```
Method: DELETE
Content-Type: application/json
Endpoint: http://localhost:3000/customers/${id}
Authorization: Bearer ${ACCESS_TOKEN}
Example: http://localhost:3000/customers/1
```

### Retrive a Customer Data

You can retrive a customer data issuing an HTTP GET request to the `customers/${id}` endpoint.

```
Method: GET
Content-Type: application/json
Endpoint: http://localhost:3000/customers/${id}
Authorization: Bearer ${ACCESS_TOKEN}
Example: http://localhost:3000/customers/1
```

### List the favorite products

You can retrive the all favorite products by issuing an HTTP GET request to the `customers/${customerId}/favorites` endpoint.

```
Method: GET
Content-Type: application/json
Endpoint: http://localhost:3000/customers/${customerId}/favorites?page=1
Authorization: Bearer ${ACCESS_TOKEN}
Example: http://localhost:3000/customers/1/favorites?page1
```

### Create a customer favorite product

You can set a favorite product by issuing an HTTP POST request to the `customers/${customerId}/favorites/${productId}` endpoint.

```
Method: POST
Content-Type: application/json
Endpoint: http://localhost:3000/customers/${customerId}/favorites/${productId}
Example: http://localhost:3000/customers/1/favorites/1bf0f365-fbdd-4e21-9786-da459d78dd1f
Authorization: Bearer ${ACCESS_TOKEN}
```

### Remove a customer favorite product

You can unset a favorite product by issuing an HTTP DELETE request to the `customers/${customerId}/favorites/${productId}` endpoint.

```
Method: DELETE
Content-Type: application/json
Endpoint: http://localhost:3000/customers/${customerId}/favorites/${productId}
Authorization: Bearer ${ACCESS_TOKEN}
Example: http://localhost:3000/customers/1/favorites/1bf0f365-fbdd-4e21-9786-da459d78dd1f
```
