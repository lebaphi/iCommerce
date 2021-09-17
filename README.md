# iCommerce

## Problem statment

A small start-up named "iCommerce" wants to build an online shopping application to sell their products. In order to get to the market quickly, they just want to build a version with a very limited set of functionalities:

a. A single web page application that shows all products on which customer can filter, sort and search for products based on different criteria such as name, price, branch, color etc.

b. A backend side to serve requests from web application such as show products, filter, sort and search.

c. If customer finds a product that they like, they can only place order by calling to the company's Call Centre.

d. To support sale and marketing, all customers' activities such as searching, filtering and viewing product's details need to be stored in the database.

e. No customer registration is required.

f. No online payment is required.

## Constraints & assumptions

- MongoDB and Redis are installed and running
- Only one MongoDB instance, no replicated instance. Then main purpose is showing how to built the system architecture for reviewing

## High level design

![High level design](https://github.com/lebaphi/iCommerce/blob/master/assets/System%20Architect.png?raw=true)
The backend is designed with some modern patterns as following:

- Microservices pattern 
  - API gateway: running as the main endpoint for user's requests. Receive user's request then route this request to the suitable service
  - Write service (Command): Process request and store data to database. The better way that I think we should apply the event sourcing pattern to handle operations on data.
  - Read service (Query): Process request and retrieve data from the database then return to the user.

- Event-driven pattern - User behaviors such as viewing products, product filters will be saved to the database, for sales or marketing purposes. With this template, any service can subscribe to the channel to receive published events for its own purposes

- CQRS pattern - a pattern that separates read and write operations for a data store. It can make the system maximize performance, scalability, and security.

## A sequence diagram

![Sequence Diagram](https://github.com/lebaphi/iCommerce/blob/master/assets/Sequence%20Diagram.png?raw=true)

The diagram above the product search flow shows. They can search all products or filter products by attributes like name, brand, color. Their activities will be saved in the database for sales or marketing purposes.

## Databases and data schema

- MongoDB for storing product and customer's activity (as an event).
- Redis as a pub/sub service.

Examples of data stored in the MongoDB or pusblished to Redis.

- Product

```
{
    "_id": "6141c498999d914e6f32e1a7",
    "name": "Iphone 13",
    "price": "500",
    "branch": "Apple",
    "color": "Blue",
    "created_at": "2021-09-15T10:02:00.350Z",
    "updated_at": "2021-09-15T10:02:00.350Z",
    "__v": 0
}
```

- Filter product by name and color

```
{
    "_id": "61434e6b111b3f60e3df7a77",
    "eventName": "FILTER_PRODUCT",
    "metadata" : {
      query: {
        name: "Iphone 13",
        color: "Blue",
        userId: "anonymous" | "loggedIn user",
      }
    },
    "__v": 0,
    "created_at": "2021-09-16T14:02:19.734Z",
    "updated_at": "2021-09-16T14:02:19.734Z"
}
```

- View product:

```
{
    "_id": "61434e6b111b3f60e3df7a77",
    "eventName": "VIEW_PRODUCT",
    "userId": "anonymous",
    "metadata" : {
      query: {
        docId: "6140c1126050d69edb35a174",
        userId: "anonymous" | "loggedIn user",
      }
    },
    "__v": 0,
    "created_at": "2021-09-16T14:02:19.734Z",
    "updated_at": "2021-09-16T14:02:19.734Z"
}
```

Example of a publised event message (via Redis):

## Tech Stacks

- MacOS 11.4
- MongoDB 4.1.1
- Redis 6.2.5
- TS-Node 10.2.1
- TypeScript 4.4.3
- ExpressJS 4.17.1
- Jest 27.2.0
- yarn 1.22.10

## Architecure of Application

### Folder structure

![Folder Structure](https://github.com/lebaphi/iCommerce/blob/master/assets/Folder%20Strcuture.png?raw=true)

3 REST API services:
  - api-gateway
  - read-service
  - write-service

The `insights` for processing 2 types of event `VIEW_PRODUCT` and `FILTER_PRODUCT`. The data event will be store into database.


## Local deployment

### Setup database servers

Use docker to get it run quickly
 
MongoDB:

```
$ docker run --rm --name mongodb -p 27017:27017 -v ~/mongodb:/db -d mongo
```

Redis:

```
$ docker run --rm --name redis -p 6379:6379 -d redis
```

### Clone source code


```
$ cd ~
$ git clone https://github.com/lebaphi/iCommerce.git
```

### Build & start the api-gateway service

Assume that you installed all dependencies like node, npm, yarn...

Navigate to the `api-gateway` project

```
$ cd ~/iCommerce/api-gateway
```

Rename the .env.example to .env, use the current one or fill the appropriate values

```
$ yarn
$ yarn start
```

### Start the write-product service

Navigate to the `write-product` project
```
$ cd ~/iCommerce/write-product
```

Rename the .env.example to .env, use the current one or fill the appropriate values

```
$ yarn
$ yarn start
$ yarn test
```

### Start the read-product service

```
$ cd ~/iCommerce/read-product
```

Rename the .env.example to .env, use the current one or fill the appropriate values

```
$ yarn
$ yarn start
$ yarn test
```

### Start the insights worker

```
$ cd ~/iCommerce/insights
```

Rename the .env.example to .env, use the current one or fill the appropriate values

```
$ yarn
$ yarn start
$ yarn test
```

## Testing

Greate a new product:

```
$ curl --request POST 'http://localhost:3000/products' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "sample product",
"price": "$100",
"branch": "Apple",
"color": "black"
}'

----------

{"result":{"name":"sample product","price":"$100","branch":"Apple","color":"black","_id":"614355056fa4374b45bf6e6f","created_at":"2021-09-16T14:30:29.918Z","updated_at":"2021-09-16T14:30:29.918Z","__v":0}}

----------
```

Update product by id:

```
$ curl --request PATCH 'http://localhost:3000/products/614355056fa4374b45bf6e6f' \
--header 'Content-Type: application/json' \
--data-raw '{
"name": "Updated product",
"price": "$200",
"branch": "Apple",
"color": "black"
}'

----------

{"result":{"_id":"614355056fa4374b45bf6e6f","name":"sample product","price":"$100","branch":"Apple","color":"black","created_at":"2021-09-16T14:30:29.918Z","updated_at":"2021-09-16T14:30:29.918Z","__v":0}}

----------

```

Delete product by id:

```
$ curl --request DELETE 'http://localhost:3000/products/614355056fa4374b45bf6e6f' \
--header 'Content-Type: application/json'
```

Search product by id:

```
$ curl --request GET 'http://localhost:3000/products/614355056fa4374b45bf6e6f' \
--header 'Content-Type: application/json'

```

Get all products:

```
$ curl --request GET 'http://localhost:3000/products' \
--header 'Content-Type: application/json'
```

To filter products with conditions such as name and color. The name will be filtered by 'regex' (regular expression):

```
$ curl --request GET 'http://localhost:3000/products?name=iphone&color=red' \
--header 'Content-Type: application/json'
```
