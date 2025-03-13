
/** @jsxImportSource @gensx/core */
import * as gensx from "@gensx/core"

interface GetDateProps {
}

interface GetDateResult {
    result: string
}

async function GetDate(props: GetDateProps) {
    return {
        result: new Date().toISOString()
    }
}
const GetDateComponent = gensx.Component<GetDateProps, GetDateResult>('getDate', GetDate)
const GetDateWorkflow = gensx.Workflow('Get Date Tool', GetDateComponent)

export default GetDateWorkflow;
