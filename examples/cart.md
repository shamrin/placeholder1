Browser-side:

* authenticate user
* get current user shopping cart
* update current user shopping cart
* insert an order

Server-side (function?):

* listen to order collection changes, and send email notifications

Data model:

* shopping cart collection: user_id -> cart content
* order collection: user_id -> {sent, order_content}
