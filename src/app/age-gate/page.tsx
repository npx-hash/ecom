import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { confirmAgeGateAction } from "@/actions/age-gate-actions";
import { AGE_GATE_COOKIE, resolveSafeNextPath } from "@/lib/age-gate";

type AgeGatePageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function AgeGatePage({ searchParams }: AgeGatePageProps) {
  const [params, cookieStore] = await Promise.all([searchParams, cookies()]);
  const nextPath = resolveSafeNextPath(params.next?.toString().trim(), "/");
  const errorMessage = params.error?.toString().trim();

  if (cookieStore.get(AGE_GATE_COOKIE)?.value === "1") {
    redirect(nextPath);
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      <section className="rb-panel rb-fade-up p-8 text-center">
        <p className="rb-chip">Preview Gate</p>
        <h1 className="rb-title mt-4 text-5xl">Private Access</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--rb-muted)]">
          This optional gate can be used when you want to restrict access during internal demos or
          staged testing sessions.
        </p>

        {errorMessage ? <p className="rb-alert mt-4 text-left">{errorMessage}</p> : null}

        <form action={confirmAgeGateAction} className="mt-6 space-y-3">
          <input type="hidden" name="next" value={nextPath} />
          <button type="submit" name="isOfAge" value="yes" className="rb-btn w-full">
            Continue to storefront
          </button>
          <button type="submit" name="isOfAge" value="no" className="rb-btn-danger w-full !py-2.5">
            Stay blocked
          </button>
        </form>

        <p className="mt-5 text-xs uppercase tracking-[0.12em] text-[var(--rb-muted)]">
          Disable middleware gate if you want open local access.
        </p>
      </section>
    </div>
  );
}
