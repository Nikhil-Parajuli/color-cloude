const testPlates = [
    {
      number: 12,
      type: 'screening',
      image: 'test-plates/plate1.png'
    },
    {
      number: 8,
      type: 'protanopia',
      image: 'test-plates/plate2.png'
    },
    {
      number: 6,
      type: 'deuteranopia',
      image: 'test-plates/plate3.png'
    }
  ];
  
  let currentTest = 0;
  let results = {};
  
  document.getElementById('nextTest').addEventListener('click', function() {
    const answer = document.getElementById('answer').value;
    
    if (answer) {
      results[currentTest] = parseInt(answer) === testPlates[currentTest].number;
      
      if (currentTest < testPlates.length - 1) {
        currentTest++;
        showTest(currentTest);
      } else {
        showResults();
      }
    }
  });
  
  function showTest(index) {
    const plate = testPlates[index];
    document.getElementById('currentPlate').style.backgroundImage = `url(${plate.image})`;
    document.getElementById('answer').value = '';
  }
  
  function showResults() {
    document.getElementById('test-container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    
    let recommendation = 'normal';
    if (!results[0]) {
      if (!results[1]) recommendation = 'protanopia';
      else if (!results[2]) recommendation = 'deuteranopia';
    }
    
    document.getElementById('result-text').textContent = `Based on your results, we recommend using the ${recommendation} mode.`;
    
    document.getElementById('applySettings').addEventListener('click', function() {
      chrome.storage.local.set({mode: recommendation}, function() {
        window.close();
      });
    });
  }
  
  showTest(0);