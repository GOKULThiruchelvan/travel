import requests

# Function to interact with Gemini API
def get_gemini_response(user_query):
    # URL endpoint for Gemini API
    gemini_api_url = "https://api.gemini.com/v1/query"  # Replace with actual Gemini API URL
    
    # The payload to send to the API
    payload = {
        "query": user_query
    }

    # Send the request to the Gemini API
    response = requests.post(gemini_api_url, json=payload)
    
    # Check if the API request was successful
    if response.status_code == 200:
        # Get the response from the API
        api_response = response.json()
        
        # Return the response from the Gemini API
        return api_response.get('response')  # Adjust according to Gemini API response format
    else:
        return "Error: Unable to reach Gemini API."

# Example usage
user_query = input("Ask your query: ")  # Get user input

# Get and print the Gemini API response
response = get_gemini_response(user_query)
print(response)
