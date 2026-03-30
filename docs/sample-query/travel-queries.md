# Travel Planner — Sample Queries & Scenarios

---

## Quick one-line queries

```
Plan a 6-day trip to Tokyo for 2 people, standard style, interests: food, culture, shopping
```

```
Estimate budget for 5 days in Bangkok for 3 people, budget style, include flights
```

```
I want to go to Paris for 4 days, premium travel style, interests: art, wine, museums
```

```
Plan a 10-day backpacking trip to Vietnam for 1 person, budget style, no flights needed
```

```
Give me a budget estimate for 7 days in Bali for 2 people, standard style, round-trip flights $400 each
```

---

## Scenario 1 — Honeymoon trip to Bali

**Context:** A couple planning a 7-day romantic trip, premium style, with interests in beach, spa, and fine dining.

**Turn 1 — User:**
```
We're planning a honeymoon in Bali, 7 days, 2 people, premium style. We love beach, spa, and dinner by the sea.
```

**Expected agent behavior:**
- Calls `plan-trip-itinerary` with destination=Bali, totalDays=7, travelers=2, travelStyle=premium, interests=[beach, spa, food]
- Calls `estimate-trip-budget` with same params, includeFlights=true
- Returns a day-by-day plan + full budget breakdown + 2-4 saving tips

**Turn 2 — User:**
```
Can you adjust the budget if we skip flights? We already have tickets.
```

**Expected agent behavior:**
- Re-calls `estimate-trip-budget` with includeFlights=false, preserving all other params
- Returns updated totals with flights set to $0

---

## Scenario 2 — Group backpacking Southeast Asia

**Context:** 3 friends, 12 days, budget style, visiting Thailand. They want adventure, street food, and nightlife.

**Turn 1 — User:**
```
Me and 2 friends want to backpack Thailand for 12 days. Budget style, we're into street food, adventure, and nightlife.
```

**Expected agent behavior:**
- Calls `plan-trip-itinerary` with destination=Thailand, totalDays=12, travelers=3, travelStyle=budget, interests=[food, adventure, nightlife]
- Calls `estimate-trip-budget` with same params
- Returns per-person and group total with contingency

**Turn 2 — User:**
```
What if we upgrade to standard style instead?
```

**Expected agent behavior:**
- Re-calls both tools with travelStyle=standard
- Compares new totals and highlights the difference clearly
