import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState<null | File>(null);
  const [responseMessage, setResponseMessage] = useState('')

  const handleFileChange = (event: any) => {
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
    formData.append('image', file)

    try {
      console.log('Uploading file:', file)
      const response = await fetch('http://192.168.1.186:3007/get_response', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result)
        setResponseMessage('File uploaded successfully: ' + result.response)
      } else {
        console.error('File upload failed')
        setResponseMessage('File upload failed')
      }
    } catch (error: any) {
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
          Dating is Hard. Let's Make it Harder.
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