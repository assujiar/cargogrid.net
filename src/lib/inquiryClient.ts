import type { Inquiry } from "./storage";

export type InquiryPayload = Omit<Inquiry, "id" | "status" | "createdAt" | "updatedAt">;

export class InquirySubmitError extends Error {
  /** True when the browser never got a response at all. */
  readonly isNetwork: boolean;
  /** True when the visitor could have fixed it themselves (bad/missing fields). */
  readonly isUserFixable: boolean;

  constructor(message: string, options: { isNetwork?: boolean; isUserFixable?: boolean } = {}) {
    super(message);
    this.name = "InquirySubmitError";
    this.isNetwork = options.isNetwork ?? false;
    this.isUserFixable = options.isUserFixable ?? false;
  }
}

const RETRY_DELAYS_MS = [600, 1800];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Posts a lead-capture inquiry to the same-origin /api/inquiry route.
 *
 * Deliberately does not touch the Supabase SDK: keeping the request on
 * cargogrid.net removes the cross-origin hop to *.supabase.co that used to fail
 * with a bare `TypeError: Failed to fetch`, and keeps the SDK out of the
 * contact page's JS bundle entirely.
 *
 * Retries only when `fetch` itself rejects — i.e. the request never got a
 * response, so the row almost certainly was not written. A request that reaches
 * the server and comes back 4xx/5xx is reported as-is rather than retried,
 * since `create_inquiry` inserts unconditionally and a blind retry there could
 * duplicate the lead.
 */
export async function submitInquiry(payload: InquiryPayload): Promise<Inquiry> {
  let lastNetworkError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    let response: Response;
    try {
      response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      lastNetworkError = err;
      if (attempt < RETRY_DELAYS_MS.length) {
        await wait(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      throw new InquirySubmitError(
        lastNetworkError instanceof Error ? lastNetworkError.message : "Network request failed",
        { isNetwork: true },
      );
    }

    const result = await response.json().catch(
      () => ({}) as { inquiry?: Inquiry; error?: string; detail?: string },
    );

    if (!response.ok) {
      // The server splits visitor-facing copy (`error`) from the technical root
      // cause (`detail`). Only the latter belongs in the console.
      if (result.detail) console.error("Inquiry submission rejected by server:", result.detail);
      throw new InquirySubmitError(result.error || `Request failed with status ${response.status}`, {
        isUserFixable: response.status === 400,
      });
    }
    if (!result.inquiry) {
      throw new InquirySubmitError("Server did not return the saved inquiry");
    }
    return result.inquiry;
  }

  // Unreachable: the loop either returns or throws.
  throw new InquirySubmitError("Network request failed", { isNetwork: true });
}
