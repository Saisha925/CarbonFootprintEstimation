"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  Download,
  BarChart2,
  PieChartIcon,
  Leaf,
  Settings,
  Home,
  FileText,
  HelpCircle,
  ChevronRight,
  AlertTriangle,
  TrendingDown,
  Award,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Color palette - eco-friendly tech colors
const COLORS = ["#4ade80", "#2dd4bf", "#38bdf8", "#a78bfa", "#f87171"]
const CHART_COLORS = {
  energy: "#4ade80",
  materials: "#2dd4bf",
  operations: "#38bdf8",
  transport: "#a78bfa",
  waste: "#f87171",
}

const sectorList = [
  "Manufacturing",
  "Retail",
  "Logistics",
  "IT/Software",
  "Healthcare",
  "Hospitality",
  "Food & Beverage",
]
const transportList = ["truck", "car", "train", "airplane", "bike", "ship"]

export default function Dashboard() {
  // Form inputs
  const [hours, setHours] = useState(40)
  const [energy, setEnergy] = useState(1000)
  const [material, setMaterial] = useState(500)
  const [waste, setWaste] = useState(50)
  const [output, setOutput] = useState(100)
  const [distance, setDistance] = useState(200)
  const [sector, setSector] = useState("Manufacturing")
  const [transport, setTransport] = useState("truck")

  // Results
  const [prediction, setPrediction] = useState(0)
  const [pieData, setPieData] = useState([])
  const [barData, setBarData] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [metrics, setMetrics] = useState({
    energyEfficiency: 0,
    materialEfficiency: 0,
    transportEfficiency: 0,
    overallScore: 0,
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [hasCalculated, setHasCalculated] = useState(false)

  const handlePredict = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        body: JSON.stringify({
          hours,
          energy,
          material,
          waste,
          output,
          distance,
          sector,
          transport,
        }),
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      setPrediction(data.prediction)
      setPieData(data.pieData)
      setBarData(data.barData)
      setRecommendations(data.recommendations)
      setMetrics(data.metrics)
      setHasCalculated(true)
      setActiveTab("results")
    } catch (error) {
      console.error("Error predicting emissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const reportData = {
      inputs: {
        hours,
        energy,
        material,
        waste,
        output,
        distance,
        sector,
        transport,
      },
      results: {
        prediction,
        pieData,
        barData,
        recommendations,
        metrics,
        timestamp: new Date().toISOString(),
      },
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `co2-emissions-report-${new Date().toLocaleDateString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#0a0f1a]">
        <Sidebar className="border-r border-[#1e293b]">
          <SidebarHeader className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-[#4ade80]" />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={activeTab === "dashboard"}
                  onClick={() => setActiveTab("dashboard")}
                >
                  <Home className="mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Calculator"
                  isActive={activeTab === "calculator"}
                  onClick={() => setActiveTab("calculator")}
                >
                  <Settings className="mr-2" />
                  <span>Calculator</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Results"
                  isActive={activeTab === "results"}
                  onClick={() => (hasCalculated ? setActiveTab("results") : setActiveTab("calculator"))}
                >
                  <BarChart2 className="mr-2" />
                  <span>Results</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Reports"
                  isActive={activeTab === "reports"}
                  onClick={() => setActiveTab("reports")}
                >
                  <FileText className="mr-2" />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Help" isActive={activeTab === "help"} onClick={() => setActiveTab("help")}>
                  <HelpCircle className="mr-2" />
                  <span>Help</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="px-4 py-2">
            <div className="text-xs text-muted-foreground">v1.0.0 </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🌱 EcoTrack: Carbon Footprint Estimator</h1>
              <p className="text-muted-foreground">Predict and analyze your carbon footprint</p>
            </div>
            <div className="flex space-x-2">
              <SidebarTrigger />
              {hasCalculated && (
                <Button variant="outline" className="flex items-center gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              )}
            </div>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#111827] text-white border-[#1e293b] col-span-2">
                  <CardHeader>
                    <CardTitle>Welcome to EcoTrack</CardTitle>
                    <CardDescription className="text-gray-400">
                      Your AI-powered carbon emission calculator
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-md overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        poster="/placeholder.svg?height=400&width=800"
                      >
                        <source
                          src="https://drive.google.com/uc?export=preview&id=1tIU9KWg4VD02pD368vBuqT_Tcf6-u28S"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="mt-4 space-y-4">
                      <p className="text-gray-300">
                        EcoTrack helps businesses calculate, track, and reduce their carbon emissions with AI-powered
                        insights and recommendations.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#4ade80] text-black">AI-Powered</Badge>
                        <Badge className="bg-[#2dd4bf] text-black">Eco-Friendly</Badge>
                        <Badge className="bg-[#38bdf8] text-black">Data-Driven</Badge>
                        <Badge className="bg-[#a78bfa] text-black">Sustainable</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="bg-[#4ade80] hover:bg-[#22c55e] text-black"
                      onClick={() => setActiveTab("calculator")}
                    >
                      Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Global CO₂ Emissions</span>
                        <span className="text-sm font-medium">36.3 GT</span>
                      </div>
                      <Progress value={75} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#f87171]" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Industrial Contribution</span>
                        <span className="text-sm font-medium">24%</span>
                      </div>
                      <Progress value={24} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#a78bfa]" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Transport Contribution</span>
                        <span className="text-sm font-medium">16%</span>
                      </div>
                      <Progress value={16} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#38bdf8]" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Energy Contribution</span>
                        <span className="text-sm font-medium">31%</span>
                      </div>
                      <Progress value={31} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#4ade80]" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-[#f87171]" />
                      Climate Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Every ton of CO₂ contributes to global warming. The average business emits 100-1000 tons annually.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingDown className="mr-2 h-5 w-5 text-[#4ade80]" />
                      Reduction Potential
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Most businesses can reduce emissions by 20-40% with proper strategies and technology adoption.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="mr-2 h-5 w-5 text-[#a78bfa]" />
                      Business Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      Reducing emissions can lead to cost savings, improved brand image, and regulatory compliance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "calculator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#111827] text-white border-[#1e293b]">
                <CardHeader>
                  <CardTitle>Business Parameters</CardTitle>
                  <CardDescription className="text-gray-400">Enter your business operation details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours">Operation Hours</Label>
                      <Input
                        id="hours"
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="bg-[#1e293b] border-[#2d3748]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="energy">Energy (kWh)</Label>
                      <Input
                        id="energy"
                        type="number"
                        value={energy}
                        onChange={(e) => setEnergy(Number(e.target.value))}
                        className="bg-[#1e293b] border-[#2d3748]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material">Material Used (kg)</Label>
                      <Input
                        id="material"
                        type="number"
                        value={material}
                        onChange={(e) => setMaterial(Number(e.target.value))}
                        className="bg-[#1e293b] border-[#2d3748]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waste">Material Waste (kg)</Label>
                      <Input
                        id="waste"
                        type="number"
                        value={waste}
                        onChange={(e) => setWaste(Number(e.target.value))}
                        className="bg-[#1e293b] border-[#2d3748]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Business Sector</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger className="bg-[#1e293b] border-[#2d3748]">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectorList.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111827] text-white border-[#1e293b]">
                <CardHeader>
                  <CardTitle>Production & Transport</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter your production and transport details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="output">Product Output Units</Label>
                      <Input
                        id="output"
                        type="number"
                        value={output}
                        onChange={(e) => setOutput(Number(e.target.value))}
                        className="bg-[#1e293b] border-[#2d3748]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Transport Distance (km)</Label>
                      <Input
                        id="distance"
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="bg-[#1e293b] border-[#2d3748]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Mode</Label>
                    <Select value={transport} onValueChange={setTransport}>
                      <SelectTrigger className="bg-[#1e293b] border-[#2d3748]">
                        <SelectValue placeholder="Select transport" />
                      </SelectTrigger>
                      <SelectContent>
                        {transportList.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button
                      className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-black"
                      onClick={handlePredict}
                      disabled={loading}
                    >
                      {loading ? "Calculating..." : "🔮 Predict CO₂ Emissions"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "results" && hasCalculated && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-medium text-gray-400">Total Emissions</h3>
                      <div className="mt-2 text-4xl font-bold">{prediction.toFixed(2)}</div>
                      <p className="mt-1 text-sm text-gray-400">kg CO₂e</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-medium text-gray-400">Energy Efficiency</h3>
                      <div className="mt-2 text-4xl font-bold">{metrics.energyEfficiency}%</div>
                      <Progress
                        value={metrics.energyEfficiency}
                        className="mt-2 h-2 bg-[#1e293b]"
                        indicatorClassName="bg-[#4ade80]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-medium text-gray-400">Material Efficiency</h3>
                      <div className="mt-2 text-4xl font-bold">{metrics.materialEfficiency}%</div>
                      <Progress
                        value={metrics.materialEfficiency}
                        className="mt-2 h-2 bg-[#1e293b]"
                        indicatorClassName="bg-[#2dd4bf]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-lg font-medium text-gray-400">Overall Score</h3>
                      <div className="mt-2 text-4xl font-bold">{metrics.overallScore}%</div>
                      <Progress
                        value={metrics.overallScore}
                        className="mt-2 h-2 bg-[#1e293b]"
                        indicatorClassName="bg-[#a78bfa]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Emission Breakdown</CardTitle>
                    <PieChartIcon className="h-5 w-5 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} kg`, "CO₂"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Monthly Trend</CardTitle>
                    <BarChart2 className="h-5 w-5 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                        <XAxis dataKey="name" stroke="#FFFFFF" />
                        <YAxis stroke="#FFFFFF" />
                        <Tooltip formatter={(value) => [`${value} kg`, "CO₂"]} />
                        <Bar dataKey="emissions" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#111827] text-white border-[#1e293b]">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Based on your inputs, here are some ways to reduce your carbon footprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-4 rounded-lg border border-[#2d3748] bg-[#1e293b]">
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              rec.impact === "high"
                                ? "bg-[#4ade80]/20 text-[#4ade80]"
                                : rec.impact === "medium"
                                  ? "bg-[#a78bfa]/20 text-[#a78bfa]"
                                  : "bg-[#38bdf8]/20 text-[#38bdf8]"
                            }`}
                          >
                            {rec.category === "energy" ? (
                              <Leaf className="h-5 w-5" />
                            ) : rec.category === "waste" ? (
                              <AlertTriangle className="h-5 w-5" />
                            ) : rec.category === "transport" ? (
                              <TrendingDown className="h-5 w-5" />
                            ) : (
                              <Settings className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{rec.title}</h4>
                            <p className="mt-1 text-sm text-gray-400">{rec.description}</p>
                            <div className="mt-2 flex items-center">
                              <Badge className="bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30">
                                Save up to {rec.savingPotential} kg CO₂
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-[#2d3748] flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("calculator")}>
                    Modify Inputs
                  </Button>
                  <Button
                    className="bg-[#4ade80] hover:bg-[#22c55e] text-black flex items-center gap-2"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <Card className="bg-[#111827] text-white border-[#1e293b]">
                <CardHeader>
                  <CardTitle>Saved Reports</CardTitle>
                  <CardDescription className="text-gray-400">
                    View and manage your saved emission reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasCalculated ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-[#2d3748] bg-[#1e293b] flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">CO₂ Report - {new Date().toLocaleDateString()}</h4>
                          <p className="text-sm text-gray-400">
                            {sector} • {prediction.toFixed(2)} kg CO₂
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                      <div className="p-4 rounded-lg border border-[#2d3748] bg-[#1e293b] flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">
                            CO₂ Report - {new Date(Date.now() - 86400000).toLocaleDateString()}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {sector} • {(prediction * 1.2).toFixed(2)} kg CO₂
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium">No Reports Yet</h3>
                      <p className="text-sm text-gray-400 mt-1 mb-4">Calculate your emissions to generate reports</p>
                      <Button
                        className="bg-[#4ade80] hover:bg-[#22c55e] text-black"
                        onClick={() => setActiveTab("calculator")}
                      >
                        Go to Calculator
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "help" && (
            <div className="space-y-6">
              <Card className="bg-[#111827] text-white border-[#1e293b]">
                <CardHeader>
                  <CardTitle>How to Use EcoMetrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                        1
                      </span>
                      Enter Your Business Data
                    </h3>
                    <p className="text-gray-400 pl-8">
                      Navigate to the Calculator tab and input your business operation details including energy
                      consumption, material usage, and transport information.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                        2
                      </span>
                      Generate Predictions
                    </h3>
                    <p className="text-gray-400 pl-8">
                      Click the "Predict CO₂ Emissions" button to calculate your carbon footprint based on the provided
                      data.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                        3
                      </span>
                      Review Results
                    </h3>
                    <p className="text-gray-400 pl-8">
                      Analyze the breakdown of your emissions, view trends, and check your efficiency scores in the
                      Results tab.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                        4
                      </span>
                      Implement Recommendations
                    </h3>
                    <p className="text-gray-400 pl-8">
                      Follow the AI-generated recommendations to reduce your carbon footprint and improve your
                      sustainability metrics.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                        5
                      </span>
                      Export and Share
                    </h3>
                    <p className="text-gray-400 pl-8">
                      Export your reports to share with stakeholders or keep track of your progress over time.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#111827] text-white border-[#1e293b]">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">How accurate are the predictions?</h3>
                    <p className="text-sm text-gray-400">
                      Our AI model is trained on industry-standard emission factors and real-world data. While
                      predictions are generally within 10-15% of actual emissions, they should be used as estimates
                      rather than exact measurements.
                    </p>
                  </div>
                  <Separator className="bg-[#2d3748]" />
                  <div className="space-y-2">
                    <h3 className="font-medium">Can I track my progress over time?</h3>
                    <p className="text-sm text-gray-400">
                      Yes, you can save and export reports to track your emissions over time. Future updates will
                      include a dedicated tracking dashboard.
                    </p>
                  </div>
                  <Separator className="bg-[#2d3748]" />
                  <div className="space-y-2">
                    <h3 className="font-medium">How are the recommendations generated?</h3>
                    <p className="text-sm text-gray-400">
                      Our AI analyzes your input data and identifies areas with the highest emission reduction potential
                      based on industry best practices and sustainability research.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  )
}
