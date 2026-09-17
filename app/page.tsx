import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const portalHref = isAdmin ? "/admin" : "/dashboard";
  const portalLabel = isAdmin ? "Admin Console" : "Open Dashboard";
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Top Navbar */}
      <nav className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-600/30">
            CP
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block">Civic Prime Global</span>
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">Institutional Banking & Wealth</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#about" className="hover:text-indigo-400 transition-colors">About Us</a>
          <a href="#services" className="hover:text-indigo-400 transition-colors">Services</a>
          <a href="#markets" className="hover:text-indigo-400 transition-colors">Live Markets</a>
          <a href="#investments" className="hover:text-indigo-400 transition-colors">Investment Plans</a>
          <a href="#loans" className="hover:text-indigo-400 transition-colors">Loans</a>
          <a href="#news" className="hover:text-indigo-400 transition-colors">News</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href={portalHref} className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/25">
            {portalLabel} →
          </Link>
        </div>
      </nav>

      {/* Stock Market Ticker Bar */}
      <div className="ticker-viewport bg-slate-900 border-b border-slate-800 py-2 text-xs font-mono">
        <div className="ticker-track gap-12 px-6 text-slate-400">
          <div className="inline-flex shrink-0 gap-12">
          <span><strong className="text-white">S&P 500:</strong> 5,842.10 <span className="text-emerald-400">+1.24%</span></span>
          <span><strong className="text-white">NASDAQ:</strong> 18,310.45 <span className="text-emerald-400">+1.89%</span></span>
          <span><strong className="text-white">BTC/USD:</strong> $92,450.00 <span className="text-emerald-400">+3.45%</span></span>
          <span><strong className="text-white">EUR/USD:</strong> 1.0892 <span className="text-red-400">-0.12%</span></span>
          <span><strong className="text-white">GOLD:</strong> $2,684.50 <span className="text-emerald-400">+0.65%</span></span>
          <span><strong className="text-white">AAPL:</strong> $224.10 <span className="text-emerald-400">+0.82%</span></span>
          </div>
          <div className="inline-flex shrink-0 gap-12" aria-hidden="true">
            <span><strong className="text-white">S&amp;P 500:</strong> 5,842.10 <span className="text-emerald-400">+1.24%</span></span>
            <span><strong className="text-white">NASDAQ:</strong> 18,310.45 <span className="text-emerald-400">+1.89%</span></span>
            <span><strong className="text-white">BTC/USD:</strong> $92,450.00 <span className="text-emerald-400">+3.45%</span></span>
            <span><strong className="text-white">EUR/USD:</strong> 1.0892 <span className="text-red-400">-0.12%</span></span>
            <span><strong className="text-white">GOLD:</strong> $2,684.50 <span className="text-emerald-400">+0.65%</span></span>
            <span><strong className="text-white">AAPL:</strong> $224.10 <span className="text-emerald-400">+0.82%</span></span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative px-8 py-24 max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest">
          Global Multi-Asset Clearing & Wealth Architecture
        </span>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight">
          Institutional Liquidity, Advanced Trading & Global Wealth Management
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
          Empowering corporations, high-net-worth investors, and fintech innovators with enterprise virtual cards, multi-currency vaults, and real-time market access.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href={portalHref} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xl shadow-indigo-600/30">
            {portalLabel}
          </Link>
          <a href="#markets" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold rounded-xl text-sm transition-all">
            Explore Markets & Rates
          </a>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">About Civic Prime Global</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Decades of Trust in Global Financial Infrastructure</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Founded on principles of unwavering security, transparency, and high-speed execution, Civic Prime Global delivers tier-one banking services across jurisdictions. We bridge traditional banking compliance with modern digital asset management.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4 font-mono">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-2xl font-bold text-white block">$4.8B+</span>
                <span className="text-xs text-slate-400 uppercase">Daily Settled Volume</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <span className="text-2xl font-bold text-indigo-400 block">140+</span>
                <span className="text-xs text-slate-400 uppercase">Global Jurisdictions</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">🛡️</div>
              <div>
                <h4 className="text-sm font-semibold text-white">Institutional Grade Security</h4>
                <p className="text-xs text-slate-400">SOC2 Type II certified with multi-signature cold storage.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">⚡</div>
              <div>
                <h4 className="text-sm font-semibold text-white">Sub-Millisecond Settlement</h4>
                <p className="text-xs text-slate-400">Automated SWIFT and Fedwire automated matching engines.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-24 border-t border-slate-800/80 max-w-7xl mx-auto px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Comprehensive Solutions</span>
          <h2 className="text-3xl font-bold text-white">Core Institutional Services</h2>
          <p className="text-slate-400 text-sm">Tailored financial architecture designed for modern global enterprises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">💳</div>
            <h3 className="text-base font-semibold text-white">Virtual & Corporate Cards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Issue instant single or multi-use virtual cards with customized spend limits and automated receipt matching.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">🌐</div>
            <h3 className="text-base font-semibold text-white">Cross-Border Wire Warrants</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Send and receive SWIFT and Fedwire transfers across 40+ currencies with real-time FX conversion.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4 hover:border-indigo-500/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">⚡</div>
            <h3 className="text-base font-semibold text-white">Programmatic API Payouts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Integrate webhooks and REST endpoints to automate institutional payouts and treasury ledger updates.</p>
          </div>
        </div>
      </section>

      {/* Live Stock Market Table & Currency Widget */}
      <section id="markets" className="py-24 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Real-Time Data Feeds</span>
            <h2 className="text-3xl font-bold text-white">Global Equities & Currency Converter</h2>
            <p className="text-slate-400 text-sm">Monitor live asset prices and calculate cross-border conversions instantly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Stock Table */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">Active Equities & Commodities</h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LIVE FEED</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-6">Instrument</th>
                      <th className="py-3 px-6">Price (USD)</th>
                      <th className="py-3 px-6">24h Change</th>
                      <th className="py-3 px-6 text-right">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-white">Apple Inc. (AAPL)</td>
                      <td className="py-3.5 px-6">$224.10</td>
                      <td className="py-3.5 px-6 text-emerald-400">+0.82%</td>
                      <td className="py-3.5 px-6 text-right text-slate-400">$3.42T</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-white">Microsoft Corp. (MSFT)</td>
                      <td className="py-3.5 px-6">$432.80</td>
                      <td className="py-3.5 px-6 text-emerald-400">+1.15%</td>
                      <td className="py-3.5 px-6 text-right text-slate-400">$3.21T</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-white">NVIDIA Corp. (NVDA)</td>
                      <td className="py-3.5 px-6">$128.50</td>
                      <td className="py-3.5 px-6 text-emerald-400">+3.40%</td>
                      <td className="py-3.5 px-6 text-right text-slate-400">$3.15T</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-6 font-bold text-white">Gold Spot (XAU)</td>
                      <td className="py-3.5 px-6">$2,684.50</td>
                      <td className="py-3.5 px-6 text-emerald-400">+0.65%</td>
                      <td className="py-3.5 px-6 text-right text-slate-400">17.2T</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Currency Conversion Widget */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">Institutional FX Calculator</h3>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Amount to Convert</label>
                    <input type="number" defaultValue="10000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">From</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">To</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-200">
                        <option>EUR (€)</option>
                        <option>USD ($)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Converted Settlement Value</span>
                <div className="text-lg font-bold text-emerald-400">€9,180.45 EUR</div>
                <span className="text-[10px] text-slate-500">Zero FX markup for tier-1 accounts.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Investment Plans Pricing Cards */}
      <section id="investments" className="py-24 border-t border-slate-800/80 max-w-7xl mx-auto px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Yield Portfolios</span>
          <h2 className="text-3xl font-bold text-white">Structured Investment Plans</h2>
          <p className="text-slate-400 text-sm">Choose an institutional allocation tier designed for consistent quarterly yield.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400">LIQUID TREASURY</span>
              <h3 className="text-2xl font-bold text-white mt-2">5.4% <span className="text-xs text-slate-400 font-normal">APY Yield</span></h3>
              <p className="text-xs text-slate-400 mt-2">Short-term government backed paper with daily liquidity and zero lock-up.</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 font-mono border-t border-slate-800 pt-4">
              <li>✓ Daily Interest Accrual</li>
              <li>✓ FDIC Insured Sweep</li>
              <li>✓ Instant Withdrawal</li>
            </ul>
            <Link href="/login" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-center text-white font-semibold rounded-xl text-xs transition-colors">
              Select Plan
            </Link>
          </div>

          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500 p-8 rounded-2xl shadow-2xl flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 right-8 bg-indigo-600 text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400">CORPORATE GROWTH</span>
              <h3 className="text-2xl font-bold text-white mt-2">12.8% <span className="text-xs text-slate-400 font-normal">Target IRR</span></h3>
              <p className="text-xs text-slate-400 mt-2">Diversified allocation across private credit, venture debt, and blue-chip equities.</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 font-mono border-t border-slate-800 pt-4">
              <li>✓ Quarterly Distributions</li>
              <li>✓ Dedicated Portfolio Manager</li>
              <li>✓ Advanced Tax Reporting</li>
            </ul>
            <Link href="/login" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-center text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/30">
              Select Plan
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400">PRIME SOVEREIGN</span>
              <h3 className="text-2xl font-bold text-white mt-2">18.5% <span className="text-xs text-slate-400 font-normal">Target IRR</span></h3>
              <p className="text-xs text-slate-400 mt-2">Exclusive private equity and venture capital syndicate syndications for ultra-HNWIs.</p>
            </div>
            <ul className="space-y-3 text-xs text-slate-300 font-mono border-t border-slate-800 pt-4">
              <li>✓ Private Deal Flow Access</li>
              <li>✓ Custom Escrow Structuring</li>
              <li>✓ Concierge Wealth Services</li>
            </ul>
            <Link href="/login" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-center text-white font-semibold rounded-xl text-xs transition-colors">
              Select Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Loan Features Section */}
      <section id="loans" className="py-24 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Asset-Backed Financing</span>
            <h2 className="text-3xl font-bold text-white">Instant Institutional Credit & Loans</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leverage your corporate holdings, real estate portfolios, or digital asset vaults to secure instant liquidity without triggering taxable events.
            </p>
            <ul className="space-y-3 text-xs text-slate-300 font-mono">
              <li>✓ Low Interest Rates Starting at 4.2% APR</li>
              <li>✓ No Credit Checks Required (Asset-Backed)</li>
              <li>✓ Flexible Repayment Schedules & Bullet Options</li>
            </ul>
            <div>
              <Link href="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/20 inline-block">
                Apply for Credit Line →
              </Link>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">Loan Calculator Simulation</h3>
            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Borrowing Amount ($ USD)</label>
                <input type="text" readOnly value="$250,000.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Collateral Asset</label>
                <input type="text" readOnly value="Institutional BTC & Treasury Vault" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" />
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Estimated Monthly Payment:</span>
                <span className="text-emerald-400 font-bold">$2,410.50 / mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-24 border-t border-slate-800/80 max-w-7xl mx-auto px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Market Intelligence</span>
          <h2 className="text-3xl font-bold text-white">Latest Financial News & Insights</h2>
          <p className="text-slate-400 text-sm">Expert commentary on macroeconomic trends and digital asset regulation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">MACROECONOMICS</span>
              <h3 className="text-base font-semibold text-white">Federal Reserve Signals Steady Rates Amid Strong Corporate Earnings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Analysts review the latest FOMC statement and its implications for global equity valuations and treasury yields.</p>
            </div>
            <div className="p-6 pt-0 border-t border-slate-800 mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>September 15, 2026</span>
              <span className="text-indigo-400 hover:underline cursor-pointer">Read Article →</span>
            </div>
          </article>

          <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">FINTECH INFRASTRUCTURE</span>
              <h3 className="text-base font-semibold text-white">The Rise of Programmatic API Wires in Cross-Border Settlement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">How automated webhook clearing is cutting corporate treasury settlement times from 3 business days to under 5 seconds.</p>
            </div>
            <div className="p-6 pt-0 border-t border-slate-800 mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>September 12, 2026</span>
              <span className="text-indigo-400 hover:underline cursor-pointer">Read Article →</span>
            </div>
          </article>

          <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="p-6 space-y-3">
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">SECURITY & COMPLIANCE</span>
              <h3 className="text-base font-semibold text-white">Navigating SOC2 Type II Compliance in Multi-Tenant Cloud Architectures</h3>
              <p className="text-xs text-slate-400 leading-relaxed">An inside look at how institutional platforms maintain immutable audit logs and encrypted tenant isolation.</p>
            </div>
            <div className="p-6 pt-0 border-t border-slate-800 mt-4 flex justify-between items-center text-xs text-slate-500">
              <span>September 08, 2026</span>
              <span className="text-indigo-400 hover:underline cursor-pointer">Read Article →</span>
            </div>
          </article>
        </div>
      </section>

      {/* Review & Rating Section */}
      <section className="py-24 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">Client Testimonials</span>
            <h2 className="text-3xl font-bold text-white">Trusted by Global Leaders</h2>
            <p className="text-slate-400 text-sm">See what institutional treasurers and founders have to say about Civic Prime Global.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
              <div className="text-amber-400 text-sm font-mono">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Civic Prime Global transformed our corporate expense workflows. Issuing virtual cards and managing multi-currency treasury vaults has never been smoother."
              </p>
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-white block">Marcus Vance</span>
                <span className="text-[10px] text-slate-400 font-mono">CFO, Apex Global Technologies</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
              <div className="text-amber-400 text-sm font-mono">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "The API payout integration is lightning fast. We process thousands of international settlements daily with zero friction."
              </p>
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-white block">Sarah Jenkins</span>
                <span className="text-[10px] text-slate-400 font-mono">Head of Engineering, EuroTech UK</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
              <div className="text-amber-400 text-sm font-mono">★★★★★</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                "Unmatched security and professional support. Their asset-backed loan lines saved us from liquidating our long-term holdings."
              </p>
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-white block">Dr. Alistair Thorne</span>
                <span className="text-[10px] text-slate-400 font-mono">Managing Director, Thorne Capital</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment Form Section */}
      <section className="py-24 border-t border-slate-800/80 max-w-4xl mx-auto px-8">
        <div className="bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-semibold text-white">Leave Feedback or Inquire with Our Desk</h3>
            <p className="text-xs text-slate-400 mt-1">Our institutional relationship managers respond within 2 business hours.</p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Institutional Email</label>
                <input type="email" placeholder="john@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Feedback or Inquiry</label>
              <textarea rows={4} placeholder="Type your message or inquiry here..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="button" className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/25">
                Submit Feedback / Inquiry
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 px-8 text-center text-xs text-slate-500 space-y-4">
        <p>© 2026 Civic Prime Global N.A. All rights reserved. Regulated by international financial authorities.</p>
        <div className="flex justify-center gap-6 font-mono">
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400">Terms of Service</a>
          <a href="#" className="hover:text-slate-400">Regulatory Disclosures</a>
        </div>
      </footer>

    </div>
  );
}