const express = require('express');
const path = require('path');
const port = 3000;
const app = express();
const User = require('./models/user');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => {
  res.render('app');
});

app.get('/read', async (req, res) => {
  try {
    const users = await User.find();
    res.render('read', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/create', async (req, res) => {
  try {
    const { name, email, image } = req.body;
    const user = await User.create({
      name,
      email,
      imageUrl: image,
    });
    res.redirect('/read');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/edit/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.render("edit" , { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post('/update/:id', async (req, res) => {
  try {
    const { name, email, image } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      imageUrl: image,
    });
    res.redirect('/read');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    res.redirect('/read');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
