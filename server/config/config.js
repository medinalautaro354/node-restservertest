//Port
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BD
let connectionString;

if (process.env.NODE_ENV === 'dev') {
    connectionString = 'mongodb://localhost:27017/cafe';
} else {
    connectionString = 'mongodb+srv://test:guyKLvABrn9qnx5g@cluster0-kxpb8.mongodb.net/test';
}

process.env.ConnectionString = connectionString;