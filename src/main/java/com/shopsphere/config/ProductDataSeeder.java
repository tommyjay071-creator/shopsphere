package com.shopsphere.config;

import com.shopsphere.entity.Product;
import com.shopsphere.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ProductDataSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {

            List<ProductData> products = List.of(

                // =========================
                // ELECTRONICS
                // =========================

                new ProductData(
                    "iPhone 16 Pro",
                    "Apple iPhone 16 Pro with a titanium design, advanced camera system and powerful A18 Pro chip.",
                    1850000.0,
                    "Electronics",
                    15,
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Samsung Galaxy S25 Ultra",
                    "Premium Samsung smartphone featuring a high-resolution display, advanced cameras and flagship performance.",
                    1650000.0,
                    "Electronics",
                    18,
                    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Google Pixel 9",
                    "Google Pixel smartphone with intelligent photography features, clean Android software and powerful performance.",
                    1050000.0,
                    "Electronics",
                    12,
                   "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "MacBook Air M3",
                    "Slim Apple laptop powered by the M3 chip with excellent battery life and a sharp Retina display.",
                    2100000.0,
                    "Electronics",
                    8,
                    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "HP Pavilion 15",
                    "Versatile HP laptop suitable for school, productivity, entertainment and everyday computing.",
                    950000.0,
                    "Electronics",
                    10,
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Lenovo IdeaPad Slim 5",
                    "Slim and reliable laptop designed for productivity, studying and everyday multitasking.",
                    875000.0,
                    "Electronics",
                    9,
                   "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "iPad Air",
                    "Lightweight Apple tablet with a powerful processor, vivid display and excellent portability.",
                    1150000.0,
                    "Electronics",
                    14,
                    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Samsung 55-inch 4K Smart TV",
                    "Large 4K smart television with vivid picture quality and built-in streaming features.",
                    920000.0,
                    "Electronics",
                    7,
                   "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Sony WH-1000XM5",
                    "Premium wireless headphones with active noise cancellation and immersive sound.",
                    620000.0,
                    "Electronics",
                    20,
                  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "JBL Tune 770NC",
                    "Wireless noise-cancelling headphones with powerful JBL sound and long battery life.",
                    145000.0,
                    "Electronics",
                    25,
                   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // FASHION
                // =========================

                new ProductData(
                    "Nike Air Max 270",
                    "Comfortable Nike sneakers with a distinctive Air cushioning unit and modern everyday design.",
                    185000.0,
                    "Fashion",
                    22,
                   "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Adidas Ultraboost",
                    "Performance running shoes combining responsive cushioning with a lightweight design.",
                    210000.0,
                    "Fashion",
                    18,
                   "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "New Balance 550",
                    "Classic low-top sneakers inspired by vintage basketball styling.",
                    175000.0,
                    "Fashion",
                    16,
                    "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Classic Oversized Hoodie",
                    "Premium heavyweight hoodie with a relaxed oversized fit for everyday wear.",
                    65000.0,
                    "Fashion",
                    35,
                   "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Premium Cotton T-Shirt",
                    "Soft premium cotton T-shirt designed for comfortable everyday styling.",
                    28000.0,
                    "Fashion",
                    50,
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Straight-Leg Jeans",
                    "Classic straight-leg denim jeans with a versatile everyday fit.",
                    55000.0,
                    "Fashion",
                    30,
                   "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Cargo Pants",
                    "Modern cargo trousers featuring multiple utility pockets and a relaxed fit.",
                    48000.0,
                    "Fashion",
                    28,
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
    "Leather Backpack",
    "Stylish everyday backpack made for work, school and travel.",
    85000.0,
    "Fashion",
    20,
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80&auto=format&fit=crop"
),

                new ProductData(
                    "Classic Chronograph Watch",
                    "Elegant wristwatch featuring a classic chronograph-inspired design.",
                    125000.0,
                    "Fashion",
                    15,
                    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Minimalist Wristwatch",
                    "Clean minimalist watch designed to complement both casual and formal outfits.",
                    75000.0,
                    "Fashion",
                    24,
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // HOME & LIVING
                // =========================

                new ProductData(
                    "Modern Office Chair",
                    "Ergonomic office chair designed for comfortable long working and studying sessions.",
                    185000.0,
                    "Home & Living",
                    12,
                    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Modern Study Desk",
                    "Clean and practical study desk suitable for bedrooms, offices and workspaces.",
                    135000.0,
                    "Home & Living",
                    10,
                   "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "LED Desk Lamp",
                    "Adjustable LED desk lamp providing focused lighting for studying and working.",
                    35000.0,
                    "Home & Living",
                    30,
                    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                "Digital Air Fryer",
                "Modern air fryer designed for quick and convenient cooking with less oil.",
                95000.0,
                "Home & Living",
                 18,
                "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=700&q=80&auto=format&fit=crop"
),

new ProductData(
    "Electric Kettle",
    "Fast-boiling electric kettle with a simple modern design.",
    42000.0,
    "Home & Living",
    25,
    "https://images.unsplash.com/photo-1607791776974-5c30b43ac181?w=700&q=80&auto=format&fit=crop"
),

new ProductData(
    "Professional Blender",
    "Powerful countertop blender suitable for smoothies, sauces and everyday food preparation.",
    78000.0,
    "Home & Living",
    16,
    "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=700&q=80&auto=format&fit=crop"
),

                new ProductData(
                    "Bedside Table",
                    "Compact modern bedside table with storage for bedrooms and apartments.",
                    65000.0,
                    "Home & Living",
                    14,
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Premium Bedsheet Set",
                    "Soft premium bedsheet set designed for comfortable and stylish bedrooms.",
                    55000.0,
                    "Home & Living",
                    25,
                   "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // GROCERIES
                // =========================

                new ProductData(
                    "Golden Morn",
                    "Popular Nigerian breakfast cereal made from whole grain maize.",
                    6500.0,
                    "Groceries",
                    50,
                    "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Indomie Instant Noodles",
                    "Convenient instant noodles perfect for quick and easy meals.",
                    8500.0,
                    "Groceries",
                    60,
                   "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Peak Full Cream Milk",
                    "Creamy full cream milk suitable for breakfast, beverages and cooking.",
                    7800.0,
                    "Groceries",
                    45,
                    "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Coca-Cola Soft Drink",
                    "Classic refreshing carbonated soft drink.",
                    2500.0,
                    "Groceries",
                    80,
                   "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=700&q=80&auto=format&fit=crop"

                ),

                new ProductData(
                    "Pepsi Soft Drink",
                    "Refreshing carbonated cola drink for meals and occasions.",
                    2500.0,
                    "Groceries",
                    75,
                    "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=700&q=80&auto=format&fit=crop"

                ),

                new ProductData(
                    "Milo Chocolate Drink",
                    "Chocolate malt beverage powder ideal for breakfast and everyday drinks.",
                    8500.0,
                    "Groceries",
                    45,
                   "https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Pure Natural Honey",
                    "Natural honey suitable for breakfast, beverages and cooking.",
                    12000.0,
                    "Groceries",
                    30,
                    "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=700&q=80&auto=format&fit=crop"

                ),

                new ProductData(
                    "Premium Basmati Rice",
                    "Long-grain aromatic basmati rice suitable for a variety of meals.",
                    32000.0,
                    "Groceries",
                    35,
                   "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // GAMING
                // =========================

                new ProductData(
                    "PlayStation 5",
                    "Sony's current-generation gaming console delivering high-performance gaming and fast loading.",
                    950000.0,
                    "Gaming",
                    8,
                    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Xbox Series X",
                    "Powerful Xbox console designed for high-resolution and high-performance gaming.",
                    850000.0,
                    "Gaming",
                    7,
                    "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Nintendo Switch",
                    "Versatile hybrid gaming console that can be played handheld or connected to a TV.",
                    520000.0,
                    "Gaming",
                    10,
                   "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "DualSense Wireless Controller",
                    "Wireless PlayStation controller featuring adaptive triggers and haptic feedback.",
                    145000.0,
                    "Gaming",
                    20,
                    "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Xbox Wireless Controller",
                    "Comfortable wireless controller designed for Xbox and compatible devices.",
                    115000.0,
                    "Gaming",
                    18,
                    "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Gaming Headset",
                    "Immersive gaming headset with a built-in microphone and comfortable ear cushions.",
                    85000.0,
                    "Gaming",
                    25,
                   "https://images.unsplash.com/photo-1599669454699-248893623440?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Mechanical Gaming Keyboard",
                    "Responsive mechanical keyboard designed for gaming and fast-paced typing.",
                    95000.0,
                    "Gaming",
                    22,
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // BEAUTY
                // =========================

                new ProductData(
                    "Gentle Facial Cleanser",
                    "Daily facial cleanser designed to gently remove dirt and excess oil.",
                    18500.0,
                    "Beauty",
                    35,
                    "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Hydrating Moisturizer",
                    "Lightweight moisturizer designed to keep skin feeling soft and hydrated.",
                    22000.0,
                    "Beauty",
                    30,
                    "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Body Lotion",
                    "Moisturizing body lotion designed for everyday skincare.",
                    14500.0,
                    "Beauty",
                    40,
                   "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Nourishing Shampoo",
                    "Everyday shampoo designed to gently cleanse and care for hair.",
                    12500.0,
                    "Beauty",
                    38,
                   "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Hair Conditioner",
                    "Conditioning treatment designed to leave hair feeling soft and manageable.",
                    13500.0,
                    "Beauty",
                    32,
                    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Professional Hair Clipper",
                    "Rechargeable electric hair clipper suitable for personal grooming.",
                    48000.0,
                    "Beauty",
                    20,
                    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // KIDS
                // =========================

                new ProductData(
                    "LEGO Building Set",
                    "Creative construction building set designed to encourage imagination and problem-solving.",
                    65000.0,
                    "Kids",
                    20,
                    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Remote Control Car",
                    "Fun remote-controlled toy car designed for indoor and outdoor play.",
                    42000.0,
                    "Kids",
                    18,
                   "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=700&q=80&auto=format&fit=crop"

                ),

                new ProductData(
                    "Educational Puzzle",
                    "Colorful educational puzzle designed to encourage logical thinking and problem-solving.",
                    18000.0,
                    "Kids",
                    30,
                    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
    "Kids School Backpack",
    "Lightweight children's backpack designed for school books and everyday essentials.",
    28000.0,
    "Kids",
    25,
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=700&q=80&auto=format&fit=crop"
),

                new ProductData(
                    "Children's Drawing Set",
                    "Creative drawing and coloring set designed for young artists.",
                    22000.0,
                    "Kids",
                    35,
                   "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "Family Board Game",
                    "Fun family board game designed for group entertainment and strategic thinking.",
                    35000.0,
                    "Kids",
                    20,
                   "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=700&q=80&auto=format&fit=crop"
                ),

                // =========================
                // BOOKS
                // =========================

                new ProductData(
                    "Clean Code",
                    "A practical guide to writing readable, maintainable and professional software.",
                    32000.0,
                    "Books",
                    20,
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "The Psychology of Money",
                    "A thoughtful exploration of how people think about money, wealth and financial decisions.",
                    18000.0,
                    "Books",
                    25,
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700&q=80&auto=format&fit=crop"

                ),

                new ProductData(
                    "Atomic Habits",
                    "A practical guide to building better habits and making meaningful improvements.",
                    16500.0,
                    "Books",
                    30,
                    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=700&q=80&auto=format&fit=crop"
                ),

                new ProductData(
                    "The Hobbit",
                    "Classic fantasy adventure following Bilbo Baggins on an extraordinary journey.",
                    15000.0,
                    "Books",
                    18,
                   "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&q=80&auto=format&fit=crop"
                ),

               new ProductData(
    "1984",
    "Classic dystopian novel exploring surveillance, power and individual freedom.",
    12000.0,
    "Books",
    22,
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=700&q=80&auto=format&fit=crop"
),

                new ProductData(
                    "The Alchemist",
                    "Inspirational novel about following dreams, discovering purpose and finding meaning.",
                    13000.0,
                    "Books",
                    24,
                    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=700&q=80&auto=format&fit=crop"
                )
            );

           for (ProductData data : products) {

    Product product = productRepository
        .findByNameIgnoreCase(data.name())
        .orElseGet(Product::new);

    product.setName(data.name());
    product.setDescription(data.description());
    product.setPrice(data.price());
    product.setCategory(data.category());
    product.setStock(data.stock());
    product.setImageUrl(data.imageUrl());

    productRepository.save(product);
}
        };
    }

    private record ProductData(
        String name,
        String description,
        Double price,
        String category,
        Integer stock,
        String imageUrl
    ) {}
}