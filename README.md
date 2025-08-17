# Cubos Challenge API

This project provides a robust and scalable API for the Cubos Challenge.

## Technologies

This project is built using the following key technologies:

*   **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
*   **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
*   **Prisma**: A modern database toolkit that simplifies database access with an auto-generated and type-safe ORM.
*   **PostgreSQL**: A powerful, open-source relational database system.
*   **Swagger (OpenAPI)**: For API documentation and interactive exploration.
*   **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity.
*   **Docker & Docker Compose**: For containerization and easy environment setup.

## Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

Ensure you have the following installed on your machine:

*   [Node.js](https://nodejs.org/en/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (Node Package Manager) or [Yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/products/docker-desktop)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Create a `.env` file in the project root based on the `.env.example` (if available, otherwise create one with the following content):

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
JWT_SECRET="your_jwt_secret_key"
PORT=3000
```

**Note:** Replace `user`, `password`, and `mydatabase` with your desired PostgreSQL credentials and database name.

### Database Setup (Docker Compose)

You can easily set up a PostgreSQL database using Docker Compose:

```bash
docker-compose up -d db
```

This command will start the PostgreSQL container in the background.

### Install Dependencies

Install the project dependencies:

```bash
npm install
```

### Run Prisma Migrations

Apply the database migrations to set up your schema:

```bash
npx prisma migrate dev --name init
```

### Start the Application

You can start the application in different modes:

*   **Development Mode (with watch):**
    ```bash
    npm run start:dev
    ```
    The application will restart automatically on code changes.

*   **Production Mode:**
    ```bash
    npm run start:prod
    ```

### Access Swagger UI

Once the application is running, you can access the interactive API documentation (Swagger UI) at:

`http://localhost:3000/api` (or your configured PORT)

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```