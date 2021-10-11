import './App.css'
import { useState, useEffect } from 'react'
import { Meme } from './Meme'

const objectToQueryParam = obj => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`)
  return '?' + params.join('&')
}

function App () {
  const [templates, setTemplates] = useState([])
  const [template, setTemplate] = useState(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const [meme, setMeme] = useState(null)
  

  
    function refreshPage() {
      window.location.reload(false);
    }
  
    useEffect(() => {
    fetch('https://api.imgflip.com/get_memes').then(x =>
      x.json().then(response => setTemplates(response.data.memes))
    )
  }, [])

  if (meme) {
    return (
      <div style={{ textAlign: 'center' }}>
        <img style={{ width: 500 }} src={meme} alt='custom meme' />
        <button onClick={refreshPage}>Uudestaan</button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {template && (
        <form
          onSubmit={async e => {
            e.preventDefault()
            const params = {
              template_id: template.id,
              text0: topText,
              text1: bottomText,
              username: 'MemeKayttaja',
              password: 'MemeSalasana'
              
            }
            const response = await fetch(
              `https://api.imgflip.com/caption_image${objectToQueryParam(
                params
              )}`
            )
            const json = await response.json()
            setMeme(json.data.url)
          }}
        >
          <Meme template={template} />
          <input
            placeholder='1. teksti'
            value={topText}
            onChange={e => setTopText(e.target.value)}
          />
          <input
            placeholder='2. teksti'
            value={bottomText}
            onChange={e => setBottomText(e.target.value)}
          />
          <button type='submit'>Luo meemi</button>
          <button onClick={refreshPage}>Takaisin</button>
        </form>
      )}
      {!template && (
        <>
          <h1>Valitse meemi</h1>
          {templates.map(template => {
            return (
              <Meme
                template={template}
                onClick={() => {
                  setTemplate(template)
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
}

export default App
