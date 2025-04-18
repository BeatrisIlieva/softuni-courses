CREATE TABLE item_type (
	id SERIAL PRIMARY KEY,
	item_type_name varchar(50)
);

CREATE TABLE items(
	id SERIAL PRIMARY KEY,
	item_name VARCHAR(50),
	item_type_id INT,
	
	CONSTRAINT fk_items_item_type
	FOREIGN KEY (item_type_id)
	REFERENCES item_type(id)
);

CREATE TABLE cities (
	id SERIAL PRIMARY KEY,
	city_name VARCHAR(50)
);

CREATE TABLE customers (
	id SERIAL PRIMARY KEY,
	customer_name VARCHAR(50),
	birthday DATE,
	city_id INT,
	
	CONSTRAINT fk_customers_cities
	FOREIGN KEY (city_id)
	REFERENCES cities(id)
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	customer_id INT,
	
	CONSTRAINT fk_orders_customers
	FOREIGN KEY (customer_id)
	REFERENCES customers(id)
);

CREATE TABLE order_items(
	order_id INT,
	item_id INT,
	
	CONSTRAINT pk_order_items
	PRIMARY KEY (order_id, item_id),
	
	CONSTRAINT fk_order_items_orders
	FOREIGN KEY (order_id)
	REFERENCES orders(id),
	
	CONSTRAINT fk_order_items_items
	FOREIGN KEY (item_id)
	REFERENCES items(id)
);















