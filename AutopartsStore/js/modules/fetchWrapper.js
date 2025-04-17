//A modul for implementing an HTTP client using ajax and Fetch API
export async function fetchData(resourceUri) {
    try {
        // 1) Intiate the HTTP request message
        const response = await fetch(resourceUri);
        // 2) Validate the response
        if (!response.ok) {
            //request failed
            throw new Error(`The request was no Bueno! ${response.status}`);
        }
        // retrieve the received payload from the response message.
        const data = await response.json();
        console.log(data);
        // 4) Parse and render the HTML table
        return data;
    } catch (error) {
        console.log(error.message);
    }
}
