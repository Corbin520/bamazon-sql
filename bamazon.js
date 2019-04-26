var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
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
            // This will give us all the items
            console.log("---------------------");
            console.log("Item id: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: $ " + res[i].price + ".00");
            console.log("---------------------")
        }
        // This will give us all the items
        // console.log(res);
        inquirer
            .prompt({
                name: "productNumber",
                type: "input",
                message: "What is the product number you are looking for?",

            }).then(function (answer) {

                // console.log(answer.productNumber)
                var productNumber = answer.productNumber;
                inquirer
                    .prompt({
                        name: "quantity",
                        type: "input",
                        message: "What quantity would you like?",
                    }).then(function (answer) {
                        // console.log(answer.quantity)
                        var purchaseQuantity = answer.quantity;
                        stockLog(productNumber, purchaseQuantity)
                        connection.end();
                    });
            })
    })
}


// function that will take in the stock we have
function stockLog(productNumber, purchaseQuantity) {
    connection.query("SELECT * FROM products where item_id = ?", [productNumber], function (err, res) {
        if (err) throw err;
        var item = res[0];
        console.log(item);
        
        // console the stock in the database

        if (purchaseQuantity <= item.stock_quantity) {
            console.log("We have your products in stock")
        } else {
            console.log("Insufficient quantity!")
        }
    });
}
