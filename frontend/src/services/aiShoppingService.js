
import { getProducts } from "./api";

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBudget(message) {
  const text = String(message).toLowerCase();

  const patterns = [
    /(?:under|below|less than|maximum|max|up to|within|budget(?:\s+is)?(?:\s+of)?)\s*(?:₦|ngn)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|million|m)?/i,
    /(?:₦|ngn)\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|million|m)?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (!match) continue;

    let amount = Number(match[1].replace(/,/g, ""));

    if (!Number.isFinite(amount) || amount <= 0) {
      continue;
    }

    const suffix = (match[2] || "").toLowerCase();

    if (suffix === "k" || suffix === "thousand") {
      amount *= 1000;
    } else if (suffix === "m" || suffix === "million") {
      amount *= 1000000;
    }

    if (amount >= 1000) {
      return amount;
    }
  }

  return null;
}

function containsKeyword(text, keywords) {
  return keywords.some((keyword) => {
    const normalizedKeyword = normalizeText(keyword);

    return ` ${text} `.includes(` ${normalizedKeyword} `);
  });
}

function detectCategory(message) {
  const text = normalizeText(message);

  const categories = [
    {
      name: "Electronics",
      keywords: [
        "phone", "smartphone", "mobile", "laptop", "computer",
        "tablet", "headphone", "headphones", "earphone",
        "earphones", "television", "tv", "camera", "charger",
        "kettle", "air fryer", "blender",
      ],
    },
    {
      name: "Fashion",
      keywords: [
        "shoe", "shoes", "sneaker", "sneakers", "clothes",
        "shirt", "hoodie", "dress", "watch", "bag", "backpack",
        "fashion", "ultraboost", "air max",
      ],
    },
    {
      name: "Home & Living",
      keywords: [
        "furniture", "sofa", "chair", "table", "pillow",
        "bedding", "home", "kitchen", "decor",
      ],
    },
    {
      name: "Groceries",
      keywords: [
        "grocery", "groceries", "food", "cereal", "snack",
        "drink", "beverage", "golden morn",
      ],
    },
    {
      name: "Gaming",
      keywords: [
        "game", "gaming", "controller", "xbox", "playstation",
        "ps5", "console", "video game",
      ],
    },
    {
      name: "Beauty",
      keywords: [
        "beauty", "skincare", "skin care", "makeup",
        "perfume", "cosmetic", "hair care",
      ],
    },
    {
      name: "Kids",
      keywords: [
        "kids", "kid", "children", "child", "school bag",
        "school supplies", "toy", "toys",
      ],
    },
    {
      name: "Books",
      keywords: [
        "book", "books", "novel", "reading", "author",
        "atomic habits", "1984",
      ],
    },
  ];

  for (const category of categories) {
    if (containsKeyword(text, category.keywords)) {
      return category.name;
    }
  }

  return null;
}

// Identify the specific type of product requested.

function detectProductType(message) {
  const text = normalizeText(message);

  const productTypes = [
    {
      name: "smartphones",
      keywords: [
        "phone",
        "phones",
        "smartphone",
        "smartphones",
        "mobile phone",
        "mobile phones",
        "iphone",
        "android phone",
        "cell phone",
        "cellphone",
      ],
      productKeywords: [
        "phone",
        "smartphone",
        "iphone",
        "mobile phone",
        "cellphone",
        "galaxy",
        "pixel",
      ],
    },
    {
      name: "headphones",
      keywords: [
        "headphone",
        "headphones",
        "earphone",
        "earphones",
        "earbud",
        "earbuds",
        "headset",
        "headsets",
      ],
      productKeywords: [
        "headphone",
        "headphones",
        "earphone",
        "earphones",
        "earbud",
        "earbuds",
        "headset",
      ],
    },
    {
      name: "laptops",
      keywords: [
        "laptop",
        "laptops",
        "notebook",
        "notebooks",
      ],
      productKeywords: [
        "laptop",
        "notebook",
      ],
    },
    {
      name: "tablets",
      keywords: [
        "tablet",
        "tablets",
        "ipad",
      ],
      productKeywords: [
        "tablet",
        "ipad",
      ],
    },
    {
      name: "televisions",
      keywords: [
        "television",
        "televisions",
        "tv",
        "smart tv",
      ],
      productKeywords: [
        "television",
        "smart tv",
        "tv",
      ],
    },
    {
      name: "cameras",
      keywords: [
        "camera",
        "cameras",
      ],
      productKeywords: [
        "camera",
      ],
    },
    {
      name: "chargers",
      keywords: [
        "charger",
        "chargers",
      ],
      productKeywords: [
        "charger",
      ],
    },
  ];

  return (
    productTypes.find((type) =>
      containsKeyword(text, type.keywords)
    ) || null
  );
}

function matchesProductType(product, productType) {
  if (!productType) return true;

  const productText = normalizeText(
    `${product.name || ""} ${product.description || ""}`
  );

  return containsKeyword(
    productText,
    productType.productKeywords
  );
}

function scoreProduct(product, message, category, productType) {
  const text = normalizeText(message);
  const name = normalizeText(product.name);
  const description = normalizeText(product.description);
  const words = text.split(" ").filter((word) => word.length > 2);

  let score = 0;

  if (category && product.category === category) {
    score += 5;
  }

  if (productType && matchesProductType(product, productType)) {
    score += 15;
  }

  for (const word of words) {
    if (name.split(" ").includes(word)) {
      score += 4;
    } else if (description.split(" ").includes(word)) {
      score += 1;
    }
  }

  return score;
}

export async function findRecommendedProducts(message) {
  const text = normalizeText(message);

  if (!text) {
    return {
      products: [],
      budget: null,
      category: null,
      productType: null,
    };
  }

  const budget = extractBudget(message);
  const category = detectCategory(message);
  const productType = detectProductType(message);

  const giftIntent = /\b(gift|present)\b/i.test(text);

  if (giftIntent && !category && !productType) {
    return {
      products: [],
      budget,
      category: null,
      productType: null,
    };
  }

  const result = await getProducts();

  const allProducts = Array.isArray(result)
    ? result
    : result.content || result.products || [];

  let candidates = allProducts.filter((product) => {
    const price = Number(product.price);

    return (
      Number.isFinite(price) &&
      price > 0 &&
      (!budget || price <= budget) &&
      (!category || product.category === category) &&
      matchesProductType(product, productType)
    );
  });

  candidates = candidates
    .map((product) => ({
      product,
      score: scoreProduct(
        product,
        message,
        category,
        productType
      ),
    }))
    .sort((a, b) => b.score - a.score);

  if (!category && !productType) {
    candidates = candidates.filter((item) => item.score > 0);
  }

  return {
    products: candidates.slice(0, 4).map((item) => item.product),
    budget,
    category,
    productType: productType?.name || null,
  };
}
