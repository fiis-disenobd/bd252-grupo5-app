"use client";

import Image from "next/image";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
}

export function TopBar({ title = "Monitoreo de Operaciones", showSearch = true }: TopBarProps) {
  return (
    <header className="flex flex-shrink-0 items-center justify-between whitespace-nowrap border-b border-zinc-200 bg-white px-6 py-3">
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      <div className="flex flex-1 items-center justify-end gap-4">
        {showSearch && (
          <label className="relative flex min-w-40 max-w-64 flex-col">
            <div className="flex h-10 w-full flex-1 items-stretch rounded-lg">
              <div className="flex items-center justify-center rounded-l-lg border border-zinc-300 bg-zinc-100 pl-3 text-zinc-400">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                className="form-input h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg border border-l-0 border-zinc-300 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Buscar operaciones..."
              />
            </div>
          </label>
        )}
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-zinc-300 bg-white text-zinc-600 transition-colors hover:bg-zinc-100">
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </button>
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhLcJ5DpgX_ztNj8oriyUrpf-kq8Gis_b23ACjDWvjAp-nBzXOfOdsRlm3IPjfKLn-U5dSU-RxR_CzV-yLkJupfcVfwRHiSMhhS1ND5F7xbsOvGtG_xRbSXPFrXJFGl32lLpnP3sBJTGQ7aIlQmmg1z79vAudn0c2Vs6C3N2x-yxDFzcX_AbcFVp_-MDikRPtELSV4n_NZVCNmSMgDx9jrPvNrFruuMASevmMXoh1aUA4cO4O-JlgJut6FmwNCYpr0NG3azU3pmWKq"
            alt="User avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
