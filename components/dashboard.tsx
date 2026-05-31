"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Leaf,
  Zap,
  Truck,
  Trash2,
  Factory,
  Calculator,
  TrendingUp,
  Gauge,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PredictionResult {
  co2: number
  conf: number
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Calculator, label: "Calculator", id: "calculator" },
  { icon: Settings, label: "Settings", id: "settings" },
  { icon: HelpCircle, label: "Help", id: "help" },
]

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("overview")

  // Form state - matching API expected variables
  const [nrg, setNrg] = useState<string>("1000")
  const [tpt, setTpt] = useState<string>("200")
  const [wst, setWst] = useState<string>("50")
  const [ops, setOps] = useState<string>("100")

  // Result state
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nrg: parseFloat(nrg) || 0,
          tpt: parseFloat(tpt) || 0,
          wst: parseFloat(wst) || 0,
          ops: parseFloat(ops) || 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get prediction")
      }

      const data: PredictionResult = await response.json()
      setResult(data)
      setActiveNav("overview")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setNrg("1000")
    setTpt("200")
    setWst("50")
    setOps("100")
    setResult(null)
    setError(null)
  }

  return (
    <div className="flex h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#27272a] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">EcoTrack</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeNav === item.id
                      ? "bg-[#27272a] text-white border-l-2 border-emerald-500"
                      : "text-[#a1a1aa] hover:text-white hover:bg-[#18181b]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#27272a]">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-white hover:bg-[#18181b] transition-colors">
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#27272a] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">Carbon Footprint Calculator</h1>
            <span className="text-[#71717a] text-sm">ML-Powered Estimation</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 h-9 pl-10 pr-4 rounded-lg bg-[#18181b] border border-[#27272a] text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Notifications */}
            <button className="w-9 h-9 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            {/* User */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-medium text-white">
                U
              </div>
              <ChevronDown className="w-4 h-4 text-[#71717a]" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeNav === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CO2 Result Card */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#a1a1aa] mb-1">Predicted CO2</p>
                        <p className="text-3xl font-bold text-white">
                          {result ? `${result.co2.toFixed(1)}` : "---"}
                        </p>
                        <p className="text-xs text-[#71717a] mt-1">kg CO2e</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Confidence Card */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#a1a1aa] mb-1">Confidence</p>
                        <p className="text-3xl font-bold text-white">
                          {result ? `${(result.conf * 100).toFixed(0)}%` : "---"}
                        </p>
                        <p className="text-xs text-[#71717a] mt-1">ML Model</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                        <Gauge className="w-6 h-6 text-teal-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Energy Input Card */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#a1a1aa] mb-1">Energy Input</p>
                        <p className="text-3xl font-bold text-white">{nrg || "0"}</p>
                        <p className="text-xs text-[#71717a] mt-1">kWh</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transport Input Card */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#a1a1aa] mb-1">Transport</p>
                        <p className="text-3xl font-bold text-white">{tpt || "0"}</p>
                        <p className="text-xs text-[#71717a] mt-1">km</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Result Display */}
                <Card className="lg:col-span-2 bg-[#18181b] border-[#27272a]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Carbon Footprint Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div className="space-y-6">
                        {/* Large Result Display */}
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-4 border-emerald-500/30 mb-4">
                            <div>
                              <p className="text-4xl font-bold text-white">{result.co2.toFixed(1)}</p>
                              <p className="text-sm text-[#a1a1aa]">kg CO2e</p>
                            </div>
                          </div>
                          <p className="text-[#a1a1aa] text-sm max-w-md mx-auto">
                            Your estimated carbon footprint based on the provided inputs. This prediction was generated using our Random Forest ML model.
                          </p>
                        </div>

                        {/* Confidence Bar */}
                        <div className="bg-[#27272a] rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#a1a1aa]">Model Confidence</span>
                            <span className="text-sm font-medium text-white">{(result.conf * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-[#3f3f46] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                              style={{ width: `${result.conf * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Input Summary */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#27272a] rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <span className="text-sm text-[#a1a1aa]">Energy</span>
                            </div>
                            <p className="text-lg font-semibold text-white">{nrg} kWh</p>
                          </div>
                          <div className="bg-[#27272a] rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Truck className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-[#a1a1aa]">Transport</span>
                            </div>
                            <p className="text-lg font-semibold text-white">{tpt} km</p>
                          </div>
                          <div className="bg-[#27272a] rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Trash2 className="w-4 h-4 text-rose-500" />
                              <span className="text-sm text-[#a1a1aa]">Waste</span>
                            </div>
                            <p className="text-lg font-semibold text-white">{wst} kg</p>
                          </div>
                          <div className="bg-[#27272a] rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Factory className="w-4 h-4 text-violet-500" />
                              <span className="text-sm text-[#a1a1aa]">Operations</span>
                            </div>
                            <p className="text-lg font-semibold text-white">{ops} hrs</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#27272a] flex items-center justify-center mb-4">
                          <Calculator className="w-10 h-10 text-[#52525b]" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No Results Yet</h3>
                        <p className="text-[#71717a] text-sm max-w-sm">
                          Enter your data in the Calculator tab to get your carbon footprint prediction from our ML model.
                        </p>
                        <Button
                          onClick={() => setActiveNav("calculator")}
                          className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Go to Calculator
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Input Panel */}
                <Card className="bg-[#18181b] border-[#27272a]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-base">Quick Calculate</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quick-nrg" className="text-[#a1a1aa] text-sm">
                        Energy (kWh)
                      </Label>
                      <Input
                        id="quick-nrg"
                        type="number"
                        value={nrg}
                        onChange={(e) => setNrg(e.target.value)}
                        className="bg-[#27272a] border-[#3f3f46] text-white"
                        placeholder="1000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quick-tpt" className="text-[#a1a1aa] text-sm">
                        Transport (km)
                      </Label>
                      <Input
                        id="quick-tpt"
                        type="number"
                        value={tpt}
                        onChange={(e) => setTpt(e.target.value)}
                        className="bg-[#27272a] border-[#3f3f46] text-white"
                        placeholder="200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quick-wst" className="text-[#a1a1aa] text-sm">
                        Waste (kg)
                      </Label>
                      <Input
                        id="quick-wst"
                        type="number"
                        value={wst}
                        onChange={(e) => setWst(e.target.value)}
                        className="bg-[#27272a] border-[#3f3f46] text-white"
                        placeholder="50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quick-ops" className="text-[#a1a1aa] text-sm">
                        Operations (hrs)
                      </Label>
                      <Input
                        id="quick-ops"
                        type="number"
                        value={ops}
                        onChange={(e) => setOps(e.target.value)}
                        className="bg-[#27272a] border-[#3f3f46] text-white"
                        placeholder="100"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                        <p className="text-sm text-rose-400">{error}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleCalculate}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeNav === "calculator" && (
            <div className="max-w-3xl mx-auto">
              <Card className="bg-[#18181b] border-[#27272a]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-500" />
                    Carbon Footprint Calculator
                  </CardTitle>
                  <p className="text-[#71717a] text-sm">
                    Enter your operational data below to estimate your carbon footprint using our ML model.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Energy Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <Label htmlFor="nrg" className="text-white font-medium">
                          Energy Consumption
                        </Label>
                        <p className="text-xs text-[#71717a]">Total electricity usage in kilowatt-hours</p>
                      </div>
                    </div>
                    <Input
                      id="nrg"
                      type="number"
                      value={nrg}
                      onChange={(e) => setNrg(e.target.value)}
                      className="bg-[#27272a] border-[#3f3f46] text-white h-12 text-lg"
                      placeholder="Enter energy in kWh"
                    />
                  </div>

                  {/* Transport Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <Label htmlFor="tpt" className="text-white font-medium">
                          Transport Distance
                        </Label>
                        <p className="text-xs text-[#71717a]">Total distance traveled in kilometers</p>
                      </div>
                    </div>
                    <Input
                      id="tpt"
                      type="number"
                      value={tpt}
                      onChange={(e) => setTpt(e.target.value)}
                      className="bg-[#27272a] border-[#3f3f46] text-white h-12 text-lg"
                      placeholder="Enter distance in km"
                    />
                  </div>

                  {/* Waste Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <Label htmlFor="wst" className="text-white font-medium">
                          Waste Generated
                        </Label>
                        <p className="text-xs text-[#71717a]">Total waste produced in kilograms</p>
                      </div>
                    </div>
                    <Input
                      id="wst"
                      type="number"
                      value={wst}
                      onChange={(e) => setWst(e.target.value)}
                      className="bg-[#27272a] border-[#3f3f46] text-white h-12 text-lg"
                      placeholder="Enter waste in kg"
                    />
                  </div>

                  {/* Operations Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Factory className="w-5 h-5 text-violet-500" />
                      </div>
                      <div>
                        <Label htmlFor="ops" className="text-white font-medium">
                          Operation Hours
                        </Label>
                        <p className="text-xs text-[#71717a]">Total operational hours</p>
                      </div>
                    </div>
                    <Input
                      id="ops"
                      type="number"
                      value={ops}
                      onChange={(e) => setOps(e.target.value)}
                      className="bg-[#27272a] border-[#3f3f46] text-white h-12 text-lg"
                      placeholder="Enter hours"
                    />
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                      <p className="text-sm text-rose-400">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 h-12 border-[#3f3f46] text-[#a1a1aa] hover:text-white hover:bg-[#27272a]"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleCalculate}
                      disabled={loading}
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-5 h-5 mr-2" />
                          Calculate CO2
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeNav === "settings" && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-[#18181b] border-[#27272a]">
                <CardHeader>
                  <CardTitle className="text-white">Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#71717a]">Settings panel coming soon.</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeNav === "help" && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-[#18181b] border-[#27272a]">
                <CardHeader>
                  <CardTitle className="text-white">Help & Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-white">How to use the Calculator</h3>
                    <p className="text-[#71717a] text-sm">
                      Enter your energy consumption, transport distance, waste generated, and operation hours
                      to get an ML-powered prediction of your carbon footprint.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-white">API Variables</h3>
                    <ul className="text-[#71717a] text-sm space-y-1">
                      <li><code className="text-emerald-400">nrg</code> - Energy consumption in kWh</li>
                      <li><code className="text-emerald-400">tpt</code> - Transport distance in km</li>
                      <li><code className="text-emerald-400">wst</code> - Waste generated in kg</li>
                      <li><code className="text-emerald-400">ops</code> - Operation hours</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
