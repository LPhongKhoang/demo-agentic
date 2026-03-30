# Order Agent — Sample Queries & Scenarios

---

## Quick one-line queries

```
I want to order 1 iPhone 16 for John Doe
```

```
Check order ORD1001
```

```
What products do you have available?
```

```
Does John Doe have enough balance to buy 2 AirPods Max?
```

```
Create an order for Jane Smith: 1 iPad Pro
```

---

## Scenario 1 — Existing customer places an order

**Context:** An existing customer (John Doe) wants to buy 2 AirPods Max. Balance is $5,000, product stock is 2, price is $600 each.

**Turn 1 — User:**
```
I'd like to place an order for John Doe: 2 AirPods Max
```

**Expected agent behavior:**
1. Extracts customerName=`John Doe`, productName=`AirPods Max`, quantity=2
2. Calls `get_customer` → found, balance=$5,000
3. Calls `get_product` → found, price=$600
4. Calls `check_stock` → stock=2, quantity=2 → sufficient ✓
5. Calls `check_balance` → totalPrice=$1,200, balance=$5,000 → sufficient ✓
6. Calls `create_order` → order created with orderId

**Turn 2 — User:**
```
What was the order ID?
```

**Expected agent behavior:**
- Recalls the created order from conversation context and returns the orderId (e.g. ORD1002)

---

## Scenario 2 — New customer, product not found, then successful order

**Context:** A new customer (Alice Nguyen) wants to order "Galaxy S25" which does not exist. Agent lists available products. Customer picks iPhone 16. Balance is provided during profile creation.

**Turn 1 — User:**
```
I want to order a Galaxy S25 for Alice Nguyen
```

**Expected agent behavior:**
1. Calls `get_customer` for `Alice Nguyen` → not found
2. Asks for customer profile

**Turn 2 — User:**
```
Her profile: dob 1995-05-20, occupation Designer, marital status Single, gender Female, address 456 Elm St, balance 3000
```

**Expected agent behavior:**
1. Calls `create_customer` with provided profile
2. Calls `get_product` for `Galaxy S25` → not found
3. Calls `get_all_products` → returns [iPhone 16, iPad Pro, AirPods Max]
4. Asks user to pick from the list

**Turn 3 — User:**
```
She'll take 1 iPhone 16 instead
```

**Expected agent behavior:**
1. Calls `get_product` → price=$1,200
2. Calls `check_stock` → stock=10, quantity=1 → sufficient ✓
3. Calls `check_balance` → totalPrice=$1,200, balance=$3,000 → sufficient ✓
4. Calls `create_order` → order created
5. Returns a friendly order confirmation summary
