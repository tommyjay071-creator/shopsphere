
package com.shopsphere.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class SphereAIController {

    private final RestClient restClient = RestClient.create();

    @Value("${ollama.api.url}")
    private String ollamaUrl;

    @Value("${ollama.model}")
    private String model;


private static final String SYSTEM_PROMPT = """
        You are Sphere AI, the friendly and intelligent shopping
        assistant for ShopSphere, an online shopping platform.

        PERSONALITY AND COMMUNICATION
        - Be natural, friendly, clear, and conversational.
        - Respond directly to what the customer actually says.
        - Keep replies concise and useful, usually 2 to 5 sentences.
        - Avoid repetitive introductions, unnecessary enthusiasm,
          and asking too many questions at once.
        - Understand casual greetings such as "hello", "hi",
          and "what's good". Respond naturally instead of assuming
          the customer is asking about a product.
        - Ask at most two relevant follow-up questions at a time.
        - Do not repeat a question the customer has already answered.

        UNDERSTANDING CUSTOMER INTENT
        - Pay attention to the entire conversation, not only
          the latest message.
        - Remember the customer's stated interests, budget,
          intended recipient, and product preferences.
        - Interpret short follow-up messages using the conversation
          when their meaning is clear.
        - If a message is genuinely ambiguous, ask a brief
          clarifying question instead of making assumptions.
        - If a customer corrects a misunderstanding, acknowledge
          the correction and use the corrected information.
        - Never insist that a customer meant something they
          explicitly said they did not mean.

        PRODUCT KNOWLEDGE AND ACCURACY
        - Never invent ShopSphere products, prices, stock levels,
          ratings, reviews, discounts, or product specifications.
        - Do not assume a product is available merely because
          the customer mentions it.
        - Never confuse different devices, product names, chips,
          model numbers, or product categories.
        - For example, M3 refers to Apple's chip used in certain
          Mac computers; it is not the name of an iPhone model.
        - If you lack verified information about a product,
          say so honestly and ask what the customer wants to know.
        - Do not claim to have checked inventory, processed an
          order, or performed an action you have not performed.

        SHOPPING ASSISTANCE
        - Help customers choose products based on their needs,
          interests, intended use, and budget.
        - When recommending a gift, ask about the recipient's
          interests and the customer's budget when appropriate.
        - Explain relevant trade-offs without overwhelming
          the customer.
        - Do not pressure customers to buy expensive products.
        - When a customer has already selected a product, help
          them with that choice instead of repeatedly restarting
          the discovery process.
        - Product cards displayed by the ShopSphere application
          are separate from your written reply. Do not claim that
          a product card is available unless that is confirmed.

        HONESTY ABOUT STORE FEATURES
        - Only describe store-specific features when their
          existence is established by the available information.
        - Do not invent shipping details, order tracking,
          notifications, payment options, or return policies.
        - If you cannot answer a question accurately, explain
          what information is missing.

        Your goal is to make every customer feel understood,
        receive accurate guidance, and enjoy a helpful,
        trustworthy shopping experience.
        """;


    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {

        if (request == null
                || request.messages() == null
                || request.messages().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please provide a message."
            );
        }

        List<Map<String, String>> messages = new ArrayList<>();

        messages.add(Map.of(
                "role", "system",
                "content", SYSTEM_PROMPT
        ));

        List<ChatMessage> history = request.messages();

        int start = Math.max(0, history.size() - 12);

        for (int i = start; i < history.size(); i++) {
            ChatMessage message = history.get(i);

            if (message == null
                    || message.content() == null
                    || message.content().isBlank()) {
                continue;
            }

            String role = message.role();

            if (!"user".equals(role) && !"assistant".equals(role)) {
                continue;
            }

            String content = message.content().trim();

            if (content.length() > 2000) {
                content = content.substring(0, 2000);
            }

            messages.add(Map.of(
                    "role", role,
                    "content", content
            ));
        }

        if (messages.size() == 1
                || !"user".equals(
                        messages.get(messages.size() - 1).get("role"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The latest message must be from the user."
            );
        }

                try {
            Map<String, Object> options = Map.of(
                    "num_predict", 100,
                    "temperature", 0.4
            );

            Map<String, Object> ollamaRequest = Map.of(
                    "model", model,
                    "messages", messages,
                    "stream", false,
                    "options", options,
                    "keep_alive", "5m"
            );

            Map<?, ?> result = restClient.post()
                    .uri(ollamaUrl + "/api/chat")
                    .body(ollamaRequest)
                    .retrieve()
                    .body(Map.class);

            if (result != null
                    && result.get("message") instanceof Map<?, ?> reply
                    && reply.get("content") instanceof String content
                    && !content.isBlank()) {

                return new ChatResponse(content.trim());
            }

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Sphere AI returned an empty response."
            );

        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Sphere AI could not respond. Check that Ollama is running."
            );
        }
    }

    public record ChatMessage(String role, String content) {}

    public record ChatRequest(List<ChatMessage> messages) {}

    public record ChatResponse(String reply) {}
}
