# Dogs API

A simple REST API for managing dog breeds and favorites using NestJS.

## Endpoints

### Get All Dog Breeds

**GET** `/api/breeds`

Fetches all available dog breeds from https://dog.ceo/api/breeds/list/all and returns a simplified array.

**Response:**

```json
[
  "affenpinscher",
  "african",
  "airedale",
  "akita",
  "appenzeller",
  ...
]
```

### Get Images for a Breed

**GET** `/api/breeds/:breed/images`

Fetches 3 random images for the specified breed.

**Parameters:**

- `breed` (string): The breed name

**Response:**

```json
[
  "https://images.dog.ceo/breeds/bulldog-boston/n02096585_2450.jpg",
  "https://images.dog.ceo/breeds/bulldog-boston/n02096585_9909.jpg",
  "https://images.dog.ceo/breeds/bulldog-french/n02108915_11327.jpg"
]
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "message": "Breed 'invalidbreed' not found"
}
```

### Add Favorite Breed

**POST** `/api/favorites`

Adds a breed to the favorites list.

**Request Body:**

```json
{
  "breed": "bulldog"
}
```

**Response:**

```json
{
  "message": "Breed 'bulldog' added to favorites"
}
```

### Get Favorite Breeds

**GET** `/api/favorites`

Returns the list of favorite breeds.

**Response:**

```json
["bulldog", "retriever"]
```

### Remove Favorite Breed

**DELETE** `/api/favorites/:breed`

Removes a breed from the favorites list.

**Parameters:**

- `breed` (string): The breed name to remove

**Response:**

```json
{
  "message": "Breed 'bulldog' removed from favorites"
}
```

## Running the API

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run start:dev
   ```

3. The API will be available at `http://localhost:3000`

## Features

- **External API Integration**: Fetches data from the Dog CEO API
- **Persistent Favorites**: Favorites are stored in a local JSON file (`favorites.json`)
- **Error Handling**: Proper HTTP status codes and error messages
- **Input Validation**: Validates breed names and request bodies
- **Case Insensitive**: Breed names are normalized to lowercase
- **Duplicate Prevention**: Prevents adding duplicate favorites

## Example Usage

```bash
# Get all breeds
curl http://localhost:3000/api/breeds

# Get images for a specific breed
curl http://localhost:3000/api/breeds/bulldog/images

# Add a favorite breed
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"breed": "bulldog"}'

# Get favorite breeds
curl http://localhost:3000/api/favorites

# Remove a favorite breed
curl -X DELETE http://localhost:3000/api/favorites/bulldog
```
