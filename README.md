# Bank App

This is a simple web-based banking application that allows users to perform various banking operations such as logging in, registering for a new account, viewing account details, and adding transactions. The application is built using HTML, CSS, JavaScript, and the jQuery library.

## Features

- **User Authentication**: Users can log in using their username. If they don't have an account, they can register by providing a username, currency, description, and initial balance.

- **Dashboard**: Upon successful login, users are redirected to the dashboard where they can view their account balance, currency, and transaction history.

- **Adding Transactions**: Users can add new transactions to their account, specifying the date, object, and amount (debit or credit). The transaction history is updated in real-time.

- **Responsive Design**: The application is designed to be responsive, ensuring a seamless experience on various devices.

## Getting Started

To run this application locally, follow these steps:

1. Clone this repository to your local machine:

   ```
   git clone <repository_url>
   ```

2. Open the `index.html` file in a web browser to use the application.

## Usage

1. **Login**: Enter your username and click the "Login" button to access your account.

2. **Registration**: If you don't have an account, click the "Register" tab, fill in the required details, and click the "Register" button.

3. **Dashboard**: Once logged in, you can view your account balance, currency, and transaction history. You can also add new transactions by clicking the "Add transaction" button.

4. **Adding Transactions**: To add a new transaction, specify the date, object, and amount. Use a negative value for debit transactions. Click "OK" to confirm the transaction or "Cancel" to discard it.

5. **Logout**: Click the "Logout" button to log out of your account.

## Technologies Used

- HTML
- CSS
- JavaScript
- jQuery
- AJAX for API requests

## [API Backend](https://microsoft.github.io/Web-Dev-For-Beginners/#/7-bank-project/api/README?id=api-details)

This application interacts with a backend API for user registration, account creation, and transaction handling. Make sure the API server is running and accessible.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow the standard GitHub flow:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.
