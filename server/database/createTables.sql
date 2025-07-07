-- CREATE TABLE IF NOT EXISTS users (
-- 	userId INT(5) AUTO_INCREMENT PRIMARY KEY,
--     fname VARCHAR(30) NOT NULL,
-- 	lname VARCHAR(30) NOT NULL,
-- 	email VARCHAR(50),
--     password VARCHAR(200),
--     isAdmin BOOL,
--     createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS product (
-- 	productId INT(5) AUTO_INCREMENT PRIMARY KEY,
--     `name` VARCHAR(30) NOT NULL,
--     description TINYTEXT,
--     price DECIMAL(10,2),
--     imageURL VARCHAR(255),
--     category VARCHAR(100) NOT NULL,
--     createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS premium_products (
    productId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    description TEXT,
    imageURL TEXT,
    category VARCHAR(255),
    subscription_type VARCHAR(255),
    quantity INT DEFAULT 1  -- Added quantity column here
);

-- CREATE TABLE IF NOT EXISTS premium_products (
--     productId INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255),
--     price DECIMAL(10, 2),
--     description TEXT,
--     imageURL TEXT,
--     category VARCHAR(255),
--     subscription_type VARCHAR(255),
--     quantity INT DEFAULT 1  -- Added quantity column here
-- );

-- CREATE TABLE IF NOT EXISTS shoppingCart (
-- 	userId INT(5),
--     productId INT(5),
--     quantity INT,
--     PRIMARY KEY (userId, productId) 
-- );

-- CREATE TABLE IF NOT EXISTS orders (
-- 	orderId INT(10) AUTO_INCREMENT PRIMARY KEY,
--     userId INT(5),
--     address VARCHAR(500),
--     totalPrice DECIMAL(10,2),
--     createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE IF NOT EXISTS premiumOrders (
-- 	orderId INT(10) AUTO_INCREMENT PRIMARY KEY,
--     userId INT(5) NOT NULL,
--     address VARCHAR(500) NOT NULL,
--     totalPrice DECIMAL(10,2),
--     subscriptionId INT NOT NULL,
--     createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


-- CREATE TABLE IF NOT EXISTS productsInOrder (
-- 	orderId INT(5),
--     productId INT(5),
--     quantity INT,
--     totalPrice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--     PRIMARY KEY (orderId, productId) 
-- );



-- CREATE TABLE IF NOT EXISTS subscriptions (
--     id INT AUTO_INCREMENT PRIMARY KEY,  -- Use AUTO_INCREMENT for MySQL
--     user_id INT NOT NULL REFERENCES users(userId),
--     plan_name VARCHAR(255) NOT NULL,
--     plan_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--     start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     end_date TIMESTAMP,
--     next_order_date TIMESTAMP,
--     discount DECIMAL(5, 2),
--     status VARCHAR(255) DEFAULT 'active',
--     delivery_address TEXT
-- );


-- CREATE TABLE IF NOT EXISTS premiumProductsInOrder (
-- 	orderId INT(5),
--     productId INT(5),
--     quantity INT,
--     totalPrice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--     PRIMARY KEY (orderId, productId) 
-- );


-- ALTER TABLE shoppingCart
-- ADD FOREIGN KEY (userId) REFERENCES users (userId),
-- ADD FOREIGN KEY (productId) REFERENCES product (productId);

-- ALTER TABLE orders
-- ADD FOREIGN KEY (userId) REFERENCES users (userId);

-- ALTER TABLE premiumOrders
-- ADD FOREIGN KEY (userId) REFERENCES users (userId),
-- ADD FOREIGN KEY (subscriptionId) REFERENCES subscriptions (id);

-- ALTER TABLE productsInOrder
-- ADD FOREIGN KEY (orderId) REFERENCES orders (orderId),
-- ADD FOREIGN KEY (productId) REFERENCES product (productId);

-- ALTER TABLE premiumProductsInOrder
-- ADD FOREIGN KEY (orderId) REFERENCES premiumOrders (orderId),
-- ADD FOREIGN KEY (productId) REFERENCES premium_products (productId);


-- INSERT INTO product (productId, name, description, price, imageURL, category, createdDate) VALUES
-- (1, 'Kids Shampoo', 'Special Shampoo for kids, 100% safe', 150.00, 'https://chosenstore.in/cdn/shop/products/Cetaphil_Baby_Shampoo_b3be1471-7afd-4053-a807-75ddcc8c4b50.png?v=1664434150', 'personal care', '2025-02-26 13:16:55'),
-- (2, 'Eco Air Freshner', 'Air freshner which is made of biodegradable materials', 200.00, 'https://infiniquemall.com/cdn/shop/files/Conc-air-freshener-50ml-x-2-_indian-summer.jpg?v=1692377427', 'cleaning supplies', '2025-02-26 13:23:08'),
-- (3, 'Kuber Cleaning Cloth', 'for Kitchen | Duster Towel for Home Cleaning | 350 GSM Cleaning Cloth Towel for Car | Bike | 30x60 | Pack of 3 | Multi', 260.00, 'https://www.kuberindustries.co.in/uploads/kuberindustries/products/kuber-industries-cleaning-towel--reusable-cleaning-cloths-for-kitchen--duster-towel-for-home-cleanin-4191880400776680_l.jpg', 'cleaning supplies', '2025-02-26 17:10:12'),
-- (4, 'UNIQUE Tissue Paper', 'kitchen tissue paper roll / kitchen paper roll washable & reusable (90 sheets)', 339.00, 'https://rukminim2.flixcart.com/image/850/1000/xif0q/cleaning-cloth/w/f/y/956-1-kitchen-roll-unique-original-imagu6ymgpjxp7bu.jpeg?q=90&crop=false', 'cleaning supplies', '2025-02-26 17:13:06'),
-- (5, 'Elinnee Cleaning Cloths', 'Elinnee Multi-use Reusable Thicker Cleaning Cloths Disposable Cleaning Towels Kitchen Towels Dish Cloths Heavy Duty Mutipurpose Handy Wipes 25 Count 14.2"X15.7" (Blue)', 4168.00, 'https://m.media-amazon.com/images/I/71Lkxzc5DTL.jpg', 'cleaning supplies', '2025-02-26 17:17:20'),
-- (6, 'Tru Earth Air Freshner', 'Traditional air fresheners often contain synthetic fragrances and harsh chemicals that can contribute to indoor air pollution and pose health risks.', 500.00, 'https://cdn.shopify.com/s/files/1/0669/1684/3771/files/Air-Fresheners.jpg', 'cleaning supplies', '2025-02-26 17:23:17'),
-- (7, 'ZERODOR Care Air Freshner', 'Prevents the return of persistent malodors by removing the source. Removal of stains from fabrics with non-resoling cleaning capabilities. Eliminates lingering organic odor and bring nature?s secret indoors for a fresher, cleaner environment', 239.00, 'https://econaur.com/wp-content/uploads/2023/04/1-scaled.jpg', 'cleaning supplies', '2025-02-26 17:25:05'),
-- (8, 'Tru Earth Soap', 'Tru Earth Soap is 100% organic soap company: Tru Earth, Quantity: 1pc',  50.00, 'https://thumbs.dreamstime.com/b/organic-floral-soap-natural-skincare-soaps-flowers-extract-98107806.jpg', 'personal care', '2025-02-26 17:31:19'),
-- (9, 'Khadi Orange Soap', 'Khadi Organique Orange Soap acts as a powerful antioxidant to keep away many infection-causing microbes. Due to its natural bleaching agent, it brightens dark blotches on the skin and reduces sun tan by preventing UV ray damage',   80.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQmxV8Tk6lQRpTonNDbcSbQL4cFyxhADGpyJKigx7axTICSkYvQh2bq2LIsYwEI_2an86xtE7BFq4QYSi5-599V8rL4HpR-tkGCe8Jl5VdHo_XaWnUCW2Fl0g', 'personal care', '2025-02-26 17:33:07'),
-- (10, 'Khadi Lemon Soap', 'Khadi Organique Lemon Soap acts as a powerful antioxidant to keep away many infection-causing microbes. Due to its natural bleaching agent, it brightens dark blotches on the skin and reduces sun tan by preventing UV ray damage',   80.00, 'https://images-static.nykaa.com/media/catalog/product/3/8/38f5e788906094120148_1.jpg', 'personal care', '2025-02-26 17:36:42'),
-- (11, 'DevgaShea Saffron Bar', 'Treat your skin to a luxurious experience. Our Shea Saffron Bath Bar is formulated with the perfect blend of saffron and shea butter to nourish and protect your skin, leaving it looking healthy and radiant.',   370.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTN73zWy4XrWFrcyioNlcNGGiC8ZrvJBNOoynnTHhYpHrZgy6HBejO-ynYVOpRuCcN0-oY3O8qx2DqP13QexpAQR_foPfiE6D-3UxO5yE47vU1jKkLHpVvhlQ', 'personal care', '2025-02-26 17:36:42'),
-- (12, 'GreenGram Organic Soap', 'Green gram makes your skin bright and with prevents acne and blackheads. It good for dry skin to get a glowing, flawless complexion. Green gram rejuvenates the skin by nourishing and exfoliating.',   34.00, 'https://originsoap.com/wp-content/uploads/2023/03/Green-Gram-2-min.jpg', 'personal care', '2025-02-26 17:38:06'),
-- (13, 'Ecologie Food Wraps', 'A beeswax wrap is a reusable, compostable alternative to plastic wrap. It offers a convenient, zero-waste option for food storage that can eliminate single-use plastic products from your pantry',   100.00, 'https://ecologieliving.com/cdn/shop/files/5174009_Set_3_BWax_Wrap_Citrus_am1_large.jpg?v=1643068279', 'kitchen essentials', '2025-02-26 17:50:49'),
-- (14, 'Buzzee Food Wrap', 'Buzzee Wraps are an all natural alternative to plastic wraps and bags.Like most families, sandwiches are a staple for us. We realized we were wasting a ton of plastic by individually wrapping or bagging the sandwiches we took on roadtrips, picnics, etc.',   80.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX6U65rAOX51xedwPOI3A5ymRkKIM8fDIVfQ&s', 'kitchen essentials', '2025-02-26 17:54:13'),
-- (15, 'Arth Compostable Bags', 'ARTH Bags are made of 100% Natural material which consists of PLA ( Polylactic Acid ) which is derived from corn starch and other bio based natural material.',   300.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwMdvg9y2Iax-kCYMC6uFD_gUOv3D-knk4a6LLdHbFmmR6O25XRRyf_pXMJ2YFpWiMObA&usqp=CAU', 'kitchen essentials', '2025-02-26 17:56:42'),
-- (16, 'GLAD compostable Bags', ' Compostable Fresh Lemon Scent bags keep your compost bin clean and your kitchen smelling fresh. OdourShield technology continuously neutralizes food odours and keeps your home smelling fresh with a
--  pleasant lemon scent', 1000.00, 'https://www.glad.ca/wp-content/uploads/sites/4/2020/12/Compost_10L_20.png', 'kitchen essentials', '2025-02-26 17:59:08'),
-- (17, 'GLAD Small Comp. Bag', 'Compostable Fresh Lemon Scent bags keep your compost bin clean and your kitchen smelling fresh. OdourShield technology continuously neutralizes food odours and keeps your home smelling fresh with a pleasant lemon scent',   500.00, 'https://i.ebayimg.com/images/g/rvIAAOSwX~xgyhRv/s-l400.jpg', 'kitchen essentials', '2025-02-26 18:00:20'),
-- (18, 'Rusabl Straws', 'REUSABLE METAL STRAWS: Our metal straws offer an eco-friendly alternative to plastic straws. A pack of 4 comes with two bent and two straight straws along with a cleaning brush use, clean, and repeat as many times as you want.',   189.00, 'https://m.media-amazon.com/images/I/61UvQUCm7wL.jpg', 'kitchen essentials', '2025-02-26 18:02:27'),
-- (19, 'Thenga CoconutShell Candle', 'Soy wax candles infused with a delightful rose fragrance. Handcrafted from upcycled coconut shells, each candle is filled with 100 grams of premium soy wax, ensuring a clean and even burn', 499.00, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTLBDXUuy2sk5UcKfpVnhEKcUC1C6denC7WE1SN1OnZQNCp72bxq-fY2Kv33Y0t_YHz6eGxmmBnU4GzFLq0Y5VhbhGq8kg2zJgI8PBrw2IT&usqp=CAc', 'wellness', '2025-02-26 18:46:26'),
-- (20, 'IRIS Lemon Grass Candles', 'Perfect for cozy evenings, special occasions, or everyday moments of self-care, these candles create a warm ambiance and fill your home with a delightful aroma.', 280.00, 'https://theecologist.org/sites/default/files/NG_media/278562.jpg', 'wellness', '2025-02-26 18:49:22'),
-- (21, 'Skynix Wax Candles', 'Skynix Bulk Scented Candles are the perfect addition to any occasion, creating a warm and inviting ambiance that lights up any environment.', 295.00, 'https://m.media-amazon.com/images/I/714iX9wW3PL._AC_UF1000,1000_QL80_.jpg', 'wellness', '2025-02-26 18:50:54'),
-- (22, 'Matcha Green Tea', 'Crafted from the most tender, premium first-harvest leaves, our matcha?s balanced flavors make it an ideal choice for newcomers to matcha or those seeking an affordable option without compromising on quality.', 449.00, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSN7AbHaQQ-GK1KyzGdj5hncnjUut1983-lBnSsAsY43XVyy-MxxcObgKwdd1XHB69kuo_vok3eamaNhZ8Hq5R4hIrlP4C7ErOiWIG930H02jvfRCVv7qJtP85p9pll__wJstPMjWs&usqp=CAc', 'wellness', '2025-02-26 18:53:58'),
-- (23, 'Blue DeStress Tea', 'Blue Destress Tea is your natural solution for relaxation, helping you recharge and find calm in every cup. A 100% natural blend of 7+ soothing herbs, specially crafted to calm your mind and promote deep relaxation.', 599.00, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSYZPIXD1JBpdKlrHN1xIjw2HFMo0hmopJEimkwJcMfmY0h_JekapnL6HMxikACpGnyPan7sH7f7ah2mWhK2Szm7O3vWCWWRMt4q3hGJhk4G3fXHp-0gHtm2e4Yl2Dr-GsXQo0oSA&usqp=CAc', 'wellness', '2025-02-26 18:55:43'),
-- (24, 'Honey Oat Soap', 'Our Honey Oat soap cleanses delicately, ensuring a soothing and irritation-free experience. Experience an indulgent, care-free bathing experience with this one!', 445.00, 'https://purplesage.in/cdn/shop/files/CopyofHoneySoap.jpg?v=1684404778&width=540', 'wellness', '2025-02-26 18:57:21'),
-- (25, 'bioQ Eco Friendly Kit', 'Suitable for gifting, for events, or for anyone who wants to move a step forward in creating a positive impact for mother earth. Stationery with seeds and 2 planting kits to start planting', 765.00, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR_fLD_RPVyMX3z4e4EBQf-FRLBLlZ0cXHTbhfJOGjK7hYg_RCHJZbnkBYEnCzVo9Ir3uHNQlkBqZmSL3biemA52i3I7suoCseeCfUfjFuATxT_R1q8OJPbVQ', 'lifestyle', '2025-02-26 19:00:37'),
-- (26, 'Brown Living', 'This A5 plantable seed notebook has been created with hands using materials sourced locally and sustainably which is biodegradable too. The notebook cover is made from completely recycled paper and has seeds embedded in it.', 239.00, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTA704oaLaotO0vlS-8OZ2-l5GDNaZai3ZgzRBn2R0hdE1dCERHdbH4FS8Tj3ZraAg_bjSgkXJGUwO8HDUJeh92s9-mOjYzBJc1ov8r6hs', 'lifestyle', '2025-02-26 19:03:01'),
-- (27, 'Cork Diary', 'Your note-taking game ramps up with our premium cork notebooks, durability, and environmental consciousness. The natural beauty of cork & our eco-friendly pages will definitely inspire creativity within you and promote sustainable living.', 349.00, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQqIR33L5uYwKkaF6GicHT5b9aZtwbC8j3GPhWoHa67Z9hBxJnAt4PnEzj3xEJ08fmYyxNoaGmVGOZuszwqNhCxj0QDBCOtRMW5IJ1jHZAUtmq8YZjDY-qKEcty', 'lifestyle', '2025-02-26 19:04:54'),
-- (28, 'Kuber Shopping Bag', 'This compact and lightweight storage bag come with strong & sturdy handle perfect for taking to anywhere like supermarket, general shopping, department stores, farmers markets, picnics, camping, boating.', 308.00, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSV1EWfvH-P9Om3VQu8z6tTxJYvgL85-8sKMtYL2WwtxsEjz39yM-Gl4VA1oQP5OgfoELT9BXQGdv-_QIi7QUP8_DeRWb8SafdTh0yxWfqhFDaYMrsYMKH2snA', 'lifestyle', '2025-02-26 19:06:09');






-- premium products

-- INSERT INTO premium_products (name, price, description, imageURL, category, subscription_type, quantity)
-- VALUES 
-- ('Organic Cotton Towels', 300.00, 'Set of two luxurious organic cotton bath towels.', 'https://m.media-amazon.com/images/I/71Lkxzc5DTL.jpg', 'personal care', 'Deluxe Box', 2),  -- Example for Deluxe Box
-- ('Natural Hand Cream', 250.00, 'Hand cream infused with natural oils.', 'https://rukminim2.flixcart.com/image/850/1000/xif0q/moisturizer-cream/i/b/m/50-natural-vanilla-hand-cream-50g-for-dry-rough-hands-original-imah2uxeu5fbvryv.jpeg?q=90&crop=false', 'personal care', 'Family Box', 3), -- Example for Family Box
-- ('Bamboo Utensil Set', 700.00, 'Eco-friendly bamboo utensil set.', 'https://www.kroger.com/product/images/large/bottom/0074283938750', 'kitchen essentials', 'Deluxe Box', 1);
 
-- INSERT INTO premium_products (name, description, price, imageURL, category, subscription_type, quantity) VALUES
-- ('Eco-Friendly All-Purpose Cleaner', 'Plant-based cleaner for all surfaces.', 200.00, 'https://m.media-amazon.com/images/I/518PhE+YYnL.jpg', 'cleaning supplies', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Natural Disinfecting Spray', 'Kills germs naturally.', 400.00, 'https://m.media-amazon.com/images/I/5124xhPMRxL.jpg', 'cleaning supplies', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Concentrated Laundry Detergent', 'Eco-friendly concentrated laundry detergent.', 350.00, 'https://m.media-amazon.com/images/I/71r4Eb-Wl1L.jpg', 'cleaning supplies', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Biodegradable Cleaning Wipes', 'Cleans and disinfects with biodegradable wipes.', 150.00, 'https://m.media-amazon.com/images/I/51zSjxZTZvS.jpg', 'cleaning supplies', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2);


-- INSERT INTO premium_products (name, description, price, imageURL, category, subscription_type, quantity) VALUES
-- ('Aromatherapy Candle', 'Relax and unwind with calming scents.', 300.00, 'https://m.media-amazon.com/images/I/81MkDONQUYL.jpg', 'wellness', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Bath Salts', 'Soothe sore muscles with mineral-rich bath salts.', 100.00, 'https://images.pexels.com/photos/1298624/pexels-photo-1298624.jpeg?auto=compress&cs=tinysrgb&w=600', 'wellness', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Meditation Cushion', 'Comfortable cushion for meditation practice.', 800.00, 'https://m.media-amazon.com/images/I/71aBYKcaRvL._SL1500_.jpg', 'wellness', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Herbal Tea Sampler', 'Variety pack of calming herbal teas.', 700.00, 'https://m.media-amazon.com/images/I/81+7w3w9nJL.jpg', 'wellness', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2);

-- -- More Lifestyle (Premium)
-- INSERT INTO premium_products (name, description, price, imageURL, category, subscription_type, quantity) VALUES
-- ('Reusable Coffee Cup', 'Reduce waste with a stylish reusable cup.', 80.00, 'https://m.media-amazon.com/images/I/61eNUMzmNTL._AC_UF1000,1000_QL80_.jpg', 'lifestyle', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Shopping Bag', 'Large, reusable shopping bag.', 100.00, 'https://m.media-amazon.com/images/I/71LAwoSQKEL._AC_UY1100_.jpg', 'lifestyle', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Planner', 'Stay organized with a weekly planner.', 150.00, 'https://m.media-amazon.com/images/I/81ltiFm1TOL.jpg', 'lifestyle', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2),
-- ('Book Stand', 'Holds books for hands-free reading.', 1000.00, 'https://m.media-amazon.com/images/I/61ewEvPy2wL._AC_UF894,1000_QL80_.jpg', 'lifestyle', IF(RAND() > 0.5, 'Deluxe Box', 'Family Box'), FLOOR(RAND() * 2) + 2);