require('dotenv').config();
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'luxewood-dev-secret';
const DATABASE_URL = process.env.DATABASE_URL;
const PGHOST = process.env.PGHOST;
const PGUSER = process.env.PGUSER;
const PGPASSWORD = process.env.PGPASSWORD;
const PGDATABASE = process.env.PGDATABASE;
const PGPORT = process.env.PGPORT;

const dbConfig = {};
if (DATABASE_URL) {
  dbConfig.connectionString = DATABASE_URL;
} else if (PGHOST || PGUSER || PGPASSWORD || PGDATABASE || PGPORT) {
  if (PGHOST) dbConfig.host = PGHOST;
  if (PGUSER) dbConfig.user = PGUSER;
  if (PGPASSWORD) dbConfig.password = PGPASSWORD;
  if (PGDATABASE) dbConfig.database = PGDATABASE;
  if (PGPORT) dbConfig.port = Number(PGPORT);
} else {
  console.error('Missing PostgreSQL configuration. Set DATABASE_URL or PGHOST/PGUSER/PGPASSWORD/PGDATABASE/PGPORT.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  dbConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(dbConfig);
const app = express();

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    title: 'Sofi Modular Sofa',
    category: 'дивани',
    price: 18500,
    description: 'Comfortable modular sofa for the whole family with soft cushions and elegant design.',
    image: '/images/sofi_sofa.webp',
    rating_rate: 4.9,
    rating_count: 82,
    inventory: 8,
  },
  {
    id: 2,
    title: 'Verdi Dining Table',
    category: 'столи',
    price: 10400,
    description: 'Solid oak dining table that fits any family dinner and modern interior.',
    image: '/images/verdi_table.webp',
    rating_rate: 4.7,
    rating_count: 47,
    inventory: 5,
  },
  {
    id: 3,
    title: 'Nora Lounge Chair',
    category: 'крісла',
    price: 6800,
    description: 'Ergonomic chair with soft upholstery, perfect for reading and relaxing.',
    image: '/images/nora_chair.jpg',
    rating_rate: 4.5,
    rating_count: 33,
    inventory: 12,
  },
  {
    id: 4,
    title: 'Milan Sliding Wardrobe',
    category: 'шафи',
    price: 15200,
    description: 'Modern sliding wardrobe with elegant finish and spacious interior.',
    image: '/images/milan_wardrobe.webp',
    rating_rate: 4.8,
    rating_count: 27,
    inventory: 4,
  },
  {
    id: 5,
    title: 'Loft Double Bed',
    category: 'спальня',
    price: 11900,
    description: 'Stylish double bed with a sturdy frame and upholstered headboard.',
    image: '/images/loft_double_bed.avif',
    rating_rate: 4.6,
    rating_count: 51,
    inventory: 6,
  },
  {
    id: 6,
    title: 'Scandi Nightstand',
    category: 'шафи',
    price: 4200,
    description: 'Minimalist nightstand with clean lines for a cozy bedroom or hall.',
    image: '/images/scandi_nightstand.jpg',
    rating_rate: 4.4,
    rating_count: 22,
    inventory: 11,
  },
  {
    id: 7,
    title: 'Art Kitchen Chair',
    category: 'крісла',
    price: 3100,
    description: 'Light and stylish chair designed for kitchen or workspace use.',
    image: '/images/art_chair.jpg',
    rating_rate: 4.2,
    rating_count: 38,
    inventory: 15,
  },
  {
    id: 8,
    title: 'Rome Wall Shelf',
    category: 'стелажі',
    price: 5200,
    description: 'Modular shelf system for living room or workspace with easy assembly.',
    image: '/images/rome_shelf.jpg',
    rating_rate: 4.3,
    rating_count: 18,
    inventory: 9,
  },
  {
    id: 9,
    title: 'Breeze Coffee Table',
    category: 'столи',
    price: 3900,
    description: 'Elegant coffee table with metal legs and wooden tabletop.',
    image: '/images/breeze_table.avif',
    rating_rate: 4.5,
    rating_count: 29,
    inventory: 13,
  },
  {
    id: 10,
    title: 'Strand Writing Desk',
    category: 'столи',
    price: 7300,
    description: 'Smart desk for home office with storage and clean design.',
    image: '/images/strand_writing_desk.jpg',
    rating_rate: 4.6,
    rating_count: 44,
    inventory: 7,
  }
];

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      image_url TEXT,
      inventory INTEGER NOT NULL DEFAULT 0,
      rating_rate NUMERIC(3,2) NOT NULL DEFAULT 0,
      rating_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total_price INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      qty INTEGER NOT NULL CHECK (qty > 0),
      unit_price INTEGER NOT NULL,
      total_price INTEGER NOT NULL GENERATED ALWAYS AS (qty * unit_price) STORED
    )
  `);

  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM products');
  const categoryUpdates = {
    Sofas: 'дивани',
    Tables: 'столи',
    Chairs: 'крісла',
    Wardrobes: 'шафи',
    Beds: 'спальня',
    Nightstands: 'шафи',
    Shelves: 'стелажі',
    Desks: 'столи',
  };

  for (const [oldCategory, newCategory] of Object.entries(categoryUpdates)) {
    await pool.query('UPDATE products SET category = $1 WHERE category = $2', [newCategory, oldCategory]);
  }

  const existingProducts = await pool.query('SELECT id FROM products');
  if (existingProducts.rows.length > 0) {
    const updateText = `UPDATE products SET title = $2, category = $3, price = $4, description = $5, image_url = $6, inventory = $7, rating_rate = $8, rating_count = $9 WHERE id = $1`;
    for (const product of products) {
      await pool.query(updateText, [
        product.id,
        product.title,
        product.category,
        product.price,
        product.description,
        product.image,
        product.inventory,
        product.rating_rate,
        product.rating_count,
      ]);
    }
  }

  if (Number(rows[0].count) === 0) {
    const insertText = `INSERT INTO products (id, title, category, price, description, image_url, rating_rate, rating_count, inventory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    for (const product of products) {
      await pool.query(insertText, [
        product.id,
        product.title,
        product.category,
        product.price,
        product.description,
        product.image,
        product.rating_rate,
        product.rating_count,
        product.inventory,
      ]);
    }
    await pool.query(`SELECT setval(pg_get_serial_sequence('products','id'), (SELECT MAX(id) FROM products))`);
    console.log('Database seeded with products');
  }
}

function authorize(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  const token = auth.slice(7);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = payload.id;
    next();
  });
}

async function getUserWithOrders(id) {
  const userResult = await pool.query('SELECT id, name, email, avatar, joined_at FROM users WHERE id = $1', [id]);
  if (!userResult.rows.length) return null;
  const user = userResult.rows[0];

  const orderRows = await pool.query(`
    SELECT o.id, o.total_price, o.created_at,
      json_agg(json_build_object('productId', oi.product_id, 'qty', oi.qty, 'unitPrice', oi.unit_price)) AS items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [id]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinedAt: user.joined_at,
    orders: orderRows.rows.map((order) => ({
      id: order.id,
      totalPrice: order.total_price,
      createdAt: order.created_at,
      items: order.items || [],
    })),
  };
}

app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(rows.map((row) => ({
      ...row,
      image: row.image_url,
      rating: { rate: Number(row.rating_rate), count: row.rating_count },
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json({
      ...row,
      image: row.image_url,
      rating: { rate: Number(row.rating_rate), count: row.rating_count },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load product' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, avatar) VALUES ($1, $2, $3, $4) RETURNING id, name, email, avatar, joined_at',
      [name, email, hashed, avatar]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const fullUser = await getUserWithOrders(user.id);
    res.json({ user: fullUser, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const fullUser = await getUserWithOrders(user.id);
    res.json({ user: fullUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/users/me', authorize, async (req, res) => {
  try {
    const user = await getUserWithOrders(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', authorize, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'The cart is empty' });
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING id, created_at',
      [req.userId, totalPrice]
    );
    const orderId = orderResult.rows[0].id;
    const createdAt = orderResult.rows[0].created_at;

    const insertText = 'INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES ($1, $2, $3, $4)';
    for (const item of items) {
      await pool.query(insertText, [orderId, item.id, item.qty, item.price]);
    }

    res.json({ orderId, totalPrice, createdAt });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, async () => {
  try {
    await initializeDatabase();
    console.log(`API server listening on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Database initialization failed', err);
    process.exit(1);
  }
});