# Stock Price Checker

Description
The Stock Price Checker is a full-stack JavaScript application that allows users to check the current price of stocks. It is designed to be functionally similar to this project. The application uses a workaround to fetch stock prices from Stock Price Checker Proxy to avoid the need for individual API keys.

Features
Stock Price Information: Users can view the current price of any stock by sending a GET request to /api/stock-prices/ with a NASDAQ stock symbol.
Like System: Users can 'like' a stock, but only once per IP address to prevent spam.
Comparison Feature: Users can compare two stocks, seeing the relative likes between them.
Data Privacy Compliance: IP addresses are anonymized before being saved to the database, ensuring compliance with data privacy laws such as GDPR.
