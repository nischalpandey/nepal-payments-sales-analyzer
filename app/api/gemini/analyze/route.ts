import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { metrics, productGroups, monthlyTrends, fileName } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are a Senior Financial & Sales Operations Analyst. Analyze the following customer sales data summary from dataset "${fileName || 'Customer Sales CSV'}":

Overall Dashboard Metrics:
- Total Sales: $${metrics?.totalSales?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Total Service Charges Paid: $${metrics?.totalServiceCharges?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
- Service Charge Fee % of Sales: ${metrics?.serviceChargeRatio?.toFixed(2)}%
- Total Transactions: ${metrics?.totalCount}
- Successful Transactions: ${metrics?.successfulCount} (${metrics?.successRate?.toFixed(1)}% Success Rate)
- Average Transaction Value: $${metrics?.avgTransactionValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Top Product Groups (by Description):
${(productGroups || []).slice(0, 6).map((p: { description: string; totalSales: number; shareOfSales: number; totalServiceCharges: number; transactionCount: number }) => 
  `- ${p.description}: Sales $${p.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}, Share: ${p.shareOfSales.toFixed(1)}%, Tx Count: ${p.transactionCount}, Service Fees: $${p.totalServiceCharges.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
).join('\n')}

Monthly Revenue & Fee Trends:
${(monthlyTrends || []).map((m: { monthLabel: string; sales: number; serviceCharge: number; count: number }) => 
  `- ${m.monthLabel}: Sales $${m.sales.toLocaleString('en-US', { minimumFractionDigits: 2 })}, Service Fees $${m.serviceCharge.toLocaleString('en-US', { minimumFractionDigits: 2 })}, Txs: ${m.count}`
).join('\n')}

Please provide a structured, executive financial analysis with 4 key sections:
1. 🎯 **Executive Highlights**: Summary of financial velocity and operational performance.
2. 📊 **Product Group Breakdown & Revenue Drivers**: Insights on top performing products/services vs low performers.
3. 💸 **Service Charge & Fee Efficiency**: Analysis of payment processing fees, service charge ratios, and anomalies (e.g. unusually high fees).
4. 💡 **Strategic Growth Recommendations**: 3 actionable strategies to boost sales or reduce fee overhead.

Keep the analysis crisp, analytical, professional, and directly backed by the numbers above. Format with bold headers and bullet points.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return NextResponse.json({ analysis: response.text });
  } catch (error: unknown) {
    console.error("Gemini Analysis API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate AI insights";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
