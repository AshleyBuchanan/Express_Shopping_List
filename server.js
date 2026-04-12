const app = require('./app');

// listener
app.listen(3000, '0.0.0.0', () => {
    console.log('listening on port 3000');
});

