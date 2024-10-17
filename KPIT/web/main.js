import { streamGemini } from './gemini-api.js';

document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('form');
  let daysInput = document.querySelector('input[name="days"]');
  let output = document.querySelector('.output');
  let locationInfo = document.getElementById('locationInfo');
  let locationPrompt = document.querySelector('.location-prompt');

  // Request location on load
  getLocation();

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    output.textContent = 'Generating your trip plan...';

    try {
      let location = form.dataset.location || ''; // Get location from form data
      let days = daysInput.value;

      let contents = [
        {
          type: "text",
          text: `Plan a trip for ${days} days in ${location}. Suggest the best tourist places and activities.`,
        }
      ];

      let stream = streamGemini({
        model: 'gemini-pro',
        contents,
      });

      let buffer = [];
      let md = new markdownit();
      for await (let chunk of stream) {
        buffer.push(chunk);
        output.innerHTML = md.render(buffer.join(''));
      }
    } catch (e) {
      output.innerHTML += '<hr>' + e;
    }
  };

  // Function to get the user's location
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      locationInfo.style.display = 'block';
      locationInfo.textContent = "Geolocation is not supported by this browser.";
    }
  }

  // Function to display the position
  function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    locationInfo.style.display = 'block';
    locationInfo.textContent = `Location: Latitude ${lat}, Longitude ${lon}`;
    form.dataset.location = `${lat},${lon}`; // Save location in form data
    locationPrompt.style.display = 'none'; // Hide location prompt once location is fetched
  }

  // Function to handle location errors
  function showError(error) {
    locationInfo.style.display = 'block';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        locationInfo.textContent = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        locationInfo.textContent = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        locationInfo.textContent = "The request to get user location timed out.";
        break;
      default:
        locationInfo.textContent = "An unknown error occurred.";
        break;
    }
  }
});
