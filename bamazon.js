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
                        var stockQuantity = answer.quantity;
                        stockLog(productNumber, stockQuantity)
                    });

                connection.end();
            })
    })
}

