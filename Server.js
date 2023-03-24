const express = require('express')
const bodyParser = require('body-parser');
//import { engine } from 'express-handlebars';
const expressHbs = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
var user = require('./public/js/user');
var product = require('./public/js/product');
const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//app.engine('.hbs', ExpressHandlebars());
app.engine('.hbs', expressHbs.engine({ defaultLayout: 'main', extname: "hbs", layoutsDir: './views/layouts' }));
app.set('view engine', '.hbs');
app.set('views', './views');

var idPro = 1;
var idUser = 2;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = './public/uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    var tenGoc = file.originalname;
    arr = tenGoc.split('.');
    let newFileName = '';
    for (var i = 0; i < arr.length; i++) {
      if (i != arr.length - 1) {
        newFileName += arr[i];
      } else {
        newFileName += ('-' + Date.now() + '.' + arr[i]);
      }
    }
    cb(null, newFileName)
  }
})
var upload = multer({
  storage: storage,
})

var listProducts = new Array()
var listUsers = new Array()

listUsers.push(new user(1, "admin", "admin@gmail.com", "admin", "aophong.png"))




app.get('/', (req, res) => {
  res.render('auth/login', { layout: "auth" })
});

app.get('/logup', (req, res) => {
  res.render('auth/logup', { layout: "auth" })
});

app.get('/addProduct', (req, res) => {
  res.render('product/addProduct', { addSp: true });
});
app.get('/addUser', (req, res) => {
  res.render('user/addUser', { addUser: true });
});

app.get('/listProducts', (req, res) => {
  res.render('product/listProducts', { products: listProducts, quanly: true });
});
app.get('/listUsers', (req, res) => {
  res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true });
});

app.post('/listUsers', upload.single('image'), (req, res, callback) => {
  if (req.body.id !== undefined) {
    let id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var image = req.file.filename;
    let user1 = new user(id, name, email, password, image);
    let index = 0;
    for (var i = 0; i < listUsers.length; i++) {
      if (listUsers[i].id == id) {
        index = i;
      }
    }
    listUsers.splice(index, 1, user1);
  }
  res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true });
});

app.post('/login', upload.single('image'), (req, res, callback) => {
  // const files = req.file
  // if (!files) {
  //   const error = new Error('Please choose files')
  //   error.httpStatusCode = 400
  //   return callback(error)s
  // }
  listUsers.forEach((user1) => {
    if (req.body.email == user1.email) {
      res.render('auth/logup', { layout: "auth", check: true, firstname:req.body.firstname, lastname:  req.body.lastname,email:req.body.email,password:req.body.password ,image: req.file.filename });
    } else {
      let id = idUser;
      idUser++;
      var name = req.body.firstname + req.body.lastname;
      var email = req.body.email;
      var password = req.body.password;
      var image = req.file.filename;
      listUsers.push(new user(id, name, email, password, image));

      res.render('auth/login', { layout: "auth" });
    }
  })


});
app.post('/quanly', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  listUsers.forEach((user) => {
    if (user.email == email && user.password == password) {
      res.render('product/listProducts', { products: listProducts, quanly: true });
    }else{
      res.render('auth/login', { layout: "auth" ,check: true,email: email,password:password});
    }
  })
});
app.post('/addProduct', upload.single('image'), (req, res, callback) => {
  const files = req.file;
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return callback(error)
  }
  if (req.body.id !== undefined) {
    let id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;
    var color = req.body.color;
    var image = req.file.filename;
    let product2 = new product(id, name, image, price, color)
    let index = 0;
    for (var i = 0; i < listProducts.length; i++) {
      if (listProducts[i].id == id) {
        index = i;
      }
    }
    listProducts.splice(index, 1, product2);
    res.render('product/listProducts', { products: listProducts, quanly: true });
  } else {
    let id = idPro;
    idPro++;
    var name = req.body.name;
    var price = req.body.price;
    var color = req.body.color;
    var image = req.file.filename;
    let product1 = new product(id, name, image, price, color)
    console.log(product1)
    listProducts.push(product1);
    res.render('product/addProduct', { refresh: true, addSp: true });
  }
});
app.post('/actionProduct', (req, res) => {
  if (req.body.update == "update") {
    let id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;
    var color = req.body.color;
    var image = req.body.image;
    let product1 = new product(id, name, image, price, color)
    res.render('product/updateProduct', { product1, quanly: true });
  } else {
    let id = req.body.id;
    let index = 0;
    for (var i = 0; i < listProducts.length; i++) {
      if (listProducts[i].id == id) {
        index = i;
      }
    }
    listProducts.splice(index, 1);
    res.render('product/listProducts', { products: listProducts, quanly: true });
  }
});

app.post('/addUser', upload.single('image'), (req, res, callback) => {
  const files = req.file;
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return callback(error)
  }
  if (req.body.id !== undefined) {
    let id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var image = req.file.filename;
    let user1 = new user(id, name, email, password, image);
    let index = 0;
    for (var i = 0; i < listUsers.length; i++) {
      if (listUsers[i].id == id) {
        index = i;
      }
    }
    listUsers.splice(index, 1, user1);
    res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true });
  } else {
    let id = idUser;
    idUser++;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var image = req.file.filename;
    let user1 = new user(id, name, email, password, image);
    listUsers.push(user1);
    res.render('user/addUser', { refresh: true, addUser: true });
  }
});

app.post('/actionUser', (req, res) => {
  if (req.body.update == "update") {
    let id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var image = req.body.image;
    var user1 = new user(id, name, email, password, image)
    res.render('user/updateUser', { user1, danhSachUser: true });
  } else {
    let id = req.body.id;
    let index = 0;
    for (var i = 0; i < listUsers.length; i++) {
      if (listUsers[i].id == id) {
        index = i;
      }
    }
    listUsers.splice(index, 1);
    res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true });
  }
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
