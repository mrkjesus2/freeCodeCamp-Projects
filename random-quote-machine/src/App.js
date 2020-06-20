import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: '',
      fetched: false,
      twitterLink: ''
    }
    this.fetchQuote = this.fetchQuote.bind(this)
  }

  
  async fetchQuote() {
    let request = 'http://quotes.stormconsultancy.co.uk/random.json'
    console.log("Fetching Quote")
    try {
      await fetch(request)
        .then(response => {
            if(response.ok !== true) {
              throw new Error('Network Failure') 
            } else {
              return response.json()
            }
          })
        .then(data => {
          console.log(encodeURI(data.quote))
          this.setState({
            quote: data.quote,
            author: data.author,
            fetched: true,
            twitterLink: `https://twitter.com/intent/tweet?text=${data.quote} --${data.author}`
          })
        }) 
    } catch (error) {
      console.error('Network Failure')    
      this.setState({
        quote: `"Okay, Houston, we've had a problem here."`,
        author: "Jack Swigert",
        fetched: false
      })
    }  
  }

  componentDidMount() {
    this.fetchQuote()
  }

  render() {
    return(
      <main id="quote-box" className="quote-box">
        <blockquote className="quote">
            {this.state.fetched === false
              ? <h2>A not so random message</h2>
              : null
            }
          <p id="text" className="quote-text">
            {this.state.quote}
          </p>
          <cite id="author" className="quote-author">-- {this.state.author}</cite>
        </blockquote>
        <footer className="quote-options">
              <a href={this.state.twitterLink} id="tweet-quote" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
          <button id="new-quote" className="new-quote" onClick={this.fetchQuote}>New Quote</button>
        </footer>
      </main>
    )
  }
}




export default App;