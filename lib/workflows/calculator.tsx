
/** @jsxImportSource @gensx/core */
import * as gensx from "@gensx/core"
import { GenerateText } from "@gensx/vercel-ai-sdk"
import { openai } from "@ai-sdk/openai"

interface CalculatorProps {
    expression: string
}

interface CalculatorResult {
    result: number
}

async function Calculate(props: CalculatorProps) {
    const languageModel = openai("gpt-4o-mini");
    const systemPrompt = `You are a calculator. You will be given an expression and you will need to calculate the result. Return the result as a plain text string. With any steps taken to think through it.`
    const prompt = `Calculate the result of the following expression: ${props.expression}`
    return {
        result: <GenerateText system={systemPrompt} prompt={prompt} model={languageModel}>
            {result => {return result.text}}
        </GenerateText>
    }
}
const Calculator = gensx.Component<CalculatorProps, CalculatorResult>('calculator', Calculate)
const CalculatorWorkflow = gensx.Workflow('Calculator Tool', Calculator)

export default CalculatorWorkflow;