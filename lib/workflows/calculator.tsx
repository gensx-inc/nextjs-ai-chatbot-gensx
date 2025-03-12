
/** @jsxImportSource @gensx/core */
import { Component, Workflow } from "@gensx/core"
import * as gensx from "@gensx/core"
import { GenerateText } from "@gensx/vercel-ai-sdk"
import { openai } from "@ai-sdk/openai"

interface CalculatorProps {
    expression: string
}

interface CalculatorResult {
    result: number
}

const Calculator = Component<CalculatorProps, CalculatorResult>('calculator', 
    async (props) => {
        const languageModel = openai("gpt-4o-mini");
        return {
            result: <GenerateText
                prompt={`Calculate the result of the following expression: ${props.expression}`}
                model={languageModel}
            >
                {result => {
                    return result.text
                }}
            </GenerateText>
        }
    }
)
const CalculatorWorkflow = Workflow('Calculator Tool', Calculator)

export default CalculatorWorkflow;