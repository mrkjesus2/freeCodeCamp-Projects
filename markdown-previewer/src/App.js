import React, {useState} from 'react';
import Editor from './Editor'
import Previewer from './Previewer'
import './App.css';

function App() {
  const initMarkdown = `# Hi There
## I've made a markdown previewer
> I would like it if you decided to **hire me**
1. I've been practicing a bunch, I should probably take a \`<br>\`
2. I been reading lots of documentation
3. I'm an ok person
You can see some of my early work [at my website](http://weigel.site.com)

and here's a picture because why not

![My Picture](http://www.weigel.site/assets/img/me-250.jpg)

and they wanted some code so here you go:

        <header>Head</header>
          <section>
            <h2>Shoulders</h2>
            <p>Knees</p>
          </section>
        <footer>and Toes</footer>
`
  const [markdown, setMarkdown] = useState(initMarkdown)
  const [isFullScreen, setIsFullScreen] = useState(null)

  const handleChange = (ev) => {
    setMarkdown(ev.target.value)
  }

  return (
    <main className="container">
      <Editor text={markdown} 
              handleInput={handleChange} 
              isFullScreen={isFullScreen}
              setFullScreen={setIsFullScreen}
      />
      <Previewer markdown={markdown} 
              isFullScreen={isFullScreen}
              setFullScreen={setIsFullScreen}
      />
    </main>
  )
}

export default App;
