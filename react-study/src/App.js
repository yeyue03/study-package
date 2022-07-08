import Table from "./Table";

const characters = [
  {
    name: 'Charlie',
    job: 'Janitor',
  },
  {
    name: 'Mac',
    job: 'Bouncer',
  },
  {
    name: 'Dee',
    job: 'Aspring actress',
  },
  {
    name: 'Dennis',
    job: 'Bartender',
  },
]

function App() {
  return (
    <div className="App">
      <Table characters={characters}></Table>
    </div>
  );
}

export default App;
