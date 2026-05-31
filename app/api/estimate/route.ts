import { NextResponse } from "next/server"
import {
  predictCO2Emissions,
  generateMLRecommendations,
  generateVisualizationData,
  type MLInput,
} from "@/lib/ml-model"

export async function POST(req: Request) {
  try {
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

    // Prepare input for ML model
    const mlInput: MLInput = {
      hours: Number(hours),
      energy: Number(energy),
      material: Number(material),
      waste: Number(waste),
      output: Number(output),
      distance: Number(distance),
      sector,
      transport,
    }

    // Run ML prediction
    const mlResult = predictCO2Emissions(mlInput)

    // Generate ML-based recommendations
    const recommendations = generateMLRecommendations(mlInput, mlResult)

    // Generate visualization data
    const visualData = generateVisualizationData(mlResult, mlInput)

    // Simulate API processing time for realism
    await new Promise((resolve) => setTimeout(resolve, 600))

    return NextResponse.json({
      // Primary prediction result
      prediction: mlResult.prediction,
      confidence: mlResult.confidence,
      
      // Visualization data
      pieData: visualData.pieData,
      barData: visualData.barData,
      featureImportanceData: visualData.featureImportanceData,
      
      // Detailed breakdown
      breakdown: mlResult.breakdown,
      featureContributions: mlResult.featureContributions,
      
      // Model transparency info
      modelInfo: mlResult.modelInfo,
      
      // Efficiency metrics
      metrics: {
        energyEfficiency: mlResult.efficiencyMetrics.energyEfficiency,
        materialEfficiency: mlResult.efficiencyMetrics.materialEfficiency,
        transportEfficiency: Math.round((1 - (mlResult.breakdown.transport / mlResult.prediction)) * 100),
        overallScore: Math.round((1 - mlResult.prediction / 2000) * 100),
        wasteRatio: mlResult.efficiencyMetrics.wasteRatio,
        productivityScore: mlResult.efficiencyMetrics.productivityScore,
      },
      
      // AI recommendations
      recommendations,
    })
  } catch (error) {
    console.error("ML Prediction Error:", error)
    return NextResponse.json(
      { error: "Failed to process prediction" },
      { status: 500 }
    )
  }
}
