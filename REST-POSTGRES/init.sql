CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  about VARCHAR(500),
  price FLOAT,
  categories INT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  productId INT REFERENCES products(id)
);

INSERT INTO products (name, about, price) VALUES
  ('My first game', 'This is an awesome game', '60')