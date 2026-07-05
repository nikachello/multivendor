"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  connectCustomDomain,
  removeCustomDomain,
  checkDomainVerification,
} from "@/lib/actions/shop";

type Props = {
  shopId: string;
  initialDomain: string | null;
  initialVerified: boolean;
  isPro: boolean;
};

export default function CustomDomainForm({
  shopId,
  initialDomain,
  initialVerified,
  isPro,
}: Props) {
  const [connectedDomain, setConnectedDomain] = useState(initialDomain);
  const [verified, setVerified] = useState(initialVerified);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const inputCls =
    "border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-gray-400 transition-all shadow-sm w-full font-mono";

  function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await connectCustomDomain(shopId, trimmed);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      setConnectedDomain(result.data.domain);
      setVerified(false);
      setInput("");
      toast.success("Domain connected. Point your CNAME record to cname.vercel-dns.com");
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCustomDomain(shopId);
      if (!result.ok) {
        toast.error("Failed to remove domain");
        return;
      }
      setConnectedDomain(null);
      setVerified(false);
      toast.success("Custom domain removed");
    });
  }

  function handleCheck() {
    startTransition(async () => {
      const result = await checkDomainVerification(shopId);
      if (!result.ok) {
        toast.error("Could not check verification status");
        return;
      }
      setVerified(result.data.verified);
      if (result.data.verified) {
        toast.success("Domain verified!");
      } else {
        toast("Not verified yet. Make sure your CNAME record is saved.");
      }
    });
  }

  if (!isPro) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
          Custom Domain
        </h2>
        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-4 bg-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-700">Connect your own domain</p>
            <p className="text-xs text-gray-400 mt-0.5">Available on the Pro plan.</p>
          </div>
          <a
            href="/dashboard/billing"
            className="px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            Upgrade to Pro
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
        Custom Domain
      </h2>

      {connectedDomain ? (
        <div className="flex flex-col gap-4">
          {/* Connected domain row */}
          <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-mono text-gray-800">{connectedDomain}</span>
              {verified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[11px] font-medium text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                  Pending
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!verified && (
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={isPending}
                  className="px-2.5 py-1 text-[12px] font-medium border border-gray-200 rounded-md hover:bg-white transition-colors disabled:opacity-50"
                >
                  Check
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className="px-2.5 py-1 text-[12px] font-medium text-red-600 border border-red-100 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>

          {/* DNS instructions */}
          {!verified && (() => {
            const isApex = connectedDomain.split(".").length === 2;
            return (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex flex-col gap-2">
                <p className="text-[12px] font-semibold text-blue-800">DNS Setup Required</p>
                {isApex ? (
                  <>
                    <p className="text-[12px] text-blue-700">
                      Add an <strong>A record</strong> to point your domain to Vercel:
                    </p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12px] font-mono">
                      <span className="text-blue-500">Type</span>
                      <span className="text-blue-900">A</span>
                      <span className="text-blue-500">Name</span>
                      <span className="text-blue-900">@</span>
                      <span className="text-blue-500">Value</span>
                      <span className="text-blue-900 select-all">76.76.21.21</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[12px] text-blue-700">
                      Add a <strong>CNAME record</strong> to point your subdomain to Vercel:
                    </p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[12px] font-mono">
                      <span className="text-blue-500">Type</span>
                      <span className="text-blue-900">CNAME</span>
                      <span className="text-blue-500">Name</span>
                      <span className="text-blue-900">{connectedDomain.split(".")[0]}</span>
                      <span className="text-blue-500">Value</span>
                      <span className="text-blue-900 select-all">cname.vercel-dns.com</span>
                    </div>
                  </>
                )}
                <p className="text-[11px] text-blue-600 mt-1">
                  DNS changes can take up to 48 hours to propagate. Click &quot;Check&quot; once saved.
                </p>
              </div>
            );
          })()}
        </div>
      ) : (
        <form onSubmit={handleConnect} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Domain</label>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="shop.yourdomain.com"
                className={inputCls}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                disabled={isPending || !input.trim()}
                className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {isPending ? "Connecting..." : "Connect"}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Works with apex domains like <span className="font-mono">ufcstore.ge</span> and subdomains like <span className="font-mono">shop.ufcstore.ge</span>. Instructions will appear after connecting.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
