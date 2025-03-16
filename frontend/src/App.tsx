import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [responseMessage, setResponseMessage] = useState('')

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    console.log('File selected:', event.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected')
      setResponseMessage('No file selected')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Uploading file:', file)
      const response = await fetch('https://localhost:3006', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.text()
        console.log('File uploaded successfully:', result)
        setResponseMessage('File uploaded successfully: ' + result)
      } else {
        console.error('File upload failed')
        setResponseMessage('File upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setResponseMessage('Error uploading file: ' + error.message)
    }
  }

  return (
    <>
      <h1 className="title">Huzzicide</h1>
      
      <div className="card">
        <div className="file-upload">
          <input type="file" id="fileInput" onChange={handleFileChange} />
          <label htmlFor="fileInput" className="file-label">Choose File</label>
          <button onClick={handleUpload} className="upload-button" disabled={!file}>
            <img src="/path/to/upload-icon.svg" alt="Upload" className="upload-icon" />
            Upload
          </button>
        </div>
        {file && <p>File selected: {file.name}</p>}
        <p>
          Dating is Hard. Let’s Make it Harder.
        </p>
        <div>
          <h2>Output</h2>
          <p>{responseMessage}</p>
        </div>
      </div>
    </>
  )
}

export default App