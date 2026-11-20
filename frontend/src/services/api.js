const API_BASE_URL = "http://localhost:8080/api";

export async function getProducts() {
  const response = await fetch(
    `${API_BASE_URL}/products?page=0&size=100`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}


export async function getProductById(id) {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  return response.json();
}


export async function loginCustomer(email, password) {
  const response = await fetch(`${API_BASE_URL}/customers/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Login failed");
  }

  return response.json();
}

export async function getMyCart(token) {
  const response = await fetch(`${API_BASE_URL}/carts/my-cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get cart");
  }

  return response.json();
}

export async function createCart(token) {
  const response = await fetch(`${API_BASE_URL}/carts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    console.error("Create cart failed:", {
      status: response.status,
      statusText: response.statusText,
      message,
    });

    throw new Error(
      message || `Failed to create cart (${response.status})`
    );
  }

  return response.json();
}

export async function addToCart(token, cartId, productId, quantity = 1) {
  const response = await fetch(
    `${API_BASE_URL}/carts/${cartId}/items?productId=${productId}&quantity=${quantity}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Failed to add product to cart (${response.status})`
    );
  }

  return response.json();
}

export async function updateCartItemQuantity(
  token,
  cartId,
  itemId,
  quantity
) {
  const response = await fetch(
    `${API_BASE_URL}/carts/${cartId}/items/${itemId}?quantity=${quantity}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Failed to update quantity (${response.status})`
    );
  }

  return response.json();
}

export async function removeCartItem(token, cartId, itemId) {
  const response = await fetch(
    `${API_BASE_URL}/carts/${cartId}/items/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove item");
  }

  return response.json();
}

export async function checkoutCart(token, cartId) {
  const response = await fetch(
    `${API_BASE_URL}/orders/from-cart/${cartId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || "Checkout failed"
    );
  }

  return response.json();
}

export async function getMyOrders(token) {
  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || "Failed to fetch orders"
    );
  }

  return response.json();
}

export async function registerCustomer(firstName, lastName, email, password) {
  const response = await fetch(`${API_BASE_URL}/customers/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || "Registration failed");
  }

  return response.json();
}


export async function chatWithSphereAI(messages) {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content ?? message.text,
      })),
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Sphere AI request failed (${response.status})`
    );
  }

  return response.json();
}
