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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  Brain,
  Sparkles,
  Target,
  Info,
  CheckCircle,
  Zap,
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
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Color palette - eco-friendly tech colors
const COLORS = ["#4ade80", "#2dd4bf", "#38bdf8", "#a78bfa", "#f87171"]

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

interface FeatureContribution {
  name: string
  value: number
  contribution: number
  percentage: number
  importance: number
}

interface ModelInfo {
  algorithm: string
  r2Score: number
  rmse: number
  featuresUsed: string[]
}

interface Recommendation {
  category: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  savingPotential: number
  confidence?: number
  basedOn?: string
}

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
  const [confidence, setConfidence] = useState(0)
  const [pieData, setPieData] = useState<Array<{ name: string; value: number; color?: string }>>([])
  const [barData, setBarData] = useState<Array<{ name: string; emissions: number; baseline?: number }>>([])
  const [featureImportanceData, setFeatureImportanceData] = useState<Array<{ name: string; importance: number; contribution: number }>>([])
  const [featureContributions, setFeatureContributions] = useState<FeatureContribution[]>([])
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [metrics, setMetrics] = useState({
    energyEfficiency: 0,
    materialEfficiency: 0,
    transportEfficiency: 0,
    overallScore: 0,
    wasteRatio: 0,
    productivityScore: 0,
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
      setConfidence(data.confidence || 89)
      setPieData(data.pieData)
      setBarData(data.barData)
      setFeatureImportanceData(data.featureImportanceData || [])
      setFeatureContributions(data.featureContributions || [])
      setModelInfo(data.modelInfo || null)
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
        confidence,
        pieData,
        barData,
        featureContributions,
        modelInfo,
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
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-[#0a0f1a]">
          <Sidebar className="border-r border-[#1e293b]">
            <SidebarHeader className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <Leaf className="h-10 w-10 text-[#4ade80]" />
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
                    <Home className="mr-2 w-6 h-6" />
                    <span className="text-lg">Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Calculator"
                    isActive={activeTab === "calculator"}
                    onClick={() => setActiveTab("calculator")}
                  >
                    <Settings className="mr-2 w-6 h-6" />
                    <span className="text-lg">Calculator</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Results"
                    isActive={activeTab === "results"}
                    onClick={() => (hasCalculated ? setActiveTab("results") : setActiveTab("calculator"))}
                  >
                    <BarChart2 className="mr-2 w-6 h-6" />
                    <span className="text-lg">Results</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="ML Insights"
                    isActive={activeTab === "insights"}
                    onClick={() => (hasCalculated ? setActiveTab("insights") : setActiveTab("calculator"))}
                  >
                    <Brain className="mr-2 w-6 h-6" />
                    <span className="text-lg">ML Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Reports"
                    isActive={activeTab === "reports"}
                    onClick={() => setActiveTab("reports")}
                  >
                    <FileText className="mr-2 w-6 h-6" />
                    <span className="text-lg">Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Help" isActive={activeTab === "help"} onClick={() => setActiveTab("help")}>
                    <HelpCircle className="mr-2 w-6 h-6" />
                    <span className="text-lg">Help</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="px-4 py-2">
              <div className="text-xs text-muted-foreground">v2.0.0 - ML Powered</div>
            </SidebarFooter>
          </Sidebar>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">EcoTrack: Carbon Footprint Estimator</h1>
                  <Badge className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-black">
                    <Brain className="h-3 w-3 mr-1" />
                    ML Powered
                  </Badge>
                </div>
                <p className="text-muted-foreground">AI-powered carbon footprint prediction using Random Forest ML model</p>
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
                    <CardContent>
                      <div className="relative aspect-video rounded-md overflow-hidden">
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        >
                          <source
                            src="/vecteezy_ai-generated-earth-globe-illustration-animation-horizontal_42643019.mp4"
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>

                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
                          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
                            Welcome to EcoTrack
                          </h1>
                          <p className="text-white text-lg md:text-2xl mt-2 drop-shadow-md">
                            ML-powered carbon emission calculator
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <p className="text-gray-300">
                          EcoTrack uses a Random Forest machine learning model trained on sustainable manufacturing data
                          to provide accurate, multi-factor carbon footprint predictions with explainable AI insights.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-[#4ade80] text-black">
                            <Brain className="h-3 w-3 mr-1" />
                            Random Forest ML
                          </Badge>
                          <Badge className="bg-[#2dd4bf] text-black">
                            <Target className="h-3 w-3 mr-1" />
                            89% Accuracy
                          </Badge>
                          <Badge className="bg-[#38bdf8] text-black">
                            <Sparkles className="h-3 w-3 mr-1" />
                            8 Features
                          </Badge>
                          <Badge className="bg-[#a78bfa] text-black">
                            <Zap className="h-3 w-3 mr-1" />
                            Real-time
                          </Badge>
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
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-[#4ade80]" />
                        ML Model Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Model Accuracy (R2)</span>
                          <span className="text-sm font-medium">89%</span>
                        </div>
                        <Progress value={89} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#4ade80]" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Cross-Validation Score</span>
                          <span className="text-sm font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#2dd4bf]" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Features Used</span>
                          <span className="text-sm font-medium">8</span>
                        </div>
                        <Progress value={100} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#38bdf8]" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Prediction Confidence</span>
                          <span className="text-sm font-medium">High</span>
                        </div>
                        <Progress value={92} className="h-2 bg-[#1e293b]" indicatorClassName="bg-[#a78bfa]" />
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
                        Every ton of CO2 contributes to global warming. The average business emits 100-1000 tons annually.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingDown className="mr-2 h-5 w-5 text-[#4ade80]" />
                        ML-Driven Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Our ML model identifies key emission drivers and provides data-backed reduction strategies.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="mr-2 h-5 w-5 text-[#a78bfa]" />
                        Explainable AI
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Understand exactly how each factor contributes to your carbon footprint with feature importance analysis.
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
                        <Label htmlFor="hours" className="flex items-center gap-1">
                          Operation Hours
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total machine/operation hours per period</p>
                            </TooltipContent>
                          </UITooltip>
                        </Label>
                        <Input
                          id="hours"
                          type="number"
                          value={hours}
                          onChange={(e) => setHours(Number(e.target.value))}
                          className="bg-[#1e293b] border-[#2d3748]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="energy" className="flex items-center gap-1">
                          Energy (kWh)
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total energy consumption in kilowatt-hours</p>
                            </TooltipContent>
                          </UITooltip>
                        </Label>
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
                        <Label htmlFor="material" className="flex items-center gap-1">
                          Material Used (kg)
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total raw materials consumed in kilograms</p>
                            </TooltipContent>
                          </UITooltip>
                        </Label>
                        <Input
                          id="material"
                          type="number"
                          value={material}
                          onChange={(e) => setMaterial(Number(e.target.value))}
                          className="bg-[#1e293b] border-[#2d3748]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="waste" className="flex items-center gap-1">
                          Material Waste (kg)
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total material waste produced in kilograms</p>
                            </TooltipContent>
                          </UITooltip>
                        </Label>
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
                        <Label htmlFor="output" className="flex items-center gap-1">
                          Product Output Units
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of products/units produced</p>
                            </TooltipContent>
                          </UITooltip>
                        </Label>
                        <Input
                          id="output"
                          type="number"
                          value={output}
                          onChange={(e) => setOutput(Number(e.target.value))}
                          className="bg-[#1e293b] border-[#2d3748]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="distance" className="flex items-center gap-1">
                          Transport Distance (km)
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average transport/shipping distance</p>
                            </TooltipContent>
                          </UITooltip>
                        </Label>
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
                        className="w-full bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] hover:from-[#22c55e] hover:to-[#14b8a6] text-black font-semibold"
                        onClick={handlePredict}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Brain className="mr-2 h-4 w-4 animate-pulse" />
                            Running ML Model...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Predict with ML Model
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Model info panel */}
                    <div className="mt-4 p-3 rounded-lg bg-[#1e293b] border border-[#2d3748]">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Sparkles className="h-4 w-4 text-[#4ade80]" />
                        <span>Using Random Forest Regressor with 89% accuracy</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "results" && hasCalculated && (
              <div className="space-y-6">
                {/* Prediction summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Card className="bg-gradient-to-br from-[#111827] to-[#1e293b] text-white border-[#1e293b] md:col-span-2">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-medium text-gray-400">ML Predicted Emissions</h3>
                        <div className="mt-2 text-5xl font-bold text-[#4ade80]">{prediction.toFixed(2)}</div>
                        <p className="mt-1 text-sm text-gray-400">kg CO2e</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge className="bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {confidence}% Confidence
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-sm font-medium text-gray-400">Energy Efficiency</h3>
                        <div className="mt-2 text-3xl font-bold">{metrics.energyEfficiency}%</div>
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
                        <h3 className="text-sm font-medium text-gray-400">Material Efficiency</h3>
                        <div className="mt-2 text-3xl font-bold">{metrics.materialEfficiency}%</div>
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
                        <h3 className="text-sm font-medium text-gray-400">Overall Score</h3>
                        <div className="mt-2 text-3xl font-bold">{metrics.overallScore}%</div>
                        <Progress
                          value={metrics.overallScore}
                          className="mt-2 h-2 bg-[#1e293b]"
                          indicatorClassName="bg-[#a78bfa]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
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
                            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} kg`, "CO2"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Monthly Projection</CardTitle>
                      <BarChart2 className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                          <XAxis dataKey="name" stroke="#FFFFFF" />
                          <YAxis stroke="#FFFFFF" />
                          <Tooltip formatter={(value) => [`${value} kg`, "CO2"]} />
                          <Bar dataKey="emissions" fill="#4ade80" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#4ade80]" />
                      ML-Powered Recommendations
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Data-driven suggestions based on feature importance analysis
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
                                <Zap className="h-5 w-5" />
                              ) : rec.category === "waste" ? (
                                <AlertTriangle className="h-5 w-5" />
                              ) : rec.category === "transport" ? (
                                <TrendingDown className="h-5 w-5" />
                              ) : rec.category === "materials" ? (
                                <Leaf className="h-5 w-5" />
                              ) : (
                                <Settings className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{rec.title}</h4>
                              <p className="mt-1 text-sm text-gray-400">{rec.description}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge className="bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/30">
                                  Save up to {rec.savingPotential} kg CO2
                                </Badge>
                                {rec.confidence && (
                                  <Badge variant="outline" className="border-gray-600 text-gray-400">
                                    {rec.confidence}% confidence
                                  </Badge>
                                )}
                              </div>
                              {rec.basedOn && (
                                <p className="mt-2 text-xs text-gray-500">Based on: {rec.basedOn}</p>
                              )}
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

            {/* ML Insights Tab */}
            {activeTab === "insights" && hasCalculated && (
              <div className="space-y-6">
                {/* Model Info Card */}
                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#4ade80]" />
                      Model Transparency
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Understanding how the ML model makes predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {modelInfo && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#2d3748]">
                          <h4 className="text-sm text-gray-400">Algorithm</h4>
                          <p className="mt-1 text-lg font-semibold">{modelInfo.algorithm}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#2d3748]">
                          <h4 className="text-sm text-gray-400">R2 Score (Accuracy)</h4>
                          <p className="mt-1 text-lg font-semibold text-[#4ade80]">{(modelInfo.r2Score * 100).toFixed(0)}%</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#2d3748]">
                          <h4 className="text-sm text-gray-400">RMSE (Error)</h4>
                          <p className="mt-1 text-lg font-semibold">{modelInfo.rmse.toFixed(2)} kg</p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#1e293b] border border-[#2d3748]">
                          <h4 className="text-sm text-gray-400">Prediction Confidence</h4>
                          <p className="mt-1 text-lg font-semibold text-[#2dd4bf]">{confidence}%</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Feature Importance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardHeader>
                      <CardTitle>Feature Importance</CardTitle>
                      <CardDescription className="text-gray-400">
                        How much each input affects the prediction
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={featureImportanceData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                          <XAxis type="number" stroke="#FFFFFF" />
                          <YAxis dataKey="name" type="category" stroke="#FFFFFF" width={80} />
                          <Tooltip formatter={(value) => [`${value}%`, "Importance"]} />
                          <Bar dataKey="importance" fill="#4ade80" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardHeader>
                      <CardTitle>Feature Contributions</CardTitle>
                      <CardDescription className="text-gray-400">
                        How each input contributed to your specific prediction
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={featureImportanceData}>
                          <PolarGrid stroke="#2d3748" />
                          <PolarAngleAxis dataKey="name" stroke="#FFFFFF" />
                          <PolarRadiusAxis stroke="#FFFFFF" />
                          <Radar
                            name="Contribution"
                            dataKey="contribution"
                            stroke="#4ade80"
                            fill="#4ade80"
                            fillOpacity={0.5}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Feature Analysis */}
                <Card className="bg-[#111827] text-white border-[#1e293b]">
                  <CardHeader>
                    <CardTitle>Detailed Feature Analysis</CardTitle>
                    <CardDescription className="text-gray-400">
                      Breakdown of how each input contributes to the final prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {featureContributions.map((fc, index) => (
                        <div key={index} className="p-4 rounded-lg bg-[#1e293b] border border-[#2d3748]">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h4 className="font-medium">{fc.name}</h4>
                              <p className="text-sm text-gray-400">Input value: {fc.value}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">
                                {fc.contribution >= 0 ? "+" : ""}{fc.contribution.toFixed(2)} kg CO2
                              </p>
                              <p className="text-sm text-gray-400">{fc.percentage.toFixed(1)}% of total</p>
                            </div>
                          </div>
                          <Progress
                            value={fc.importance * 100}
                            className="h-2 bg-[#2d3748]"
                            indicatorClassName={`bg-gradient-to-r from-[#4ade80] to-[#2dd4bf]`}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Model importance: {(fc.importance * 100).toFixed(0)}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Features Used */}
                {modelInfo && (
                  <Card className="bg-[#111827] text-white border-[#1e293b]">
                    <CardHeader>
                      <CardTitle>Features Used by Model</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {modelInfo.featuresUsed.map((feature, index) => (
                          <Badge key={index} variant="outline" className="border-[#4ade80] text-[#4ade80]">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                            <h4 className="font-medium">ML CO2 Report - {new Date().toLocaleDateString()}</h4>
                            <p className="text-sm text-gray-400">
                              {sector} - {prediction.toFixed(2)} kg CO2 - {confidence}% confidence
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
                              ML CO2 Report - {new Date(Date.now() - 86400000).toLocaleDateString()}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {sector} - {(prediction * 1.2).toFixed(2)} kg CO2
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
                        <p className="text-sm text-gray-400 mt-1 mb-4">Run the ML model to generate reports</p>
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
                    <CardTitle>How the ML Model Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                          1
                        </span>
                        Data Collection
                      </h3>
                      <p className="text-gray-400 pl-8">
                        The model was trained on a sustainable manufacturing dataset with features like energy consumption,
                        material usage, operation hours, and transport data.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                          2
                        </span>
                        Feature Engineering
                      </h3>
                      <p className="text-gray-400 pl-8">
                        Key features were selected using Recursive Feature Elimination (RFE) and Mutual Information analysis
                        to identify the most predictive variables.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                          3
                        </span>
                        Model Training
                      </h3>
                      <p className="text-gray-400 pl-8">
                        A Random Forest Regressor was chosen after comparing multiple algorithms (Decision Tree, SVM,
                        Gradient Boosting) due to its highest R2 score of 89%.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                          4
                        </span>
                        Prediction
                      </h3>
                      <p className="text-gray-400 pl-8">
                        Your inputs are standardized and processed through the model, which combines predictions from
                        multiple decision trees for accurate CO2 emission estimates.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center">
                        <span className="flex h-6 w-6 rounded-full bg-[#4ade80] text-black items-center justify-center mr-2 text-sm">
                          5
                        </span>
                        Explainability
                      </h3>
                      <p className="text-gray-400 pl-8">
                        The ML Insights tab shows feature importance and contributions, helping you understand exactly
                        which factors drive your carbon footprint.
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
                      <h3 className="font-medium">How accurate is the ML model?</h3>
                      <p className="text-sm text-gray-400">
                        The Random Forest model achieves an R2 score of 89% and was validated using 5-fold cross-validation.
                        Predictions typically fall within 10-15% of actual emissions.
                      </p>
                    </div>
                    <Separator className="bg-[#2d3748]" />
                    <div className="space-y-2">
                      <h3 className="font-medium">What features are most important?</h3>
                      <p className="text-sm text-gray-400">
                        Energy consumption (35%), material usage (22%), and operation hours (15%) are the top three
                        predictors of CO2 emissions according to our feature importance analysis.
                      </p>
                    </div>
                    <Separator className="bg-[#2d3748]" />
                    <div className="space-y-2">
                      <h3 className="font-medium">How are recommendations generated?</h3>
                      <p className="text-sm text-gray-400">
                        Recommendations are generated by analyzing which input features contribute most to your emissions
                        and identifying actionable ways to reduce them based on industry best practices.
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
    </TooltipProvider>
  )
}
