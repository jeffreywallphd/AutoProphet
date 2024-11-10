// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

import React, { Component } from "react";

class BrowseFAQ extends Component {

    render() {
        return (
            <div className="page">
                <h2>Browse Our FAQs:</h2>

                <div className="faq-card">
                    <h3>Getting Started</h3>
                    <h4>How do I sign up for the tool?</h4>
                    <p>Simply visit our homepage and click on "Sign Up." Enter your email address, create a password, and follow the prompts to create your account.</p>
                    <h4>Do I need any specific software to use the tool?</h4>
                    <p>No special software is required. The tool runs entirely in your browser. We recommend using the latest versions of Chrome, Firefox, or Edge for the best experience.</p>
                    <h4>Can I try the tool for free?</h4>
                    <p>Yes, the tool is open-source.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>General Questions</h3>
                    <h4>Is there a mobile app available?</h4>
                    <p>Yes, we offer a mobile app available on both iOS and Android, which gives you access to all features on the go.</p>
                    <h4>Can I export my data?</h4>
                    <p>Yes, you can export your spending, investments, and other data into CSV format by navigating to the "Reports" section of your dashboard.</p>
                    <h4>How do I contact support?</h4>
                    <p>You can reach our support team through the "Help" section of the app, via email at support@example.com, or by using the live chat feature during business hours.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Account and Login</h3>
                    <h4>I forgot my password. How do I reset it?</h4>
                    <p>Click on the "Forgot Password" link on the login page, enter your registered email, and follow the instructions sent to your inbox to reset your password.</p>
                    <h4>Can I change my email address?</h4>
                    <p>Yes, navigate to the Account Settings section, and under "Profile," you can update your email address. Make sure to verify it after making the change.</p>
                    <h4>How can I close my account?</h4>
                    <p>To close your account, go to Account Settings, select "Close Account," and follow the on-screen instructions. All data will be deleted upon confirmation.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Bank Transfers and Linking</h3>
                    <h4>How do I link my bank accounts?</h4>
                    <p>Go to the "Bank Accounts" section, select "Link Account," and follow the prompts to securely connect your bank via Plaid or manual account entry.</p>
                    <h4>Is my bank data secure?</h4>
                    <p>Yes, we use bank-grade encryption to ensure your financial data is kept private and secure. We never share your information with third parties without consent.</p>
                    <h4>Can I transfer money between accounts?</h4>
                    <p>Our tool is for analytics only. To transfer funds, please use your bank’s website or app. We do not handle or facilitate money transfers.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Documents and Taxes</h3>
                    <h4>Does the tool help with tax documents?</h4>
                    <p>Yes, you can track deductible expenses and export your tax-related transactions. However, we do not generate tax forms. Please consult your tax advisor.</p>
                    <h4>Can I upload receipts for tax purposes?</h4>
                    <p>Yes, you can upload receipts and other tax-related documents to your account and categorize them accordingly for easy tracking.</p>
                    <h4>How do I download transaction history for tax filing?</h4>
                    <p>Go to the "Reports" section and choose the time range. You can export your transaction history to use in tax preparation software or provide to your tax professional.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Financial Terms</h3>
                    <h4>What do the technical financial terms mean?</h4>
                    <p>Click on this "link" to view a list of definitions of each technical term used. The terms are sorted by page in alphabetical order.</p>
                    <h4>What do the acronyms stand for?</h4>
                    <p>Some of the acronyms can be viewable as a popup or tooltip on each page. You can also view the full term of an acronym along with its definition by clicking the "Financial Term Definitions" link.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Investing (Bonds, Stocks, Options)</h3>
                    <h4>Can I track multiple investment accounts?</h4>
                    <p>Yes, you can link multiple brokerage accounts, and our tool will consolidate all your investments into a single dashboard for easy tracking.</p>
                    <h4>Does the tool offer investment recommendations?</h4>
                    <p>We provide personalized insights based on your portfolio, but we do not offer direct investment advice. Always consult a financial advisor for investment decisions.</p>
                    <h4>Yes, the tool allows you to track various asset classes, including stocks, bonds, and options, and view their performance over time.</h4>
                    <p>Can I track stock options and bonds?</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Retirement</h3>
                    <h4>Can I track my 401(k) or IRA in the tool?</h4>
                    <p>Yes, you can link your 401(k), IRA, and other retirement accounts to get a comprehensive view of your retirement savings and performance over time.</p>
                    <h4>Does the tool offer retirement planning?</h4>
                    <p>We provide projections and insights based on your current savings, but we recommend working with a financial advisor for personalized retirement planning.</p>
                    <h4>How often should I review my retirement accounts?</h4>
                    <p>It’s a good practice to review your retirement accounts quarterly to ensure you’re on track with your goals and adjust contributions if needed.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Spending</h3>
                    <h4>How can I track my spending using the tool?</h4>
                    <p>Our tool categorizes your transactions automatically. You can view and adjust spending categories in the "Spending" section of the dashboard.</p>
                    <h4>Can I set a budget for specific categories?</h4>
                    <p>Yes, you can set custom spending limits for categories like groceries, entertainment, or travel. You'll receive alerts if you approach or exceed your budget.</p>
                    <h4>How frequently is spending data updated?</h4>
                    <p>Your spending data is updated in real-time as soon as transactions post to your linked accounts.</p>
                </div>

                <div class="divSpacing"></div>

                <div className="faq-card">
                    <h3>Trading/Margin</h3>
                    <h4>Can I track margin trading?</h4>
                    <p>Yes, our tool allows you to monitor both regular and margin trades, including the margin balances, interest rates, and associated costs.</p>
                    <h4>Does the tool integrate with brokerage accounts for real-time tracking?</h4>
                    <p>Yes, our tool links to your brokerage accounts to provide real-time updates on your trades, balances, and investment performance.</p>
                    <h4>Can I see profit/loss for my trades?</h4>
                    <p>Absolutely! The tool tracks your trade history and automatically calculates your realized and unrealized gains or losses.</p>
                </div>

            </div>
        );
    }
}

export default BrowseFAQ;