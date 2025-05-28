INSERT INTO products (name, description, price, image_url, inventory) 
VALUES ('Converse Chuck Taylor All Star II Hi', 'Classic high-top sneaker with modern comfort', 75.00, 'https://example.com/converse.jpg', 50);

INSERT INTO variants (product_id, name, value) 
VALUES 
(1, 'color', 'Black'),
(1, 'color', 'White'),
(1, 'color', 'Red'),
(1, 'size', '7'),
(1, 'size', '8'),
(1, 'size', '9'),
(1, 'size', '10');