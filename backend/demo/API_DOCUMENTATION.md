# Transfer Simulation API Documentation

## Overview

This API allows users to simulate money transfers from Japan (JPY) to Vietnam (VND) with real-time exchange rates and fee calculations.

### Base URL
```
http://localhost:8080/api/transfer
```

---

## Endpoints

### 1. Preview Transfer Calculation

Calculate transfer details without saving to history.

**Endpoint:** `POST /api/transfer/preview`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input_mode` | String | Yes | Either `JPY_INPUT` or `VND_INPUT` |
| `send_amount_jpy` | Long | Required if `input_mode` is `JPY_INPUT` | Amount to send in JPY (min: 100) |
| `receive_amount_vnd` | Long | Required if `input_mode` is `VND_INPUT` | Desired amount to receive in VND |

**Example Request (JPY Input):**
```json
{
  "input_mode": "JPY_INPUT",
  "send_amount_jpy": 50000
}
```

**Example Request (VND Input):**
```json
{
  "input_mode": "VND_INPUT",
  "receive_amount_vnd": 10000000
}
```

**Response (200 OK):**
```json
{
  "send_amount_jpy": 50000,
  "receive_amount_vnd": 8650000,
  "fee_jpy": 400,
  "rate_jpy_to_vnd": 174.35,
  "net_amount_jpy": 49600
}
```

| Field | Type | Description |
|-------|------|-------------|
| `send_amount_jpy` | Long | Total amount user sends in JPY |
| `receive_amount_vnd` | Long | Amount recipient receives in VND |
| `fee_jpy` | Integer | Transfer fee in JPY |
| `rate_jpy_to_vnd` | BigDecimal | Exchange rate used (1 JPY = ? VND) |
| `net_amount_jpy` | Long | Amount after fee deduction (converted to VND) |

---

### 2. Create Transfer Simulation

Submit a simulation and save it to the public history.

**Endpoint:** `POST /api/transfer/simulate`

**Request Body:** Same as Preview endpoint

**Example Request:**
```json
{
  "input_mode": "JPY_INPUT",
  "send_amount_jpy": 100000
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "created_at": "2026-01-14T14:30:00",
  "send_amount_jpy": 100000,
  "receive_amount_vnd": 17305000,
  "fee_jpy": 700,
  "rate_jpy_to_vnd": 174.35,
  "input_mode": "JPY_INPUT"
}
```

---

### 3. Get Transaction History

Retrieve all simulated transactions (public history).

**Endpoint:** `GET /api/transfer/history`

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "created_at": "2026-01-14T15:00:00",
    "send_amount_jpy": 50000,
    "receive_amount_vnd": 8650000,
    "fee_jpy": 400,
    "rate_jpy_to_vnd": 174.35,
    "input_mode": "JPY_INPUT"
  },
  {
    "id": 1,
    "created_at": "2026-01-14T14:30:00",
    "send_amount_jpy": 100000,
    "receive_amount_vnd": 17305000,
    "fee_jpy": 700,
    "rate_jpy_to_vnd": 174.35,
    "input_mode": "VND_INPUT"
  }
]
```

---

### 4. Get Single Transaction

Retrieve a specific simulation by ID.

**Endpoint:** `GET /api/transfer/history/{id}`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Simulation ID |

**Example:** `GET /api/transfer/history/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "created_at": "2026-01-14T14:30:00",
  "send_amount_jpy": 100000,
  "receive_amount_vnd": 17305000,
  "fee_jpy": 700,
  "rate_jpy_to_vnd": 174.35,
  "input_mode": "JPY_INPUT"
}
```

**Response (500 Error - Not Found):**
```json
{
  "timestamp": "2026-01-14T14:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Simulation not found with ID: 999"
}
```

---

### 5. Get Current Exchange Rate

Get the real-time JPY to VND exchange rate.

**Endpoint:** `GET /api/transfer/exchange-rate`

**Response (200 OK):**
```json
{
  "base": "JPY",
  "target": "VND",
  "rate": 174.35,
  "description": "1 JPY = 174.35 VND"
}
```

---

### 6. Get Fee Structure

Retrieve the fee tier structure.

**Endpoint:** `GET /api/transfer/fee-structure`

**Response (200 OK):**
```json
{
  "currency": "JPY",
  "tiers": [
    {
      "min_amount": 100,
      "max_amount": 10000,
      "fee": 100
    },
    {
      "min_amount": 10001,
      "max_amount": 50000,
      "fee": 400
    },
    {
      "min_amount": 50001,
      "max_amount": 100000,
      "fee": 700
    },
    {
      "min_amount": 100001,
      "max_amount": "unlimited",
      "fee": 1000
    }
  ]
}
```

---

### 7. Calculate Fee for Amount

Calculate the fee for a specific JPY amount.

**Endpoint:** `GET /api/transfer/calculate-fee?amount={amountJpy}`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `amount` | Long | Yes | Amount in JPY |

**Example:** `GET /api/transfer/calculate-fee?amount=25000`

**Response (200 OK):**
```json
{
  "amount": 25000,
  "fee": 400,
  "currency": "JPY"
}
```

---

## Fee Structure

| Amount Range (JPY) | Fee (JPY) |
|--------------------|-----------|
| ¥100 - ¥10,000 | ¥100 |
| ¥10,001 - ¥50,000 | ¥400 |
| ¥50,001 - ¥100,000 | ¥700 |
| > ¥100,000 | ¥1,000 |

---

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "timestamp": "2026-01-14T14:30:00",
  "status": 400,
  "error": "Validation Failed",
  "details": {
    "send_amount_jpy": "Minimum amount is 100 JPY"
  }
}
```

### Invalid Amount Error (400 Bad Request)
```json
{
  "timestamp": "2026-01-14T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Minimum transfer amount is ¥100"
}
```

### Exchange Rate API Error (500 Internal Server Error)
```json
{
  "timestamp": "2026-01-14T14:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Unable to fetch exchange rate. Please try again later."
}
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXCHANGE_API_KEY` | API key from exchangerate-api.com | Required |
| `SPRING_DATASOURCE_URL` | MySQL connection URL | - |
| `SPRING_DATASOURCE_USERNAME` | Database username | - |
| `SPRING_DATASOURCE_PASSWORD` | Database password | - |

### Getting Exchange Rate API Key

1. Go to [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
2. Sign up for a free account
3. Copy your API key
4. Set it in your `.env` file as `EXCHANGE_API_KEY`

---

## Example Usage with cURL

### Preview a transfer
```bash
curl -X POST http://localhost:8080/api/transfer/preview \
  -H "Content-Type: application/json" \
  -d '{"input_mode": "JPY_INPUT", "send_amount_jpy": 50000}'
```

### Create a simulation
```bash
curl -X POST http://localhost:8080/api/transfer/simulate \
  -H "Content-Type: application/json" \
  -d '{"input_mode": "JPY_INPUT", "send_amount_jpy": 50000}'
```

### Get history
```bash
curl http://localhost:8080/api/transfer/history
```

### Get exchange rate
```bash
curl http://localhost:8080/api/transfer/exchange-rate
```

### Calculate fee
```bash
curl "http://localhost:8080/api/transfer/calculate-fee?amount=75000"
```
