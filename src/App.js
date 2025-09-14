import { useState, useEffect } from 'react';
import './App.css';

// Utility function to shuffle options
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function App() {
  const [countries,setCountries] = useState([]);


  const [options,setOptions] = useState([]);
  const [correctCountry,setCorrectCountry] = useState(null);
  const [score,setScore] = useState(0);
  const [message,setMessage] = useState('');

  const [isDisabled,setIsDisabled] = useState(false); 

  
  useEffect(() => {
fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca3')
.then(res => res.json())
.then(data => {
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          console.error('Unexpected data format:', data);
        }
      })
.catch(err => console.error('Fetch error:', err));
},[]);




      useEffect(() => {
    if (countries.length > 0) {
      generateQuestion();
    }
  }, [countries]);


  const generateQuestion = () => {
    console.log('Generating question with countries:', countries.length);
    if (!Array.isArray(countries) || countries.length === 0) return;
    const correct = countries[Math.floor(Math.random() * countries.length)];
    const wrong = shuffleArray(
      countries.filter(c => c.cca3 !== correct.cca3)
    ).slice(0, 3);
    const allOptions = shuffleArray([correct, ...wrong]);
    setCorrectCountry(correct);
    setOptions(allOptions);
    setMessage('');
    setIsDisabled(false);
  };
  const handleGuess =(name)  => {
    if (isDisabled) return; 
    setIsDisabled(true);
    if (name === correctCountry.name.common) {
      setScore(score + 1);
      setMessage('✅ Correct!');
    } else {
      setMessage(`❌ Wrong! It was ${correctCountry.name.common}`);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1000);
  };

  if (!correctCountry) return <p style={{ textAlign: 'center' }}>Loading countries...</p>;

  return (
    <div className='container'>
      <div className='application'>
      <h1>🌍 Guess the Country!</h1>
      <h2>Score: {score}</h2>

      <img
        src={correctCountry.flags.svg}
        alt="Country Flag"
        style={{ width: '200px', border: '1px solid #ccc' ,marginTop:'25px'}}
      />

      <div style={{ marginTop: '20px' }}>
        {options.map((country, index) => (
          <button
            key={index}
            onClick={() => handleGuess(country.name.common)}
            disabled={isDisabled}
            style={{
              margin: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {country.name.common}
          </button>
        ))}
      </div>

      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{message}</p>
    
    </div>
    </div>
  );
}

export default App;
