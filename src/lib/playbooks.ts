import { dedent } from "@/lib/dedent";

export const PLAYBOOKS = [
  {
    name: "how to top up a prepaid phone card",
    content: dedent`
      Navigate to https://bitrefill.com/th/en/
      Dismiss the cookie consent by clicking "Accept all"
      Click on Phone Refills
      Enter the phone number starting with "0" in the input with placeholder "081 234 5678" and click the red button
      Enter the amount in the "Enter amount" field with placeholder "10 - 1000"
      Click "Add to cart"
      Click "Checkout"
      Fill in email in input with label "Email address for order status updates" and click "Continue to payment"
      Choose "Ethereum" as the payment method
      For wallet, choose "Prefer not to select"
      Then get the payment address and amount to pay and pay that amount of eth to the address
      Wait 5 seconds 2 times
      Keep waiting 5 seconds until you see the "Order completed" message
      Return the invoice id in the result
    `,
  },
  {
    name: "how to donate to the water project",
    content: dedent`
      go to https://thewaterproject.org/donate-crypto
      click "Donate Crypto" button
      use web_natural_language_action to double click on the text ".25" and then press backspace two times (to clear the old number) and enter the donation amount
      use web_natural_language_action to click "Next Step"
      use web_natural_language_action to click "Final Step"
      get the payment address from the page using web_simple_question
      send the amount to that address
      complete the task with info about the donation (txn id and block explorer link)
    `,
  },
];
