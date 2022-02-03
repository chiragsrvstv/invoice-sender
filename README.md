# Automated Invoice Sender

Generate and send automated monthly invoices with ease 🏁 <br>
This project might be helpful you if you usually end up in a situation where you need to manually generate invoices(pdf) at the end of every month and need to email it to your clients/orgs. This project aims to solve that particular pain point by automating the whole flow. It could be ran locally from the cli or could be deployed as a serverless function that'd trigger every month ✌️

## Usage
The project uses a sample html invoice template which is then filled with relevant data and a pdf file is generated out of it. Then this pdf file is attached in the email and then finally is sent to the relevant recipients. You can always consider using own html template and use the same variables to generate and send a custom invoice.

## Installation and setup
1. Clone or download the repository.
2. Install all the dependencies with `npm i`.
3. Configure all the relevant environment variables in an `env` file. Please refer to `/.env.example`
4. As of now this project can send Email using GMail only. And for it to work, we'll' need to provide the right credentials(access and refresh tokens) to this project for our account. We'll be using our OAuth2 credentials to enable this project to send emails on our behalf.
    - Go to https://console.cloud.google.com and create a new or use an existing project.
    - Enable Gmail service from the API library.
    - Now go to the project > APIs & Services > Credentials
    - Click on 'Create Credentials' and then select 'Create OAuth client ID'
    - Select 'Web application' as application type.
    - Fill in the relevant details and in the 'Authorized Javascript origin' field add `http://localhost` and in `Authorized redirect URIs` add `http://localhost:3000/`. Now the latter could be any endpoint where we could intercept the redirected request i.e for http://localhost:3000/ there should be a server listening on port 3000 and should handle requests coming to `/`.
    - Click on save and copy the generated 'Client ID' and 'Client Secret'.
    - Now send a GET request(we can use browser or Postman here) to this URL https://accounts.google.com/o/oauth2/v2/auth with the below query parameters:
    ```js
    {
        redirect_uri:'http://localhost:3000/'
        prompt:'consent'
        response_type:'code'
        client_id:'**your_client_id**'
        scope:'https://mail.google.com/'
        access_type:'offline'
    }
    ```
    - Now you'll be prompted to sign-in and after successful sign-in will be redirected to http://localhost:3000/ or whatever redirect URL you've provided.
    - Now in the request that is sent to the above endpoint you can find a field called `code` which usually starts with `4/`.
    - Copy that code and send a POST request to https://www.googleapis.com/oauth2/v4/token with below parameters:
    ```JS
    {
        code:'**above_copied_code**'
        client_id:'**your_client_id**'
        client_secret:'**your_client_secret**'
        redirect_uri:'http://localhost:3000/'
        grant_type:authorization_code
    }

    ```
    - Now finally we'll have the 'access_token' and 'refresh_token' needed to send the email. If you're still getting trouble with this going through these might be helpful https://stackoverflow.com/questions/19766912/how-do-i-authorise-an-app-web-or-installed-without-user-intervention/19766913#19766913 https://nodemailer.com/usage/using-gmail/

5. Now add all the remaining environment variables such as the `INVOICE_` ones which would be replaced in the sample HTML invoice template.
6. The generated pdf invoice might look like the screenshot in '/sample_screenshot.png'.
7. Finally run `npm start` to run the project.

## LICENCE
Apache-2.0
