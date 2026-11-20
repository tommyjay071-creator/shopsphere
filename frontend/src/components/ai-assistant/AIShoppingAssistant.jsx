import { useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  LoaderCircle,
  Check,
} from "lucide-react";

import { productImages } from "../../data/productImages";
import { findRecommendedProducts } from "../../services/aiShoppingService";
import {
  addToCart,
  getMyCart,
  createCart,
  chatWithSphereAI,
} from "../../services/api";

import "./AIShoppingAssistant.css";

const suggestedPrompts = [
  "Find me a phone",
  "Recommend a gift",
  "Show me gaming products",
];

function formatPrice(price) {
  return `₦${Number(price).toLocaleString("en-NG")}`;
}

function createResponse(result) {
  const { products, budget, category } = result;

  if (products.length === 0) {
    if (budget && category) {
      return `I couldn't find matching ${category.toLowerCase()} products within ${formatPrice(budget)} in the current catalogue. Try increasing your budget or exploring another category.`;
    }

    if (budget) {
      return `I couldn't find matching products under ${formatPrice(budget)}. You could try a higher budget or a different search.`;
    }

    return "I couldn't find a close match in the current ShopSphere catalogue. Try mentioning a product type, such as phones, shoes, books, or gaming accessories.";
  }

  if (budget && category) {
    return `I found ${products.length} ${category.toLowerCase()} option${products.length === 1 ? "" : "s"} within your ${formatPrice(budget)} budget. Here are some products from ShopSphere for you to explore. 💜`;
  }

  if (category) {
    return `Here are some ${category.toLowerCase()} products from our ShopSphere catalogue. Have a look and see which one suits you best! 💜`;
  }

  return "I've searched the ShopSphere catalogue and found these products that may interest you. Take a look! 💜";
}


function ProductRecommendation({ product }) {
  const [imageError, setImageError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const imageSrc = productImages[product.name] || product.imageUrl;

  async function handleAddToCart() {
    if (adding) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    try {
      setAdding(true);
      setMessage("");

      let cartId = localStorage.getItem("cartId");

      if (cartId) {
        try {
          await addToCart(token, cartId, product.id, 1);
          setMessage("Added to cart successfully!");
          return;
        } catch (error) {
          console.log("Stored cart unavailable. Checking customer cart...");
        }
      }

      try {
        const cart = await getMyCart(token);
        cartId = cart.id;
      } catch (error) {
        const cart = await createCart(token);
        cartId = cart.id;
      }

      localStorage.setItem("cartId", String(cartId));

      await addToCart(token, cartId, product.id, 1);
      setMessage("Added to cart successfully!");
    } catch (error) {
      console.error("Sphere AI add-to-cart failed:", error);
      setMessage(error.message || "Could not add this product. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="ai-product-card">
      <div className="ai-product-image">
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="ai-product-placeholder">
            <ShoppingBag size={26} />
            <span>Image unavailable</span>
          </div>
        )}
      </div>

      <div className="ai-product-details">
        <span className="ai-product-category">{product.category}</span>
        <h4>{product.name}</h4>

        {product.description && <p>{product.description}</p>}

        <div className="ai-product-bottom">
          <strong>{formatPrice(product.price)}</strong>
        </div>

        <div className="ai-product-actions">
          <button
            type="button"
            className="ai-add-cart"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? (
              <>
                <LoaderCircle size={15} className="ai-loading-icon" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                Add to Cart
              </>
            )}
          </button>

          <button
            type="button"
            className="ai-view-product"
            onClick={() => {
              window.location.href =
                `/products?search=${encodeURIComponent(product.name)}`;
            }}
          >
            View product
            <ArrowUpRight size={14} />
          </button>
        </div>

        {message && (
          <p
            className={`ai-cart-message ${
              message === "Added to cart successfully!"
                ? "success"
                : "error"
            }`}
            role="status"
          >
            {message === "Added to cart successfully!" && (
              <Check size={14} />
            )}
            {message}
          </p>
        )}
      </div>
    </article>
  );
}


function AIShoppingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey there! 👋 Welcome to ShopSphere. I'm Sphere AI, your shopping companion. Tell me what you're looking for, and I'll help you explore products from our catalogue!",
      products: [],
    },
  ]);


const handleSend = async (messageText = input) => {
  const text = messageText.trim();

  if (!text || isTyping) return;

  const isGreeting =
    /^(hi|hello|hey|what'?s good|how are you|good morning|good afternoon|good evening)[.!?,\s]*$/i.test(
      text
    );

  setInput("");

  // Handle simple greetings immediately without calling the model.
  if (isGreeting) {
    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text,
        products: [],
        resetContext: true,
      },
      {
        role: "assistant",
        text: "What's good! 👋 I'm here to help you explore ShopSphere. What are you looking for today?",
        products: [],
      },
    ]);

    return;
  }

  // Keep only messages after the latest conversation reset.
  const lastResetIndex = messages.reduce(
    (lastIndex, message, index) =>
      message.resetContext ? index : lastIndex,
    -1
  );

  const relevantMessages =
    lastResetIndex >= 0
      ? messages.slice(lastResetIndex)
      : messages;

  const conversationHistory = [
    ...relevantMessages
      .filter(
        (message) =>
          message.role === "user" ||
          message.role === "assistant"
      )
      .map((message) => ({
        role: message.role,
        content: message.text ?? message.content ?? "",
      })),
    {
      role: "user",
      content: text,
    },
  ];

  setMessages((previous) => [
    ...previous,
    { role: "user", text, products: [] },
  ]);

  setIsTyping(true);


  let recommendedProducts = [];
  let recommendationResult = {
    products: [],
    budget: null,
    category: null,
  };

  const recommendationContext = text;

  let catalogueError = false;

  try {
    recommendationResult = await findRecommendedProducts(
      recommendationContext
    );

    recommendedProducts = recommendationResult.products ?? [];
  } catch (error) {
    console.error("Product recommendation error:", error);
    catalogueError = true;
  }

  const needsGiftDetails =
  /\b(gift|present)\b/i.test(text) &&
  !recommendationResult.category;

  const isCatalogueRequest =
    Boolean(
      recommendationResult.category ||
      recommendationResult.budget ||
      needsGiftDetails
    ) ||
    /\b(recommend|show|find|search|looking for|shop|buy|purchase|product|products)\b/i.test(
      text
    );

  // Handle catalogue recommendations without asking Ollama
  // to generate product names.
  if (isCatalogueRequest) {
    let responseText;

    if (catalogueError) {
      responseText =
        "I'm having trouble accessing the ShopSphere catalogue right now. Please try again shortly.";
    } else if (needsGiftDetails) {
      responseText =
        "I'd be happy to help you find a gift! Who is it for, what are their interests, and what's your budget? 💜";
    } else {
      responseText = createResponse(recommendationResult);
    }

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text: responseText,
        products: recommendedProducts,
      },
    ]);

    setIsTyping(false);
    return;
  }

  // Use Ollama for general conversational questions.
  try {
    const result = await chatWithSphereAI(conversationHistory);

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text: result.reply,
        products: [],
      },
    ]);
  } catch (error) {
    console.error("Sphere AI error:", error);

    setMessages((previous) => [
      ...previous,
      {
        role: "assistant",
        text:
          "Sorry, I couldn't connect to Sphere AI right now. Please check that the backend and Ollama are running, then try again.",
        products: [],
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};



  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="ai-assistant">
      {isOpen && (
        <section
          className="ai-chat-window"
          aria-label="ShopSphere AI Shopping Assistant"
        >
          <header className="ai-chat-header">
            <div className="ai-header-profile">
              <div className="ai-avatar">
                <Sparkles size={22} />
              </div>

              <div className="ai-header-info">
                <h3>Sphere AI</h3>
                <span>
                  <span className="ai-online-dot" />
                  Your shopping companion
                </span>
              </div>
            </div>

            <button
              className="ai-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <X size={20} />
            </button>
          </header>

          <div className="ai-chat-badge">
            <Sparkles size={13} />
            SHOPSPHERE PRODUCT ASSISTANT
          </div>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div key={index} className="ai-message-group">
                <div
                  className={`ai-message-row ${
                    message.role === "user" ? "user-row" : "assistant-row"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="ai-message-avatar">
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div className={`ai-message ${message.role}`}>
                    {message.text}
                  </div>
                </div>

                {message.role === "assistant" &&
                  message.products?.length > 0 && (
                    <div className="ai-product-list">
                      {message.products.map((product) => (
                        <ProductRecommendation
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-row assistant-row">
                <div className="ai-message-avatar">
                  <Sparkles size={14} />
                </div>

                <div className="ai-message assistant ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="ai-suggestions">
              <p>TRY ASKING ME</p>

              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  className="ai-suggestion"
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                >
                  <ShoppingBag size={15} />
                  {prompt}
                  <ArrowUpRight size={15} />
                </button>
              ))}
            </div>
          )}

          <form
            className="ai-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}
          >
            <div className="ai-input-wrapper">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What are you shopping for?"
                rows={1}
                aria-label="Message Sphere AI"
              />

              <button
                type="submit"
                className="ai-send-button"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                {isTyping ? (
                  <LoaderCircle size={17} className="ai-loading-icon" />
                ) : (
                  <Send size={17} />
                )}
              </button>
            </div>

            <p className="ai-disclaimer">
              Powered by local AI · ShopSphere catalogue recommendations
            </p>
          </form>
        </section>
      )}

      <button
        className={`ai-launcher ${isOpen ? "launcher-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={
          isOpen ? "Close shopping assistant" : "Open shopping assistant"
        }
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={25} /> : <MessageCircle size={25} />}

        {!isOpen && (
          <span className="ai-launcher-sparkle">
            <Sparkles size={13} />
          </span>
        )}
      </button>
    </div>
  );
}

export default AIShoppingAssistant;
