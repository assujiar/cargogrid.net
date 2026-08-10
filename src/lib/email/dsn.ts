/**
 * Parses a bounce message (Delivery Status Notification) into a verdict.
 *
 * This is the half of bounce tracking that SMTP cannot give us. A relay accepts
 * a message with 250, decides seconds later that the mailbox does not exist,
 * and mails a DSN back to the return-path. Nothing in the send path ever sees
 * it, so without reading those the bounce rate reads 0% while a fifth of the
 * list is undeliverable — which is exactly the state that gets a domain
 * blacklisted, because nobody is looking at the number that would have warned
 * them.
 *
 * Two formats have to be handled. RFC 3464 machine-readable DSNs carry a
 * `message/delivery-status` part with `Final-Recipient` and `Status` fields,
 * and those are parsed exactly. Plenty of servers — including several Indonesian
 * ISPs — send prose instead, so there is a fallback that reads the human text.
 * The fallback is deliberately conservative: an address it is not sure about is
 * better left unrecorded than wrongly suppressed, because suppression silently
 * removes a real customer from every future mailing.
 */

export interface BounceVerdict {
  email: string;
  /** hard = the address is permanently gone; soft = try again later. */
  type: "hard" | "soft";
  /** RFC 3463 enhanced status code, when the DSN provided one. */
  status?: string;
  detail: string;
}

/** Addresses that are never the bounced recipient, only the messenger. */
const NOT_A_RECIPIENT =
  /^(postmaster|mailer-daemon|mail|noreply|no-reply|abuse|bounce[sd]?|root|admin)@/i;

function cleanAddress(raw: string): string {
  return raw
    .trim()
    .replace(/^rfc822\s*;\s*/i, "")
    .replace(/^<|>$/g, "")
    .replace(/^"|"$/g, "")
    .trim()
    .toLowerCase();
}

function isPlausibleAddress(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(value) && !NOT_A_RECIPIENT.test(value);
}

/**
 * RFC 3463 enhanced status codes: 5.x.x is permanent, 4.x.x is transient.
 *
 * The one deliberate exception is 5.2.2 — "mailbox full". It is reported as
 * permanent but describes a temporary condition, and suppressing a real
 * customer because their inbox was full on a Tuesday is a worse error than
 * mailing them once more.
 */
function classifyStatus(status: string | undefined, text: string): "hard" | "soft" | null {
  const code = (status || "").trim();

  if (/^5\.2\.2$/.test(code)) return "soft";
  if (/^5\./.test(code)) return "hard";
  if (/^4\./.test(code)) return "soft";

  const lower = text.toLowerCase();

  if (/mailbox (is )?full|over ?quota|quota exceeded|insufficient (system )?storage/.test(lower)) return "soft";
  if (/temporar|try again|deferred|greylist|rate limit|too many|throttl|timed? ?out|connection refused/.test(lower)) return "soft";

  if (
    /user unknown|unknown user|no such user|no such recipient|does not exist|doesn'?t exist|not found|unrouteable|unroutable|invalid recipient|recipient rejected|address rejected|mailbox unavailable|no mailbox|account (has been )?(disabled|closed|suspended)/
      .test(lower)
  ) {
    return "hard";
  }

  // Nothing conclusive. Say so rather than guessing.
  return null;
}

/**
 * Extracts every failed recipient from one raw bounce message.
 *
 * Returns an empty array when the message is not a bounce at all, or when it is
 * one but nothing could be established with confidence — the caller records
 * only what this returns, so an empty result costs a missing data point rather
 * than a wrongly suppressed customer.
 */
export function parseDsn(raw: string): BounceVerdict[] {
  if (!raw) return [];

  const verdicts = new Map<string, BounceVerdict>();

  // --- RFC 3464: the machine-readable form ----------------------------------
  // Fields repeat once per failed recipient, so they are walked in order and
  // each Final-Recipient is paired with the Action/Status that follow it.
  const perRecipientBlocks = raw.split(/\n(?=Final-Recipient:)/i).slice(1);

  for (const block of perRecipientBlocks) {
    const address = cleanAddress(block.match(/^Final-Recipient:\s*(.+)$/im)?.[1] || "");
    if (!isPlausibleAddress(address)) continue;

    const action = block.match(/^Action:\s*(\w+)/im)?.[1]?.toLowerCase();
    const status = block.match(/^Status:\s*([245]\.\d+\.\d+)/im)?.[1];
    const diagnostic = block.match(/^Diagnostic-Code:\s*(.+(?:\n[ \t]+.+)*)/im)?.[1]?.replace(/\s+/g, " ").trim();

    // "delayed" is a warning that delivery is still being retried, not a
    // failure. Recording it would bounce an address that may yet arrive.
    if (action === "delayed") continue;

    const type = classifyStatus(status, `${diagnostic || ""} ${block}`);
    if (!type && action !== "failed") continue;

    verdicts.set(address, {
      email: address,
      type: type || "hard",
      status,
      detail: (diagnostic || `DSN status ${status || "tidak diketahui"}`).slice(0, 500),
    });
  }

  // A message that carried RFC 3464 blocks has already been read definitively.
  // Falling through to the prose reader would let it second-guess that — and
  // in the one case that matters, override a deliberate "this is only a delay,
  // do not record it" with a bounce scraped out of the human-readable copy of
  // the same event.
  if (perRecipientBlocks.length > 0) return Array.from(verdicts.values());

  // --- Fallback: prose bounces ---------------------------------------------
  // Only attempted when the message looks like a bounce, so an ordinary reply
  // that happens to quote an address cannot be mistaken for one.
  const looksLikeBounce =
    /undelivered mail|delivery status notification|returned to sender|delivery has failed|failure notice|mail delivery (failed|subsystem)|could not be delivered|wasn'?t delivered/i
      .test(raw);
  if (!looksLikeBounce) return [];

  // Both gates — it reads as a bounce, and the text states a conclusive reason —
  // have to pass before any address is harvested. Only then is a plain scan of
  // the body safe enough to use.
  const type = classifyStatus(undefined, raw);
  if (!type) return [];

  const candidates = new Set<string>();
  for (const match of raw.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    candidates.add(cleanAddress(match[0]));
  }

  for (const address of candidates) {
    if (!isPlausibleAddress(address)) continue;
    // Our own domain appears in every bounce as the sender being notified.
    if (/@cargogrid\.net$/i.test(address)) continue;
    verdicts.set(address, {
      email: address,
      type,
      detail: (raw.match(/^.*(?:said|failed|error|reason).*$/im)?.[0] || "Bounce tanpa kode status")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 500),
    });
  }

  return Array.from(verdicts.values());
}
