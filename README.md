<img width="1899" height="923" alt="Screenshot 2026-06-18 005311" src="https://github.com/user-attachments/assets/4f949099-faf9-4a2f-b6cd-2bc9952ffbcb" />
VASTRA — AI-Powered Agentic E-Commerce Platform

> **Vastra** is an AI-powered agentic e-commerce platform that uses AI not only as a chatbot, but as an intelligent interface that can interact with real e-commerce functionality.

Vastra provides two AI experiences:

* **Customer AI Agent** — helps customers discover products and perform shopping actions conversationally.
* **Merchant AI Copilot** — helps merchants analyze business performance, optimize profits, and make delivery decisions.

The project is built using **React, Spring Boot, Spring AI, MySQL, Spring Security, JWT, and Razorpay**.

---

## Table of Contents

* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Solution](#solution)
* [Key Features](#key-features)
* [Customer AI Agent](#customer-ai-agent)
* [Merchant AI Copilot](#merchant-ai-copilot)
* [Agentic AI Architecture](#agentic-ai-architecture)
* [Razorpay Payment Flow](#razorpay-payment-flow)
* [Payment Recovery](#payment-recovery)
* [Delivery Optimization](#delivery-optimization)
* [Authentication and Security](#authentication-and-security)
* [Technology Stack](#technology-stack)
* [System Architecture](#system-architecture)
* [Project Structure](#project-structure)
* [Important Modules](#important-modules)
* [Application Flow](#application-flow)
* [Screenshots](#screenshots)
* [Getting Started](#getting-started)
* [Environment Configuration](#environment-configuration)
* [Future Improvements](#future-improvements)
* [Author](#author)

---

# Overview

Traditional e-commerce platforms require customers to manually search for products, apply filters, browse product pages, add products to carts, and proceed through checkout.

Vastra introduces an **AI-first shopping experience**.

Instead of manually navigating through the application, a customer can simply tell the AI what they want.

For example:

> "Show me men's shirts under ₹2000."

The AI searches the actual product catalog and returns relevant products.

The customer can then:

**Search → View Products → Add to Cart → Wishlist → Buy Now → Pay**

The AI can therefore act as an intelligent interface between the customer and the e-commerce system.

Vastra also provides a separate AI assistant for merchants.

The merchant can ask questions about:

* Product performance
* Profitability
* Business performance
* Pending deliveries
* Delivery optimization
* Store improvement

This creates an AI-powered experience for **both sides of the marketplace**.

---

# Problem Statement

Traditional e-commerce applications have two major challenges.

### Customer Side

Customers often need to:

1. Search manually
2. Apply filters
3. Browse multiple products
4. Compare products
5. Add products to cart
6. Navigate to checkout
7. Complete payment

This creates multiple steps between the customer's intention and the final purchase.

### Merchant Side

Merchants also need to manually analyze:

* Revenue
* Profit
* Orders
* Product performance
* Pending deliveries
* Delivery options

This can make operational decision-making slower.

---

# Solution

Vastra combines traditional e-commerce functionality with **Agentic AI**.

The AI understands the user's intent and can interact with application functionality through dedicated tools.

### Customer

```text
Natural Language
       ↓
Customer AI Agent
       ↓
Product Search
       ↓
Actual Product Data
       ↓
Cart / Wishlist / Buy Now
       ↓
Razorpay
       ↓
Payment Verification
       ↓
Order
```

### Merchant

```text
Merchant Question
       ↓
Merchant AI Copilot
       ↓
Business Tools
       ↓
Real Merchant Data
       ↓
Business Recommendation
       ↓
Merchant Decision
```

---

# Key Features

## Customer Features

* AI-powered product search
* Natural-language product discovery
* Product recommendations
* Add to Cart from AI
* Add to Wishlist from AI
* Buy Now from AI
* Direct checkout
* Razorpay payment integration
* Payment recovery after cancelled payment
* Traditional e-commerce browsing
* Product management and catalog
* Order management

## Merchant Features

* Merchant dashboard
* Revenue analytics
* Profit analytics
* Order statistics
* Order status tracking
* Top-performing products
* Merchant AI Copilot
* Profit analysis
* Business insights
* Delivery optimization
* Delivery cost and ETA comparison
* Merchant approval before delivery assignment
* Delivery lifecycle tracking

## Platform Features

* JWT authentication
* Role-based authorization
* Customer and merchant separation
* Spring Security
* MySQL database
* REST APIs
* AI tool calling
* Payment verification
* Merchant-specific data access

---

# Customer AI Agent

The Customer AI Agent is designed specifically for shopping.

The customer can interact with the application using natural language.

### Example

Customer:

> "Show me trending shirts under ₹2000."

The AI understands:

* Product category → Shirts
* Maximum price → ₹2000
* Customer intent → Product discovery

It then calls the appropriate product search functionality and retrieves actual products from the database.

The result can contain:

* Product name
* Price
* Product image
* Product information
* Shopping actions

The customer can then directly perform actions from the AI interface.

### Available Actions

```text
ADD_TO_CART
ADD_TO_WISHLIST
DIRECT_CHECKOUT
```

This makes the AI more than a conversational interface.

It becomes an **action-oriented shopping agent**.

---

# Merchant AI Copilot

The Merchant AI Copilot is a separate AI experience designed for merchants.

Unlike the customer AI, it does not recommend clothing products to the merchant.

Its purpose is to help with business operations.

### Example Questions

```text
Which of my products are performing the best?

How can I improve my profit?

Which pending deliveries should I prioritize?

Give me actionable insights to improve my store performance.
```

The merchant AI can use dedicated tools to access relevant business information.

### Merchant AI Tools

#### Profit Optimization Tool

Analyzes order and product information to provide profit-related insights.

```text
Order
 ↓
Selling Price
 ↓
Product Cost
 ↓
Quantity
 ↓
Profit Analysis
```

#### Business Insights Tool

Provides information about merchant business performance, including product performance and profitability.

#### Delivery Optimization Tool

Analyzes pending deliveries and recommends suitable delivery options based on factors such as:

* Delivery cost
* Estimated delivery time
* Reliability
* Destination
* Order context
* Profit impact

---

# Agentic AI Architecture

The major difference between a normal chatbot and Vastra's AI system is **tool usage**.

The AI does not need to generate everything from its own knowledge.

Instead, it can use application tools to access real data and functionality.

### Customer Tools

```text
Customer AI
    │
    ├── ProductSearchTool
    │
    └── ProductCrossSellTool
```

### Merchant Tools

```text
Merchant AI
    │
    ├── ProfitOptimizationTool
    │
    ├── DeliveryOptimizationTool
    │
    └── BusinessInsightsTool
```

This architecture allows the LLM to interact with the actual application instead of producing disconnected responses.

---

# Razorpay Payment Flow

Vastra integrates Razorpay for online payments.

The payment architecture is:

```text
Customer
   ↓
Buy Now
   ↓
Backend creates Razorpay Order
   ↓
Razorpay Checkout
   ↓
Customer Payment
   ↓
Payment Response
   ↓
Backend Payment Verification
   ↓
Order Confirmation
```

The backend is responsible for verifying the payment before treating the order as successfully paid.

This prevents the frontend from being the source of truth for payment confirmation.

---

# Payment Recovery

One of the important features of Vastra is payment recovery.

Suppose a customer selects a product and clicks **Buy Now**.

The customer enters Razorpay Checkout but cancels the payment.

Instead of forcing the customer to:

```text
Search Product
      ↓
Open Product
      ↓
Buy Again
      ↓
Checkout
```

Vastra keeps the shopping context available.

The customer can retry the purchase directly.

```text
Payment Cancelled
       ↓
AI Conversation Remains
       ↓
Retry Purchase
       ↓
Razorpay Checkout
       ↓
Payment
```

This reduces friction and can help recover potentially lost purchases.

---

# Delivery Optimization

Vastra provides AI-assisted delivery optimization on the merchant side.

The merchant can view pending deliveries and request an optimization recommendation.

The system evaluates delivery-related factors such as:

```text
Delivery Cost
ETA
Reliability
Destination
Order Information
Profit Impact
```

The system then recommends an appropriate delivery option.

The merchant remains in control.

```text
Pending Delivery
       ↓
AI Delivery Optimizer
       ↓
Recommendation
       ↓
Merchant Review
       ↓
Accept & Assign
       ↓
Ongoing Delivery
       ↓
Delivered
```

This combines AI recommendations with human approval rather than blindly executing operational decisions.

---

# Authentication and Security

Vastra uses **Spring Security and JWT-based authentication**.

Users are authenticated through JWT tokens.

The application supports role-based access.

```text
USER
  ↓
Customer Features
  ↓
Customer AI
```

and

```text
MERCHANT
  ↓
Merchant Dashboard
  ↓
Merchant AI
  ↓
Merchant Operations
```

Merchant APIs are protected using role-based authorization.

The backend determines the authenticated user's role rather than relying on a role supplied by the frontend.

This prevents users from simply changing a frontend value to access merchant functionality.

---

# Technology Stack

## Frontend

* React.js
* Tailwind CSS
* Vite
* Axios
* JavaScript
* React Router

## Backend

* Java
* Spring Boot
* Spring MVC
* Spring Security
* JWT
* Spring Data JPA
* Hibernate

## AI

* Spring AI
* LLM through OpenRouter
* AI Tool Calling

## Database

* MySQL

## Payment

* Razorpay

## External Services

* Razorpay
* Nominatim Geocoding

---

# System Architecture

```text
                    ┌──────────────────────┐
                    │       VASTRA         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
      ┌───────────────┐                 ┌────────────────┐
      │    CUSTOMER   │                 │    MERCHANT    │
      └───────┬───────┘                 └───────┬────────┘
              │                                 │
              ▼                                 ▼
      ┌───────────────┐                 ┌────────────────┐
      │ Customer AI   │                 │ Merchant AI    │
      │    Agent      │                 │    Copilot     │
      └───────┬───────┘                 └───────┬────────┘
              │                                 │
       ┌──────┴──────┐                 ┌────────┼────────┐
       ▼             ▼                 ▼        ▼        ▼
   Product       Cross Sell         Profit  Delivery  Business
    Tools           Tool            Tool    Tool      Insights
       │             │                 │        │        │
       └─────────────┴─────────────────┴────────┴────────┘
                               │
                               ▼
                     ┌───────────────────┐
                     │    Spring Boot    │
                     │     Backend       │
                     └─────────┬─────────┘
                               │
                ┌──────────────┼───────────────┐
                ▼              ▼               ▼
        Spring Security      MySQL          Razorpay
             + JWT
```

---

# High-Level Application Architecture

```text
React + Tailwind
       │
       │ REST API
       ▼
Spring Boot
       │
       ├── Authentication
       ├── Product Management
       ├── Cart
       ├── Wishlist
       ├── Orders
       ├── Payments
       ├── Deliveries
       ├── Merchant Dashboard
       │
       └── Spring AI
              │
              ▼
        LLM / OpenRouter
              │
              ▼
          Tool Calling
              │
              ▼
       Application Services
              │
              ▼
            MySQL
```

---

# Project Structure

The project is divided into frontend and backend applications.

```text
VASTRA/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Chat.jsx
│   │   │   ├── MerchantChat.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── MerchantNavbar.jsx
│   │   │   └── ...
│   │   │
│   │   ├── Pages/
│   │   │   ├── Home/
│   │   │   ├── Product/
│   │   │   ├── Cart/
│   │   │   ├── Wishlist/
│   │   │   ├── Checkout/
│   │   │   ├── Merchant/
│   │   │   └── ...
│   │   │
│   │   ├── Service/
│   │   │   ├── chatService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── ...
│   │   │
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
│
├── backend/
│   │
│   └── src/main/java/com/Ecomm/prj/
│       │
│       ├── Controller/
│       │   ├── AuthController.java
│       │   ├── ProductController.java
│       │   ├── OrderController.java
│       │   ├── MerchantOrderController.java
│       │   └── ...
│       │
│       ├── Service/
│       │   ├── DeliveryService.java
│       │   ├── DeliveryOptimizationService.java
│       │   ├── ProfitOptimizationService.java
│       │   ├── MerchantDashboardService.java
│       │   ├── NominatimGeocodingService.java
│       │   └── ...
│       │
│       ├── Repository/
│       │   ├── ProductRepository.java
│       │   ├── OrderRepository.java
│       │   ├── UserRepository.java
│       │   └── ...
│       │
│       ├── Entity/
│       │   ├── Product.java
│       │   ├── Order.java
│       │   ├── User.java
│       │   ├── Delivery.java
│       │   └── ...
│       │
│       ├── DTO/
│       │   ├── ProductDTO.java
│       │   ├── OrderDTO.java
│       │   ├── MerchantDashboardResponse.java
│       │   └── ...
│       │
│       ├── AI/
│       │   ├── ChatService.java
│       │   ├── ProductSearchTool.java
│       │   ├── ProductCrossSellTool.java
│       │   ├── ProfitOptimizationTool.java
│       │   ├── DeliveryOptimizationTool.java
│       │   └── BusinessInsightsTool.java
│       │
│       ├── Security/
│       │   ├── JwtFilter.java
│       │   ├── JwtUtil.java
│       │   ├── SecurityConfig.java
│       │   └── CustomUserDetailService.java
│       │
│       └── ...
│
├── README.md
└── .gitignore
```

> **Note:** The structure above represents the major architectural modules. Individual package names/files may vary slightly depending on the current repository version.

---

# Important Backend Modules

## Controllers

Controllers expose REST APIs to the React frontend.

Examples:

```text
AuthController
ProductController
OrderController
MerchantOrderController
```

---

## Services

The service layer contains the application's business logic.

Important services include:

```text
DeliveryService
DeliveryOptimizationService
ProfitOptimizationService
MerchantDashboardService
NominatimGeocodingService
```

---

## Repositories

Repositories provide database access through Spring Data JPA.

Examples:

```text
ProductRepository
OrderRepository
UserRepository
```

---

## Entities

Entities represent the application's database models.

Examples:

```text
User
Product
Order
Delivery
```

---

# AI Module Structure

The AI layer is separated based on user role.

```text
AI
│
├── Customer AI
│   ├── ProductSearchTool
│   └── ProductCrossSellTool
│
└── Merchant AI
    ├── ProfitOptimizationTool
    ├── DeliveryOptimizationTool
    └── BusinessInsightsTool
```

The backend determines whether the authenticated user is a customer or merchant and provides the appropriate AI experience.

---

# Application Flow

## Customer Shopping Flow

```text
Customer Login
      ↓
Browse / AI Search
      ↓
Product Discovery
      ↓
Add to Cart / Wishlist
      ↓
Buy Now
      ↓
Razorpay Checkout
      ↓
Payment Verification
      ↓
Order Confirmation
```

---

## Merchant Flow

```text
Merchant Login
      ↓
Merchant Dashboard
      ↓
View Business Data
      ↓
Merchant AI Copilot
      ↓
Profit / Product / Delivery Analysis
      ↓
Merchant Decision
      ↓
Execute Operation
```

---

## Delivery Flow

```text
Pending
   ↓
AI Optimization
   ↓
Merchant Approval
   ↓
Ongoing
   ↓
Delivered
```

---

# Screenshots

## 1. Vastra Home Page

<img width="1899" height="923" alt="Screenshot 2026-06-18 005311" src="https://github.com/user-attachments/assets/39863426-dbd5-4a74-ad54-b216eb23595f" />

---

## 2. Customer AI Agent

Example of conversational product discovery.

<img width="1897" height="915" alt="Screenshot 2026-09-04 231237" src="https://github.com/user-attachments/assets/095361bd-879f-4dc3-835b-95b7d3641af9" />

**Add screenshot below:**
<img width="437" height="662" alt="Screenshot 2026-09-04 231314" src="https://github.com/user-attachments/assets/e552e47f-0418-42f4-80c3-754b1ed0f0c3" />

---

## 3. AI Product Search

Example:

> "Show me men's shirts under ₹2000."

**Add screenshot below:**
<img width="437" height="662" alt="Screenshot 2026-09-04 231314" src="https://github.com/user-attachments/assets/e552e47f-0418-42f4-80c3-754b1ed0f0c3" />


---

## 4. AI Shopping Actions

Show:

* Add to Cart
* Add to Wishlist
* Buy Now

<img width="437" height="662" alt="Screenshot 2026-09-04 231314" src="https://github.com/user-attachments/assets/e552e47f-0418-42f4-80c3-754b1ed0f0c3" />
---

## 5. Razorpay Checkout


<img width="1910" height="920" alt="Screenshot 2026-09-04 231335" src="https://github.com/user-attachments/assets/51fd10f2-8285-4bac-9472-fcfd317fc217" />


---

## 6. Payment Recovery

Show the cancelled payment and retry-purchase flow.


<img width="435" height="654" alt="Screenshot 2026-09-04 231348" src="https://github.com/user-attachments/assets/3cf63d7d-45c0-46de-9b06-830a5d6c155d" />


---

## 7. Merchant Dashboard

Show:

* Revenue
* Profit
* Orders
* Order status
* Charts
* Top products


<img width="1899" height="916" alt="Screenshot 2026-09-04 231153" src="https://github.com/user-attachments/assets/b93ecc2f-788a-460f-8c5c-abb4a066ede4" />


---

## 8. Merchant AI Copilot

<img width="260" height="365" alt="Screenshot 2026-09-04 232307" src="https://github.com/user-attachments/assets/c34bdf69-7681-4d71-b352-a28d762f97d4" />


---

## 9. Delivery Optimization

Show the AI recommendation and merchant approval.


<img width="738" height="861" alt="Screenshot 2026-09-04 231633" src="https://github.com/user-attachments/assets/3625f847-6301-4f4b-9c5f-61be36a70630" />

---

# Getting Started

## Prerequisites

Make sure the following are installed:

* Java 17+
* Maven
* Node.js
* npm
* MySQL
* Git

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure the MySQL database in:

```text
application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vastra
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

Configure the required AI and Razorpay credentials using environment variables or your local configuration.

Then start the backend:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8081
```

---

# Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on the Vite development server.

---

# Environment Configuration

Do not commit sensitive credentials to GitHub.

The following values should be kept private:

```text
Database Password
JWT Secret
Razorpay Key Secret
AI API Key
OpenRouter API Key
```

Use environment variables or local configuration files.

Make sure sensitive files are included in `.gitignore`.

---

# Future Improvements

Vastra currently demonstrates the core concept of agentic commerce.

Possible future improvements include:

### Payment Reliability

* Razorpay webhook-based payment reconciliation
* Idempotency for payment and order creation
* Better payment failure handling

### AI

* Persistent AI conversation history
* More autonomous merchant workflows
* Personalized customer recommendations
* AI-powered inventory forecasting
* AI-powered demand prediction

### Logistics

* Integration with real delivery providers
* Real-time delivery tracking
* Dynamic delivery pricing
* Automatic delivery reassignment on failure

### Platform

* Redis caching
* Message queues
* Observability using Prometheus and Grafana
* Distributed tracing
* Docker deployment
* Kubernetes deployment
* CI/CD pipeline
* Cloud deployment

These improvements can help evolve Vastra from a prototype into a production-grade platform.

---

# Why Vastra is Agentic Commerce

The key idea behind Vastra is that AI is not limited to conversation.

The AI can understand intent and interact with real application capabilities.

For example:

```text
Customer:
"Show me shirts under ₹2000."

        ↓

AI understands intent

        ↓

Product Search Tool

        ↓

Real Product Database

        ↓

Products returned

        ↓

Customer selects Buy Now

        ↓

Checkout

        ↓

Razorpay

        ↓

Order
```

On the merchant side:

```text
Merchant:
"Which delivery should I prioritize?"

        ↓

Merchant AI

        ↓

Delivery Optimization Tool

        ↓

Delivery Data

        ↓

Recommendation

        ↓

Merchant Approval

        ↓

Delivery Assignment
```

This is the core of Vastra's **Agentic Commerce** approach.

---

# Project Highlights

| Area           | Implementation                        |
| -------------- | ------------------------------------- |
| Frontend       | React + Tailwind CSS                  |
| Backend        | Spring Boot                           |
| Database       | MySQL                                 |
| Authentication | Spring Security + JWT                 |
| AI             | Spring AI + LLM                       |
| AI Provider    | OpenRouter                            |
| Customer AI    | Product Search + Cross-Selling        |
| Merchant AI    | Profit + Delivery + Business Insights |
| Payments       | Razorpay                              |
| Geocoding      | Nominatim                             |
| Architecture   | REST-based client-server architecture |
| Authorization  | Role-based access control             |

---

# Buildathon Focus

Vastra was designed around the idea of **AI-powered Agentic Commerce**.

The project focuses on using AI to improve both sides of the e-commerce marketplace:

### Customer

**Discover → Decide → Purchase**

### Merchant

**Analyze → Optimize → Operate**

Instead of treating AI as an additional chatbot feature, Vastra integrates AI directly into the e-commerce workflow.

---

# Author

## Harsh Kumar

**B.Tech Computer Science Engineering — Third Year**

Interested in:

* React.js
* Spring Boot
* Full Stack Development
* AI Integration
* System Design

Vastra was developed as a practical project combining **full-stack development, AI, payments, security, and e-commerce architecture**.

---

# Final Summary

Vastra is an **AI-powered agentic e-commerce platform** where:

```text
                    VASTRA
                       │
          ┌────────────┴────────────┐
          │                         │
      CUSTOMER                   MERCHANT
          │                         │
     AI AGENT                 AI COPILOT
          │                         │
    Product Search          Business Insights
    Cart Actions            Profit Analysis
    Wishlist                Delivery Optimization
    Buy Now
          │                         │
          ▼                         ▼
       RAZORPAY               MERCHANT DECISION
          │
          ▼
        ORDER
```

The goal of Vastra is to make e-commerce more **conversational, intelligent, action-oriented, and efficient** by bringing AI directly into the shopping and merchant-operation workflows.
<img width="1899" height="923" alt="Screenshot 2026-06-18 005311" src="https://github.com/user-attachments/assets/a86f8344-776c-44e1-bf77-c46aebfea237" />
