import { useRef } from "react"
import processFilenames from "./components/process-filenames"

function App() {
  const output = useRef<HTMLPreElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputs = e.target.files
    if (inputs === null) return

    const filenames = Array.from(inputs, input => input.name)
    const jsonData = await processFilenames(filenames)
    if (output.current) output.current.innerHTML = jsonData
  }

  return (
    <div>
      <label htmlFor="files">
        Select files
        <input type="file" multiple onChange={handleChange} />
        <pre ref={output}>No data</pre>
      </label>
    </div>
  )
}

export default App
