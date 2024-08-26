"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function Component() {
  const [initialInvestment, setInitialInvestment] = useState(20000)
  const [annualContribution, setAnnualContribution] = useState(5000)
  const [interestRate, setInterestRate] = useState(5)
  const [years, setYears] = useState(5)
  const [compoundFrequency, setCompoundFrequency] = useState("annually")
  const [results, setResults] = useState(null)
  const [isTableOpen, setIsTableOpen] = useState(false)

  const calculateInterest = () => {
    let balance = initialInvestment
    let totalContributions = initialInvestment
    let yearlyData = []

    const rate = interestRate / 100
    const compoundsPerYear = compoundFrequency === "annually" ? 1 : 12

    for (let year = 1; year <= years; year++) {
      const startBalance = balance
      for (let i = 0; i < compoundsPerYear; i++) {
        balance *= (1 + rate / compoundsPerYear)
        if (i === 0) balance += annualContribution
      }
      totalContributions += annualContribution
      const yearInterest = balance - startBalance - annualContribution
      yearlyData.push({
        year,
        startBalance: Math.round(startBalance),
        contribution: Math.round(annualContribution),
        interest: Math.round(yearInterest),
        endBalance: Math.round(balance),
        totalContributions: Math.round(totalContributions),
        totalInterest: Math.round(balance - totalContributions)
      })
    }

    setResults({
      endingBalance: Math.round(balance),
      totalContributions: Math.round(totalContributions),
      totalInterest: Math.round(balance - totalContributions),
      yearlyData
    })
  }

  const chartColors = {
    principle: "#4A4A4A",  // Soft black for principle
    contributions: "#6B8EB8",  // Muted blue for contributions
    interest: "#B86B6B"  // Muted red for interest
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Interest Calculator</CardTitle>
        <CardDescription>Calculate compound interest over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
            <Input
              id="initialInvestment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="annualContribution">Annual Contribution ($)</Label>
            <Input
              id="annualContribution"
              type="number"
              value={annualContribution}
              onChange={(e) => setAnnualContribution(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="years">Investment Length (Years)</Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="compoundFrequency">Compound Frequency</Label>
            <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
              <SelectTrigger id="compoundFrequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-4" onClick={calculateInterest}>Calculate</Button>
        
        {results && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Ending Balance</p>
                <p className="text-2xl font-bold">${results.endingBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Total Contributions</p>
                <p className="text-2xl font-bold">${results.totalContributions.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Total Interest</p>
                <p className="text-2xl font-bold">${results.totalInterest.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Growth Over Time</h4>
              <BarChart width={600} height={300} data={results.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="startBalance" name="Principle" stackId="a" fill={chartColors.principle} />
                <Bar dataKey="contribution" name="Contributions" stackId="a" fill={chartColors.contributions} />
                <Bar dataKey="interest" name="Interest" stackId="a" fill={chartColors.interest} />
              </BarChart>
            </div>

            <Collapsible className="mt-6" open={isTableOpen} onOpenChange={setIsTableOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between w-full">
                  <span>Yearly Breakdown</span>
                  {isTableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Starting Balance</TableHead>
                      <TableHead>Contribution</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.yearlyData.map((year) => (
                      <TableRow key={year.year}>
                        <TableCell>{year.year}</TableCell>
                        <TableCell>${year.startBalance.toLocaleString()}</TableCell>
                        <TableCell>${year.contribution.toLocaleString()}</TableCell>
                        <TableCell>${year.interest.toLocaleString()}</TableCell>
                        <TableCell>${year.endBalance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  )
}