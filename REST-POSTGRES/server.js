const express = require("express");
const postgres = require("postgres");
const z = require("zod");

const app = express();
const port = 8000;
const sql = postgres({ db: "mydb", user: "user", password: "password" });

app.use(express.json());

// Schemas
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  about: z.string(),
  price: z.number().positive(),
});
const CreateProductSchema = ProductSchema.omit({ id: true });

app.post("/products", async (req, res) => {
  const result = await CreateProductSchema.safeParse(req.body);

  // If Zod parsed successfully the request body
  if (result.success) {
    const { name, about, price } = result.data;

    const product = await sql`
    INSERT INTO products (name, about, price)
    VALUES (${name}, ${about}, ${price})
    RETURNING *
    `;

    res.send(product[0]);
  } else {
    res.status(400).send(result);
  }
});

app.get("/products", async (req, res) => {
  const products = await sql`
    SELECT * FROM products
    `;

  res.send(products);
});

app.get("/products/:id", async (req, res) => {
  const product = await sql`
    SELECT * FROM products WHERE id=${req.params.id}
    `;

  if (product.length > 0) {
    res.send(product[0]);
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const product = await sql`
    DELETE FROM products
    WHERE id=${req.params.id}
    RETURNING *
    `;

  if (product.length > 0) {
    res.send(product[0]);
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/orders", async (req, res) => {
  const { productId } = req.body;

  const order = await sql`
      INSERT INTO orders (productId)
      VALUES (${productId})
      RETURNING *
      `;

  res.send(order[0]);
});

app.get("/orders/:id", async (req, res) => {
  console.log(req.params.id);
  const order = await sql`
    SELECT orders.id, orders.productid, products.name as product_name
    FROM orders
    LEFT JOIN products ON products.id = orders.productid
    WHERE orders.id=${req.params.id}
    `;

  console.log(order);
  if (order.length > 0) {
    res.send(order[0]);
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

import("node-fetch").then((nodeFetch) => {
  console.log("Node : ", nodeFetch);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
