/**
 * OneCompilerHub — Privacy-Conscious Analytics & Telemetry Helper
 *
 * Lightweight, privacy-preserving event tracker that does not capture
 * any sensitive data, personal information (PII), or user code.
 */

export type AnalyticsEventName =
  | "tool_viewed"
  | "editor_opened"
  | "template_selected"
  | "search_executed"
  | "theme_toggled"
  | "export_zip"
  | "run_code_attempt";

export interface AnalyticsEventProps {
  toolSlug?: string;
  category?: string;
  templateId?: string;
  theme?: string;
  searchLength?: number;
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks an anonymous interaction event.
 * Never logs user code, secrets, or personally identifiable information.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  props: AnalyticsEventProps = {}
): void {
  if (typeof window === "undefined") return;

  // Filter out any potential sensitive fields defensively
  const safeProps: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    ...props,
  };
  delete safeProps.code;
  delete safeProps.password;
  delete safeProps.email;
  delete safeProps.token;

  // Google Analytics / GTag compatibility if active
  if (typeof window.gtag === "function") {
    try {
      window.gtag("event", eventName, safeProps);
    } catch {
      // Ignore tracker failures silently
    }
  }

  // Debug logging in non-production environments
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug(`[Analytics Event] ${eventName}:`, safeProps);
  }
}
