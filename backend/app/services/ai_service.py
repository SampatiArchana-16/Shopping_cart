import os
import re
import random
from collections import defaultdict
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ---------------------------
# 🛍️ PRODUCTS
# ---------------------------
PRODUCTS = [
    {"id": 1, "name": "Men T-Shirt", "type": "shirt", "category": "men", "price": 500},
    {"id": 2, "name": "Men Jeans", "type": "jeans", "category": "men", "price": 1200},
    {"id": 3, "name": "Men Shoes", "type": "shoes", "category": "men", "price": 2000},

    {"id": 4, "name": "Women Top", "type": "shirt", "category": "women", "price": 700},
    {"id": 5, "name": "Women Jeans", "type": "jeans", "category": "women", "price": 1400},
    {"id": 6, "name": "Women Heels", "type": "shoes", "category": "women", "price": 2500},

    {"id": 7, "name": "Kids T-Shirt", "type": "shirt", "category": "kids", "price": 300},
    {"id": 8, "name": "Kids Shorts", "type": "jeans", "category": "kids", "price": 400},
    {"id": 9, "name": "Kids Shoes", "type": "shoes", "category": "kids", "price": 800},
]

# ---------------------------
# 🧠 USER MEMORY
# ---------------------------
USER_MEMORY = defaultdict(lambda: {
    "preferred_types": defaultdict(int),
    "preferred_categories": defaultdict(int),
    "budget": None,
})

# ---------------------------
# 🔍 HELPERS
# ---------------------------
def extract_budget(text):
    match = re.search(r'(\d{3,5})', text)
    return int(match.group(1)) if match else None


def detect_type(msg):
    if any(w in msg for w in ["shirt", "tshirt", "top"]):
        return "shirt"
    if any(w in msg for w in ["jeans", "shorts"]):
        return "jeans"
    if any(w in msg for w in ["shoe", "shoes", "loafers", "heels", "sneakers"]):
        return "shoes"
    return None


def detect_category(msg):
    if "men" in msg: return "men"
    if "women" in msg: return "women"
    if "kid" in msg: return "kids"
    return None


def detect_intent(msg):
    if any(word in msg for word in [
        "shirt", "jeans", "shoes", "loafers",
        "heels", "sneakers", "under", "buy",
        "cheap", "wear", "style"
    ]):
        return "shopping"
    return "general"


# ---------------------------
# 🧠 MEMORY UPDATE
# ---------------------------
def update_memory(user_id, category, ptype, budget):
    memory = USER_MEMORY[user_id]

    if category:
        memory["preferred_categories"][category] += 1

    if ptype:
        memory["preferred_types"][ptype] += 1

    if budget:
        memory["budget"] = budget


# ---------------------------
# 🏷️ TAG ENGINE
# ---------------------------
def get_tag(product, budget):
    if budget and product["price"] <= budget:
        return "💸 Best Value"
    if product["price"] > 2000:
        return "💎 Premium"
    return "🔥 Trending"


# ---------------------------
# 🧠 PRODUCT SCORING (UPGRADED)
# ---------------------------
def score_product(p, memory, category, ptype, budget):
    score = 0

    if category and p["category"] == category:
        score += 5

    if ptype and p["type"] == ptype:
        score += 4

    if budget:
        if p["price"] <= budget:
            score += 3
        else:
            score -= 1

    score += memory["preferred_categories"][p["category"]] * 2
    score += memory["preferred_types"][p["type"]] * 2

    # slight randomness (human feel)
    score += random.uniform(0, 1)

    return score


# ---------------------------
# 🧠 HUMAN RESPONSE (ADVANCED)
# ---------------------------
def build_human_response(products, budget, category, ptype):
    top_products = products[:2]

    descriptions = []

    for p in top_products:
        tag = get_tag(p, budget)

        reason = []

        if budget and p["price"] <= budget:
            reason.append("fits your budget")

        if category and p["category"] == category:
            reason.append("matches your category")

        if ptype and p["type"] == ptype:
            reason.append("exactly what you searched")

        reason_text = ", ".join(reason) if reason else "a good choice"

        descriptions.append(
            f"{p['name']} (₹{p['price']}) [{tag}] — {reason_text}"
        )

    # 🔥 Dynamic styles
    styles = [
        f"✨ Great picks for you 👇 {descriptions[0]}",
        f"🔥 Trending right now 👇 {descriptions[0]}",
        f"🎯 Based on your search 👇 {descriptions[0]}",
        f"🛍️ You might like this 👇 {descriptions[0]}",
    ]

    if len(descriptions) > 1:
        styles.append(
            f"✨ Here are a couple of solid options 👇 {' | '.join(descriptions)}"
        )

    if budget:
        styles.append(
            f"💸 Best options under ₹{budget} 👇 {' | '.join(descriptions)}"
        )

    return random.choice(styles)


# ---------------------------
# 🚀 MAIN FUNCTION
# ---------------------------
def generate_ai_response(user_id: int, message: str):
    msg = message.lower()

    intent = detect_intent(msg)
    budget = extract_budget(msg)
    category = detect_category(msg)
    ptype = detect_type(msg)

    update_memory(user_id, category, ptype, budget)
    memory = USER_MEMORY[user_id]

    # ---------------------------
    # 🛍️ SHOPPING
    # ---------------------------
    if intent == "shopping":

        ranked = sorted(
            PRODUCTS,
            key=lambda p: score_product(p, memory, category, ptype, budget),
            reverse=True
        )

        filtered = ranked

        if category:
            filtered = [p for p in filtered if p["category"] == category]

        if ptype:
            filtered = [p for p in filtered if p["type"] == ptype]

        if budget:
            filtered = [p for p in filtered if p["price"] <= budget]

        # ❌ No match → smart fallback
        if not filtered:
            filtered = ranked[:3]

            return {
                "response": "😔 No exact match — here are the closest options 👇",
                "action": "recommend",
                "products": [p["id"] for p in filtered],
                "product_id": None
            }

        response_text = build_human_response(filtered, budget, category, ptype)

        return {
            "response": response_text,
            "action": "recommend",
            "products": [p["id"] for p in filtered[:5]],
            "product_id": None
        }

    # ---------------------------
    # 🤖 GENERAL CHAT
    # ---------------------------
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a smart ecommerce assistant."},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
        )

        return {
            "response": completion.choices[0].message.content.strip(),
            "action": "none",
            "products": [],
            "product_id": None
        }

    except Exception:
        return {
            "response": "Try something like 'kids shoes under 1000' 😊",
            "action": "none",
            "products": [],
            "product_id": None
        }