import React from 'react';
import { clipboard, ipcRenderer } from 'electron';
import { render } from 'react-dom';

const writeToClipboard = content => {
  clipboard.writeText(content);
}
class Application extends React.Component {
  constructor() {
    super();
    this.state = {
      clippings: [
        {
          content: "text 1",
          id: '1'
        }
      ]
    }
    this.addClipping = this.addClipping.bind(this);
  }

  componentDidMount(){
    ipcRenderer.on('create-new-clipping', this.addClipping);
  }

  addClipping() {
    const { clippings } = this.state;
    const content = clipboard.readText();
    const clipping = { content, id: Date.now()};
    this.setState({clippings: [clipping, ...clippings]});
  }

  render() {
    return (
      <div className="container">
        <header className="controls">
          <button id="copy-from-clipboard" onClick={this.addClipping}>Copy from Clipboard</button>
        </header>

        <section className="content">
          <div className="clippings-list">
            {this.state.clippings.map( clipping => (
              <Clipping content={clipping.content} key={clipping.id} />
            ))}
          </div>
        </section>
      </div>
    )
  }
}

const Clipping = ({content}) => {
  return (
    <article className="clippings-list-item">
      <div className="clipping-text" disabled>
        {content}
      </div>
      <div className="clipping-controls">
        <button onClick={() => writeToClipboard(content)}>&rarr; Clipboard</button>
        <button>Update</button>
      </div>
    </article>
  )
}

render(<Application />, document.getElementById('application'));