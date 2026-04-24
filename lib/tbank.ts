import crypto from "node:crypto";

type Primitive = string | number | boolean | null | undefined;

type TBankTaxation =
  | "osn"
  | "usn_income"
  | "usn_income_outcome"
  | "patent"
  | "envd"
  | "esn";

type TBankTax =
  | "none"
  | "vat0"
  | "vat10"
  | "vat20"
  | "vat110"
  | "vat120";

type TBankPaymentMethod =
  | "full_prepayment"
  | "prepayment"
  | "advance"
  | "full_payment"
  | "partial_payment"
  | "credit"
  | "credit_payment";

type TBankPaymentObject =
  | "commodity"
  | "excise"
  | "job"
  | "service"
  | "gambling_bet"
  | "gambling_prize"
  | "lottery"
  | "lottery_prize"
  | "intellectual_activity"
  | "payment"
  | "agent_commission"
  | "composite"
  | "another";

type TBankReceiptItem = {
  Name: string;
  Price: number;
  Quantity: number;
  Amount: number;
  Tax: TBankTax;
  PaymentMethod: TBankPaymentMethod;
  PaymentObject: TBankPaymentObject;
};

type TBankReceipt = {
  Email?: string;
  Phone?: string;
  Taxation: TBankTaxation;
  Items: TBankReceiptItem[];
};

type InitPayload = {
  TerminalKey: string;
  Amount: number;
  OrderId: string;
  Description?: string;
  NotificationURL?: string;
  SuccessURL?: string;
  FailURL?: string;
  CustomerKey?: string;
  Language?: "ru" | "en";
  PayType?: "O" | "T";
  Receipt?: TBankReceipt;
  Token: string;
};

type InitResponse = {
  Success: boolean;
  ErrorCode: string;
  TerminalKey?: string;
  Status?: string;
  PaymentId?: string | number;
  OrderId?: string;
  Amount?: number;
  PaymentURL?: string;
  Message?: string;
  Details?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

export function getTBankTerminalKey(): string {
  return getRequiredEnv("TINKOFF_TERMINAL_KEY");
}

export function getTBankPassword(): string {
  return getRequiredEnv("TINKOFF_PASSWORD");
}

export function getTBankApiUrl(): string {
  return (
    process.env.TINKOFF_API_URL?.trim() || "https://securepay.tinkoff.ru/v2"
  ).replace(/\/+$/, "");
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "https://www.ateliaai.ru"
  ).replace(/\/+$/, "");
}

export function getTBankTaxation(): TBankTaxation {
  return (
    (process.env.TINKOFF_TAXATION?.trim() as TBankTaxation | undefined) ||
    "usn_income"
  );
}

function normalizeValue(value: Primitive): string {
  if (value === null || typeof value === "undefined") return "";
  return String(value);
}

export function createTBankToken(
  values: Record<string, Primitive>,
  password = getTBankPassword(),
): string {
  const tokenSource = Object.entries({
    ...values,
    Password: password,
  })
    .filter(([, value]) => {
      return (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      );
    })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => normalizeValue(value))
    .join("");

  return crypto.createHash("sha256").update(tokenSource).digest("hex");
}

export function verifyTBankToken(payload: Record<string, unknown>): boolean {
  const providedToken =
    typeof payload.Token === "string" ? payload.Token.trim() : "";

  if (!providedToken) {
    return false;
  }

  const source: Record<string, Primitive> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (key === "Token") continue;

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      source[key] = value;
    }
  }

  const expectedToken = createTBankToken(source);
  return expectedToken === providedToken;
}

export function buildTBankReceipt(params: {
  email?: string | null;
  phone?: string | null;
  itemName: string;
  amountRub: number;
}): TBankReceipt {
  const amountKopecks = params.amountRub * 100;

  return {
    Email: params.email?.trim() || undefined,
    Phone: params.phone?.trim() || undefined,
    Taxation: getTBankTaxation(),
    Items: [
      {
        Name: params.itemName,
        Price: amountKopecks,
        Quantity: 1,
        Amount: amountKopecks,
        Tax: "none",
        PaymentMethod: "full_payment",
        PaymentObject: "service",
      },
    ],
  };
}

export async function initTBankPayment(params: {
  amountRub: number;
  orderId: string;
  description: string;
  customerKey: string;
  notificationURL: string;
  successURL: string;
  failURL: string;
  receipt?: TBankReceipt;
}): Promise<InitResponse> {
  const TerminalKey = getTBankTerminalKey();

  const bodyWithoutToken = {
    TerminalKey,
    Amount: params.amountRub * 100,
    OrderId: params.orderId,
    Description: params.description,
    CustomerKey: params.customerKey,
    NotificationURL: params.notificationURL,
    SuccessURL: params.successURL,
    FailURL: params.failURL,
    Language: "ru" as const,
    PayType: "O" as const,
  };

  const body: InitPayload = {
    ...bodyWithoutToken,
    Receipt: params.receipt,
    Token: createTBankToken(bodyWithoutToken),
  };

  const response = await fetch(`${getTBankApiUrl()}/Init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json()) as InitResponse;

  if (!response.ok) {
    throw new Error(data.Details || data.Message || "T-Bank Init request failed");
  }

  if (!data.Success || !data.PaymentURL || !data.PaymentId) {
    throw new Error(
      data.Details || data.Message || "T-Bank did not return payment URL",
    );
  }

  return data;
}
