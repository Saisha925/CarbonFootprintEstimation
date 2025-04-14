import { NextResponse } from "next/server"

// Emission factors from the Python model
const EMISSION_FACTORS = {
  energy_kWh: 0.82,
  material_kg: 0.01,
  machine_hour: 0.05,
  transport: {
    truck: 0.21,
    car: 0.18,
    train: 0.04,
    airplane: 0.15,
    bike: 0.0,
    ship: 0.09,
  },
}

// Sector-specific weights
const SECTOR_COMPONENT_WEIGHTS = {
  Manufacturing: { energy: 1.0, material: 1.0, operation: 1.0 },
  Retail: { energy: 0.6, material: 0.4, operation: 0.5 },
  Logistics: { energy: 0.9, material: 0.7, operation: 1.2 },
  "IT/Software": { energy: 0.4, material: 0.2, operation: 0.5 },
  Healthcare: { energy: 0.8, material: 0.7, operation: 0.9 },
  Hospitality: { energy: 0.7, material: 0.6, operation: 0.8 },
  "Food & Beverage": { energy: 0.9, material: 1.1, operation: 1.0 },
}

// Compute emission based on the Python model logic
function computeEmission(
  hours: number,
  energy: number,
  material: number,
  waste: number,
  output: number,
  distance: number,
  sector: string,
  transport: string,
): number {
  const weights = SECTOR_COMPONENT_WEIGHTS[sector] || SECTOR_COMPONENT_WEIGHTS["Manufacturing"]
  const transportFactor = EMISSION_FACTORS.transport[transport] || EMISSION_FACTORS.transport.truck

  const energyEmission = energy * EMISSION_FACTORS.energy_kWh * weights.energy
  const materialEmission = material * EMISSION_FACTORS.material_kg * weights.material
  const operationEmission = hours * EMISSION_FACTORS.machine_hour * weights.operation
  const transportEmission = distance * transportFactor

  // Add waste factor (not in original model but makes sense)
  const wasteEmission = waste * EMISSION_FACTORS.material_kg * 1.5 // Higher factor for waste

  // Efficiency factor based on output (higher output = more efficient)
  const efficiencyFactor = Math.max(0.7, 1 - (output / 1000) * 0.3)

  return (energyEmission + materialEmission + operationEmission + transportEmission + wasteEmission) * efficiencyFactor
}

// Generate pie chart data based on emission components
function generatePieData(
  hours: number,
  energy: number,
  material: number,
  waste: number,
  distance: number,
  sector: string,
  transport: string,
) {
  const weights = SECTOR_COMPONENT_WEIGHTS[sector] || SECTOR_COMPONENT_WEIGHTS["Manufacturing"]
  const transportFactor = EMISSION_FACTORS.transport[transport] || EMISSION_FACTORS.transport.truck

  const energyEmission = energy * EMISSION_FACTORS.energy_kWh * weights.energy
  const materialEmission = material * EMISSION_FACTORS.material_kg * weights.material
  const operationEmission = hours * EMISSION_FACTORS.machine_hour * weights.operation
  const transportEmission = distance * transportFactor
  const wasteEmission = waste * EMISSION_FACTORS.material_kg * 1.5

  return [
    { name: "Energy", value: Math.round(energyEmission * 100) / 100 },
    { name: "Materials", value: Math.round(materialEmission * 100) / 100 },
    { name: "Operations", value: Math.round(operationEmission * 100) / 100 },
    { name: "Transport", value: Math.round(transportEmission * 100) / 100 },
    { name: "Waste", value: Math.round(wasteEmission * 100) / 100 },
  ]
}

// Generate monthly projection data
function generateBarData(prediction: number, sector: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

  // Different sectors have different seasonal patterns
  const seasonalPatterns = {
    Manufacturing: [1.0, 1.05, 1.1, 1.15, 1.2, 1.25],
    Retail: [1.2, 1.0, 0.9, 0.95, 1.0, 1.1],
    Logistics: [1.0, 1.05, 1.1, 1.15, 1.2, 1.25],
    "IT/Software": [1.0, 1.0, 1.0, 1.05, 1.05, 1.1],
    Healthcare: [1.1, 1.05, 1.0, 1.0, 1.05, 1.1],
    Hospitality: [0.9, 0.95, 1.0, 1.1, 1.2, 1.3],
    "Food & Beverage": [1.0, 1.05, 1.1, 1.15, 1.2, 1.25],
  }

  const pattern = seasonalPatterns[sector] || seasonalPatterns["Manufacturing"]

  return months.map((month, i) => ({
    name: month,
    emissions: Math.round(prediction * pattern[i]),
  }))
}

// Generate recommendations based on inputs and prediction
function generateRecommendations(
  hours: number,
  energy: number,
  material: number,
  waste: number,
  output: number,
  distance: number,
  sector: string,
  transport: string,
  prediction: number,
) {
  const recommendations = []

  // Energy recommendations
  if (energy > 800) {
    recommendations.push({
      category: "energy",
      title: "Reduce Energy Consumption",
      description: `Your energy usage of ${energy} kWh is high. Consider energy-efficient equipment to save up to ${Math.round(energy * 0.3)} kWh.`,
      impact: "high",
      savingPotential: Math.round(energy * 0.3 * EMISSION_FACTORS.energy_kWh),
    })
  }

  // Material waste recommendations
  if (waste > 40) {
    recommendations.push({
      category: "waste",
      title: "Optimize Material Usage",
      description: `Material waste of ${waste} kg can be reduced by implementing lean manufacturing principles.`,
      impact: "medium",
      savingPotential: Math.round(waste * 0.4 * EMISSION_FACTORS.material_kg * 1.5),
    })
  }

  // Transport recommendations
  if (distance > 150 && transport !== "train" && transport !== "bike") {
    recommendations.push({
      category: "transport",
      title: "Consider Alternative Transport",
      description: `Switching from ${transport} to train could reduce emissions by up to ${Math.round(distance * (EMISSION_FACTORS.transport[transport] - EMISSION_FACTORS.transport.train))} kg CO₂.`,
      impact: "high",
      savingPotential: Math.round(
        distance * (EMISSION_FACTORS.transport[transport] - EMISSION_FACTORS.transport.train),
      ),
    })
  }

  // Operation hours recommendations
  if (hours > 40 && sector !== "IT/Software") {
    recommendations.push({
      category: "operations",
      title: "Optimize Operational Hours",
      description: "Consider process optimization to reduce operational hours while maintaining output.",
      impact: "medium",
      savingPotential: Math.round(hours * 0.1 * EMISSION_FACTORS.machine_hour),
    })
  }

  // Always add a renewable energy recommendation
  recommendations.push({
    category: "energy",
    title: "Switch to Renewable Energy",
    description: `Switching to renewable energy sources could reduce emissions by up to ${Math.round(energy * EMISSION_FACTORS.energy_kWh * 0.7)} kg CO₂.`,
    impact: "high",
    savingPotential: Math.round(energy * EMISSION_FACTORS.energy_kWh * 0.7),
  })

  return recommendations
}

export async function POST(req: Request) {
  const body = await req.json()
  const {
    hours = 40,
    energy = 1000,
    material = 500,
    waste = 50,
    output = 100,
    distance = 200,
    sector = "Manufacturing",
    transport = "truck",
  } = body

  // Calculate emission using the model logic
  const prediction = computeEmission(hours, energy, material, waste, output, distance, sector, transport)

  // Generate visualization data
  const pieData = generatePieData(hours, energy, material, waste, distance, sector, transport)
  const barData = generateBarData(prediction, sector)
  const recommendations = generateRecommendations(
    hours,
    energy,
    material,
    waste,
    output,
    distance,
    sector,
    transport,
    prediction,
  )

  // Simulate API delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800))

  return NextResponse.json({
    prediction,
    pieData,
    barData,
    recommendations,
    // Add efficiency metrics
    metrics: {
      energyEfficiency: Math.round((1 - energy / (output + 1) / 10) * 100),
      materialEfficiency: Math.round((1 - waste / (material + 1)) * 100),
      transportEfficiency: Math.round((1 - EMISSION_FACTORS.transport[transport] / 0.21) * 100),
      overallScore: Math.round((1 - prediction / 2000) * 100),
    },
  })
}
