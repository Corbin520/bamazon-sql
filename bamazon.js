var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Password1",
    database: "Bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});


function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            
            console.log("---------------------");
            console.log("Item id: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: $ " + res[i].price + ".00");
            console.log("Stock Quantity: " + res[i].stock_quantity)
    
        }

        inquirer
            .prompt({
                name: "productNumber",
                type: "input",
                message: "What is the product number you are looking for?",

            }).then(function (answer) {

                var productNumber = answer.productNumber;
                inquirer
                    .prompt({
                        name: "quantity",
                        type: "input",
                        message: "What quantity would you like?",
                    }).then(function (answer) {

                        var purchaseQuantity = parseInt(answer.quantity);
                        stockLog(productNumber, purchaseQuantity)
                    });
                })
    })
}

function stockLog(productNumber, purchaseQuantity) {
    connection.query("SELECT * FROM products where item_id = ?", [productNumber], function (err, res) {
        if (err) throw err;
        // console.log(res)
        var item = res[0];
        var price = res[0].price
        var name = res[0].product_name
        if (purchaseQuantity <= item.stock_quantity) {
            console.log();
            console.log("We have your products in stock")
            console.log();
            connection.query('UPDATE `products` SET `stock_quantity` = ? WHERE item_id = ?', [(item.stock_quantity - purchaseQuantity), item.item_id], function(error, results, fields){
            
                connection.end();
                console.log("--------------------");
                console.log("Here is your order information:");
                console.log();
                console.log("Product: " + name);
                console.log();
                console.log("Your total purchase is: " + price * purchaseQuantity + ".00");
                console.log("--------------------");
            })
        } else {
            console.log();
            console.log("Insufficient quantity!");
            console.log();
                connection.end()
        }
    
    });
}
