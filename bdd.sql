CREATE TABLE IF NOT EXISTS account(
  id INT NOT NULL,
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
  kbis VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS prices(
  id INT NOT NULL,
  minNumberPurchased INT NOT NULL,
  price INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS credits(
  id INT NOT NULL,
  purchaseDate DATETIME NOT NULL,
  validity INT NOT NULL DEFAULT 63115200,
  price INT NOT NULL,
  account_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (account_id) REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS discounts(
  id INT NOT NULL,
  acquisitionDate DATETIME NOT NULL,
  validity INT NOT NULL DEFAULT 63115200,
  percentage INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS libraries(
  id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type ENUM('Scene','Character','Item','Image_and_police'),
  price INT NOT NULL,
  state ENUM('accepted','validating','rejected'),
  releaseDate DATETIME NOT NULL,
  salesNumber INT NOT NULL,
  encouragementsNumber INT NOT NULL,
  owner_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (owner_id) REFERENCES contributors(id)
);

CREATE TABLE IF NOT EXISTS tags(
  id INT NOT NULL,
  name VARCHAR(255),
  isActive BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS libraries_tags(
  library_id INT NOT NULL,
  tag_id INT NULL,
  FOREIGN KEY (library_id) REFERENCES libraries(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS users_libraries(
  user_id INT NOT NULL,
  library_id INT NULL,
  purchaseDate DATETIME NOT NULL,
  FOREIGN KEY (library_id) REFERENCES libraries(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS receipts(
  purchase_id INT NOT NULL,
  tags VARCHAR(255),
  purchaseDate DATETIME NOT NULL,
  name VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES users_libraries(id)
);

CREATE TABLE IF NOT EXISTS approvement(
  library_id INT NOT NULL,
  date DATETIME NOT NULL,
  commentary TEXT NOT NULL DEFAULT '',
  isAccepted BOOLEAN NOT NULL,
  FOREIGN KEY (library_id) REFERENCES libraries(id)
);