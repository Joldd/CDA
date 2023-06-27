CREATE TABLE account(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mailIsConfirmed BOOLEAN,
  image VARCHAR(255),
  Description TEXT,
  societyAdress VARCHAR(255),
  siren INT,
  paypalAdress VARCHAR(255),
  kbis VARCHAR(255)
);

CREATE TABLE prices(
  id SERIAL PRIMARY KEY,
  minNumberPurchased INT NOT NULL,
  price INT NOT NULL
);

CREATE TABLE credits(
  id SERIAL PRIMARY KEY,
  purchaseDate TIMESTAMP NOT NULL,
  validity INT NOT NULL DEFAULT 63115200,
  price INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE discounts(
  id SERIAL PRIMARY KEY,
  acquisitionDate TIMESTAMP NOT NULL,
  validity INT NOT NULL DEFAULT 63115200,
  percentage INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE libraries(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type ENUM('Scene','Character','Item','Image_and_police'),
  price INT NOT NULL,
  state ENUM('accepted','validating','rejected'),
  releaseDate TIMESTAMP NOT NULL,
  salesNumber INT NOT NULL,
  encouragementsNumber INT NOT NULL,
  owner_id INT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES contributors(id)
);

CREATE TABLE tags(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  isActive BOOLEAN DEFAULT FALSE
);

CREATE TABLE libraries_tags(
  library_id INT NOT NULL,
  tag_id INT NULL,
  FOREIGN KEY (library_id) REFERENCES libraries(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE users_libraries(
  user_id INT NOT NULL,
  library_id INT NULL,
  purchaseDate TIMESTAMP NOT NULL,
  FOREIGN KEY (library_id) REFERENCES libraries(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE receipts(
  purchase_id INT NOT NULL,
  tags VARCHAR(255),
  purchaseDate TIMESTAMP NOT NULL,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES users_libraries(id)
);

CREATE TABLE approvement(
  library_id INT NOT NULL,
  date TIMESTAMP NOT NULL,
  commentary TEXT NOT NULL DEFAULT '',
  isAccepted BOOLEAN NOT NULL,
  FOREIGN KEY (library_id) REFERENCES libraries(id)
);