import { useRef } from "react"
import { validateFileTypeArray } from "../utils/validators"

function Home() {
  const outputRef = useRef<HTMLPreElement>(null)

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputs = event.target.files
    if (inputs === null) return

    const filenames = Array.from(inputs, input => input.name)

    const response = await fetch("/api/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filenames }),
    })

    const paintings = await response.json()

    if (outputRef.current)
      outputRef.current.innerHTML = JSON.stringify(paintings, null, 2)
  }

  return (
    <div>
      <label htmlFor="files">Select files</label>
      <input
        onChange={handleChange}
        name="files"
        type="file"
        accept={validateFileTypeArray.join(",")}
        multiple
      />
      <pre ref={outputRef}>No Data</pre>
    </div>
  )
}

export default Home
