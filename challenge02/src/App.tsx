import './App.css'
import Contacts from './Contacts_List.tsx'
import contactListLogo from './assets/CONTACT-LIST.png'

function App() {
  return (
    <div id="app-root">
      <header>
        <h1>Challenge01 Federico Gonzalez</h1>
        <img src={contactListLogo} alt="Contact List Logo" className="logo" />
      </header>

      <main>
        <Contacts />
      </main>
    </div>
  )
}

export default App
