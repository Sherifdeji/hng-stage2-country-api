# Countries API

A RESTful API that fetches country data and exchange rates from external sources, processes the information, and provides comprehensive CRUD operations with advanced filtering and sorting capabilities.

## Features

- **Data Aggregation**: Fetches country and currency exchange rate data from external REST APIs.
- **Persistent Storage**: Uses a MySQL database with Prisma ORM to store and manage data efficiently.
- **RESTful Endpoints**: Provides clean, well-structured endpoints to refresh data, read countries, and delete countries.
- **Dynamic Filtering & Sorting**: Supports filtering countries by `region` and `currency`, and sorting by `estimated_gdp`.
- **Dynamic Image Generation**: Creates a PNG image summarizing key statistics like total countries, last refresh time, and top 5 countries by GDP.
- **Robust Error Handling**: Implements a centralized error handler for graceful management of client errors (404) and server errors (503, 500).
- **Containerized Environment**: Uses Docker Compose to provide a consistent and isolated MySQL database environment for development.

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Containerization**: Docker
- **HTTP Client**: Axios
- **Image Generation**: `node-canvas`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Sherifdeji/hng-stage2-country-api
    cd hng-stage2-country-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. You can do this by copying the example structure below.

    ```bash
    touch .env
    ```

    Open the `.env` file and add the following content, replacing `your_secret_password` with a password of your choice.

    ```env
    # This password will be used by docker-compose to set up the database
    DB_PASSWORD=your_secret_password

    # This is the full connection string Prisma will use to connect to the Docker container
    DATABASE_URL="mysql://root:${DB_PASSWORD}@127.0.0.1:3306/hng_stage2"
    ```

4.  **Start the database container:**
    This command will start a MySQL database in a Docker container using the password from your `.env` file.

    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**
    This command applies the database schema defined in `prisma/schema.prisma` to the running MySQL instance.
    ```bash
    npx prisma migrate dev
    ```

### Running the Application

- **Development Mode:**
  To run the server with hot-reloading for development:

  ```bash
  npm run dev
  ```

  The server will be available at `http://localhost:3000`.

- **Production Mode:**
  To build and run the production-ready version of the app:
  ```bash
  npm run build
  npm start
  ```

## API Documentation

All endpoints are prefixed with the base URL (e.g., `http://localhost:3000`).

| Method   | Endpoint             | Description                                                                                                          | Success Response                           |
| :------- | :------------------- | :------------------------------------------------------------------------------------------------------------------- | :----------------------------------------- |
| `POST`   | `/countries/refresh` | Fetches data from external APIs, populates the database, and generates the summary image.                            | `200 OK` with a summary message.           |
| `GET`    | `/countries`         | Returns a list of all countries. Supports filtering (`?region=...`, `?currency=...`) and sorting (`?sort=gdp_desc`). | `200 OK` with an array of country objects. |
| `GET`    | `/countries/image`   | Serves the dynamically generated `summary.png` image.                                                                | `200 OK` with the image file.              |
| `GET`    | `/countries/:name`   | Returns a single country matching the provided name (case-insensitive).                                              | `200 OK` with a single country object.     |
| `DELETE` | `/countries/:name`   | Deletes a single country matching the provided name.                                                                 | `204 No Content`.                          |
| `GET`    | `/status`            | Returns the total number of countries in the database and the timestamp of the last successful refresh.              | `200 OK` with a status object.             |

### Error Responses

- **`404 Not Found`**: Returned when a requested resource (e.g., a specific country, the status, or the image) does not exist.
  ```json
  { "error": "Country not found" }
  ```
- **`503 Service Unavailable`**: Returned if the external APIs are unreachable during a data refresh.
  ```json
  {
    "error": "External data source unavailable",
    "details": "Could not fetch data from [API name]"
  }
  ```
- **`500 Internal Server Error`**: Returned for any unexpected server-side errors.
  ```json
  { "error": "Internal server error" }
  ```

## Deployment

This project is configured for easy deployment on platforms like [Railway](https://railway.app/).

- **Build Command**: In your deployment service settings, the build command should be set to:
  ```bash
  npm run build
  ```
- **Start Command**: The start command should be set to run migrations before starting the server:
  ```bash
  npx prisma migrate deploy && npm start
  ```

This ensures that the TypeScript code is compiled first, and then database migrations are applied in the runtime environment before the application starts, preventing common deployment errors. For platforms that use Nixpacks (like Railway), a `nixpacks.toml` file is included to install the necessary system dependencies for `node-canvas`.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sherif Ibrahim**

---

## 🙏 Acknowledgments

- Built as part of Stage 2 assessment for [HNG Internship](https://hng.tech)

---
