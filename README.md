<img src="./public/images/readme/hyperpos-docs.jpg" >

## Getting Started

This project is an **open-source web-based Point of Sale (POS) system** built with Node.js and structured using the **Clean Architecture** pattern. It helps developers and businesses launch scalable, modular backends quickly. The architecture promotes maintainability, separation of concerns, and flexibility for long-term development and commercial or personal POS system deployments.

Whether you prefer SQL databases like MySQL or NoSQL databases like MongoDB, this template serves as a powerful and flexible starting point. It provides essential features such as authentication, file upload handling, and built-in testing. Developers can immediately begin building robust applications on top of this production-ready backend framework.

You can **extend or enhance** this system to match your unique business needs, including inventory tracking, multi-store management, and customer loyalty programs. The design encourages customization with clean, reusable code, and modular services. This makes the system suitable for various industries including retail, restaurants, and service-based businesses with different operational flows.

This project is built with widely supported libraries and tools that are well-tested and community-backed. It ensures you have the flexibility to evolve the system as your needs grow. Whether for learning, freelancing, or enterprise-level deployments, this template gives you a dependable base to develop modern, feature-rich POS applications efficiently.

[**Demo POS**](https://hyperpos.neohubasia.com/) | [**Information**](https://info.hyperpos.neohubasia.com/)

### 🔧 Tech Stack

[**Express**](https://bit.ly/3FeNkRi)

-   a powerful and flexible framework that makes it easy to build web applications and APIs using Node.js. Its minimalist approach and large ecosystem make it a popular choice for developers who want to build scalable and maintainable web applications.

[**Sequelize**](https://bit.ly/40zuH2f)

-   an Object-Relational Mapping (ORM) library for Node.js, which allows you to work with relational databases such as MySQL, PostgreSQL, and SQLite using JavaScript syntax.

[**Mongoose**](https://bit.ly/3TA0ZGT)

-   a powerful and flexible ODM library for MongoDB and Node.js that provides a rich set of tools for working with data. Its schema-based approach, data validation tools, and powerful

[**Bootstrap**](https://bit.ly/3VQCqXA)

-   a popular front-end framework for building responsive and mobile-first web applications. It was originally developed by Twitter and is now maintained by the open-source community.

[**Passport**](https://bit.ly/3W24cAr)

-   an open-source authentication middleware for Node.js. It provides a simple and modular approach to authentication that makes it easy to add user authentication to web applications.

[**Multer**](https://bit.ly/3NhgEZr)

-   a popular package that provides middleware for handling multipart/form-data in Node.js. It's commonly used in web applications to handle file uploads from users.

[**JWT**](https://bit.ly/3W2dNrg)

-   in the context of Node.js, the jsonwebtoken package is a popular npm package that provides a simple way to create and verify JWTs.

[**Mocha**](https://bit.ly/3f95w3Q)

-   a testing framework for Node.js applications. It's designed to provide a simple and flexible way to write and run tests, with support for a variety of testing styles and frameworks.

### 🧰 Prerequisites

-   Node.js,
-   MongoDB,
-   MySQL (optional)
-   Redis (optional)

### 🚀 Setup Instructions

**Clone repository**

```bash
git clone https://github.com/waiphyo285/pos-stater-kit.git
```

**Navigate root directory and install dependencies**

```bash
npm install
```

**Copy `.env.example` to `.env` then update it with your values (e.g., database settings, credentials)**

```bash
cp .env.example .env
```

⚠️ If your database requires authentication (username/password), make sure to update the .env file accordingly. You may also need to adjust the connection logic in `models/mongodb/connection.js` to match your credentials and connection format.

**Run the application**

```bash
npm run dev
npm start
```

⚠️ Use npm run dev if you have nodemon installed globally. Otherwise npm start.

**TDD `./../.spec.js` in controllers**

```
npm run test
```

### 🛠 CLI Commands (from src/cli)

```bash
node index
node index --index
node index --show=************************
```

### 📌 Note

This application is different to the Clean Architecture diagram above but attempts to achieve the same outcome.
